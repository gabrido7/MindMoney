import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { registerTestUser, cleanupUser, authHeader } from "./helpers";

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
    const month = new Date().toISOString().slice(0, 7);

    const create = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida a apagar", totalAmount: 1000 });
    const debtId = create.body.debt.id;

    await request(app)
      .post(`/api/debts/${debtId}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 400, paidAt: `${month}-10` });

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
  const dueDayInDays = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.getDate();
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
