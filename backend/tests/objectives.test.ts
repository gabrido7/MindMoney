import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
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
    // Todo o arquivo assume "hoje" em agosto/2026 -- metas com alvo em
    // 2026-11/2026-12 esperando 3/4 meses restantes, aportes em
    // "2026-08-10", objetivo "criado" em "2026-06-15" (via
    // backdateCreatedAt) esperando exatamente 2 meses decorridos, meta em
    // "2026-01" esperando estar vencida. objectives.service.ts calcula tudo
    // isso a partir de currentMonth()/new Date() reais -- sem congelar o
    // relógio, esses números derivam conforme o tempo real passa (mesmo
    // problema já resolvido corretamente no frontend por
    // simulateGoal.test.ts). toFake: ["Date"] -- só o relógio é congelado,
    // setTimeout/etc. continuam reais, então a conexão de verdade com o
    // MySQL não é afetada.
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-08-15T12:00:00Z"));

    userA = await registerTestUser("objectives-a");
    userB = await registerTestUser("objectives-b");
  });

  afterAll(async () => {
    vi.useRealTimers();
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

  it("cria um objetivo com prioridade explícita, e usa 'media' como padrão quando omitida", async () => {
    const withPriority = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Reserva", category: "reserva", priority: "alta", targetAmount: 1000, targetMonth: "2026-11" });
    expect(withPriority.body.objective.priority).toBe("alta");

    const withoutPriority = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Sem prioridade", category: "reserva", targetAmount: 1000, targetMonth: "2026-11" });
    expect(withoutPriority.body.objective.priority).toBe("media");
  });

  it("rejeita prioridade inválida (400)", async () => {
    const res = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "x", category: "reserva", priority: "urgente", targetAmount: 100, targetMonth: "2026-11" });
    expect(res.status).toBe(400);
  });

  it("lista os objetivos ordenados por prioridade (alta, depois média, depois baixa)", async () => {
    const freshUser = await registerTestUser("objectives-priority-order");

    await request(app)
      .post("/api/objectives")
      .set(authHeader(freshUser.token))
      .send({ name: "Baixa primeiro criada", category: "personalizada", priority: "baixa", targetAmount: 100, targetMonth: "2026-11" });
    await request(app)
      .post("/api/objectives")
      .set(authHeader(freshUser.token))
      .send({ name: "Alta criada depois", category: "personalizada", priority: "alta", targetAmount: 100, targetMonth: "2026-11" });
    await request(app)
      .post("/api/objectives")
      .set(authHeader(freshUser.token))
      .send({ name: "Média", category: "personalizada", priority: "media", targetAmount: 100, targetMonth: "2026-11" });

    const list = await request(app).get("/api/objectives").set(authHeader(freshUser.token));
    const priorities = list.body.objectives.map((o: { priority: string }) => o.priority);
    expect(priorities).toEqual(["alta", "media", "baixa"]);

    await cleanupUser(freshUser.userId);
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
    expect(summary.body.mostUrgentObjective).toMatchObject({ name: "Perto do prazo", category: "viagem" });
    expect(summary.body.mostUrgentObjective.daysRemaining).toBeGreaterThan(0);

    await cleanupUser(freshUser.userId);
  });

  it("resumo aponta a meta mais urgente (menos dias) entre as próximas do prazo, e null quando nenhuma está próxima", async () => {
    const freshUser = await registerTestUser("objectives-most-urgent");

    await request(app)
      .post("/api/objectives")
      .set(authHeader(freshUser.token))
      .send({ name: "Daqui a 3 meses", category: "viagem", targetAmount: 1000, targetMonth: "2026-11" });
    await request(app)
      .post("/api/objectives")
      .set(authHeader(freshUser.token))
      .send({ name: "Mais urgente", category: "reserva", targetAmount: 1000, targetMonth: "2026-09" });

    const summary = await request(app).get("/api/objectives/summary").set(authHeader(freshUser.token));
    expect(summary.body.nearDeadlineCount).toBe(2);
    expect(summary.body.mostUrgentObjective.name).toBe("Mais urgente");

    await cleanupUser(freshUser.userId);

    const emptyUser = await registerTestUser("objectives-no-urgent");
    const emptySummary = await request(app).get("/api/objectives/summary").set(authHeader(emptyUser.token));
    expect(emptySummary.body.nearDeadlineCount).toBe(0);
    expect(emptySummary.body.mostUrgentObjective).toBeNull();
    await cleanupUser(emptyUser.userId);
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

  it("marco de progresso: aporte que não cruza nenhum marco não retorna milestoneReached", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Sem marco ainda", category: "compra", targetAmount: 1000, targetMonth: "2026-11" });
    const id = created.body.objective.id;

    const res = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 100, contributedAt: "2026-08-10" }); // 10%, não cruza 25%
    expect(res.body.milestoneReached).toBeNull();
  });

  it("marco de progresso: cruzar 25% retorna milestoneReached 25", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Cruza 25", category: "compra", targetAmount: 1000, targetMonth: "2026-11" });
    const id = created.body.objective.id;

    const res = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 300, contributedAt: "2026-08-10" }); // 30%, cruza 25%
    expect(res.body.milestoneReached).toBe(25);
  });

  it("marco de progresso: aporte que pula direto de 0% pra 60% celebra o marco mais alto cruzado (50), não o menor (25)", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Pula marcos", category: "compra", targetAmount: 1000, targetMonth: "2026-11" });
    const id = created.body.objective.id;

    const res = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 600, contributedAt: "2026-08-10" });
    expect(res.body.milestoneReached).toBe(50);
  });

  it("marco de progresso: um segundo aporte só celebra marcos ainda não cruzados", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Dois aportes", category: "compra", targetAmount: 1000, targetMonth: "2026-11" });
    const id = created.body.objective.id;

    const first = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 250, contributedAt: "2026-08-05" }); // 25%
    expect(first.body.milestoneReached).toBe(25);

    const second = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 300, contributedAt: "2026-08-10" }); // 25% -> 55%, cruza 50 mas não 25 de novo
    expect(second.body.milestoneReached).toBe(50);
  });

  it("marco de progresso: aporte que atinge exatamente o valor alvo retorna milestoneReached 100", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Bate 100%", category: "compra", targetAmount: 1000, targetMonth: "2026-11" });
    const id = created.body.objective.id;

    const res = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 1000, contributedAt: "2026-08-10" });
    expect(res.body.milestoneReached).toBe(100);
  });

  it("marco de progresso: aporte extra numa meta já concluída não celebra de novo", async () => {
    const created = await request(app)
      .post("/api/objectives")
      .set(authHeader(userA.token))
      .send({ name: "Já concluída", category: "compra", targetAmount: 1000, targetMonth: "2026-11" });
    const id = created.body.objective.id;

    await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 1000, contributedAt: "2026-08-10" });

    const res = await request(app)
      .post(`/api/objectives/${id}/contributions`)
      .set(authHeader(userA.token))
      .send({ amount: 50, contributedAt: "2026-08-12" });
    expect(res.body.milestoneReached).toBeNull();
  });

  it("evolução acumula aportes reais por mês, só de objetivos do próprio usuário", async () => {
    const freshUser = await registerTestUser("objectives-evolution");
    const other = await registerTestUser("objectives-evolution-other");

    const objA = await request(app)
      .post("/api/objectives")
      .set(authHeader(freshUser.token))
      .send({ name: "Meta A", category: "reserva", targetAmount: 5000, targetMonth: "2026-12" });
    const objB = await request(app)
      .post("/api/objectives")
      .set(authHeader(freshUser.token))
      .send({ name: "Meta B", category: "viagem", targetAmount: 5000, targetMonth: "2026-12" });

    await request(app)
      .post(`/api/objectives/${objA.body.objective.id}/contributions`)
      .set(authHeader(freshUser.token))
      .send({ amount: 300, contributedAt: "2026-07-05" });
    await request(app)
      .post(`/api/objectives/${objB.body.objective.id}/contributions`)
      .set(authHeader(freshUser.token))
      .send({ amount: 200, contributedAt: "2026-07-20" });
    await request(app)
      .post(`/api/objectives/${objA.body.objective.id}/contributions`)
      .set(authHeader(freshUser.token))
      .send({ amount: 150, contributedAt: "2026-08-10" });

    // aporte de outro usuário não pode aparecer na evolução de freshUser
    const objOther = await request(app)
      .post("/api/objectives")
      .set(authHeader(other.token))
      .send({ name: "Meta de outro usuário", category: "reserva", targetAmount: 1000, targetMonth: "2026-12" });
    await request(app)
      .post(`/api/objectives/${objOther.body.objective.id}/contributions`)
      .set(authHeader(other.token))
      .send({ amount: 9999, contributedAt: "2026-07-10" });

    const res = await request(app).get("/api/objectives/evolution").set(authHeader(freshUser.token));
    expect(res.status).toBe(200);
    expect(res.body.evolution).toEqual([
      { month: "2026-07", totalSaved: 500 },
      { month: "2026-08", totalSaved: 650 },
    ]);

    await cleanupUser(freshUser.userId);
    await cleanupUser(other.userId);
  });

  it("evolução vem vazia quando o usuário ainda não tem nenhum aporte", async () => {
    const freshUser = await registerTestUser("objectives-evolution-empty");
    const res = await request(app).get("/api/objectives/evolution").set(authHeader(freshUser.token));
    expect(res.status).toBe(200);
    expect(res.body.evolution).toEqual([]);
    await cleanupUser(freshUser.userId);
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

    const evolution = await request(app).get("/api/objectives/evolution");
    expect(evolution.status).toBe(401);
  });
});
