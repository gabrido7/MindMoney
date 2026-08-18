import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { uniqueEmail, cleanupUser } from "./helpers";

describe("Refresh token (renovação de sessão)", () => {
  const createdUserIds: number[] = [];

  afterEach(async () => {
    while (createdUserIds.length) {
      await cleanupUser(createdUserIds.pop()!);
    }
  });

  it("cadastro e login devolvem um refresh token de 64 caracteres além do access token", async () => {
    const email = uniqueEmail("refresh-issue");
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Teste Refresh", email, password: "senha12345" });
    createdUserIds.push(res.body.user.id);

    expect(res.body.token).toBeTruthy();
    expect(res.body.refreshToken).toMatch(/^[0-9a-f]{64}$/);

    const login = await request(app).post("/api/auth/login").send({ email, password: "senha12345" });
    expect(login.body.refreshToken).toMatch(/^[0-9a-f]{64}$/);
  });

  it("renova o access token a partir de um refresh token válido", async () => {
    const email = uniqueEmail("refresh-use");
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Teste Refresh", email, password: "senha12345" });
    createdUserIds.push(reg.body.user.id);

    const refreshed = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: reg.body.refreshToken });

    expect(refreshed.status).toBe(200);
    expect(refreshed.body.token).toBeTruthy();
    expect(refreshed.body.refreshToken).toMatch(/^[0-9a-f]{64}$/);

    const me = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${refreshed.body.token}`);
    expect(me.status).toBe(200);
  });

  it("rotaciona: o refresh token antigo não pode ser reusado depois de renovado", async () => {
    const email = uniqueEmail("refresh-rotate");
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Teste Rotação", email, password: "senha12345" });
    createdUserIds.push(reg.body.user.id);

    const first = await request(app).post("/api/auth/refresh").send({ refreshToken: reg.body.refreshToken });
    expect(first.status).toBe(200);
    expect(first.body.refreshToken).not.toBe(reg.body.refreshToken);

    const reuseOld = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: reg.body.refreshToken });
    expect(reuseOld.status).toBe(401);

    const useNew = await request(app).post("/api/auth/refresh").send({ refreshToken: first.body.refreshToken });
    expect(useNew.status).toBe(200);
  });

  it("rejeita um refresh token inexistente/inválido", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: "a".repeat(64) });
    expect(res.status).toBe(401);
  });

  it("logout revoga o refresh token de verdade -- ele para de funcionar depois", async () => {
    const email = uniqueEmail("logout");
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Teste Logout", email, password: "senha12345" });
    createdUserIds.push(reg.body.user.id);

    const logout = await request(app).post("/api/auth/logout").send({ refreshToken: reg.body.refreshToken });
    expect(logout.status).toBe(204);

    const afterLogout = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: reg.body.refreshToken });
    expect(afterLogout.status).toBe(401);
  });

  it("trocar a senha revoga todos os refresh tokens ativos do usuário", async () => {
    const email = uniqueEmail("refresh-revoke-pw");
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Teste Revoga", email, password: "senhaAntiga1" });
    createdUserIds.push(reg.body.user.id);

    await request(app)
      .put("/api/users/me/password")
      .set("Authorization", `Bearer ${reg.body.token}`)
      .send({ currentPassword: "senhaAntiga1", newPassword: "senhaNova123" });

    const afterChange = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: reg.body.refreshToken });
    expect(afterChange.status).toBe(401);
  });

  it("redefinir a senha (modo demonstração) também revoga os refresh tokens existentes", async () => {
    const email = uniqueEmail("refresh-revoke-reset");
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Teste Revoga Reset", email, password: "senhaAntiga1" });
    createdUserIds.push(reg.body.user.id);

    const forgot = await request(app).post("/api/auth/forgot-password").send({ email });
    await request(app)
      .post("/api/auth/reset-password")
      .send({ token: forgot.body.token, password: "senhaNova123" });

    const afterReset = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: reg.body.refreshToken });
    expect(afterReset.status).toBe(401);
  });
});
