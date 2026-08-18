import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { pool } from "../src/config/db";
import { uniqueEmail, registerTestUser, cleanupUser, authHeader } from "./helpers";

describe("Perfil (editar dados, trocar senha, excluir conta)", () => {
  const createdUserIds: number[] = [];

  afterEach(async () => {
    while (createdUserIds.length) {
      await cleanupUser(createdUserIds.pop()!);
    }
  });

  it("edita nome e e-mail", async () => {
    const user = await registerTestUser("perfil-edit");
    createdUserIds.push(user.userId);

    const newEmail = uniqueEmail("perfil-edit-novo");
    const res = await request(app)
      .put("/api/users/me")
      .set(authHeader(user.token))
      .send({ name: "Nome Atualizado", email: newEmail });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe("Nome Atualizado");
    expect(res.body.user.email).toBe(newEmail);

    const me = await request(app).get("/api/users/me").set(authHeader(user.token));
    expect(me.body.user.email).toBe(newEmail);
  });

  it("rejeita editar para um e-mail já usado por outra conta (409)", async () => {
    const userA = await registerTestUser("perfil-conflito-a");
    const userB = await registerTestUser("perfil-conflito-b");
    createdUserIds.push(userA.userId, userB.userId);

    const res = await request(app)
      .put("/api/users/me")
      .set(authHeader(userA.token))
      .send({ name: "Qualquer", email: userB.email });

    expect(res.status).toBe(409);
  });

  it("continuar usando o mesmo e-mail próprio não é tratado como conflito", async () => {
    const user = await registerTestUser("perfil-mesmo-email");
    createdUserIds.push(user.userId);

    const res = await request(app)
      .put("/api/users/me")
      .set(authHeader(user.token))
      .send({ name: "Nome Novo", email: user.email });

    expect(res.status).toBe(200);
  });

  it("troca a senha com sucesso e a nova senha passa a funcionar no login", async () => {
    const email = uniqueEmail("perfil-senha");
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Teste Senha", email, password: "senhaAntiga1" });
    createdUserIds.push(reg.body.user.id);
    const token = reg.body.token;

    const changed = await request(app)
      .put("/api/users/me/password")
      .set(authHeader(token))
      .send({ currentPassword: "senhaAntiga1", newPassword: "senhaNova123" });
    expect(changed.status).toBe(200);

    const oldLogin = await request(app).post("/api/auth/login").send({ email, password: "senhaAntiga1" });
    expect(oldLogin.status).toBe(401);

    const newLogin = await request(app).post("/api/auth/login").send({ email, password: "senhaNova123" });
    expect(newLogin.status).toBe(200);
  });

  it("rejeita trocar a senha com a senha atual errada (403, não 401 -- a sessão continua válida)", async () => {
    const user = await registerTestUser("perfil-senha-errada");
    createdUserIds.push(user.userId);

    const res = await request(app)
      .put("/api/users/me/password")
      .set(authHeader(user.token))
      .send({ currentPassword: "senhaErrada1", newPassword: "outraSenha123" });

    expect(res.status).toBe(403);

    // a sessão (token) continua válida -- só a reverificação de senha falhou
    const me = await request(app).get("/api/users/me").set(authHeader(user.token));
    expect(me.status).toBe(200);
  });

  it("exclui a conta com a senha correta -- transações, categorias e login somem de verdade", async () => {
    const email = uniqueEmail("perfil-excluir");
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Teste Excluir", email, password: "senha12345" });
    const token = reg.body.token;
    const userId = reg.body.user.id;

    const catRes = await request(app).get("/api/categories").set(authHeader(token));
    const salario = catRes.body.categories.find((c: { name: string }) => c.name === "Salário");
    await request(app)
      .post("/api/transactions")
      .set(authHeader(token))
      .send({ categoryId: salario.id, description: "Salário", amount: 1000, type: "entrada", transactionDate: "2026-08-05" });

    const del = await request(app)
      .delete("/api/users/me")
      .set(authHeader(token))
      .send({ password: "senha12345" });
    expect(del.status).toBe(204);

    const loginAfter = await request(app).post("/api/auth/login").send({ email, password: "senha12345" });
    expect(loginAfter.status).toBe(401);

    const [userRows] = await pool.query("SELECT id FROM users WHERE id = ?", [userId]);
    expect((userRows as unknown[]).length).toBe(0);
    const [txRows] = await pool.query("SELECT id FROM transactions WHERE user_id = ?", [userId]);
    expect((txRows as unknown[]).length).toBe(0);
    const [catRows] = await pool.query("SELECT id FROM categories WHERE user_id = ?", [userId]);
    expect((catRows as unknown[]).length).toBe(0);
  });

  it("rejeita excluir a conta com a senha errada (403, não 401) e a conta continua existindo", async () => {
    const user = await registerTestUser("perfil-excluir-senha-errada");
    createdUserIds.push(user.userId);

    const res = await request(app)
      .delete("/api/users/me")
      .set(authHeader(user.token))
      .send({ password: "senhaTotalmenteErrada1" });
    expect(res.status).toBe(403);

    const me = await request(app).get("/api/users/me").set(authHeader(user.token));
    expect(me.status).toBe(200);
  });

  it("todas as rotas de /api/users/me exigem autenticação (401 sem token)", async () => {
    const put = await request(app).put("/api/users/me").send({ name: "x", email: "x@x.com" });
    expect(put.status).toBe(401);

    const putPassword = await request(app)
      .put("/api/users/me/password")
      .send({ currentPassword: "a", newPassword: "bbbbbbbb" });
    expect(putPassword.status).toBe(401);

    const del = await request(app).delete("/api/users/me").send({ password: "x" });
    expect(del.status).toBe(401);
  });
});
