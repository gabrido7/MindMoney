import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { pool } from "../src/config/db";
import { registerTestUser, cleanupUser, authHeader } from "./helpers";

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

async function backdateDebtCreatedAt(debtId: number, mysqlDateTime: string) {
  await pool.query("UPDATE debts SET created_at = ? WHERE id = ?", [mysqlDateTime, debtId]);
}

/** Um dia-do-mês que ainda não chegou neste mês (~15 dias à frente) -- evita ambiguidade de "a primeira parcela já é hoje" nos testes de geração automática de parcelas. */
function futureDueDay(): number {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 15);
  return d.getUTCDate();
}

describe("Dívidas", () => {
  it("lista vazia para um usuário novo", async () => {
    const user = await registerTestUser("debts-fresh");
    const res = await request(app).get("/api/debts").set(authHeader(user.token));

    expect(res.status).toBe(200);
    expect(res.body.debts).toEqual([]);

    await cleanupUser(user.userId);
  });

  it("cria uma dívida completa e ela aparece na lista", async () => {
    const user = await registerTestUser("debts-create");

    const res = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({
        type: "cartao_credito",
        name: "Cartão Nubank",
        totalAmount: 3200,
        installmentAmount: 400,
        interestRate: 12.5,
        installmentsCount: 8,
        dueDay: 10,
      });

    expect(res.status).toBe(201);
    expect(res.body.debt).toMatchObject({
      type: "cartao_credito",
      name: "Cartão Nubank",
      totalAmount: 3200,
      installmentAmount: 400,
      interestRate: 12.5,
      installmentsCount: 8,
      dueDay: 10,
    });

    const list = await request(app).get("/api/debts").set(authHeader(user.token));
    expect(list.body.debts).toHaveLength(1);

    await cleanupUser(user.userId);
  });

  it("cria uma dívida só com os campos obrigatórios (resto fica null)", async () => {
    const user = await registerTestUser("debts-minimal");

    const res = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Empréstimo com um amigo", totalAmount: 500 });

    expect(res.status).toBe(201);
    expect(res.body.debt).toMatchObject({
      type: "outro",
      name: "Empréstimo com um amigo",
      totalAmount: 500,
      installmentAmount: null,
      interestRate: null,
      installmentsCount: null,
      dueDay: null,
    });

    await cleanupUser(user.userId);
  });

  it("rejeita valor total não positivo", async () => {
    const user = await registerTestUser("debts-invalid-amount");

    const res = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Teste", totalAmount: -10 });

    expect(res.status).toBe(400);

    await cleanupUser(user.userId);
  });

  it("rejeita tipo fora do enum", async () => {
    const user = await registerTestUser("debts-invalid-type");

    const res = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "nao-existe", name: "Teste", totalAmount: 100 });

    expect(res.status).toBe(400);

    await cleanupUser(user.userId);
  });

  it("remove uma dívida", async () => {
    const user = await registerTestUser("debts-remove");

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "financiamento", name: "Carro", totalAmount: 20000 });

    const remove = await request(app)
      .delete(`/api/debts/${create.body.debt.id}`)
      .set(authHeader(user.token));
    expect(remove.status).toBe(204);

    const list = await request(app).get("/api/debts").set(authHeader(user.token));
    expect(list.body.debts).toEqual([]);

    await cleanupUser(user.userId);
  });

  it("remover uma dívida inexistente devolve 404", async () => {
    const user = await registerTestUser("debts-remove-missing");

    const res = await request(app).delete("/api/debts/999999999").set(authHeader(user.token));
    expect(res.status).toBe(404);

    await cleanupUser(user.userId);
  });

  it("usuário B não vê nem consegue apagar dívida de A (IDOR)", async () => {
    const userA = await registerTestUser("debts-idor-a");
    const userB = await registerTestUser("debts-idor-b");

    const created = await request(app)
      .post("/api/debts")
      .set(authHeader(userA.token))
      .send({ type: "emprestimo", name: "Dívida da A", totalAmount: 1000 });

    const attempt = await request(app)
      .delete(`/api/debts/${created.body.debt.id}`)
      .set(authHeader(userB.token));
    expect(attempt.status).toBe(404);

    const listB = await request(app).get("/api/debts").set(authHeader(userB.token));
    expect(listB.body.debts).toEqual([]);

    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("exige autenticação (401 sem token)", async () => {
    const res = await request(app).get("/api/debts");
    expect(res.status).toBe(401);
  });
});

