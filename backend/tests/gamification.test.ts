import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { pool } from "../src/config/db";
import { registerTestUser, cleanupUser, authHeader } from "./helpers";

async function backdateCompletedAt(userId: number, lessonId: string, mysqlDateTime: string) {
  await pool.query("UPDATE lesson_progress SET completed_at = ? WHERE user_id = ? AND lesson_id = ?", [
    mysqlDateTime,
    userId,
    lessonId,
  ]);
}

/**
 * Formata em componentes LOCAIS (não toISOString, que é UTC) -- o valor é
 * gravado como string literal no MySQL (sessão em fuso SYSTEM = local), e
 * precisa representar o mesmo horário de parede que um "N dias atrás"
 * calculado localmente, não a data UTC equivalente (que pode cair num dia
 * diferente perto da virada de meia-noite UTC).
 */
function daysAgoDateTime(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

async function completeLesson(token: string, lessonId: string, extra: Record<string, unknown> = {}) {
  return request(app)
    .put(`/api/education/progress/${lessonId}`)
    .set(authHeader(token))
    .send({ completed: true, ...extra });
}

describe("Gamificação: XP, nível e conquistas", () => {
  it("resumo inicial de um usuário novo vem zerado, nível 1, nenhuma conquista", async () => {
    const user = await registerTestUser("gami-fresh");
    const res = await request(app).get("/api/gamification/summary").set(authHeader(user.token));

    expect(res.status).toBe(200);
    expect(res.body.totalXp).toBe(0);
    expect(res.body.level).toBe(1);
    expect(res.body.xpIntoLevel).toBe(0);
    expect(res.body.xpForNextLevel).toBe(100);
    expect(res.body.streak).toBe(0);
    expect(res.body.achievements.length).toBeGreaterThan(0);
    expect(res.body.achievements.every((a: { unlocked: boolean }) => a.unlocked === false)).toBe(true);

    await cleanupUser(user.userId);
  });

  it("completar a primeira aula dá XP e desbloqueia 'Primeira aula'", async () => {
    const user = await registerTestUser("gami-first-lesson");

    const res = await completeLesson(user.token, "fundamentos.o-que-e-dinheiro.aula-1");
    expect(res.status).toBe(200);
    expect(res.body.progress.completed).toBe(true);
    expect(res.body.gamification.xpAwarded).toBe(45); // 20 (aula) + 25 (conquista "Primeira aula")
    expect(res.body.gamification.totalXp).toBe(45);
    expect(res.body.gamification.newAchievements.map((a: { id: string }) => a.id)).toEqual(["primeira-aula"]);

    const summary = await request(app).get("/api/gamification/summary").set(authHeader(user.token));
    expect(summary.body.totalXp).toBe(45);
    const primeiraAula = summary.body.achievements.find((a: { id: string }) => a.id === "primeira-aula");
    expect(primeiraAula.unlocked).toBe(true);

    await cleanupUser(user.userId);
  });

  it("responder o quiz de uma aula dá XP e desbloqueia 'Primeiro quiz', mesmo sem marcar a aula como concluída", async () => {
    const user = await registerTestUser("gami-first-quiz");

    const res = await request(app)
      .put("/api/education/progress/fundamentos.o-que-e-dinheiro.aula-1")
      .set(authHeader(user.token))
      .send({ completed: false, quizScore: 1, quizTotal: 2 });

    expect(res.body.progress.completed).toBe(false);
    expect(res.body.gamification.xpAwarded).toBe(40); // 15 (quiz) + 25 (conquista "Primeiro quiz")
    expect(res.body.gamification.newAchievements.map((a: { id: string }) => a.id)).toEqual(["primeiro-quiz"]);

    await cleanupUser(user.userId);
  });

  it("marcar a mesma aula como concluída de novo não dá XP em dobro (idempotente)", async () => {
    const user = await registerTestUser("gami-idempotent");

    await completeLesson(user.token, "fundamentos.o-que-e-dinheiro.aula-1");
    const again = await completeLesson(user.token, "fundamentos.o-que-e-dinheiro.aula-1");

    expect(again.body.gamification).toBeNull();

    const summary = await request(app).get("/api/gamification/summary").set(authHeader(user.token));
    expect(summary.body.totalXp).toBe(45); // continua só o da primeira vez

    await cleanupUser(user.userId);
  });

  it("5 aulas concluídas (em cursos diferentes) desbloqueia '5 aulas concluídas' e sobe de nível", async () => {
    const user = await registerTestUser("gami-five-lessons");
    const lessonIds = [
      "fundamentos.o-que-e-dinheiro.aula-1",
      "fundamentos.receitas-e-despesas.aula-1",
      "fundamentos.como-montar-um-orcamento.aula-1",
      "fundamentos.controle-de-gastos.aula-1",
      "fundamentos.reserva-emergencia.aula-1",
    ];

    const responses = [];
    for (const lessonId of lessonIds) {
      responses.push(await completeLesson(user.token, lessonId));
    }

    // 45, 65, 85, 105, 150 -- o 4º cruza o limite de 100 XP do nível 1 (sobe pra nível 2)
    expect(responses[0].body.gamification.xpAwarded).toBe(45);
    expect(responses[1].body.gamification.xpAwarded).toBe(20);
    expect(responses[2].body.gamification.xpAwarded).toBe(20);
    expect(responses[3].body.gamification.xpAwarded).toBe(20);
    expect(responses[3].body.gamification.leveledUp).toBe(true);
    expect(responses[3].body.gamification.level).toBe(2);
    expect(responses[4].body.gamification.xpAwarded).toBe(45); // 20 + 25 ("5 aulas concluídas")
    expect(responses[4].body.gamification.leveledUp).toBe(false);
    expect(responses[4].body.gamification.newAchievements.map((a: { id: string }) => a.id)).toEqual([
      "cinco-aulas",
    ]);
    expect(responses[4].body.gamification.totalXp).toBe(150);

    await cleanupUser(user.userId);
  });

  it("completar as 5 aulas do curso 'Como montar um orçamento' dá bônus de curso e desbloqueia 'Mestre do orçamento'", async () => {
    const user = await registerTestUser("gami-course-complete");

    let last;
    for (let i = 1; i <= 5; i++) {
      last = await completeLesson(user.token, `fundamentos.como-montar-um-orcamento.aula-${i}`);
    }

    // aula-5: lesson(20) + course_completed(50) + "5 aulas concluídas"(25) + "Mestre do orçamento"(25) = 120
    expect(last!.body.gamification.xpAwarded).toBe(120);
    const ids = last!.body.gamification.newAchievements.map((a: { id: string }) => a.id);
    expect(ids).toContain("cinco-aulas");
    expect(ids).toContain("mestre-orcamento");
    expect(last!.body.gamification.totalXp).toBe(225);

    await cleanupUser(user.userId);
  });

  it("bônus de curso também funciona para trilhas além de Fundamentos (Organização financeira)", async () => {
    const user = await registerTestUser("gami-other-trail-course");

    let last;
    for (let i = 1; i <= 5; i++) {
      last = await completeLesson(user.token, `organizacao-financeira.metas-financeiras.aula-${i}`);
    }

    // aula-5: lesson(20) + course_completed(50) + "5 aulas concluídas"(25) = 95 (sem conquista de curso específica aqui)
    expect(last!.body.gamification.xpAwarded).toBe(95);
    const ids = last!.body.gamification.newAchievements.map((a: { id: string }) => a.id);
    expect(ids).toContain("cinco-aulas");
    expect(ids).not.toContain("trilha-organizacao"); // só 5 de 30 aulas da trilha

    await cleanupUser(user.userId);
  });

  it("investidor-consciente e bônus de curso funcionam para a trilha Investimentos também", async () => {
    const user = await registerTestUser("gami-investimentos-course");

    const first = await completeLesson(user.token, "investimentos.inflacao.aula-1");
    expect(first.body.gamification.newAchievements.map((a: { id: string }) => a.id)).toEqual(
      expect.arrayContaining(["primeira-aula", "investidor-consciente"])
    );

    let last;
    for (let i = 2; i <= 5; i++) {
      last = await completeLesson(user.token, `investimentos.inflacao.aula-${i}`);
    }
    const ids = last!.body.gamification.newAchievements.map((a: { id: string }) => a.id);
    expect(ids).toContain("cinco-aulas");
    expect(ids).not.toContain("trilha-investimentos"); // só 5 de 50 aulas da trilha

    await cleanupUser(user.userId);
  });

  it("bônus de curso e trilha também funcionam para a trilha Finanças avançadas", async () => {
    const user = await registerTestUser("gami-financas-avancadas");

    let last;
    for (let i = 1; i <= 5; i++) {
      last = await completeLesson(user.token, `financas-avancadas.alocacao-de-ativos.aula-${i}`);
    }

    // aula-5: lesson(20) + course_completed(50) + "5 aulas concluídas"(25) = 95
    expect(last!.body.gamification.xpAwarded).toBe(95);
    const ids = last!.body.gamification.newAchievements.map((a: { id: string }) => a.id);
    expect(ids).toContain("cinco-aulas");
    expect(ids).not.toContain("trilha-financas-avancadas"); // só 5 de 35 aulas da trilha

    await cleanupUser(user.userId);
  });

  it("bônus de curso e trilha também funcionam para a trilha Crédito e dívidas", async () => {
    const user = await registerTestUser("gami-credito-e-dividas");

    let last;
    for (let i = 1; i <= 5; i++) {
      last = await completeLesson(user.token, `credito-e-dividas.score-de-credito.aula-${i}`);
    }

    // aula-5: lesson(20) + course_completed(50) + "5 aulas concluídas"(25) = 95
    expect(last!.body.gamification.xpAwarded).toBe(95);
    const ids = last!.body.gamification.newAchievements.map((a: { id: string }) => a.id);
    expect(ids).toContain("cinco-aulas");
    expect(ids).not.toContain("trilha-credito-e-dividas"); // só 5 de 25 aulas da trilha

    await cleanupUser(user.userId);
  });

  it("bônus de curso e trilha também funcionam para a trilha Aposentadoria e independência financeira", async () => {
    const user = await registerTestUser("gami-aposentadoria");

    let last;
    for (let i = 1; i <= 5; i++) {
      last = await completeLesson(user.token, `aposentadoria-e-independencia.independencia-financeira.aula-${i}`);
    }

    // aula-5: lesson(20) + course_completed(50) + "5 aulas concluídas"(25) = 95
    expect(last!.body.gamification.xpAwarded).toBe(95);
    const ids = last!.body.gamification.newAchievements.map((a: { id: string }) => a.id);
    expect(ids).toContain("cinco-aulas");
    expect(ids).not.toContain("trilha-aposentadoria"); // só 5 de 25 aulas da trilha

    await cleanupUser(user.userId);
  });

  it("completar as 25 aulas de Fundamentos desbloqueia a conquista da trilha completa", async () => {
    const user = await registerTestUser("gami-trail-complete");
    const courseIds = [
      "o-que-e-dinheiro",
      "receitas-e-despesas",
      "como-montar-um-orcamento",
      "controle-de-gastos",
      "reserva-emergencia",
    ];

    let last;
    for (const courseId of courseIds) {
      for (let i = 1; i <= 5; i++) {
        last = await completeLesson(user.token, `fundamentos.${courseId}.aula-${i}`);
      }
    }

    const lastIds = last!.body.gamification.newAchievements.map((a: { id: string }) => a.id);
    expect(lastIds).toContain("trilha-fundamentos");

    const summary = await request(app).get("/api/gamification/summary").set(authHeader(user.token));
    for (const id of ["primeira-aula", "cinco-aulas", "vinte-aulas", "mestre-orcamento", "trilha-fundamentos"]) {
      const achievement = summary.body.achievements.find((a: { id: string }) => a.id === id);
      expect(achievement.unlocked).toBe(true);
    }

    await cleanupUser(user.userId);
  });

  it("sequência de 3 dias seguidos dá bônus de XP e desbloqueia 'Sequência de 3 dias'", async () => {
    const user = await registerTestUser("gami-streak");

    await completeLesson(user.token, "fundamentos.o-que-e-dinheiro.aula-1");
    await backdateCompletedAt(user.userId, "fundamentos.o-que-e-dinheiro.aula-1", daysAgoDateTime(2));

    await completeLesson(user.token, "fundamentos.o-que-e-dinheiro.aula-2");
    await backdateCompletedAt(user.userId, "fundamentos.o-que-e-dinheiro.aula-2", daysAgoDateTime(1));

    const third = await completeLesson(user.token, "fundamentos.o-que-e-dinheiro.aula-3");

    // lesson(20) + streak_bonus(30) + "Sequência de 3 dias"(25) = 75
    expect(third.body.gamification.xpAwarded).toBe(75);
    expect(third.body.gamification.newAchievements.map((a: { id: string }) => a.id)).toEqual([
      "sequencia-3-dias",
    ]);

    const summary = await request(app).get("/api/gamification/summary").set(authHeader(user.token));
    expect(summary.body.streak).toBe(3);

    await cleanupUser(user.userId);
  });

  it("atingir uma meta financeira dá XP e desbloqueia 'Primeira meta atingida'", async () => {
    const user = await registerTestUser("gami-goal");

    const objective = await request(app)
      .post("/api/objectives")
      .set(authHeader(user.token))
      .send({ name: "Meta gamificada", category: "reserva", targetAmount: 1000, targetMonth: "2026-12" });

    const contribution = await request(app)
      .post(`/api/objectives/${objective.body.objective.id}/contributions`)
      .set(authHeader(user.token))
      .send({ amount: 1000, contributedAt: "2026-08-10" });

    expect(contribution.body.milestoneReached).toBe(100);
    expect(contribution.body.gamification.xpAwarded).toBe(125); // 100 (meta) + 25 (conquista)
    expect(contribution.body.gamification.newAchievements.map((a: { id: string }) => a.id)).toEqual([
      "primeira-meta",
    ]);

    await cleanupUser(user.userId);
  });

  it("contribuição que não atinge a meta não mexe em gamificação", async () => {
    const user = await registerTestUser("gami-goal-partial");

    const objective = await request(app)
      .post("/api/objectives")
      .set(authHeader(user.token))
      .send({ name: "Meta parcial", category: "reserva", targetAmount: 1000, targetMonth: "2026-12" });

    const contribution = await request(app)
      .post(`/api/objectives/${objective.body.objective.id}/contributions`)
      .set(authHeader(user.token))
      .send({ amount: 300, contributedAt: "2026-08-10" });

    expect(contribution.body.gamification).toBeNull();

    await cleanupUser(user.userId);
  });

  it("'Investidor consciente' desbloqueia ao completar qualquer aula da trilha Investimentos", async () => {
    const user = await registerTestUser("gami-investor");

    const res = await completeLesson(user.token, "investimentos.inflacao.aula-1");
    const ids = res.body.gamification.newAchievements.map((a: { id: string }) => a.id);
    expect(ids).toContain("investidor-consciente");
    expect(ids).toContain("primeira-aula");

    await cleanupUser(user.userId);
  });

  it("usuário B não vê XP nem conquistas de A (IDOR)", async () => {
    const userA = await registerTestUser("gami-idor-a");
    const userB = await registerTestUser("gami-idor-b");

    await completeLesson(userA.token, "fundamentos.o-que-e-dinheiro.aula-1");

    const summaryB = await request(app).get("/api/gamification/summary").set(authHeader(userB.token));
    expect(summaryB.body.totalXp).toBe(0);
    expect(summaryB.body.achievements.every((a: { unlocked: boolean }) => a.unlocked === false)).toBe(true);

    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("exige autenticação (401 sem token)", async () => {
    const res = await request(app).get("/api/gamification/summary");
    expect(res.status).toBe(401);
  });
});

describe("Gamificação financeira: dívidas quitadas e patrimônio positivo", () => {
  it("quitar uma dívida por completo dá XP, desbloqueia a conquista e notifica de verdade", async () => {
    const user = await registerTestUser("gami-debt-paidoff");

    const debt = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida Pequena", totalAmount: 100 });

    const payment = await request(app)
      .post(`/api/debts/${debt.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 100, paidAt: new Date().toISOString().slice(0, 10) });

    expect(payment.status).toBe(201);
    expect(payment.body.milestoneReached).toBe(100);
    expect(payment.body.gamification.xpAwarded).toBe(105); // 80 (debt_paid_off) + 25 (conquista)
    expect(
      payment.body.gamification.newAchievements.some((a: { id: string }) => a.id === "primeira-divida-quitada")
    ).toBe(true);

    const notifRes = await request(app).get("/api/notifications").set(authHeader(user.token));
    expect(notifRes.body.notifications.some((n: { type: string }) => n.type === "debt_paid_off")).toBe(true);

    await cleanupUser(user.userId);
  });

  it("quitar uma segunda dívida dá XP de novo, mas não desbloqueia 'primeira-divida-quitada' outra vez", async () => {
    const user = await registerTestUser("gami-debt-paidoff-twice");
    const today = new Date().toISOString().slice(0, 10);

    const debt1 = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida 1", totalAmount: 50 });
    await request(app)
      .post(`/api/debts/${debt1.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 50, paidAt: today });

    const debt2 = await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida 2", totalAmount: 80 });
    const payment2 = await request(app)
      .post(`/api/debts/${debt2.body.debt.id}/payments`)
      .set(authHeader(user.token))
      .send({ amount: 80, paidAt: today });

    expect(payment2.body.milestoneReached).toBe(100);
    expect(payment2.body.gamification.xpAwarded).toBe(80); // só o XP do evento, sem bônus de conquista de novo
    expect(
      payment2.body.gamification.newAchievements.some((a: { id: string }) => a.id === "primeira-divida-quitada")
    ).toBe(false);

    await cleanupUser(user.userId);
  });

  it("patrimônio líquido virando positivo desbloqueia 'patrimonio-no-azul' e notifica -- só depois de já ter dívida registrada", async () => {
    const user = await registerTestUser("gami-networth");
    const today = new Date().toISOString().slice(0, 10);

    await request(app)
      .post("/api/debts")
      .set(authHeader(user.token))
      .send({ type: "outro", name: "Dívida Grande", totalAmount: 1000 });

    const asset = await request(app)
      .post("/api/assets")
      .set(authHeader(user.token))
      .send({ type: "investimento", name: "Poupança", initialValue: 500, valuedAt: today });

    // ainda negativo (500 em ativos contra 1000 de dívida) -- não desbloqueia ainda
    expect(
      asset.body.gamification.newAchievements.some((a: { id: string }) => a.id === "patrimonio-no-azul")
    ).toBe(false);

    const update = await request(app)
      .post(`/api/assets/${asset.body.asset.id}/updates`)
      .set(authHeader(user.token))
      .send({ value: 1500, valuedAt: today });

    expect(
      update.body.gamification.newAchievements.some((a: { id: string }) => a.id === "patrimonio-no-azul")
    ).toBe(true);

    const notifRes = await request(app).get("/api/notifications").set(authHeader(user.token));
    expect(notifRes.body.notifications.some((n: { type: string }) => n.type === "net_worth_positive")).toBe(true);

    await cleanupUser(user.userId);
  });

  it("sem nenhuma dívida registrada, ter só um ativo positivo NÃO desbloqueia 'patrimonio-no-azul'", async () => {
    const user = await registerTestUser("gami-networth-no-debt");

    const asset = await request(app)
      .post("/api/assets")
      .set(authHeader(user.token))
      .send({ type: "investimento", name: "Poupança", initialValue: 500, valuedAt: new Date().toISOString().slice(0, 10) });

    expect(
      asset.body.gamification.newAchievements.some((a: { id: string }) => a.id === "patrimonio-no-azul")
    ).toBe(false);
    expect(asset.body.gamification.xpAwarded).toBe(0);

    await cleanupUser(user.userId);
  });

  it("checar conquistas financeiras sem cruzar nenhum marco novo não gera XP fantasma", async () => {
    const user = await registerTestUser("gami-no-phantom-xp");
    const today = new Date().toISOString().slice(0, 10);

    const asset = await request(app)
      .post("/api/assets")
      .set(authHeader(user.token))
      .send({ type: "investimento", name: "Poupança", initialValue: 100, valuedAt: today });
    expect(asset.body.gamification.xpAwarded).toBe(0);

    // atualizar de novo, ainda sem nenhuma dívida registrada -- continua sem XP/conquista nova
    const update = await request(app)
      .post(`/api/assets/${asset.body.asset.id}/updates`)
      .set(authHeader(user.token))
      .send({ value: 200, valuedAt: today });
    expect(update.body.gamification.xpAwarded).toBe(0);
    expect(update.body.gamification.newAchievements).toEqual([]);

    await cleanupUser(user.userId);
  });
});
