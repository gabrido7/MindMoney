import request from "supertest";
import { app } from "../src/app";

let counter = 0;

/** E-mail único por chamada, pra nunca colidir entre testes. */
export const uniqueEmail = (label: string) => {
  counter += 1;
  return `test.${label}.${Date.now()}.${counter}@mindmoney.dev`;
};

export interface TestUser {
  token: string;
  refreshToken: string;
  userId: number;
  email: string;
}

export async function registerTestUser(label: string): Promise<TestUser> {
  const email = uniqueEmail(label);
  const res = await request(app).post("/api/auth/register").send({
    name: `Teste ${label}`,
    email,
    password: "senha12345",
  });

  if (res.status !== 201) {
    throw new Error(`Falha ao registrar usuário de teste: ${JSON.stringify(res.body)}`);
  }

  return { token: res.body.token, refreshToken: res.body.refreshToken, userId: res.body.user.id, email };
}

export const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

export async function getCategoryId(token: string, name: string): Promise<number> {
  const res = await request(app).get("/api/categories").set(authHeader(token));
  const category = res.body.categories.find((c: { name: string }) => c.name === name);
  if (!category) throw new Error(`Categoria "${name}" não encontrada nos dados de teste.`);
  return category.id;
}

/** Apaga as transações do usuário antes de apagar o usuário (RESTRICT em transactions.category_id). */
export async function cleanupUser(userId: number) {
  const { pool } = await import("../src/config/db");
  await pool.query("DELETE FROM transactions WHERE user_id = ?", [userId]);
  await pool.query("DELETE FROM users WHERE id = ?", [userId]);
}
