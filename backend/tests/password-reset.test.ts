import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { pool } from "../src/config/db";
import { uniqueEmail, cleanupUser } from "./helpers";

describe("Redefinição de senha (modo demonstração)", () => {
  const createdUserIds: number[] = [];

  afterEach(async () => {
    while (createdUserIds.length) {
      await cleanupUser(createdUserIds.pop()!);
    }
  });

  it("gera um token real para e-mail cadastrado e permite redefinir a senha", async () => {
    const email = uniqueEmail("reset");
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Teste Reset", email, password: "senhaAntiga1" });
    createdUserIds.push(reg.body.user.id);

    const forgot = await request(app).post("/api/auth/forgot-password").send({ email });
    expect(forgot.status).toBe(200);
    expect(forgot.body.token).toBeTruthy();
    expect(typeof forgot.body.expiresAt).toBe("string");

    const reset = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: forgot.body.token, password: "senhaNova123" });
    expect(reset.status).toBe(200);

    const oldLogin = await request(app).post("/api/auth/login").send({ email, password: "senhaAntiga1" });
    expect(oldLogin.status).toBe(401);

    const newLogin = await request(app).post("/api/auth/login").send({ email, password: "senhaNova123" });
    expect(newLogin.status).toBe(200);
  });

  it("não revela se o e-mail existe (mesma resposta 200 sem token para e-mail desconhecido)", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: uniqueEmail("naoexiste-reset") });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeUndefined();
  });

  it("rejeita token já usado (uso único)", async () => {
    const email = uniqueEmail("reset-reuso");
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Teste Reuso", email, password: "senhaAntiga1" });
    createdUserIds.push(reg.body.user.id);

    const forgot = await request(app).post("/api/auth/forgot-password").send({ email });
    const first = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: forgot.body.token, password: "senhaNova123" });
    expect(first.status).toBe(200);

    const second = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: forgot.body.token, password: "outraSenha456" });
    expect(second.status).toBe(400);
  });

  it("rejeita token inválido/inexistente", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: "a".repeat(64), password: "senhaNova123" });
    expect(res.status).toBe(400);
  });

  it("um novo pedido invalida o link anterior ainda não usado", async () => {
    const email = uniqueEmail("reset-invalida");
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Teste Invalida", email, password: "senhaAntiga1" });
    createdUserIds.push(reg.body.user.id);

    const firstRequest = await request(app).post("/api/auth/forgot-password").send({ email });
    await request(app).post("/api/auth/forgot-password").send({ email });

    const useOldToken = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: firstRequest.body.token, password: "senhaNova123" });
    expect(useOldToken.status).toBe(400);
  });

  it("token expirado é rejeitado", async () => {
    const email = uniqueEmail("reset-expirado");
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Teste Expirado", email, password: "senhaAntiga1" });
    createdUserIds.push(reg.body.user.id);

    const forgot = await request(app).post("/api/auth/forgot-password").send({ email });
    await pool.query("UPDATE password_reset_tokens SET expires_at = NOW() - INTERVAL 1 MINUTE WHERE user_id = ?", [
      reg.body.user.id,
    ]);

    const reset = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: forgot.body.token, password: "senhaNova123" });
    expect(reset.status).toBe(400);
  });
});