describe("Dívidas -- pagamentos", () => {
  it("dívida nova começa com saldo restante igual ao total, sem pagamento", async () => {
    const user = await registerTestUser("debtpay-fresh");

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "emprestimo", name: "Empréstimo pessoal", totalAmount: 1000 });

    expect(create.body.debt).toMatchObject({
      paidAmount: 0,
      remainingAmount: 1000,
      progressPercent: 0,
      paidOff: false,
    });

    await cleanupUser(user.userId);
  });

  it("registra um pagamento e reduz o saldo restante de verdade", async () => {
    const user = await registerTestUser("debtpay-add");

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "cartao_credito", name: "Cartão", totalAmount: 1000 });
    const debtId = create.body.debt.id;

    const pay = await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 300, paidAt: "2026-08-10", note: "Parcela de agosto" });

    expect(pay.status).toBe(201);
    expect(pay.body.debt).toMatchObject({
      paidAmount: 300,
      remainingAmount: 700,
      progressPercent: 30,
      paidOff: false,
    });

    const list = await request(app).get("/api/debts").set(authHeader(user.token));
    expect(list.body.debts[0]).toMatchObject({ paidAmount: 300, remainingAmount: 700 });

    const payments = await request(app).get(`/api/debts/${debtId}/payments`).set(authHeader(user.token));
    expect(payments.body.payments).toHaveLength(1);
    expect(payments.body.payments[0]).toMatchObject({ amount: 300, paidAt: "2026-08-10", note: "Parcela de agosto" });

    await cleanupUser(user.userId);
  });

  it("quita totalmente a dívida (paidOff true, saldo zerado, percentual travado em 100)", async () => {
    const user = await registerTestUser("debtpay-payoff");

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "parcelamento", name: "Sofá", totalAmount: 500 });
    const debtId = create.body.debt.id;

    await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 300, paidAt: "2026-08-01" });

    const finalPayment = await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 250, paidAt: "2026-08-15" });

    // paga R$50 a mais que o total -- não deve ficar negativo nem passar de 100%
    expect(finalPayment.body.debt).toMatchObject({
      paidAmount: 550,
      remainingAmount: 0,
      progressPercent: 100,
      paidOff: true,
    });

    await cleanupUser(user.userId);
  });

  it("remove um pagamento e o saldo restante volta a subir", async () => {
    const user = await registerTestUser("debtpay-remove");

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida", totalAmount: 1000 });
    const debtId = create.body.debt.id;

    await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 400, paidAt: "2026-08-05" });
    const payments = await request(app).get(`/api/debts/${debtId}/payments`).set(authHeader(user.token));
    const paymentId = payments.body.payments[0].id;

    const removed = await request(app)
      .delete(`/api/debts/${debtId}/payments/${paymentId}`)
      .set(authHeader(user.token));

    expect(removed.status).toBe(200);
    expect(removed.body.debt).toMatchObject({ paidAmount: 0, remainingAmount: 1000 });

    await cleanupUser(user.userId);
  });

  it("rejeita valor de pagamento não positivo", async () => {
    const user = await registerTestUser("debtpay-invalid");

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida", totalAmount: 100 });

    const res = await request(app)
      .post(`/api/debts/${create.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: -10, paidAt: "2026-08-05" });

    expect(res.status).toBe(400);

    await cleanupUser(user.userId);
  });

  it("usuário B não consegue registrar nem apagar pagamento na dívida de A (IDOR)", async () => {
    const userA = await registerTestUser("debtpay-idor-a");
    const userB = await registerTestUser("debtpay-idor-b");

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(userA.token))
      .send({ type: "outro", name: "Dívida da A", totalAmount: 1000 });
    const debtId = create.body.debt.id;

    const attemptAdd = await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(userB.token))
      .send({ amount: 100, paidAt: "2026-08-05" });
    expect(attemptAdd.status).toBe(404);

    await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(userA.token))
      .send({ amount: 100, paidAt: "2026-08-05" });
    const paymentsA = await request(app).get(`/api/debts/${debtId}/payments`).set(authHeader(userA.token));
    const paymentId = paymentsA.body.payments[0].id;

    const attemptRemove = await request(app)
      .delete(`/api/debts/${debtId}/payments/${paymentId}`)
      .set(authHeader(userB.token));
    expect(attemptRemove.status).toBe(404);

    const attemptList = await request(app).get(`/api/debts/${debtId}/payments`).set(authHeader(userB.token));
    expect(attemptList.status).toBe(404);

    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("pagamento em dívida inexistente devolve 404", async () => {
    const user = await registerTestUser("debtpay-missing-debt");

    const res = await request(app)
      .post("/api/debts/999999999/payments")
      .set(authHeader(user.token))
      .send({ amount: 100, paidAt: "2026-08-05" });
    expect(res.status).toBe(404);

    await cleanupUser(user.userId);
  });
});

describe("Dívidas -- editar pagamento", () => {
  it("edita valor, data e nota de um pagamento já lançado", async () => {
    const user = await registerTestUser("debtpay-edit");

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida editável", totalAmount: 1000 });
    const debtId = create.body.debt.id;

    await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 200, paidAt: "2026-08-10" });
    const paymentId = (await request(app).get(`/api/debts/${debtId}/payments`).set(authHeader(user.token))).body
      .payments[0].id;

    const edit = await request(app)
      .put(`/api/debts/${debtId}/payments/${paymentId}`)
      .set(authHeader(user.token))
      .send({ amount: 350, paidAt: "2026-08-12", note: "Corrigido" });

    expect(edit.status).toBe(200);
    expect(edit.body.debt).toMatchObject({ paidAmount: 350, remainingAmount: 650 });

    const payments = await request(app).get(`/api/debts/${debtId}/payments`).set(authHeader(user.token));
    expect(payments.body.payments[0]).toMatchObject({ amount: 350, paidAt: "2026-08-12", note: "Corrigido" });

    await cleanupUser(user.userId);
  });

  it("editar o valor do pagamento atualiza a transação real vinculada também", async () => {
    const user = await registerTestUser("debtpay-edit-transaction");
    const month = new Date().toISOString().slice(0, 7);

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida com transação editável", totalAmount: 1000 });
    const debtId = create.body.debt.id;

    await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 200, paidAt: `${month}-10` });
    const paymentId = (await request(app).get(`/api/debts/${debtId}/payments`).set(authHeader(user.token))).body
      .payments[0].id;

    await request(app)
      .put(`/api/debts/${debtId}/payments/${paymentId}`)
      .set(authHeader(user.token))
      .send({ amount: 450, paidAt: `${month}-10` });

    const txRes = await request(app)
      .get(`/api/transactions?month=${month}&limit=50`)
      .set(authHeader(user.token));
    const tx = txRes.body.transactions.find((t: { description: string }) =>
      t.description.includes("Dívida com transação editável")
    );
    expect(tx).toBeTruthy();
    expect(Number(tx.amount)).toBe(450);

    await cleanupUser(user.userId);
  });

  it("rejeita valor não positivo na edição", async () => {
    const user = await registerTestUser("debtpay-edit-invalid");

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida", totalAmount: 500 });
    await request(app)
      .post(`/api/debts/${create.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 100, paidAt: "2026-08-05" });
    const paymentId = (
      await request(app).get(`/api/debts/${create.body.debt.id}/payments`).set(authHeader(user.token))
    ).body.payments[0].id;

    const res = await request(app)
      .put(`/api/debts/${create.body.debt.id}/payments/${paymentId}`)
      .set(authHeader(user.token))
      .send({ amount: -10, paidAt: "2026-08-05" });
    expect(res.status).toBe(400);

    await cleanupUser(user.userId);
  });

  it("usuário B não consegue editar pagamento da dívida de A (IDOR)", async () => {
    const userA = await registerTestUser("debtpay-edit-idor-a");
    const userB = await registerTestUser("debtpay-edit-idor-b");

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(userA.token))
      .send({ type: "outro", name: "Dívida da A", totalAmount: 1000 });
    const debtId = create.body.debt.id;

    await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(userA.token))
      .send({ amount: 100, paidAt: "2026-08-05" });
    const paymentId = (await request(app).get(`/api/debts/${debtId}/payments`).set(authHeader(userA.token))).body
      .payments[0].id;

    const attempt = await request(app)
      .put(`/api/debts/${debtId}/payments/${paymentId}`)
      .set(authHeader(userB.token))
      .send({ amount: 999, paidAt: "2026-08-05" });
    expect(attempt.status).toBe(404);

    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("editar pagamento inexistente devolve 404", async () => {
    const user = await registerTestUser("debtpay-edit-missing");

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida", totalAmount: 500 });

    const res = await request(app)
      .put(`/api/debts/${create.body.debt.id}/payments/999999999`)
      .set(authHeader(user.token))
      .send({ amount: 100, paidAt: "2026-08-05" });
    expect(res.status).toBe(404);

    await cleanupUser(user.userId);
  });
});

