import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { currentMonth, getPreviousMonth } from "../src/utils/month";
import { registerTestUser, cleanupUser, authHeader, getAccountId, getCategoryId } from "./helpers";

describe("Patrimônio líquido -- histórico", () => {
  it("devolve 6 meses por padrão, com o mês atual batendo com o retrato de hoje", async () => {
    const user = await registerTestUser("networth-default");
    const today = new Date().toISOString().slice(0, 10);

    await request(app)
      .post("/api/assets")
      .set(authHeader(user.token))
      .send({ type: "investimento", name: "Poupança", initialValue: 2000, valuedAt: today });
    await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida qualquer", totalAmount: 500 });

    const res = await request(app).get("/api/net-worth/history").set(authHeader(user.token));

    expect(res.status).toBe(200);
    expect(res.body.history).toHaveLength(6);

    const currentSnapshot = res.body.history[res.body.history.length - 1];
    expect(currentSnapshot.month).toBe(currentMonth());
    expect(currentSnapshot.totalAssets).toBe(2000);
    expect(currentSnapshot.totalDebts).toBe(500);
    expect(currentSnapshot.netWorth).toBe(1500);

    await cleanupUser(user.userId);
  });

  it("reflete a evolução real do patrimônio -- snapshot de 2 meses atrás não inclui valor/dívida lançados só depois", async () => {
    const user = await registerTestUser("networth-trend");
    const twoMonthsAgo = getPreviousMonth(getPreviousMonth(currentMonth()));
    const today = new Date().toISOString().slice(0, 10);

    await request(app)
      .post("/api/assets")
      .set(authHeader(user.token))
      .send({ type: "investimento", name: "Poupança Antiga", initialValue: 1000, valuedAt: `${twoMonthsAgo}-01` });
    await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Financiamento Novo", totalAmount: 300 }); // criado agora -- não existia há 2 meses

    const created = await request(app).get("/api/assets").set(authHeader(user.token));
    await request(app)
      .post(`/api/assets/${created.body.assets[0].id}/updates`)
      .set(authHeader(user.token))
      .send({ value: 1500, valuedAt: today });

    const res = await request(app).get("/api/net-worth/history").set(authHeader(user.token));

    const oldSnapshot = res.body.history.find((h: { month: string }) => h.month === twoMonthsAgo);
    expect(oldSnapshot).toMatchObject({ totalAssets: 1000, totalDebts: 0, netWorth: 1000 });

    const currentSnapshot = res.body.history[res.body.history.length - 1];
    expect(currentSnapshot).toMatchObject({ totalAssets: 1500, totalDebts: 300, netWorth: 1200 });

    await cleanupUser(user.userId);
  });

  it("saldo de conta (initial_balance + transações) entra no patrimônio junto com ativos e dívidas", async () => {
    const user = await registerTestUser("networth-accounts");
    const today = new Date().toISOString().slice(0, 10);
    const accountId = await getAccountId(user.token); // "Conta Principal" seedada, initial_balance 0
    const salarioId = await getCategoryId(user.token, "Salário");

    await request(app)
      .post("/api/transactions")
      .set(authHeader(user.token))
      .send({ accountId, categoryId: salarioId, description: "Salário", amount: 800, type: "entrada", transactionDate: today });

    const newAccount = await request(app)
      .post("/api/accounts")
      .set(authHeader(user.token))
      .send({ type: "poupanca", name: "Poupança", initialBalance: 200 });
    expect(newAccount.status).toBe(201);

    const res = await request(app).get("/api/net-worth/history").set(authHeader(user.token));
    const currentSnapshot = res.body.history[res.body.history.length - 1];

    // Conta Principal: 0 + 800 = 800. Poupança nova: 200 + 0 = 200. Total: 1000.
    expect(currentSnapshot.totalAccounts).toBe(1000);
    expect(currentSnapshot.netWorth).toBe(1000);

    await cleanupUser(user.userId);
  });

  it("aceita o parâmetro months e rejeita valores fora do intervalo permitido", async () => {
    const user = await registerTestUser("networth-months-param");

    const custom = await request(app)
      .get("/api/net-worth/history")
      .query({ months: 3 })
      .set(authHeader(user.token));
    expect(custom.status).toBe(200);
    expect(custom.body.history).toHaveLength(3);

    const tooFew = await request(app)
      .get("/api/net-worth/history")
      .query({ months: 1 })
      .set(authHeader(user.token));
    expect(tooFew.status).toBe(400);

    const tooMany = await request(app)
      .get("/api/net-worth/history")
      .query({ months: 30 })
      .set(authHeader(user.token));
    expect(tooMany.status).toBe(400);

    await cleanupUser(user.userId);
  });

  it("histórico de um usuário nunca inclui dado de outro (IDOR)", async () => {
    const userA = await registerTestUser("networth-idor-a");
    const userB = await registerTestUser("networth-idor-b");

    await request(app)
      .post("/api/assets")
      .set(authHeader(userA.token))
      .send({ type: "investimento", name: "Só de A", initialValue: 999999, valuedAt: new Date().toISOString().slice(0, 10) });

    const resB = await request(app).get("/api/net-worth/history").set(authHeader(userB.token));
    const currentSnapshot = resB.body.history[resB.body.history.length - 1];
    expect(currentSnapshot.totalAssets).toBe(0);

    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("todas as rotas exigem autenticação (401 sem token)", async () => {
    const res = await request(app).get("/api/net-worth/history");
    expect(res.status).toBe(401);
  });
});
