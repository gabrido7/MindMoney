import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { pool } from "../src/config/db";
import { currentMonth, getPreviousMonth } from "../src/utils/month";
import { registerTestUser, cleanupUser, authHeader, getCategoryId, getAccountId } from "./helpers";

/** Dias-corridos atrás como 'YYYY-MM-DD' -- pra testar o limiar de 45 dias de consistência de pagamento sem depender de meses de calendário. */
function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

async function backdateDebtCreatedAt(debtId: number, mysqlDateTime: string) {
  await pool.query("UPDATE debts SET created_at = ? WHERE id = ?", [mysqlDateTime, debtId]);
}

describe("Conselhos sobre dívidas", () => {
  it("usuário sem dívidas recebe só o reforço positivo", async () => {
    const user = await registerTestUser("debtadvice-empty");

    const res = await request(app).get("/api/debt-advice").set(authHeader(user.token));

    expect(res.status).toBe(200);
    expect(res.body.advice).toHaveLength(1);
    expect(res.body.advice[0]).toMatchObject({ id: "sem-dividas", severity: "success" });

    await cleanupUser(user.userId);
  });

  it("dívida com parcela que não cobre os juros gera alerta crítico de armadilha", async () => {
    const user = await registerTestUser("debtadvice-trap");

    const debt = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({
        type: "emprestimo",
        name: "Empréstimo Armadilha",
        totalAmount: 10000,
        installmentAmount: 50, // bem abaixo do juro mensal sobre 10000 a 5%
        interestRate: 5,
      });
    expect(debt.status).toBe(201);

    const res = await request(app).get("/api/debt-advice").set(authHeader(user.token));

    const trapAdvice = res.body.advice.find((a: { id: string }) => a.id === `armadilha-${debt.body.debt.id}`);
    expect(trapAdvice).toMatchObject({ severity: "critical" });
    expect(trapAdvice.title).toContain("Empréstimo Armadilha");

    await cleanupUser(user.userId);
  });

  it("cartão de crédito com juros altos gera alerta de rotativo caro com equivalente anual", async () => {
    const user = await registerTestUser("debtadvice-card");

    const debt = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({
        type: "cartao_credito",
        name: "Cartão Caro",
        totalAmount: 2000,
        installmentAmount: 300,
        interestRate: 15,
      });
    expect(debt.status).toBe(201);

    const res = await request(app).get("/api/debt-advice").set(authHeader(user.token));

    const cardAdvice = res.body.advice.find((a: { id: string }) => a.id === `cartao-rotativo-${debt.body.debt.id}`);
    expect(cardAdvice).toMatchObject({ severity: "critical" });
    expect(cardAdvice.title).toContain("Cartão Caro");
    // (1.15)^12 - 1 ~= 435% -- confere que o equivalente anual real está no texto, não um valor fixo
    expect(cardAdvice.message).toMatch(/435%/);

    await cleanupUser(user.userId);
  });

  it("comprometimento de renda acima de 50% gera alerta crítico com o percentual real", async () => {
    const user = await registerTestUser("debtadvice-ratio");
    const salarioId = await getCategoryId(user.token, "Salário");
    const accountId = await getAccountId(user.token);

    await request(app)
      .post("/api/transactions")
      .set(authHeader(user.token))
      .send({ accountId, categoryId: salarioId, description: "Salário", amount: 2000, type: "entrada", transactionDate: new Date().toISOString().slice(0, 10) });

    await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({
        type: "financiamento",
        name: "Financiamento Pesado",
        totalAmount: 50000,
        installmentAmount: 1200, // 60% de 2000
        interestRate: 1,
      });

    const res = await request(app).get("/api/debt-advice").set(authHeader(user.token));

    const ratioAdvice = res.body.advice.find((a: { id: string }) => a.id === "comprometimento-renda");
    expect(ratioAdvice).toMatchObject({ severity: "critical" });
    expect(ratioAdvice.title).toContain("60%");

    await cleanupUser(user.userId);
  });

  it("situação financeira endividada sem reserva sugere reserva mínima, e some quando o objetivo existe", async () => {
    const user = await registerTestUser("debtadvice-reserve");

    await request(app)
      .put("/api/users/me/financial-profile")
      .set(authHeader(user.token))
      .send({ financialSituation: "endividado" });

    await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida qualquer", totalAmount: 1000 });

    const before = await request(app).get("/api/debt-advice").set(authHeader(user.token));
    expect(before.body.advice.some((a: { id: string }) => a.id === "reserva-antes-de-acelerar")).toBe(true);

    await request(app)
      .post("/api/objectives")
      .set(authHeader(user.token))
      .send({ name: "Reserva de emergência", category: "reserva", targetAmount: 5000, targetMonth: "2026-12" });

    const after = await request(app).get("/api/debt-advice").set(authHeader(user.token));
    expect(after.body.advice.some((a: { id: string }) => a.id === "reserva-antes-de-acelerar")).toBe(false);

    await cleanupUser(user.userId);
  });

  it("diagnóstico geral aparece sempre primeiro e cita a projeção real de quitação", async () => {
    const user = await registerTestUser("debtadvice-diagnosis");

    await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "emprestimo", name: "Empréstimo Projeção", totalAmount: 2000, installmentAmount: 500, interestRate: 1 });

    const res = await request(app).get("/api/debt-advice").set(authHeader(user.token));

    expect(res.body.advice[0].id).toBe("diagnostico-geral");
    expect(res.body.advice[0].message).toContain("livre de todas as dívidas");

    await cleanupUser(user.userId);
  });

  it("diagnóstico mostra a tendência real quando há pagamentos de meses anteriores", async () => {
    const user = await registerTestUser("debtadvice-trend");

    const debt = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "emprestimo", name: "Empréstimo Tendência", totalAmount: 1000 });

    const twoMonthsAgo = getPreviousMonth(getPreviousMonth(currentMonth()));
    await backdateDebtCreatedAt(debt.body.debt.id, `${twoMonthsAgo}-01 00:00:00`);

    // pago no mês de 2 meses atrás -- conta na comparação "2 meses atrás"
    await request(app)
      .post(`/api/debts/${debt.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 200, paidAt: `${twoMonthsAgo}-02` });

    // pago hoje -- só entra no saldo de hoje, não no de 2 meses atrás
    await request(app)
      .post(`/api/debts/${debt.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 300, paidAt: new Date().toISOString().slice(0, 10) });

    const res = await request(app).get("/api/debt-advice").set(authHeader(user.token));

    const diagnosis = res.body.advice[0];
    expect(diagnosis.id).toBe("diagnostico-geral");
    expect(diagnosis.severity).toBe("success");
    expect(diagnosis.message).toContain("Sua dívida total caiu");

    await cleanupUser(user.userId);
  });

  it("consistência de pagamento alerta numa dívida antiga sem pagamento recente, mas não numa dívida recém-criada", async () => {
    const user = await registerTestUser("debtadvice-consistency");

    const oldDebt = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "emprestimo", name: "Empréstimo Esquecido", totalAmount: 5000, installmentAmount: 200 });
    await backdateDebtCreatedAt(oldDebt.body.debt.id, `${isoDaysAgo(90)} 00:00:00`);

    const newDebt = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "emprestimo", name: "Empréstimo Novo", totalAmount: 3000, installmentAmount: 150 });

    const res = await request(app).get("/api/debt-advice").set(authHeader(user.token));

    expect(res.body.advice.some((a: { id: string }) => a.id === `consistencia-${oldDebt.body.debt.id}`)).toBe(true);
    expect(res.body.advice.some((a: { id: string }) => a.id === `consistencia-${newDebt.body.debt.id}`)).toBe(false);

    await cleanupUser(user.userId);
  });

  it("consistência de pagamento some depois de um pagamento recente", async () => {
    const user = await registerTestUser("debtadvice-consistency-paid");

    const debt = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "emprestimo", name: "Empréstimo Regularizado", totalAmount: 5000, installmentAmount: 200 });
    await backdateDebtCreatedAt(debt.body.debt.id, `${isoDaysAgo(90)} 00:00:00`);

    await request(app)
      .post(`/api/debts/${debt.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 200, paidAt: isoDaysAgo(1) });

    const res = await request(app).get("/api/debt-advice").set(authHeader(user.token));
    expect(res.body.advice.some((a: { id: string }) => a.id === `consistencia-${debt.body.debt.id}`)).toBe(false);

    await cleanupUser(user.userId);
  });

  it("ordena por gravidade -- itens critical vêm antes de warning/success, exceto o diagnóstico que é sempre o primeiro", async () => {
    const user = await registerTestUser("debtadvice-severity-order");

    // cartão rotativo (critical) cadastrado DEPOIS da dívida saudável (success/warning),
    // pra confirmar que o sort reordena de verdade, não só preserva a ordem de criação.
    await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "emprestimo", name: "Empréstimo Saudável", totalAmount: 1000, installmentAmount: 500, interestRate: 1 });
    await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "cartao_credito", name: "Cartão Depois", totalAmount: 2000, installmentAmount: 500, interestRate: 15 });

    const res = await request(app).get("/api/debt-advice").set(authHeader(user.token));

    expect(res.body.advice[0].id).toBe("diagnostico-geral");

    const rank: Record<string, number> = { critical: 0, warning: 1, success: 2 };
    const rest = res.body.advice.filter((a: { id: string }) => a.id !== "diagnostico-geral");
    const ranks = rest.map((a: { severity: string }) => rank[a.severity]);
    const sorted = [...ranks].sort((a, b) => a - b);
    expect(ranks).toEqual(sorted);
    // confere que a dívida crítica (cadastrada depois) realmente subiu pra frente da saudável (cadastrada antes)
    const cardIndex = rest.findIndex((a: { id: string }) => a.id.startsWith("cartao-rotativo-"));
    const attackIndex = rest.findIndex((a: { id: string }) => a.id === "plano-ataque");
    expect(cardIndex).toBeGreaterThanOrEqual(0);
    if (attackIndex >= 0) expect(cardIndex).toBeLessThan(attackIndex);

    await cleanupUser(user.userId);
  });

  it("conselhos de um usuário nunca aparecem para outro", async () => {
    const userA = await registerTestUser("debtadvice-idor-a");
    const userB = await registerTestUser("debtadvice-idor-b");

    await request(app)
      .post("/api/debts")
      .set(authHeader(userA.token))
      .send({
        type: "cartao_credito",
        name: "Cartão só do A",
        totalAmount: 2000,
        installmentAmount: 300,
        interestRate: 15,
      });

    const resB = await request(app).get("/api/debt-advice").set(authHeader(userB.token));
    expect(resB.body.advice.every((a: { title: string }) => !a.title.includes("Cartão só do A"))).toBe(true);
    expect(resB.body.advice.some((a: { id: string }) => a.id === "sem-dividas")).toBe(true);

    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("celebra o progresso real quando pelo menos 20% do valor original já foi pago", async () => {
    const user = await registerTestUser("debtadvice-progress");

    const debt = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "emprestimo", name: "Empréstimo em dia", totalAmount: 1000, installmentAmount: 500, interestRate: 1 });

    await request(app)
      .post(`/api/debts/${debt.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 300, paidAt: new Date().toISOString().slice(0, 10) }); // 30% do valor original

    const res = await request(app).get("/api/debt-advice").set(authHeader(user.token));
    const progress = res.body.advice.find((a: { id: string }) => a.id === "progresso-pago");

    expect(progress).toMatchObject({ severity: "success" });
    expect(progress.title).toContain("30%");

    await cleanupUser(user.userId);
  });

  it("não celebra progresso abaixo de 20% -- evita ruído logo no início", async () => {
    const user = await registerTestUser("debtadvice-progress-low");

    const debt = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "emprestimo", name: "Início recente", totalAmount: 1000, installmentAmount: 500, interestRate: 1 });

    await request(app)
      .post(`/api/debts/${debt.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 50, paidAt: new Date().toISOString().slice(0, 10) }); // só 5%

    const res = await request(app).get("/api/debt-advice").set(authHeader(user.token));
    expect(res.body.advice.some((a: { id: string }) => a.id === "progresso-pago")).toBe(false);

    await cleanupUser(user.userId);
  });
});