describe("Dívidas -- integração com transações reais", () => {
  it("usuário novo já tem a categoria 'Dívidas' seedada", async () => {
    const user = await registerTestUser("debts-category-fresh");

    const res = await request(app).get("/api/categories").set(authHeader(user.token));
    const debtsCategory = res.body.categories.find((c: { type: string; is_builtin: number }) => c.type === "saida" && c.is_builtin === 1);
    expect(debtsCategory).toBeTruthy();

    await cleanupUser(user.userId);
  });

  it("registrar um pagamento cria uma transação real de saída na categoria de dívidas", async () => {
    const user = await registerTestUser("debtpay-transaction");
    const month = new Date().toISOString().slice(0, 7);

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "cartao_credito", name: "Cartão Real", totalAmount: 1000 });
    const debtId = create.body.debt.id;

    await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 250, paidAt: `${month}-10` });

    const txRes = await request(app)
      .get(`/api/transactions?month=${month}&limit=50`)
      .set(authHeader(user.token));
    const tx = txRes.body.transactions.find((t: { description: string }) => t.description.includes("Cartão Real"));

    expect(tx).toBeTruthy();
    expect(Number(tx.amount)).toBe(250);
    expect(tx.type).toBe("saida");

    await cleanupUser(user.userId);
  });

  it("remover um pagamento remove a transação real vinculada a ele", async () => {
    const user = await registerTestUser("debtpay-transaction-remove");
    const month = new Date().toISOString().slice(0, 7);

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida com transação", totalAmount: 1000 });
    const debtId = create.body.debt.id;

    await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 300, paidAt: `${month}-10` });

    const payments = await request(app).get(`/api/debts/${debtId}/payments`).set(authHeader(user.token));
    const payment = payments.body.payments[0];
    expect(payment.transactionId).toBeTruthy();

    await request(app)
      .delete(`/api/debts/${debtId}/payments/${payment.id}`)
      .set(authHeader(user.token));

    const txRes = await request(app)
      .get(`/api/transactions?month=${month}&limit=50`)
      .set(authHeader(user.token));
    const tx = txRes.body.transactions.find((t: { description: string }) => t.description.includes("Dívida com transação"));
    expect(tx).toBeFalsy();

    await cleanupUser(user.userId);
  });

  it("apagar a dívida inteira NÃO apaga as transações já lançadas pelos pagamentos", async () => {
    const user = await registerTestUser("debtpay-delete-debt-keeps-tx");
    // Claramente no passado, de propósito: remove() agora só preserva
    // transação de pagamento JÁ realizado (paid_at <= hoje) -- parcela
    // futura é limpa junto com a dívida (ver describe "parcelas
    // automáticas" abaixo). `${month}-10` sozinho seria ambíguo (pode cair
    // no futuro dependendo do dia em que o teste roda).
    const paidAt = isoDaysAgo(1);
    const month = paidAt.slice(0, 7);

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida a apagar", totalAmount: 1000 });
    const debtId = create.body.debt.id;

    await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 400, paidAt });

    await request(app).delete(`/api/debts/${debtId}`).set(authHeader(user.token));

    const txRes = await request(app)
      .get(`/api/transactions?month=${month}&limit=50`)
      .set(authHeader(user.token));
    const tx = txRes.body.transactions.find((t: { description: string }) => t.description.includes("Dívida a apagar"));
    expect(tx).toBeTruthy(); // histórico financeiro real não é apagado só porque a dívida deixou de ser rastreada

    await cleanupUser(user.userId);
  });
});

