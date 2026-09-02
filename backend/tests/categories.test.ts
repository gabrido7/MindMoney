import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { registerTestUser, cleanupUser, authHeader, getCategoryId, type TestUser } from "./helpers";

describe("Categorias e subcategorias", () => {
  let userA: TestUser;
  let userB: TestUser;

  beforeAll(async () => {
    userA = await registerTestUser("categorias-a");
    userB = await registerTestUser("categorias-b");
  });

  afterAll(async () => {
    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("lista as 15 categorias padrão seedadas no cadastro", async () => {
    const res = await request(app).get("/api/categories").set(authHeader(userA.token));
    expect(res.body.categories.length).toBe(15);
    expect(res.body.categories.map((c: { name: string }) => c.name)).toContain("Salário");
  });

  it("cria uma categoria customizada com cor automática", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set(authHeader(userA.token))
      .send({ name: "Viagens", type: "saida" });

    expect(res.status).toBe(201);
    expect(res.body.category.color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("rejeita categoria duplicada por usuário (409)", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set(authHeader(userA.token))
      .send({ name: "Alimentação", type: "saida" });
    expect(res.status).toBe(409);
  });

  it("não permite apagar categoria padrão (builtin)", async () => {
    const salarioId = await getCategoryId(userA.token, "Salário");
    const res = await request(app).delete(`/api/categories/${salarioId}`).set(authHeader(userA.token));
    expect(res.status).toBe(400);
  });

  it("apaga categoria customizada e ela some da listagem", async () => {
    const created = await request(app)
      .post("/api/categories")
      .set(authHeader(userA.token))
      .send({ name: "Hobbies", type: "saida" });

    const del = await request(app)
      .delete(`/api/categories/${created.body.category.id}`)
      .set(authHeader(userA.token));
    expect(del.status).toBe(204);

    const list = await request(app).get("/api/categories").set(authHeader(userA.token));
    expect(list.body.categories.find((c: { name: string }) => c.name === "Hobbies")).toBeUndefined();
  });

  it("cria e remove subcategoria", async () => {
    const alimentacaoId = await getCategoryId(userA.token, "Alimentação");
    const created = await request(app)
      .post(`/api/categories/${alimentacaoId}/subcategories`)
      .set(authHeader(userA.token))
      .send({ name: "Feira" });
    expect(created.status).toBe(201);

    const list = await request(app)
      .get(`/api/categories/${alimentacaoId}/subcategories`)
      .set(authHeader(userA.token));
    expect(list.body.subcategories.some((s: { name: string }) => s.name === "Feira")).toBe(true);

    const removed = await request(app)
      .delete(`/api/categories/${alimentacaoId}/subcategories/${created.body.subcategory.id}`)
      .set(authHeader(userA.token));
    expect(removed.status).toBe(204);
  });

  it("usuário B não vê subcategorias de categoria de A (404)", async () => {
    const alimentacaoIdA = await getCategoryId(userA.token, "Alimentação");
    const res = await request(app)
      .get(`/api/categories/${alimentacaoIdA}/subcategories`)
      .set(authHeader(userB.token));
    expect(res.status).toBe(404);
  });

  it("usuário B não consegue apagar categoria de A", async () => {
    const alimentacaoIdA = await getCategoryId(userA.token, "Alimentação");
    const res = await request(app)
      .delete(`/api/categories/${alimentacaoIdA}`)
      .set(authHeader(userB.token));
    expect(res.status).toBe(404);
  });

  it("GET /api/categories já devolve subcategorias aninhadas (sem precisar de 1 chamada por categoria)", async () => {
    const res = await request(app).get("/api/categories").set(authHeader(userA.token));

    const alimentacao = res.body.categories.find((c: { name: string }) => c.name === "Alimentação");
    expect(Array.isArray(alimentacao.subcategories)).toBe(true);
    expect(alimentacao.subcategories.length).toBeGreaterThan(0);
    expect(alimentacao.subcategories[0]).toHaveProperty("name");
    expect(alimentacao.subcategories[0]).toHaveProperty("color");
  });

  it("categoria recém-criada já vem com subcategories: [] na própria resposta do POST", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set(authHeader(userA.token))
      .send({ name: "Cuidados com pets", type: "saida" });

    expect(res.body.category.subcategories).toEqual([]);
  });
});
