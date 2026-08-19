import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { pool } from "../src/config/db";
import { registerTestUser, cleanupUser, authHeader, type TestUser } from "./helpers";

async function backdateCreatedAt(objectiveId: number, mysqlDateTime: string) {
  await pool.query("UPDATE financial_objectives SET created_at = ? WHERE id = ?", [mysqlDateTime, objectiveId]);
}

describe("Insights: objetivos de alta prioridade", () => {
  const users: TestUser[] = [];

  afterAll(async () => {
    await Promise.all(users.map((u) => cleanupUser(u.userId)));
  });

  async function freshUser(label: string) {
    const user = await registerTestUser(label);
    users.push(user);
    return user;
  }

  it("gera um insight de warning para meta de alta prioridade atrasada", async () => {
    const user = await freshUser("insights-overdue");
    await request(app)
      .post("/api/objectives")
      .set(authHeader(user.token))
      .send({ name: "Meta prioritária vencida", category: "reserva", priority: "alta", targetAmount: 1000, targetMonth: "2026-01" });

    const res = await request(app).get("/api/insights").set(authHeader(user.token));
    expect(res.status).toBe(200);
    const insight = res.body.insights.find(
      (i: { type: string; message: string }) => i.type === "objetivo_prioridade" && i.message.includes("Meta prioritária vencida")
    );
    expect(insight).toBeDefined();
    expect(insight.severity).toBe("warning");
    expect(insight.title).toContain("atrasada");
  });

  it("gera um insight de warning quando o ritmo está abaixo do necessário", async () => {
    const user = await freshUser("insights-behind");
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(user.token))
      .send({ name: "Fora do ritmo", category: "patrimonio", priority: "alta", targetAmount: 6000, targetMonth: "2026-12" });
    const id = created.body.objective.id;
    await backdateCreatedAt(id, "2026-06-15 00:00:00");
    await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(user.token))
      .send({ amount: 400, contributedAt: "2026-08-10" });

    const res = await request(app).get("/api/insights").set(authHeader(user.token));
    const insight = res.body.insights.find(
      (i: { type: string; message: string }) => i.type === "objetivo_prioridade" && i.message.includes("Fora do ritmo")
    );
    expect(insight).toBeDefined();
    expect(insight.severity).toBe("warning");
    expect(insight.message).toContain("R$");
  });

  it("gera um insight de success quando a meta de alta prioridade está no ritmo ou adiantada", async () => {
    const user = await freshUser("insights-on-track");
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(user.token))
      .send({ name: "No ritmo certo", category: "patrimonio", priority: "alta", targetAmount: 6000, targetMonth: "2026-12" });
    const id = created.body.objective.id;
    await backdateCreatedAt(id, "2026-06-15 00:00:00");
    await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(user.token))
      .send({ amount: 2000, contributedAt: "2026-08-10" });

    const res = await request(app).get("/api/insights").set(authHeader(user.token));
    const insight = res.body.insights.find(
      (i: { type: string; message: string }) => i.type === "objetivo_prioridade" && i.message.includes("No ritmo certo")
    );
    expect(insight).toBeDefined();
    expect(insight.severity).toBe("success");
  });

  it("não gera insight de prioridade para metas de prioridade média/baixa nem para metas já atingidas", async () => {
    const user = await freshUser("insights-no-noise");
    await request(app)
      .post("/api/objectives")
      .set(authHeader(user.token))
      .send({ name: "Prioridade média atrasada", category: "reserva", priority: "media", targetAmount: 1000, targetMonth: "2026-01" });

    const achieved = await request(app)
      .post("/api/objectives")
      .set(authHeader(user.token))
      .send({ name: "Alta prioridade já concluída", category: "reserva", priority: "alta", targetAmount: 500, targetMonth: "2026-11" });
    await request(app)
      .post(`/api/objectives/${achieved.body.objective.id}/contributions`)
      .set(authHeader(user.token))
      .send({ amount: 500, contributedAt: "2026-08-10" });

    const res = await request(app).get("/api/insights").set(authHeader(user.token));
    const priorityInsights = res.body.insights.filter((i: { type: string }) => i.type === "objetivo_prioridade");
    expect(priorityInsights).toHaveLength(0);
  });
});
