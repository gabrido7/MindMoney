import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { registerTestUser, cleanupUser, authHeader, getCategoryId, type TestUser } from "./helpers";

describe("Dashboard (agregação e cálculos)", () => {
  let user: TestUser;

  beforeAll(async () => {
    user = await registerTestUser("dashboard");
    const salarioId = await getCategoryId(user.token, "Salário");
    const alimentacaoId = await getCategoryId(user.token, "Alimentação");
    const transporteId = await getCategoryId(user.token, "Transporte");

    await request(app)
      .post("/api/transactions")
      .set(authHeader(user.token))
      .send({ categoryId: salarioId, description: "Salário", amount: 5000, type: "entrada", transactionDate: "2026-08-05" });
    await request(app)
      .post("/api/transactions")
      .set(authHeader(user.token))
      .send({ categoryId: alimentacaoId, description: "Alimentação", amount: 1200, type: "saida", transactionDate: "2026-08-10" });
    await request(app)
      .post("/api/transactions")
      .set(authHeader(user.token))
      .send({ categoryId: transporteId, description: "Transporte", amount: 300, type: "saida", transactionDate: "2026-08-12" });
  });

  afterAll(async () => {
    await cleanupUser(user.userId);
  });

  it("calcula totais e saldo corretamente", async () => {
    const res = await request(app).get("/api/dashboard").query({ month: "2026-08" }).set(authHeader(user.token));

    expect(res.body.totals.entradas).toBe(5000);
    expect(res.body.totals.saidas).toBe(1500);
    expect(res.body.totals.saldo).toBe(3500);
  });

  it("ranking traz a categoria de maior gasto em primeiro", async () => {
    const res = await request(app).get("/api/dashboard").query({ month: "2026-08" }).set(authHeader(user.token));
    expect(res.body.ranking[0].name).toBe("Alimentação");
    expect(res.body.ranking[0].value).toBe(1200);
  });

  it("mês sem nenhuma transação não quebra (divisão por zero tratada)", async () => {
    const res = await request(app).get("/api/dashboard").query({ month: "2020-01" }).set(authHeader(user.token));
    expect(res.status).toBe(200);
    expect(res.body.totals.entradas).toBe(0);
    expect(res.body.alert.gastoPercentual).toBe(0);
    expect(Number.isFinite(res.body.changes.saldo)).toBe(true);
  });
});
