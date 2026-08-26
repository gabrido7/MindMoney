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
