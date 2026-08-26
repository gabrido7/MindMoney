import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { registerTestUser, cleanupUser, authHeader, getCategoryId } from "./helpers";

const MONTH = new Date().toISOString().slice(0, 7);

describe("Orçamento por categoria", () => {
  it("lista vazia para um usuário novo", async () => {
    const user = await registerTestUser("budget-fresh");
    const res = await request(app)
      .get(`/api/category-budgets?month=${MONTH}`)
      .set(authHeader(user.token));

    expect(res.status).toBe(200);
    expect(res.body.budgets).toEqual([]);

    await cleanupUser(user.userId);
  });

  it("define um orçamento e ele aparece na lista com gasto zerado", async () => {
    const user = await registerTestUser("budget-create");
    const categoryId = await getCategoryId(user.token, "Alimentação");

    const res = await request(app)
      .put(`/api/category-budgets/${categoryId}`)
      .set(authHeader(user.token))
      .send({ month: MONTH, amount: 400 });

    expect(res.status).toBe(200);
    expect(res.body.budget).toMatchObject({
      categoryId,
      categoryName: "Alimentação",
      amount: 400,
      spent: 0,
      percent: 0,
      status: "ok",
    });

    await cleanupUser(user.userId);
  });

  it("calcula percentual e status (ok/near/over) a partir de transações reais", async () => {
    const user = await registerTestUser("budget-status");
    const categoryId = await getCategoryId(user.token, "Alimentação");

    await request(app)
      .put(`/api/category-budgets/${categoryId}`)
      .set(authHeader(user.token))
      .send({ month: MONTH, amount: 400 });

    await request(app)
      .post("/api/transactions")
      .set(authHeader(user.token))
      .send({
        description: "Mercado",
        amount: 340,
        type: "saida",
        transactionDate: `${MONTH}-05`,
        categoryId,
      });

    const res = await request(app)
      .get(`/api/category-budgets?month=${MONTH}`)
      .set(authHeader(user.token));

    expect(res.body.budgets).toHaveLength(1);
    expect(res.body.budgets[0]).toMatchObject({ spent: 340, status: "near" });
    expect(res.body.budgets[0].percent).toBeCloseTo(85, 0);

    await cleanupUser(user.userId);
  });

  it('marca status "over" quando o gasto ultrapassa o orçamento e gera notificação', async () => {
    const user = await registerTestUser("budget-over");
    const categoryId = await getCategoryId(user.token, "Alimentação");

    await request(app)
      .put(`/api/category-budgets/${categoryId}`)
      .set(authHeader(user.token))
      .send({ month: MONTH, amount: 100 });

    await request(app)
      .post("/api/transactions")
      .set(authHeader(user.token))
      .send({
        description: "Mercado grande",
        amount: 150,
        type: "saida",
        transactionDate: `${MONTH}-05`,
        categoryId,
      });

    const budgets = await request(app)
      .get(`/api/category-budgets?month=${MONTH}`)
      .set(authHeader(user.token));
    expect(budgets.body.budgets[0].status).toBe("over");

    const notifications = await request(app).get("/api/notifications").set(authHeader(user.token));
    const found = notifications.body.notifications.find(
      (n: { type: string }) => n.type === "category_budget_exceeded"
    );
    expect(found).toBeTruthy();
    expect(found.message).toContain("Alimentação");

    await cleanupUser(user.userId);
  });

  it("atualiza um orçamento existente (upsert idempotente por categoria/mês)", async () => {
    const user = await registerTestUser("budget-upsert");
    const categoryId = await getCategoryId(user.token, "Alimentação");

    await request(app)
      .put(`/api/category-budgets/${categoryId}`)
      .set(authHeader(user.token))
      .send({ month: MONTH, amount: 300 });

    const update = await request(app)
      .put(`/api/category-budgets/${categoryId}`)
      .set(authHeader(user.token))
      .send({ month: MONTH, amount: 500 });
    expect(update.body.budget.amount).toBe(500);

    const list = await request(app)
      .get(`/api/category-budgets?month=${MONTH}`)
      .set(authHeader(user.token));
    expect(list.body.budgets).toHaveLength(1);
    expect(list.body.budgets[0].amount).toBe(500);

    await cleanupUser(user.userId);
  });

  it("remove um orçamento", async () => {
    const user = await registerTestUser("budget-remove");
    const categoryId = await getCategoryId(user.token, "Alimentação");

    await request(app)
      .put(`/api/category-budgets/${categoryId}`)
      .set(authHeader(user.token))
      .send({ month: MONTH, amount: 300 });

    const remove = await request(app)
      .delete(`/api/category-budgets/${categoryId}?month=${MONTH}`)
      .set(authHeader(user.token));
    expect(remove.status).toBe(204);

    const list = await request(app)
      .get(`/api/category-budgets?month=${MONTH}`)
      .set(authHeader(user.token));
    expect(list.body.budgets).toEqual([]);

    await cleanupUser(user.userId);
  });

  it("remover um orçamento inexistente devolve 404", async () => {
    const user = await registerTestUser("budget-remove-missing");
    const categoryId = await getCategoryId(user.token, "Alimentação");

    const res = await request(app)
      .delete(`/api/category-budgets/${categoryId}?month=${MONTH}`)
      .set(authHeader(user.token));
    expect(res.status).toBe(404);

    await cleanupUser(user.userId);
  });

  it("rejeita orçamento em categoria de entrada", async () => {
    const user = await registerTestUser("budget-entrada");
    const categoryId = await getCategoryId(user.token, "Salário");

    const res = await request(app)
      .put(`/api/category-budgets/${categoryId}`)
      .set(authHeader(user.token))
      .send({ month: MONTH, amount: 100 });

    expect(res.status).toBe(400);

    await cleanupUser(user.userId);
  });

  it("rejeita valor não positivo", async () => {
    const user = await registerTestUser("budget-invalid-amount");
    const categoryId = await getCategoryId(user.token, "Alimentação");

    const res = await request(app)
      .put(`/api/category-budgets/${categoryId}`)
      .set(authHeader(user.token))
      .send({ month: MONTH, amount: -50 });

    expect(res.status).toBe(400);

    await cleanupUser(user.userId);
  });

  it("usuário B não vê nem consegue definir orçamento na categoria de A (IDOR)", async () => {
    const userA = await registerTestUser("budget-idor-a");
    const userB = await registerTestUser("budget-idor-b");
    const categoryIdA = await getCategoryId(userA.token, "Alimentação");

    await request(app)
      .put(`/api/category-budgets/${categoryIdA}`)
      .set(authHeader(userA.token))
      .send({ month: MONTH, amount: 300 });

    const attempt = await request(app)
      .put(`/api/category-budgets/${categoryIdA}`)
      .set(authHeader(userB.token))
      .send({ month: MONTH, amount: 999 });
    expect(attempt.status).toBe(404);

    const listB = await request(app)
      .get(`/api/category-budgets?month=${MONTH}`)
      .set(authHeader(userB.token));
    expect(listB.body.budgets).toEqual([]);

    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("exige autenticação (401 sem token)", async () => {
    const res = await request(app).get("/api/category-budgets");
    expect(res.status).toBe(401);
  });
});