describe("Dívidas -- histórico global de pagamentos", () => {
  it("GET /debts/payments traz pagamentos de várias dívidas, com o nome da dívida junto", async () => {
    const user = await registerTestUser("debts-history");
    const month = new Date().toISOString().slice(0, 7);

    const debtA = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida A", totalAmount: 1000 });
    const debtB = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida B", totalAmount: 2000 });

    await request(app)
      .post(`/api/debts/${debtA.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 100, paidAt: `${month}-05` });
    await request(app)
      .post(`/api/debts/${debtB.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 200, paidAt: `${month}-06` });

    const res = await request(app).get("/api/debts/payments").set(authHeader(user.token));
    expect(res.status).toBe(200);
    expect(res.body.payments).toHaveLength(2);
    const names = res.body.payments.map((p: { debtName: string }) => p.debtName).sort();
    expect(names).toEqual(["Dívida A", "Dívida B"]);

    await cleanupUser(user.userId);
  });

  it("histórico global vazio pra usuário sem nenhum pagamento", async () => {
    const user = await registerTestUser("debts-history-empty");
    const res = await request(app).get("/api/debts/payments").set(authHeader(user.token));
    expect(res.body.payments).toEqual([]);
    await cleanupUser(user.userId);
  });
});

describe("Dívidas -- alerta de vencimento (marcos 30/15/7/3/0 dias)", () => {
  // UTC de propósito -- backend/src/utils/month.ts (nextDueDate) calcula o
  // próximo vencimento inteiramente em UTC. Calcular aqui em horário local
  // descasa o dia calculado sempre que o fuso local já virou o dia mas o UTC
  // ainda não (ou vice-versa) -- ex: 21h em Brasília (UTC-3) já é o dia
  // seguinte em UTC, fazendo "hoje" do teste e "hoje" do servidor
  // divergirem por 1 dia e todo o cálculo de marco sair errado.
  const dueDayInDays = (daysFromNow: number) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + daysFromNow);
    return date.getUTCDate();
  };

  it("dispara notificação no dia do vencimento (marco 0)", async () => {
    const user = await registerTestUser("debts-due-0");
    const dueDay = dueDayInDays(0);

    await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "cartao_credito", name: "Fatura Hoje", totalAmount: 500, dueDay });
    await request(app).get("/api/debts").set(authHeader(user.token));

    const notifRes = await request(app).get("/api/notifications").set(authHeader(user.token));
    const notif = notifRes.body.notifications.find(
      (n: { type: string; message: string }) => n.type === "debt_due_date" && n.message.includes("Fatura Hoje")
    );
    expect(notif).toBeTruthy();
    expect(notif.message).toContain("vence hoje");

    await cleanupUser(user.userId);
  });

  it("dispara notificação 3 dias antes (marco 3)", async () => {
    const user = await registerTestUser("debts-due-3");
    const dueDay = dueDayInDays(3);

    await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "cartao_credito", name: "Fatura em 3 dias", totalAmount: 500, dueDay });
    await request(app).get("/api/debts").set(authHeader(user.token));

    const notifRes = await request(app).get("/api/notifications").set(authHeader(user.token));
    const notif = notifRes.body.notifications.find(
      (n: { type: string; message: string }) => n.type === "debt_due_date" && n.message.includes("Fatura em 3 dias")
    );
    expect(notif).toBeTruthy();
    expect(notif.message).toContain("vence em 3 dias");

    await cleanupUser(user.userId);
  });

  it("não dispara em um dia que não é marco (ex: 5 dias antes)", async () => {
    const user = await registerTestUser("debts-due-not-milestone");
    const dueDay = dueDayInDays(5);

    await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "cartao_credito", name: "Fatura em 5 dias", totalAmount: 500, dueDay });
    await request(app).get("/api/debts").set(authHeader(user.token));

    const notifRes = await request(app).get("/api/notifications").set(authHeader(user.token));
    const notif = notifRes.body.notifications.find((n: { type: string }) => n.type === "debt_due_date");
    expect(notif).toBeFalsy();

    await cleanupUser(user.userId);
  });

  it("revisitar a lista no mesmo dia não duplica a notificação do mesmo marco", async () => {
    const user = await registerTestUser("debts-due-no-dup");
    const dueDay = dueDayInDays(7);

    await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "cartao_credito", name: "Fatura em 7 dias", totalAmount: 500, dueDay });

    await request(app).get("/api/debts").set(authHeader(user.token));
    await request(app).get("/api/debts").set(authHeader(user.token));
    await request(app).get("/api/debts").set(authHeader(user.token));

    const notifRes = await request(app).get("/api/notifications").set(authHeader(user.token));
    const matches = notifRes.body.notifications.filter((n: { type: string }) => n.type === "debt_due_date");
    expect(matches).toHaveLength(1);

    await cleanupUser(user.userId);
  });

  it("duas dívidas vencendo em marcos diferentes no mesmo dia geram dois avisos separados", async () => {
    const user = await registerTestUser("debts-due-multiple");

    await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "cartao_credito", name: "Conta A", totalAmount: 500, dueDay: dueDayInDays(15) });
    await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "cartao_credito", name: "Conta B", totalAmount: 500, dueDay: dueDayInDays(30) });

    await request(app).get("/api/debts").set(authHeader(user.token));

    const notifRes = await request(app).get("/api/notifications").set(authHeader(user.token));
    const matches = notifRes.body.notifications.filter((n: { type: string }) => n.type === "debt_due_date");
    expect(matches).toHaveLength(2);
    expect(matches.some((n: { message: string }) => n.message.includes("Conta A"))).toBe(true);
    expect(matches.some((n: { message: string }) => n.message.includes("Conta B"))).toBe(true);

    await cleanupUser(user.userId);
  });
});

