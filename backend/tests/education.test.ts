import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { registerTestUser, cleanupUser, authHeader, type TestUser } from "./helpers";

describe("Progresso da trilha de Educação Financeira", () => {
  let userA: TestUser;
  let userB: TestUser;

  beforeAll(async () => {
    userA = await registerTestUser("education-a");
    userB = await registerTestUser("education-b");
  });

  afterAll(async () => {
    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("lista vazia quando o usuário ainda não completou nenhuma aula", async () => {
    const res = await request(app).get("/api/education/progress").set(authHeader(userA.token));
    expect(res.status).toBe(200);
    expect(res.body.progress).toEqual([]);
  });

  it("marca uma aula como concluída, com resultado de quiz e resposta do exercício", async () => {
    const res = await request(app)
      .put("/api/education/progress/fundamentos.o-que-e-dinheiro.aula-1")
      .set(authHeader(userA.token))
      .send({ completed: true, quizScore: 4, quizTotal: 5, exerciseResponse: "Minha resposta ao exercício." });

    expect(res.status).toBe(200);
    expect(res.body.progress).toMatchObject({
      lessonId: "fundamentos.o-que-e-dinheiro.aula-1",
      completed: true,
      quizScore: 4,
      quizTotal: 5,
      exerciseResponse: "Minha resposta ao exercício.",
    });
    expect(res.body.progress.completedAt).not.toBeNull();
  });

  it("atualizar de novo (upsert) substitui os dados, não duplica a linha", async () => {
    await request(app)
      .put("/api/education/progress/fundamentos.o-que-e-dinheiro.aula-2")
      .set(authHeader(userA.token))
      .send({ completed: true, quizScore: 2, quizTotal: 5 });

    const updated = await request(app)
      .put("/api/education/progress/fundamentos.o-que-e-dinheiro.aula-2")
      .set(authHeader(userA.token))
      .send({ completed: true, quizScore: 5, quizTotal: 5, exerciseResponse: "Refiz e acertei tudo." });
    expect(updated.body.progress.quizScore).toBe(5);
    expect(updated.body.progress.exerciseResponse).toBe("Refiz e acertei tudo.");

    const list = await request(app).get("/api/education/progress").set(authHeader(userA.token));
    const matches = list.body.progress.filter(
      (p: { lessonId: string }) => p.lessonId === "fundamentos.o-que-e-dinheiro.aula-2"
    );
    expect(matches).toHaveLength(1);
  });

  it("completed: false marca como não concluída (completedAt null)", async () => {
    await request(app)
      .put("/api/education/progress/fundamentos.o-que-e-dinheiro.aula-3")
      .set(authHeader(userA.token))
      .send({ completed: true });

    const res = await request(app)
      .put("/api/education/progress/fundamentos.o-que-e-dinheiro.aula-3")
      .set(authHeader(userA.token))
      .send({ completed: false });

    expect(res.body.progress.completed).toBe(false);
    expect(res.body.progress.completedAt).toBeNull();
  });

  it("remove o progresso de uma aula", async () => {
    await request(app)
      .put("/api/education/progress/fundamentos.o-que-e-dinheiro.aula-4")
      .set(authHeader(userA.token))
      .send({ completed: true });

    const deleted = await request(app)
      .delete("/api/education/progress/fundamentos.o-que-e-dinheiro.aula-4")
      .set(authHeader(userA.token));
    expect(deleted.status).toBe(204);

    const list = await request(app).get("/api/education/progress").set(authHeader(userA.token));
    expect(
      list.body.progress.find((p: { lessonId: string }) => p.lessonId === "fundamentos.o-que-e-dinheiro.aula-4")
    ).toBeUndefined();
  });

  it("rejeita quizScore fora do intervalo e exerciseResponse gigante (400)", async () => {
    const badScore = await request(app)
      .put("/api/education/progress/fundamentos.o-que-e-dinheiro.aula-5")
      .set(authHeader(userA.token))
      .send({ completed: true, quizScore: -1 });
    expect(badScore.status).toBe(400);

    const badResponse = await request(app)
      .put("/api/education/progress/fundamentos.o-que-e-dinheiro.aula-5")
      .set(authHeader(userA.token))
      .send({ completed: true, exerciseResponse: "x".repeat(5001) });
    expect(badResponse.status).toBe(400);
  });

  it("usuário B não vê nem altera o progresso de A (IDOR)", async () => {
    await request(app)
      .put("/api/education/progress/fundamentos.reserva-emergencia.aula-1")
      .set(authHeader(userA.token))
      .send({ completed: true });

    const listB = await request(app).get("/api/education/progress").set(authHeader(userB.token));
    expect(
      listB.body.progress.find(
        (p: { lessonId: string }) => p.lessonId === "fundamentos.reserva-emergencia.aula-1"
      )
    ).toBeUndefined();

    // B "completando" a mesma lessonId cria a PRÓPRIA linha de B, não altera a de A
    await request(app)
      .put("/api/education/progress/fundamentos.reserva-emergencia.aula-1")
      .set(authHeader(userB.token))
      .send({ completed: false });

    const listA = await request(app).get("/api/education/progress").set(authHeader(userA.token));
    const aRow = listA.body.progress.find(
      (p: { lessonId: string }) => p.lessonId === "fundamentos.reserva-emergencia.aula-1"
    );
    expect(aRow.completed).toBe(true);
  });

  it("todas as rotas exigem autenticação (401 sem token)", async () => {
    const list = await request(app).get("/api/education/progress");
    expect(list.status).toBe(401);

    const upsert = await request(app)
      .put("/api/education/progress/fundamentos.o-que-e-dinheiro.aula-1")
      .send({ completed: true });
    expect(upsert.status).toBe(401);
  });
});
