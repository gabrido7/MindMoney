import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { pool } from "../src/config/db";
import { registerTestUser, cleanupUser, authHeader, type TestUser } from "./helpers";

/** Só o real created_at faria os aportes acumularem por vários meses; nos testes, forçamos a data direto no banco. */
async function backdateCreatedAt(objectiveId: number, mysqlDateTime: string) {
  await pool.query("UPDATE financial_objectives SET created_at = ? WHERE id = ?", [mysqlDateTime, objectiveId]);
}

describe("Objetivos financeiros (metas de longo prazo)", () => {
  let userA: TestUser;
  let userB: TestUser;

  beforeAll(async () => {
    userA = await registerTestUser("objectives-a");
    userB = await registerTestUser("objectives-b");
  });

  afterAll(async () => {
    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("cria um objetivo com currentAmount/progressPercent zerados", async () => {
    const res = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Comprar um carro", category: "compra", targetAmount: 3000, targetMonth: "2026-11" });

    expect(res.status).toBe(201);
    expect(res.body.objective).toMatchObject({
      name: "Comprar um carro",
      category: "compra",
      targetAmount: 3000,
      currentAmount: 0,
      progressPercent: 0,
      achieved: false,
      overdue: false,
      monthsRemaining: 3,
      requiredMonthlyAmount: 1000,
    });
  });

  it("rejeita categoria inválida, mês malformado e valor não positivo (400)", async () => {
    const badCategory = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "x", category: "invalida", targetAmount: 100, targetMonth: "2026-11" });
    expect(badCategory.status).toBe(400);

    const badMonth = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "x", category: "viagem", targetAmount: 100, targetMonth: "2026-13" });
    expect(badMonth.status).toBe(400);

    const badAmount = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "x", category: "viagem", targetAmount: -5, targetMonth: "2026-11" });
    expect(badAmount.status).toBe(400);
  });

  it("aportes somam pro currentAmount e recalculam progresso/faltam/necessário por mês", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Viagem internacional", category: "viagem", targetAmount: 4000, targetMonth: "2026-11" });
    const id = created.body.objective.id;

    const first = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 1000, contributedAt: "2026-08-10", note: "Bônus" });
    expect(first.status).toBe(201);
    expect(first.body.objective.currentAmount).toBe(1000);
    expect(first.body.objective.remainingAmount).toBe(3000);
    expect(first.body.objective.progressPercent).toBe(25);
    expect(first.body.objective.requiredMonthlyAmount).toBe(1000); // 3000 restantes / 3 meses

    const second = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 500, contributedAt: "2026-08-15" });
    expect(second.body.objective.currentAmount).toBe(1500);

    const list = await request(app)
      .get(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token));
    expect(list.body.contributions).toHaveLength(2);
  });

  it("achieved fica true quando os aportes alcançam o valor alvo (progresso trava em 100%)", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Reserva de emergência", category: "reserva", targetAmount: 1000, targetMonth: "2026-11" });
    const id = created.body.objective.id;

    const res = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 1500, contributedAt: "2026-08-10" });

    expect(res.body.objective.achieved).toBe(true);
    expect(res.body.objective.progressPercent).toBe(100);
    expect(res.body.objective.remainingAmount).toBe(0);
    expect(res.body.objective.requiredMonthlyAmount).toBe(0);
  });

  it("marca overdue quando o prazo já passou e o objetivo não foi atingido", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Meta atrasada", category: "patrimonio", targetAmount: 5000, targetMonth: "2026-01" });

    expect(created.body.objective.overdue).toBe(true);
    expect(created.body.objective.monthsRemaining).toBe(0);
    expect(created.body.objective.requiredMonthlyAmount).toBe(0);
  });

  it("remover um aporte recalcula o objetivo pra baixo", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Curso", category: "educacao", targetAmount: 1000, targetMonth: "2026-11" });
    const id = created.body.objective.id;

    await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 400, contributedAt: "2026-08-10" });

    const listRes = await request(app)
      .get(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token));
    const cId = listRes.body.contributions[0].id;

    const removed = await request(app)
      .delete(`/api/objectives/${id}/contributions/${cId}`)
      .set(authHeader(userA.token));
    expect(removed.status).toBe(200);
    expect(removed.body.objective.currentAmount).toBe(0);
  });

  it("edita um objetivo (nome, categoria, valor, prazo)", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Nome antigo", category: "compra", targetAmount: 1000, targetMonth: "2026-11" });
    const id = created.body.objective.id;

    const updated = await request(app)
      .put(`/api/objectives/${id}`)
      .set(authHeader(userA.token))
      .send({ name: "Nome novo", category: "patrimonio", targetAmount: 2000, targetMonth: "2026-12" });

    expect(updated.status).toBe(200);
    expect(updated.body.objective).toMatchObject({
      name: "Nome novo",
      category: "patrimonio",
      targetAmount: 2000,
      targetMonth: "2026-12",
    });
  });

  it("exclui um objetivo e seus aportes cascateiam", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Vai ser excluído", category: "personalizada", targetAmount: 1000, targetMonth: "2026-11" });
    const id = created.body.objective.id;

    await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 100, contributedAt: "2026-08-10" });

    const deleted = await request(app).delete(`/api/objectives/${id}`).set(authHeader(userA.token));
    expect(deleted.status).toBe(204);

    const afterDelete = await request(app)
      .get(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token));
    expect(afterDelete.status).toBe(404);
  });

  it("resumo agrega totais reais e conta metas próximas do prazo", async () => {
    const freshUser = await registerTestUser("objectives-summary");

    const near = await request(app)
      .post("/api/objectives")
      .set(authHeader(freshUser.token))
      .send({ name: "Perto do prazo", category: "viagem", targetAmount: 1000, targetMonth: "2026-09" });
    await request(app)
      .post(`/api/objectives/${near.body.objective.id}/contributions`)
      .set(authHeader(freshUser.token))
      .send({ amount: 200, contributedAt: "2026-08-10" });

    await request(app)
      .post("/api/objectives")
      .set(authHeader(freshUser.token))
      .send({ name: "Longe do prazo", category: "reserva", targetAmount: 2000, targetMonth: "2028-01" });

    const summary = await request(app).get("/api/objectives/summary").set(authHeader(freshUser.token));
    expect(summary.status).toBe(200);
    expect(summary.body.totalObjectives).toBe(2);
    expect(summary.body.totalTarget).toBe(3000);
    expect(summary.body.totalSaved).toBe(200);
    expect(summary.body.nearDeadlineCount).toBe(1);

    await cleanupUser(freshUser.userId);
  });

  it("ritmo: dados insuficientes no primeiro mês do objetivo (sem histórico pra comparar)", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Recém criada", category: "compra", targetAmount: 3000, targetMonth: "2026-12" });
    const id = created.body.objective.id;

    const res = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 100, contributedAt: "2026-08-10" });

    expect(res.body.objective.paceStatus).toBe("insufficient_data");
    expect(res.body.objective.monthlyPace).toBeNull();
  });

  it("ritmo: 'behind' quando o ritmo médio de aportes fica abaixo do necessário", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Atrás do ritmo", category: "patrimonio", targetAmount: 6000, targetMonth: "2026-12" });
    const id = created.body.objective.id;
    await backdateCreatedAt(id, "2026-06-15 00:00:00");

    const res = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 400, contributedAt: "2026-08-10" });

    // 2 meses desde a criação, R$400 guardados => ritmo de R$200/mês.
    // Faltam R$5.600 em 4 meses => necessário R$1.400/mês.
    expect(res.body.objective.monthlyPace).toBe(200);
    expect(res.body.objective.paceStatus).toBe("behind");
    expect(res.body.objective.paceMonthlyDifference).toBe(1200);
  });

  it("ritmo: 'on_track' quando o ritmo médio bate com o necessário", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "No ritmo", category: "patrimonio", targetAmount: 6000, targetMonth: "2026-12" });
    const id = created.body.objective.id;
    await backdateCreatedAt(id, "2026-06-15 00:00:00");

    const res = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 2000, contributedAt: "2026-08-10" });

    // 2 meses desde a criação, R$2.000 guardados => ritmo de R$1.000/mês.
    // Faltam R$4.000 em 4 meses => necessário R$1.000/mês -- bate certinho.
    expect(res.body.objective.monthlyPace).toBe(1000);
    expect(res.body.objective.paceStatus).toBe("on_track");
  });

  it("ritmo: 'ahead' quando o ritmo médio supera o necessário, projeta meses de antecipação", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Adiantada", category: "patrimonio", targetAmount: 6000, targetMonth: "2026-12" });
    const id = created.body.objective.id;
    await backdateCreatedAt(id, "2026-06-15 00:00:00");

    const res = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 3000, contributedAt: "2026-08-10" });

    // 2 meses desde a criação, R$3.000 guardados => ritmo de R$1.500/mês.
    // Faltam R$3.000 em 4 meses => necessário R$750/mês; no ritmo atual, acaba em 2 meses => 2 meses de antecipação.
    expect(res.body.objective.monthlyPace).toBe(1500);
    expect(res.body.objective.paceStatus).toBe("ahead");
    expect(res.body.objective.paceMonthsEarlier).toBe(2);
  });

  it("usuário B não vê, edita, apaga nem lança aporte em objetivo de A (IDOR)", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Só de A", category: "compra", targetAmount: 1000, targetMonth: "2026-11" });
    const id = created.body.objective.id;

    const listB = await request(app).get("/api/objectives").set(authHeader(userB.token));
    expect(listB.body.objectives.find((o: { id: number }) => o.id === id)).toBeUndefined();

    const updateB = await request(app)
      .put(`/api/objectives/${id}`)
      .set(authHeader(userB.token))
      .send({ name: "hack", category: "compra", targetAmount: 1, targetMonth: "2026-11" });
    expect(updateB.status).toBe(404);

    const contributeB = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userB.token))
      .send({ amount: 100, contributedAt: "2026-08-10" });
    expect(contributeB.status).toBe(404);

    const deleteB = await request(app).delete(`/api/objectives/${id}`).set(authHeader(userB.token));
    expect(deleteB.status).toBe(404);
  });

  it("todas as rotas exigem autenticação (401 sem token)", async () => {
    const list = await request(app).get("/api/objectives");
    expect(list.status).toBe(401);

    const create = await request(app)
      .post("/api/objectives")
      .send({ name: "x", category: "compra", targetAmount: 1, targetMonth: "2026-11" });
    expect(create.status).toBe(401);
  });
});
