import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { pool } from "../src/config/db";
import { uniqueEmail } from "./helpers";

describe("Newsletter", () => {
  const emails: string[] = [];

  afterAll(async () => {
    if (emails.length > 0) {
      await pool.query("DELETE FROM newsletter_subscribers WHERE email IN (?)", [emails]);
    }
  });

  it("cadastra um novo e-mail na newsletter", async () => {
    const email = uniqueEmail("newsletter");
    emails.push(email);

    const res = await request(app).post("/api/newsletter").send({ name: "Visitante Teste", email });

    expect(res.status).toBe(201);
    expect(res.body.alreadySubscribed).toBe(false);
  });

  it("reenviar o mesmo e-mail não duplica e não gera erro", async () => {
    const email = uniqueEmail("newsletter-dup");
    emails.push(email);

    await request(app).post("/api/newsletter").send({ name: "Visitante Teste", email });
    const second = await request(app).post("/api/newsletter").send({ name: "Visitante Teste", email });

    expect(second.status).toBe(201);
    expect(second.body.alreadySubscribed).toBe(true);

    const [rows] = await pool.query("SELECT id FROM newsletter_subscribers WHERE email = ?", [email]);
    expect((rows as unknown[]).length).toBe(1);
  });

  it("rejeita e-mail inválido", async () => {
    const res = await request(app).post("/api/newsletter").send({ name: "Visitante", email: "não-é-email" });
    expect(res.status).toBe(400);
  });

  it("rejeita nome vazio", async () => {
    const res = await request(app)
      .post("/api/newsletter")
      .send({ name: "", email: uniqueEmail("newsletter-noname") });
    expect(res.status).toBe(400);
  });
});
