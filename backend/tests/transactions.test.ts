import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { registerTestUser, cleanupUser, authHeader, getCategoryId, getAccountId, type TestUser } from "./helpers";

describe("Transações (CRUD, validação, filtros, permissões)", () => {
  let userA: TestUser;
  let userB: TestUser;
  let salarioId: number;
  let alimentacaoId: number;
  let accountIdA: number;
  let accountIdB: number;

  beforeAll(async () => {
    userA = await registerTestUser("transacoes-a");
    userB = await registerTestUser("transacoes-b");
    salarioId = await getCategoryId(userA.token, "Salário");
    alimentacaoId = await getCategoryId(userA.token, "Alimentação");
    accountIdA = await getAccountId(userA.token);
    accountIdB = await getAccountId(userB.token);
  });

  afterAll(async () => {
    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("cria uma transação válida", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .set(authHeader(userA.token))
      .send({
        accountId: accountIdA,
        categoryId: salarioId,
        description: "Salário",
        amount: 5000,
        type: "entrada",
        transactionDate: "2026-08-05",
      });

    expect(res.status).toBe(201);
    expect(res.body.transaction.amount).toBe(5000);
    expect(res.body.transaction.category_name).toBe("Salário");
  });

  it("rejeita valor negativo ou zero (400)", async () => {
    const negativo = await request(app)
      .post("/api/transactions")
      .set(authHeader(userA.token))
      .send({ accountId: accountIdA, categoryId: alimentacaoId, description: "x", amount: -10, type: "saida", transactionDate: "2026-08-10" });
    expect(negativo.status).toBe(400);

    const zero = await request(app)
      .post("/api/transactions")
      .set(authHeader(userA.token))
      .send({ accountId: accountIdA, categoryId: alimentacaoId, description: "x", amount: 0, type: "saida", transactionDate: "2026-08-10" });
    expect(zero.status).toBe(400);
  });

  it("rejeita categoria inexistente (400)", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .set(authHeader(userA.token))
      .send({ accountId: accountIdA, categoryId: 999999, description: "x", amount: 10, type: "saida", transactionDate: "2026-08-10" });
    expect(res.status).toBe(400);
  });

  it("filtra por mês e por tipo", async () => {
    await request(app)
      .post("/api/transactions")
      .set(authHeader(userA.token))
      .send({ accountId: accountIdA, categoryId: alimentacaoId, description: "Mercado", amount: 300, type: "saida", transactionDate: "2026-07-15" });

    const agosto = await request(app)
      .get("/api/transactions")
      .query({ month: "2026-08" })
      .set(authHeader(userA.token));
    expect(agosto.body.transactions.every((t: { transaction_date: string }) => t.transaction_date.startsWith("2026-08"))).toBe(true);

    const entradas = await request(app)
      .get("/api/transactions")
      .query({ type: "entrada" })
      .set(authHeader(userA.token));
    expect(entradas.body.transactions.every((t: { type: string }) => t.type === "entrada")).toBe(true);
  });

  it("edita e depois exclui uma transação", async () => {
    const created = await request(app)
      .post("/api/transactions")
      .set(authHeader(userA.token))
      .send({ accountId: accountIdA, categoryId: alimentacaoId, description: "Editar", amount: 100, type: "saida", transactionDate: "2026-08-12" });
    const id = created.body.transaction.id;

    const updated = await request(app)
      .put(`/api/transactions/${id}`)
      .set(authHeader(userA.token))
      .send({ accountId: accountIdA, categoryId: alimentacaoId, description: "Editada", amount: 250, type: "saida", transactionDate: "2026-08-12" });
    expect(updated.status).toBe(200);
    expect(updated.body.transaction.amount).toBe(250);

    const deleted = await request(app).delete(`/api/transactions/${id}`).set(authHeader(userA.token));
    expect(deleted.status).toBe(204);

    const afterDelete = await request(app).delete(`/api/transactions/${id}`).set(authHeader(userA.token));
    expect(afterDelete.status).toBe(404);
  });

  it("usuário B não vê, não edita e não apaga transação de A (IDOR)", async () => {
    const created = await request(app)
      .post("/api/transactions")
      .set(authHeader(userA.token))
      .send({ accountId: accountIdA, categoryId: salarioId, description: "Só de A", amount: 999, type: "entrada", transactionDate: "2026-08-01" });
    const id = created.body.transaction.id;

    const listB = await request(app).get("/api/transactions").set(authHeader(userB.token));
    expect(listB.body.transactions.find((t: { id: number }) => t.id === id)).toBeUndefined();

    const editB = await request(app)
      .put(`/api/transactions/${id}`)
      .set(authHeader(userB.token))
      // accountId de A só pra passar da validação zod (número presente) --
      // a checagem de posse da transação já barra antes de sequer olhar pra
      // conta/categoria, então o valor exato aqui não importa pro teste.
      .send({ accountId: accountIdA, categoryId: salarioId, description: "hack", amount: 1, type: "entrada", transactionDate: "2026-08-01" });
    expect(editB.status).toBe(404);

    const deleteB = await request(app).delete(`/api/transactions/${id}`).set(authHeader(userB.token));
    expect(deleteB.status).toBe(404);

    const stillThere = await request(app).get("/api/transactions").set(authHeader(userA.token));
    expect(stillThere.body.transactions.find((t: { id: number }) => t.id === id)).toBeTruthy();
  });

  it("usuário B não consegue criar transação usando categoria de A", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .set(authHeader(userB.token))
      .send({ accountId: accountIdB, categoryId: salarioId, description: "hack", amount: 10, type: "entrada", transactionDate: "2026-08-01" });
    expect(res.status).toBe(400);
  });

  it("pagina o resultado (limit define o tamanho da página, total reflete o total real)", async () => {
    const pagUser = await registerTestUser("paginacao");
    const catId = await getCategoryId(pagUser.token, "Alimentação");
    const pagAccountId = await getAccountId(pagUser.token);

    for (let i = 0; i < 7; i++) {
      await request(app)
        .post("/api/transactions")
        .set(authHeader(pagUser.token))
        .send({
          accountId: pagAccountId,
          categoryId: catId,
          description: `Transação ${i}`,
          amount: 10 + i,
          type: "saida",
          transactionDate: "2026-08-01",
        });
    }

    const page1 = await request(app)
      .get("/api/transactions")
      .query({ limit: 3, page: 1 })
      .set(authHeader(pagUser.token));
    expect(page1.body.transactions.length).toBe(3);
    expect(page1.body.pagination).toEqual({ page: 1, limit: 3, total: 7, totalPages: 3 });

    const page3 = await request(app)
      .get("/api/transactions")
      .query({ limit: 3, page: 3 })
      .set(authHeader(pagUser.token));
    expect(page3.body.transactions.length).toBe(1);

    const idsPage1 = page1.body.transactions.map((t: { id: number }) => t.id);
    const idsPage3 = page3.body.transactions.map((t: { id: number }) => t.id);
    expect(idsPage1.some((id: number) => idsPage3.includes(id))).toBe(false);

    await cleanupUser(pagUser.userId);
  });

  it("limita o tamanho máximo de página e rejeita page/limit inválidos", async () => {
    const tooBig = await request(app)
      .get("/api/transactions")
      .query({ limit: 500 })
      .set(authHeader(userA.token));
    expect(tooBig.status).toBe(400);

    const zeroPage = await request(app)
      .get("/api/transactions")
      .query({ page: 0 })
      .set(authHeader(userA.token));
    expect(zeroPage.status).toBe(400);
  });

  it("usa limit=50/page=1 como padrão quando não informado", async () => {
    const res = await request(app).get("/api/transactions").set(authHeader(userA.token));
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(50);
  });
});