describe("Dívidas -- status (ativa/atrasada/quitada)", () => {
  it("dívida recém-criada com parcela e vencimento é 'ativa', não 'atrasada'", async () => {
    const user = await registerTestUser("debts-status-new");

    const res = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "emprestimo", name: "Recém criada", totalAmount: 1000, installmentAmount: 100, dueDay: 10 });

    expect(res.body.debt.status).toBe("ativa");

    await cleanupUser(user.userId);
  });

  it("dívida antiga (>45 dias) com parcela definida e sem nenhum pagamento fica 'atrasada'", async () => {
    const user = await registerTestUser("debts-status-late");

    const created = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "emprestimo", name: "Esquecida", totalAmount: 1000, installmentAmount: 100, dueDay: 10 });
    await backdateDebtCreatedAt(created.body.debt.id, `${isoDaysAgo(90)} 00:00:00`);

    const list = await request(app).get("/api/debts").set(authHeader(user.token));
    const debt = list.body.debts.find((d: { id: number }) => d.id === created.body.debt.id);
    expect(debt.status).toBe("atrasada");

    await cleanupUser(user.userId);
  });

  it("registrar um pagamento recente tira a dívida do status 'atrasada'", async () => {
    const user = await registerTestUser("debts-status-regularized");

    const created = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "emprestimo", name: "Regularizada", totalAmount: 1000, installmentAmount: 100, dueDay: 10 });
    await backdateDebtCreatedAt(created.body.debt.id, `${isoDaysAgo(90)} 00:00:00`);

    const paid = await request(app)
      .post(`/api/debts/${created.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 100, paidAt: isoDaysAgo(1) });

    expect(paid.body.debt.status).toBe("ativa");

    await cleanupUser(user.userId);
  });

  it("dívida quitada nunca é 'atrasada', mesmo antiga e sem pagamento recente", async () => {
    const user = await registerTestUser("debts-status-paidoff");

    const created = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "emprestimo", name: "Quitada Antiga", totalAmount: 100, installmentAmount: 100, dueDay: 10 });
    await backdateDebtCreatedAt(created.body.debt.id, `${isoDaysAgo(90)} 00:00:00`);

    const paid = await request(app)
      .post(`/api/debts/${created.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 100, paidAt: isoDaysAgo(80) }); // pagamento antigo também, mas quita a dívida inteira

    expect(paid.body.debt.status).toBe("quitada");

    await cleanupUser(user.userId);
  });

  it("dívida sem dueDay ou sem parcela definida nunca fica 'atrasada' -- não há ciclo esperado pra cobrar", async () => {
    const user = await registerTestUser("debts-status-no-schedule");

    const created = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Sem ciclo", totalAmount: 1000 });
    await backdateDebtCreatedAt(created.body.debt.id, `${isoDaysAgo(90)} 00:00:00`);

    const list = await request(app).get("/api/debts").set(authHeader(user.token));
    const debt = list.body.debts.find((d: { id: number }) => d.id === created.body.debt.id);
    expect(debt.status).toBe("ativa");

    await cleanupUser(user.userId);
  });
});

