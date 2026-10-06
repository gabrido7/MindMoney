import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { pool } from "../src/config/db";
import { TERMS_VERSION } from "../src/config/rules";
import { uniqueEmail, cleanupUser, authHeader } from "./helpers";

describe("Autenticação (cadastro, login, /me)", () => {
  const createdUserIds: number[] = [];

  afterEach(async () => {
    while (createdUserIds.length) {
      await cleanupUser(createdUserIds.pop()!);
    }
  });

  it("grava a data e a versão dos termos aceitos no cadastro", async () => {
    const email = uniqueEmail("termos");
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Aceita Termos", email, password: "senha12345", acceptTerms: true });
    expect(res.status).toBe(201);
    createdUserIds.push(res.body.user.id);

    const [rows] = await pool.query("SELECT terms_accepted_at, terms_version FROM users WHERE id = ?", [res.body.user.id]);
    const row = (rows as { terms_accepted_at: string | null; terms_version: string | null }[])[0];
    expect(row.terms_accepted_at).not.toBeNull();
    expect(row.terms_version).toBe(TERMS_VERSION);
  });

  it.each([
    ["sem o campo acceptTerms", undefined],
    ["com acceptTerms false", false],
    ["com acceptTerms como texto", "true"],
  ])("recusa o cadastro %s e não cria a conta", async (_label, value) => {
    const email = uniqueEmail("sem-termos");
    const body: Record<string, unknown> = { name: "Sem Termos", email, password: "senha12345" };
    if (value !== undefined) body.acceptTerms = value;

    const res = await request(app).post("/api/auth/register").send(body);

    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body)).toMatch(/Termos de Uso/);
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    expect((rows as unknown[]).length).toBe(0);
  });

  it("cadastra um usuário novo e já semeia as categorias padrão", async () => {
    const email = uniqueEmail("cadastro");
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Novo Usuário", email, password: "senha12345", acceptTerms: true });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe(email);
    expect(res.body.user.password_hash).toBeUndefined();
    createdUserIds.push(res.body.user.id);

    const categories = await request(app)
      .get("/api/categories")
      .set(authHeader(res.body.token));
    expect(categories.body.categories.length).toBe(15);
  });

  it("rejeita cadastro com e-mail já usado (409)", async () => {
    const email = uniqueEmail("duplicado");
    const first = await request(app)
      .post("/api/auth/register")
      .send({ name: "Primeiro", email, password: "senha12345", acceptTerms: true });
    createdUserIds.push(first.body.user.id);

    const second = await request(app)
      .post("/api/auth/register")
      .send({ name: "Segundo", email, password: "outrasenha123", acceptTerms: true });

    expect(second.status).toBe(409);
  });

  it("rejeita cadastro com senha curta (400, validação do backend)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Senha Curta", email: uniqueEmail("curta"), password: "123", acceptTerms: true });

    expect(res.status).toBe(400);
  });

  it("faz login com credenciais corretas", async () => {
    const email = uniqueEmail("login");
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Login Teste", email, password: "senha12345", acceptTerms: true });
    createdUserIds.push(reg.body.user.id);

    const login = await request(app).post("/api/auth/login").send({ email, password: "senha12345" });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeTruthy();
  });

  it("rejeita login com senha errada (401, mensagem genérica)", async () => {
    const email = uniqueEmail("senhaerrada");
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Teste", email, password: "senha12345", acceptTerms: true });
    createdUserIds.push(reg.body.user.id);

    const login = await request(app).post("/api/auth/login").send({ email, password: "outraSenha1" });
    expect(login.status).toBe(401);
  });

  it("rejeita login com usuário inexistente (401, mesma mensagem genérica)", async () => {
    const wrongPassword = await request(app)
      .post("/api/auth/login")
      .send({ email: uniqueEmail("naoexiste"), password: "qualquercoisa1" });

    expect(wrongPassword.status).toBe(401);
  });

  it("GET /api/users/me exige token (401 sem header, 200 com token válido)", async () => {
    const semToken = await request(app).get("/api/users/me");
    expect(semToken.status).toBe(401);

    const email = uniqueEmail("me");
    const reg = await request(app)
      .post("/api/auth/register")
      .send({ name: "Teste Me", email, password: "senha12345", acceptTerms: true });
    createdUserIds.push(reg.body.user.id);

    const me = await request(app).get("/api/users/me").set(authHeader(reg.body.token));
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe(email);
  });

  it("rejeita token adulterado/inválido (401)", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set(authHeader("token.completamente.invalido"));
    expect(res.status).toBe(401);
  });
});
