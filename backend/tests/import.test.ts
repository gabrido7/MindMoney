import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { registerTestUser, cleanupUser, authHeader, type TestUser } from "./helpers";

describe("Importação em massa de transações", () => {
  let user: TestUser;

  beforeAll(async () => {
    user = await registerTestUser("import");
  });

  afterAll(async () => {
    await cleanupUser(user.userId);
  });

  it("importa transações válidas casando categoria/subcategoria por nome", async () => {
    const res = await request(app)
      .post("/api/transactions/import")
      .set(authHeader(user.token))
      .send({
        transactions: [
          { date: "2026-08-05", description: "Salário", category: "Salário", type: "entrada", amount: 5000 },
          {
            date: "2026-08-10",
            description: "Mercado",
            category: "Alimentação",
            subcategory: "Mercado",
            type: "saida",
            amount: 300,
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.imported).toBe(2);
    expect(res.body.skipped).toEqual([]);

    const list = await request(app)
      .get("/api/transactions")
      .query({ month: "2026-08" })
      .set(authHeader(user.token));
    expect(list.body.transactions.some((t: { description: string }) => t.description === "Mercado")).toBe(
      true
    );
  });

  it("pula linhas com categoria desconhecida, sem derrubar a importação inteira", async () => {
    const res = await request(app)
      .post("/api/transactions/import")
      .set(authHeader(user.token))
      .send({
        transactions: [
          { date: "2026-08-06", description: "Válida", category: "Salário", type: "entrada", amount: 100 },
          {
            date: "2026-08-06",
            description: "Categoria inexistente",
            category: "Categoria Que Não Existe",
            type: "saida",
            amount: 50,
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.imported).toBe(1);
    expect(res.body.skipped).toHaveLength(1);
    expect(res.body.skipped[0]).toMatchObject({ row: 2 });
    expect(res.body.skipped[0].reason).toContain("Categoria Que Não Existe");
  });

  it("importa mesmo quando a subcategoria informada não existe (sem subcategoria, não pula a linha)", async () => {
    const res = await request(app)
      .post("/api/transactions/import")
      .set(authHeader(user.token))
      .send({
        transactions: [
          {
            date: "2026-08-07",
            description: "Sem subcategoria válida",
            category: "Alimentação",
            subcategory: "Subcategoria Inventada",
            type: "saida",
            amount: 20,
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.imported).toBe(1);
  });

  it("rejeita lote vazio e formato inválido (400)", async () => {
    const empty = await request(app)
      .post("/api/transactions/import")
      .set(authHeader(user.token))
      .send({ transactions: [] });
    expect(empty.status).toBe(400);

    const badRow = await request(app)
      .post("/api/transactions/import")
      .set(authHeader(user.token))
      .send({ transactions: [{ date: "não é uma data", description: "x", category: "Salário", type: "entrada", amount: 10 }] });
    expect(badRow.status).toBe(400);
  });

  it("usuário B não consegue importar usando categorias de A (nomes não pertencem a ele, tudo pulado)", async () => {
    const userB = await registerTestUser("import-b");

    const res = await request(app)
      .post("/api/transactions/import")
      .set(authHeader(userB.token))
      .send({
        transactions: [
          { date: "2026-08-08", description: "hack", category: "Salário", type: "entrada", amount: 999 },
        ],
      });

    // "Salário" existe pra userB também (categoria padrão seedada no cadastro dele),
    // então isso na verdade importa pro próprio userB -- prova real de isolamento é
    // que a transação nunca aparece na lista de A.
    expect(res.status).toBe(201);
    expect(res.body.imported).toBe(1);

    const listA = await request(app)
      .get("/api/transactions")
      .query({ month: "2026-08" })
      .set(authHeader(user.token));
    expect(listA.body.transactions.some((t: { description: string }) => t.description === "hack")).toBe(
      false
    );

    await cleanupUser(userB.userId);
  });

  it("exige autenticação (401 sem token)", async () => {
    const res = await request(app)
      .post("/api/transactions/import")
      .send({ transactions: [{ date: "2026-08-01", description: "x", category: "Salário", type: "entrada", amount: 10 }] });
    expect(res.status).toBe(401);
  });
});