describe("Dívidas -- marco de progresso ao registrar pagamento", () => {
  it("um pagamento que cruza 25% retorna milestoneReached 25, sem XP de dívida quitada", async () => {
    const user = await registerTestUser("debts-milestone-25");

    const debt = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida com marco", totalAmount: 1000 });

    const payment = await request(app)
      .post(`/api/debts/${debt.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 300, paidAt: new Date().toISOString().slice(0, 10) }); // 30%, cruza 25%

    expect(payment.status).toBe(201);
    expect(payment.body.milestoneReached).toBe(25);
    expect(payment.body.gamification.xpAwarded).toBe(0); // marco parcial não dá XP, só a dívida quitada dá

    await cleanupUser(user.userId);
  });

  it("um pagamento que não cruza nenhum marco retorna milestoneReached null", async () => {
    const user = await registerTestUser("debts-milestone-none");

    const debt = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida sem marco", totalAmount: 1000 });

    const payment = await request(app)
      .post(`/api/debts/${debt.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 100, paidAt: new Date().toISOString().slice(0, 10) }); // só 10%

    expect(payment.body.milestoneReached).toBeNull();

    await cleanupUser(user.userId);
  });

  it("um segundo pagamento que já estava acima de um marco não celebra ele de novo", async () => {
    const user = await registerTestUser("debts-milestone-no-repeat");

    const debt = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dois pagamentos", totalAmount: 1000 });

    const first = await request(app)
      .post(`/api/debts/${debt.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 300, paidAt: new Date().toISOString().slice(0, 10) }); // 30%, cruza 25%
    expect(first.body.milestoneReached).toBe(25);

    const second = await request(app)
      .post(`/api/debts/${debt.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 150, paidAt: new Date().toISOString().slice(0, 10) }); // 30% -> 45%, não cruza 50%
    expect(second.body.milestoneReached).toBeNull();

    await cleanupUser(user.userId);
  });
});

