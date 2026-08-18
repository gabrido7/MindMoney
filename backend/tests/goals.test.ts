import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { registerTestUser, cleanupUser, authHeader, type TestUser } from "./helpers";

describe("Metas financeiras", () => {
  let userA: TestUser;
  let userB: TestUser;

  beforeAll(async () => {
    userA = await registerTestUser("metas-a");
    userB = await registerTestUser("metas-b");
  });

  afterAll(async () => {
    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("cria uma meta e lista de volta", async () => {
    const created = await request(app)
      .post("/api/goals")
      .set(authHeader(userA.token))
      .send({ referenceMonth: "2026-09", targetAmount: 1500 });
    expect(created.status).toBe(201);

    const list = await request(app).get("/api/goals").set(authHeader(userA.token));
    expect(list.body.goals.some((g: { reference_month: string }) => g.reference_month === "2026-09")).toBe(true);
  });

  it("rejeita segunda meta no mesmo mês (409)", async () => {
    const res = await request(app)
      .post("/api/goals")
      .set(authHeader(userA.token))
      .send({ referenceMonth: "2026-09", targetAmount: 100 });
    expect(res.status).toBe(409);
  });

  it("edita e depois exclui uma meta", async () => {
    const created = await request(app)
      .post("/api/goals")
      .set(authHeader(userA.token))
      .send({ referenceMonth: "2026-10", targetAmount: 800 });
    const id = created.body.goal.id;

    const updated = await request(app)
      .put(`/api/goals/${id}`)
      .set(authHeader(userA.token))
      .send({ targetAmount: 1200 });
    expect(updated.body.goal.target_amount).toBe(1200);

    const deleted = await request(app).delete(`/api/goals/${id}`).set(authHeader(userA.token));
    expect(deleted.status).toBe(204);
  });

  it("usuário B não vê, edita ou apaga meta de A", async () => {
    const created = await request(app)
      .post("/api/goals")
      .set(authHeader(userA.token))
      .send({ referenceMonth: "2026-11", targetAmount: 2000 });
    const id = created.body.goal.id;

    const listB = await request(app).get("/api/goals").set(authHeader(userB.token));
    expect(listB.body.goals.length).toBe(0);

    const editB = await request(app).put(`/api/goals/${id}`).set(authHeader(userB.token)).send({ targetAmount: 1 });
    expect(editB.status).toBe(404);

    const deleteB = await request(app).delete(`/api/goals/${id}`).set(authHeader(userB.token));
    expect(deleteB.status).toBe(404);
  });
});
