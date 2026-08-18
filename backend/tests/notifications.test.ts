import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { registerTestUser, cleanupUser, authHeader, getCategoryId, type TestUser } from "./helpers";

describe("Notificações", () => {
  let userA: TestUser;
  let userB: TestUser;

  beforeAll(async () => {
    userA = await registerTestUser("notif-a");
    userB = await registerTestUser("notif-b");
  });

  afterAll(async () => {
    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("gasto acima do limite de alerta gera notificação automaticamente", async () => {
    const salarioId = await getCategoryId(userA.token, "Salário");
    const alimentacaoId = await getCategoryId(userA.token, "Alimentação");

    await request(app)
      .post("/api/transactions")
      .set(authHeader(userA.token))
      .send({ categoryId: salarioId, description: "Salário", amount: 1000, type: "entrada", transactionDate: "2026-08-05" });
    await request(app)
      .post("/api/transactions")
      .set(authHeader(userA.token))
      .send({ categoryId: alimentacaoId, description: "Alimentação", amount: 900, type: "saida", transactionDate: "2026-08-10" });

    const list = await request(app).get("/api/notifications").set(authHeader(userA.token));
    const notif = list.body.notifications.find((n: { type: string }) => n.type === "limit_exceeded");
    expect(notif).toBeTruthy();
    expect(notif.read_at).toBeNull();
  });

  it("marcar como lida funciona e não duplica nova notificação enquanto não lida", async () => {
    const before = await request(app).get("/api/notifications").set(authHeader(userA.token));
    const unread = before.body.notifications.find((n: { type: string; read_at: string | null }) => n.type === "limit_exceeded" && !n.read_at);
    expect(unread).toBeTruthy();

    const marked = await request(app)
      .put(`/api/notifications/${unread.id}/read`)
      .set(authHeader(userA.token));
    expect(marked.status).toBe(200);
    expect(marked.body.notification.read_at).toBeTruthy();
  });

  it("usuário B não vê nem marca como lida notificação de A", async () => {
    const listA = await request(app).get("/api/notifications").set(authHeader(userA.token));
    const notifA = listA.body.notifications[0];

    const listB = await request(app).get("/api/notifications").set(authHeader(userB.token));
    expect(listB.body.notifications.length).toBe(0);

    const markB = await request(app)
      .put(`/api/notifications/${notifA.id}/read`)
      .set(authHeader(userB.token));
    expect(markB.status).toBe(404);
  });
});
