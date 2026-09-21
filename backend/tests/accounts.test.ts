import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { registerTestUser, cleanupUser, authHeader, getCategoryId, getAccountId } from "./helpers";

describe("Contas", () => {
  it("todo usuário novo já nasce com uma conta padrão (Conta Principal, saldo zero)", async () => {
    const user = await registerTestUser("accounts-fresh");
    const res = await request(app).get("/api/accounts").set(authHeader(user.token));

    expect(res.status).toBe(200);
    expect(res.body.accounts).toHaveLength(1);
    expect(res.body.accounts[0]).toMatchObject({
      type: "corrente",
      name: "Conta Principal",
      initialBalance: 0,
      balance: 0,
    });

    await cleanupUser(user.userId);
  });

  it("cria uma conta com saldo inicial e ela aparece na lista com esse saldo (sem transação ainda)", async () => {
    const user = await registerTestUser("accounts-create");

    const res = await request(app)
      .post("/api/accounts")
      .set(authHeader(user.token))
      .send({ type: "poupanca", name: "Poupança Nubank", initialBalance: 1000 });

    expect(res.status).toBe(201);
    expect(res.body.account).toMatchObject({
      type: "poupanca",
      name: "Poupança Nubank",
      initialBalance: 1000,
      balance: 1000,
    });

    const list = await request(app).get("/api/accounts").set(authHeader(user.token));
    expect(list.body.accounts).toHaveLength(2); // a padrão + esta

    await cleanupUser(user.userId);
  });

  it("aceita saldo inicial negativo (conta corrente pode nascer no vermelho)", async () => {
    const user = await registerTestUser("accounts-negative");

    const res = await request(app)
      .post("/api/accounts")
      .set(authHeader(user.token))
      .send({ type: "corrente", name: "Cheque especial usado", initialBalance: -300 });

    expect(res.status).toBe(201);
    expect(res.body.account.balance).toBe(-300);

    await cleanupUser(user.userId);
  });

  it("rejeita tipo fora do enum", async () => {
    const user = await registerTestUser("accounts-invalid-type");

    const res = await request(app)
      .post("/api/accounts")
      .set(authHeader(user.token))
      .send({ type: "nao-existe", name: "Teste", initialBalance: 0 });
    expect(res.status).toBe(400);

    await cleanupUser(user.userId);
  });

  it("saldo da conta é initial_balance + soma real das transações (entrada soma, saída subtrai)", async () => {
    const user = await registerTestUser("accounts-balance");
    const accountId = await getAccountId(user.token);
    const salarioId = await getCategoryId(user.token, "Salário");
    const alimentacaoId = await getCategoryId(user.token, "Alimentação");

    await request(app)
      .post("/api/transactions")
      .set(authHeader(user.token))
      .send({ accountId, categoryId: salarioId, description: "Salário", amount: 3000, type: "entrada", transactionDate: "2026-08-05" });
    await request(app)
      .post("/api/transactions")
      .set(authHeader(user.token))
      .send({ accountId, categoryId: alimentacaoId, description: "Mercado", amount: 400, type: "saida", transactionDate: "2026-08-10" });

    const res = await request(app).get("/api/accounts").set(authHeader(user.token));
    const account = res.body.accounts.find((a: { id: number }) => a.id === accountId);
    expect(account.balance).toBe(2600); // 0 + 3000 - 400

    await cleanupUser(user.userId);
  });

  it("apagar uma transação atualiza o saldo da conta de volta", async () => {
    const user = await registerTestUser("accounts-balance-after-delete");
    const accountId = await getAccountId(user.token);
    const salarioId = await getCategoryId(user.token, "Salário");

    const tx = await request(app)
      .post("/api/transactions")
      .set(authHeader(user.token))
      .send({ accountId, categoryId: salarioId, description: "Salário", amount: 500, type: "entrada", transactionDate: "2026-08-05" });

    await request(app).delete(`/api/transactions/${tx.body.transaction.id}`).set(authHeader(user.token));

    const res = await request(app).get("/api/accounts").set(authHeader(user.token));
    expect(res.body.accounts[0].balance).toBe(0);

    await cleanupUser(user.userId);
  });

  it("não permite apagar uma conta com transação (protege histórico real)", async () => {
    const user = await registerTestUser("accounts-remove-blocked");
    const accountId = await getAccountId(user.token);
    const salarioId = await getCategoryId(user.token, "Salário");

    await request(app)
      .post("/api/transactions")
      .set(authHeader(user.token))
      .send({ accountId, categoryId: salarioId, description: "Salário", amount: 100, type: "entrada", transactionDate: "2026-08-05" });

    const remove = await request(app).delete(`/api/accounts/${accountId}`).set(authHeader(user.token));
    expect(remove.status).toBe(409);

    const list = await request(app).get("/api/accounts").set(authHeader(user.token));
    expect(list.body.accounts.some((a: { id: number }) => a.id === accountId)).toBe(true);

    await cleanupUser(user.userId);
  });

  it("apaga uma conta sem transação nenhuma", async () => {
    const user = await registerTestUser("accounts-remove-empty");

    const created = await request(app)
      .post("/api/accounts")
      .set(authHeader(user.token))
      .send({ type: "carteira", name: "Carteira", initialBalance: 50 });

    const remove = await request(app)
      .delete(`/api/accounts/${created.body.account.id}`)
      .set(authHeader(user.token));
    expect(remove.status).toBe(204);

    const list = await request(app).get("/api/accounts").set(authHeader(user.token));
    expect(list.body.accounts.some((a: { id: number }) => a.id === created.body.account.id)).toBe(false);

    await cleanupUser(user.userId);
  });

  it("remover uma conta inexistente devolve 404", async () => {
    const user = await registerTestUser("accounts-remove-missing");
    const res = await request(app).delete("/api/accounts/999999999").set(authHeader(user.token));
    expect(res.status).toBe(404);
    await cleanupUser(user.userId);
  });

  it("usuário B não vê nem apaga conta de A, nem lança transação nela (IDOR)", async () => {
    const userA = await registerTestUser("accounts-idor-a");
    const userB = await registerTestUser("accounts-idor-b");
    const accountIdA = await getAccountId(userA.token);
    const salarioIdB = await getCategoryId(userB.token, "Salário");

    const listB = await request(app).get("/api/accounts").set(authHeader(userB.token));
    expect(listB.body.accounts.some((a: { id: number }) => a.id === accountIdA)).toBe(false);

    const removeB = await request(app).delete(`/api/accounts/${accountIdA}`).set(authHeader(userB.token));
    expect(removeB.status).toBe(404);

    const txB = await request(app)
      .post("/api/transactions")
      .set(authHeader(userB.token))
      .send({ accountId: accountIdA, categoryId: salarioIdB, description: "hack", amount: 10, type: "entrada", transactionDate: "2026-08-01" });
    expect(txB.status).toBe(400);

    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("exige autenticação (401 sem token)", async () => {
    const res = await request(app).get("/api/accounts");
    expect(res.status).toBe(401);
  });
});