describe("Dívidas -- parcelas automáticas (cartão parcelado)", () => {
  it("cria com autoGenerateInstallments e gera as N parcelas futuras como transações reais", async () => {
    const user = await registerTestUser("debts-auto-create");

    const res = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({
        type: "parcelamento",
        name: "Notebook parcelado",
        totalAmount: 300,
        installmentAmount: 100,
        installmentsCount: 3,
        dueDay: 28, // clamp seguro em qualquer mês, sem ambiguidade de fim de mês entre parcelas
        autoGenerateInstallments: true,
      });
    expect(res.status).toBe(201);
    const debtId = res.body.debt.id;

    const payments = await request(app).get(`/api/debts/${debtId}/payments`).set(authHeader(user.token));
    expect(payments.body.payments).toHaveLength(3);

    const sorted = [...payments.body.payments].sort((a: { paidAt: string }, b: { paidAt: string }) =>
      a.paidAt.localeCompare(b.paidAt)
    );
    expect(sorted.map((p: { amount: number }) => p.amount)).toEqual([100, 100, 100]);
    expect(sorted.map((p: { note: string | null }) => p.note)).toEqual(["Parcela 1/3", "Parcela 2/3", "Parcela 3/3"]);
    expect(sorted.every((p: { transactionId: number | null }) => p.transactionId)).toBe(true);

    // cada parcela cai exatamente 1 mês depois da anterior
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(`${sorted[i - 1].paidAt}T00:00:00Z`);
      const curr = new Date(`${sorted[i].paidAt}T00:00:00Z`);
      const monthDiff = (curr.getUTCFullYear() - prev.getUTCFullYear()) * 12 + (curr.getUTCMonth() - prev.getUTCMonth());
      expect(monthDiff).toBe(1);
    }

    const firstMonth = sorted[0].paidAt.slice(0, 7);
    const txRes = await request(app)
      .get(`/api/transactions?month=${firstMonth}&limit=50`)
      .set(authHeader(user.token));
    const tx = txRes.body.transactions.find((t: { description: string }) =>
      t.description.includes("Parcela 1/3 — Notebook parcelado")
    );
    expect(tx).toBeTruthy();
    expect(Number(tx.amount)).toBe(100);

    await cleanupUser(user.userId);
  });

  it("sem o checkbox marcado, criar a dívida não gera nenhuma parcela automaticamente (comportamento de sempre)", async () => {
    const user = await registerTestUser("debts-auto-off");

    const res = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({
        type: "parcelamento",
        name: "Sem automação",
        totalAmount: 300,
        installmentAmount: 100,
        installmentsCount: 3,
        dueDay: 28,
        // autoGenerateInstallments omitido -- default é false
      });

    const payments = await request(app).get(`/api/debts/${res.body.debt.id}/payments`).set(authHeader(user.token));
    expect(payments.body.payments).toEqual([]);

    await cleanupUser(user.userId);
  });

  it("parcela agendada pro futuro não conta como paga -- progresso reflete só o que já venceu", async () => {
    const user = await registerTestUser("debts-auto-future-not-paid");

    const res = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({
        type: "cartao_credito",
        name: "Parcelas no futuro",
        totalAmount: 300,
        installmentAmount: 100,
        installmentsCount: 3,
        dueDay: futureDueDay(),
        autoGenerateInstallments: true,
      });

    // as 3 parcelas caem em datas futuras (dueDay escolhido ~15 dias à
    // frente) -- nada foi pago de verdade ainda, apesar de as 3 transações
    // e as 3 linhas de debt_payments já existirem no banco.
    expect(res.body.debt).toMatchObject({
      paidAmount: 0,
      remainingAmount: 300,
      progressPercent: 0,
      paidOff: false,
    });

    const list = await request(app).get("/api/debts").set(authHeader(user.token));
    expect(list.body.debts[0]).toMatchObject({ paidAmount: 0, remainingAmount: 300 });

    await cleanupUser(user.userId);
  });

  it("apagar a dívida remove as transações de parcelas futuras, mas preserva as que já venceram", async () => {
    const user = await registerTestUser("debts-remove-future-cleanup");
    const pastMonth = new Date().toISOString().slice(0, 7);
    const futureDate = (() => {
      const d = new Date();
      d.setUTCMonth(d.getUTCMonth() + 2);
      return d.toISOString().slice(0, 10);
    })();

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "parcelamento", name: "Mix passado e futuro", totalAmount: 1000 });
    const debtId = create.body.debt.id;

    await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 300, paidAt: isoDaysAgo(1) }); // já aconteceu
    await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 200, paidAt: futureDate }); // ainda não aconteceu

    await request(app).delete(`/api/debts/${debtId}`).set(authHeader(user.token));

    const txPast = await request(app)
      .get(`/api/transactions?month=${pastMonth}&limit=50`)
      .set(authHeader(user.token));
    expect(
      txPast.body.transactions.some((t: { description: string }) => t.description.includes("Mix passado e futuro"))
    ).toBe(true); // pagamento passado é histórico real, não some

    const futureMonth = futureDate.slice(0, 7);
    const txFuture = await request(app)
      .get(`/api/transactions?month=${futureMonth}&limit=50`)
      .set(authHeader(user.token));
    expect(
      txFuture.body.transactions.some((t: { description: string }) => t.description.includes("Mix passado e futuro"))
    ).toBe(false); // parcela futura nunca ia acontecer de verdade -- some junto com a dívida

    await cleanupUser(user.userId);
  });
});

