import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { registerTestUser, cleanupUser, authHeader, getCategoryId, type TestUser } from "./helpers";

describe("Score financeiro", () => {
  let user: TestUser;

  beforeAll(async () => {
    user = await registerTestUser("score");
  });

  afterAll(async () => {
    await cleanupUser(user.userId);
  });

  it("mês sem nenhuma transação: score baixo, nível Atenção ou Crítico", async () => {
    const res = await request(app)
      .get("/api/score")
      .query({ month: "2026-08" })
      .set(authHeader(user.token));

    expect(res.status).toBe(200);
    expect(res.body.breakdown.spendingControl).toBe(0);
    expect(["Atenção", "Crítico"]).toContain(res.body.level);
  });

  it("bom controle de gastos (20% das entradas) gera score alto", async () => {
    const salarioId = await getCategoryId(user.token, "Salário");
    const alimentacaoId = await getCategoryId(user.token, "Alimentação");

    await request(app)
      .post("/api/transactions")
      .set(authHeader(user.token))
      .send({ categoryId: salarioId, description: "Salário", amount: 5000, type: "entrada", transactionDate: "2026-09-05" });
    await request(app)
      .post("/api/transactions")
      .set(authHeader(user.token))
      .send({ categoryId: alimentacaoId, description: "Alimentação", amount: 1000, type: "saida", transactionDate: "2026-09-10" });

    const res = await request(app).get("/api/score").query({ month: "2026-09" }).set(authHeader(user.token));

    // 40 * (1 - 1000/5000) = 32
    expect(res.body.breakdown.spendingControl).toBe(32);
    // sem meta: 30 * ((4000/5000) / 0.2) -> clamp em 30
    expect(res.body.breakdown.savingsCapacity).toBe(30);
    expect(res.body.score).toBeGreaterThanOrEqual(80);
    expect(res.body.level).toBe("Excelente");
  });

  it("histórico traz os últimos N meses em ordem crescente", async () => {
    const res = await request(app)
      .get("/api/score/history")
      .query({ months: 3 })
      .set(authHeader(user.token));

    expect(res.status).toBe(200);
    expect(res.body.history.length).toBe(3);
    const months = res.body.history.map((h: { month: string }) => h.month);
    expect([...months].sort()).toEqual(months);
  });
});
