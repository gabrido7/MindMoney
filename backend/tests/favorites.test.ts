import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { registerTestUser, cleanupUser, authHeader } from "./helpers";

describe("Favoritos", () => {
  it("lista de um usuário novo vem vazia", async () => {
    const user = await registerTestUser("fav-fresh");
    const res = await request(app).get("/api/favorites").set(authHeader(user.token));

    expect(res.status).toBe(200);
    expect(res.body.favorites).toEqual([]);

    await cleanupUser(user.userId);
  });

  it("favorita uma aula e ela aparece na lista", async () => {
    const user = await registerTestUser("fav-lesson");

    const add = await request(app)
      .post("/api/favorites")
      .set(authHeader(user.token))
      .send({ contentType: "lesson", contentId: "fundamentos.o-que-e-dinheiro.aula-1" });
    expect(add.status).toBe(201);

    const list = await request(app).get("/api/favorites").set(authHeader(user.token));
    expect(list.body.favorites).toHaveLength(1);
    expect(list.body.favorites[0]).toMatchObject({
      contentType: "lesson",
      contentId: "fundamentos.o-que-e-dinheiro.aula-1",
    });

    await cleanupUser(user.userId);
  });

  it("favorita uma ferramenta e ela aparece na lista", async () => {
    const user = await registerTestUser("fav-tool");

    await request(app)
      .post("/api/favorites")
      .set(authHeader(user.token))
      .send({ contentType: "tool", contentId: "financiamento" });

    const list = await request(app).get("/api/favorites").set(authHeader(user.token));
    expect(list.body.favorites).toHaveLength(1);
    expect(list.body.favorites[0]).toMatchObject({ contentType: "tool", contentId: "financiamento" });

    await cleanupUser(user.userId);
  });

  it("favoritar o mesmo conteúdo duas vezes é idempotente (não duplica)", async () => {
    const user = await registerTestUser("fav-idempotent");

    await request(app)
      .post("/api/favorites")
      .set(authHeader(user.token))
      .send({ contentType: "lesson", contentId: "fundamentos.o-que-e-dinheiro.aula-1" });
    await request(app)
      .post("/api/favorites")
      .set(authHeader(user.token))
      .send({ contentType: "lesson", contentId: "fundamentos.o-que-e-dinheiro.aula-1" });

    const list = await request(app).get("/api/favorites").set(authHeader(user.token));
    expect(list.body.favorites).toHaveLength(1);

    await cleanupUser(user.userId);
  });

  it("remove um favorito e ele some da lista", async () => {
    const user = await registerTestUser("fav-remove");

    await request(app)
      .post("/api/favorites")
      .set(authHeader(user.token))
      .send({ contentType: "tool", contentId: "juros-compostos" });

    const remove = await request(app)
      .delete("/api/favorites/tool/juros-compostos")
      .set(authHeader(user.token));
    expect(remove.status).toBe(204);

    const list = await request(app).get("/api/favorites").set(authHeader(user.token));
    expect(list.body.favorites).toEqual([]);

    await cleanupUser(user.userId);
  });

  it("remover um favorito que não existe não dá erro (idempotente)", async () => {
    const user = await registerTestUser("fav-remove-missing");

    const remove = await request(app)
      .delete("/api/favorites/tool/inexistente")
      .set(authHeader(user.token));
    expect(remove.status).toBe(204);

    await cleanupUser(user.userId);
  });

  it("rejeita contentType inválido", async () => {
    const user = await registerTestUser("fav-invalid-type");

    const res = await request(app)
      .post("/api/favorites")
      .set(authHeader(user.token))
      .send({ contentType: "curso", contentId: "algo" });
    expect(res.status).toBe(400);

    await cleanupUser(user.userId);
  });

  it("usuário B não vê nem consegue remover favoritos de A (IDOR)", async () => {
    const userA = await registerTestUser("fav-idor-a");
    const userB = await registerTestUser("fav-idor-b");

    await request(app)
      .post("/api/favorites")
      .set(authHeader(userA.token))
      .send({ contentType: "lesson", contentId: "fundamentos.o-que-e-dinheiro.aula-1" });

    const listB = await request(app).get("/api/favorites").set(authHeader(userB.token));
    expect(listB.body.favorites).toEqual([]);

    await request(app)
      .delete("/api/favorites/lesson/fundamentos.o-que-e-dinheiro.aula-1")
      .set(authHeader(userB.token));

    const listAAfter = await request(app).get("/api/favorites").set(authHeader(userA.token));
    expect(listAAfter.body.favorites).toHaveLength(1);

    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("exige autenticação (401 sem token)", async () => {
    const res = await request(app).get("/api/favorites");
    expect(res.status).toBe(401);
  });
});