describe("Dívidas -- quitação automática de parcelas agendadas", () => {
  it("quando o tempo passa da última parcela, list() comemora quitação (XP + notificação) uma única vez", async () => {
    const user = await registerTestUser("debts-auto-payoff");

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({
        type: "parcelamento",
        name: "Celular parcelado",
        totalAmount: 200,
        installmentAmount: 100,
        installmentsCount: 2,
        dueDay: 15,
        autoGenerateInstallments: true,
      });
    const debtId = create.body.debt.id;

    // avança "hoje" pra depois da última parcela -- toFake:["Date"] só
    // congela o relógio do Node, a conexão real com o MySQL não é afetada
    // (mesmo padrão já usado em objectives.test.ts).
    vi.useFakeTimers({ toFake: ["Date"] });
    const future = new Date();
    future.setUTCMonth(future.getUTCMonth() + 3);
    vi.setSystemTime(future);

    try {
      // O token emitido antes do salto tem exp calculado a partir do tempo
      // real -- sob o relógio 3 meses à frente ele parece expirado. Faz
      // login de novo já sob o tempo futuro, pra ter um token válido daqui
      // pra frente (mesmo usuário, mesma senha de sempre nos testes).
      const relogin = await request(app)
        .post("/api/auth/login")
        .send({ email: user.email, password: "senha12345" });
      const futureToken = relogin.body.token as string;

      const list1 = await request(app).get("/api/debts").set(authHeader(futureToken));
      const debt = list1.body.debts.find((d: { id: number }) => d.id === debtId);
      expect(debt.paidOff).toBe(true);

      const notifRes = await request(app).get("/api/notifications").set(authHeader(futureToken));
      const payoffNotifs = notifRes.body.notifications.filter(
        (n: { type: string; message: string }) =>
          n.type === "debt_paid_off" && n.message.includes("Celular parcelado")
      );
      expect(payoffNotifs).toHaveLength(1);

      // revisitar a lista de novo não comemora (nem dá XP) uma segunda vez
      await request(app).get("/api/debts").set(authHeader(futureToken));
      const notifRes2 = await request(app).get("/api/notifications").set(authHeader(futureToken));
      const payoffNotifs2 = notifRes2.body.notifications.filter(
        (n: { type: string; message: string }) =>
          n.type === "debt_paid_off" && n.message.includes("Celular parcelado")
      );
      expect(payoffNotifs2).toHaveLength(1);
    } finally {
      vi.useRealTimers();
    }

    await cleanupUser(user.userId);
  });
});
