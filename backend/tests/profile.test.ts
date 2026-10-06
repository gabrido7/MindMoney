import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { pool } from "../src/config/db";
import { registerTestUser, cleanupUser, authHeader } from "./helpers";

// Cabeçalhos reais de cada formato (o upload confere os bytes, não o
// Content-Type declarado), seguidos de lixo para parecer um arquivo de verdade.
const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG = Buffer.concat([PNG_HEADER, Buffer.from("png-body")]);
const PNG_2 = Buffer.concat([PNG_HEADER, Buffer.from("outra-foto")]);
const JPEG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.from("jpeg-body")]);
const WEBP = Buffer.concat([Buffer.from("RIFF"), Buffer.from([0x10, 0, 0, 0]), Buffer.from("WEBPVP8 body")]);

const keyFromUrl = (url: string) => url.split("/").pop()!;
const avatarRows = async (userId: number) => {
  const [rows] = await pool.query("SELECT file_key FROM user_avatars WHERE user_id = ?", [userId]);
  return (rows as { file_key: string }[]).length;
};

describe("Perfil -- foto", () => {
  it("usuário novo não tem avatar", async () => {
    const user = await registerTestUser("avatar-fresh");
    const res = await request(app).get("/api/users/me").set(authHeader(user.token));
    expect(res.body.user.avatarUrl).toBeNull();
    await cleanupUser(user.userId);
  });

  it("envia uma foto, ela aparece no perfil e é servida pelo banco", async () => {
    const user = await registerTestUser("avatar-upload");

    const res = await request(app)
      .post("/api/users/me/avatar")
      .set(authHeader(user.token))
      .attach("avatar", PNG, { filename: "foto.png", contentType: "image/png" });

    expect(res.status).toBe(200);
    expect(res.body.user.avatarUrl).toMatch(/^\/uploads\/avatars\/[0-9a-f-]{36}$/);

    // a imagem é pública (o <img> não manda token) e volta byte a byte igual
    const img = await request(app)
      .get(res.body.user.avatarUrl)
      .buffer(true)
      .parse((r, cb) => {
        const chunks: Buffer[] = [];
        r.on("data", (c: Buffer) => chunks.push(c));
        r.on("end", () => cb(null, Buffer.concat(chunks)));
      });
    expect(img.status).toBe(200);
    expect(img.headers["content-type"]).toBe("image/png");
    expect(img.headers["cross-origin-resource-policy"]).toBe("cross-origin");
    expect(img.headers["x-content-type-options"]).toBe("nosniff");
    expect(Buffer.compare(img.body as Buffer, PNG)).toBe(0);

    await cleanupUser(user.userId);
  });

  it.each([
    ["jpeg", JPEG, "image/jpeg"],
    ["webp", WEBP, "image/webp"],
  ])("aceita %s e guarda o tipo real", async (_name, bytes, mime) => {
    const user = await registerTestUser("avatar-types");
    const res = await request(app)
      .post("/api/users/me/avatar")
      .set(authHeader(user.token))
      .attach("avatar", bytes, { filename: "foto", contentType: mime });
    expect(res.status).toBe(200);

    const img = await request(app).get(res.body.user.avatarUrl);
    expect(img.headers["content-type"]).toBe(mime);
    await cleanupUser(user.userId);
  });

  it("rejeita formato de arquivo não suportado", async () => {
    const user = await registerTestUser("avatar-bad-type");

    const res = await request(app)
      .post("/api/users/me/avatar")
      .set(authHeader(user.token))
      .attach("avatar", Buffer.from("not an image"), { filename: "arquivo.txt", contentType: "text/plain" });

    expect(res.status).toBe(400);
    await cleanupUser(user.userId);
  });

  it("rejeita arquivo que declara image/png mas não é uma imagem de verdade", async () => {
    const user = await registerTestUser("avatar-fake");

    const res = await request(app)
      .post("/api/users/me/avatar")
      .set(authHeader(user.token))
      .attach("avatar", Buffer.from("<script>alert(1)</script>"), { filename: "foto.png", contentType: "image/png" });

    expect(res.status).toBe(400);
    expect(await avatarRows(user.userId)).toBe(0);
    const me = await request(app).get("/api/users/me").set(authHeader(user.token));
    expect(me.body.user.avatarUrl).toBeNull();
    await cleanupUser(user.userId);
  });

  it("rejeita arquivo maior que 2MB", async () => {
    const user = await registerTestUser("avatar-big");
    const big = Buffer.concat([PNG, Buffer.alloc(2 * 1024 * 1024 + 10)]);
    const res = await request(app)
      .post("/api/users/me/avatar")
      .set(authHeader(user.token))
      .attach("avatar", big, { filename: "grande.png", contentType: "image/png" });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
    expect(await avatarRows(user.userId)).toBe(0);
    await cleanupUser(user.userId);
  });

  it("enviar uma nova foto substitui a antiga (apaga a anterior do banco)", async () => {
    const user = await registerTestUser("avatar-replace");

    const first = await request(app)
      .post("/api/users/me/avatar")
      .set(authHeader(user.token))
      .attach("avatar", PNG, { filename: "a.png", contentType: "image/png" });
    const firstKey = keyFromUrl(first.body.user.avatarUrl);

    const second = await request(app)
      .post("/api/users/me/avatar")
      .set(authHeader(user.token))
      .attach("avatar", PNG_2, { filename: "b.png", contentType: "image/png" });
    const secondKey = keyFromUrl(second.body.user.avatarUrl);

    expect(secondKey).not.toBe(firstKey);
    expect(await avatarRows(user.userId)).toBe(1);
    expect((await request(app).get(`/uploads/avatars/${firstKey}`)).status).toBe(404);
    expect((await request(app).get(`/uploads/avatars/${secondKey}`)).status).toBe(200);

    await cleanupUser(user.userId);
  });

  it("remove a foto", async () => {
    const user = await registerTestUser("avatar-remove");

    const upload = await request(app)
      .post("/api/users/me/avatar")
      .set(authHeader(user.token))
      .attach("avatar", PNG, { filename: "foto.png", contentType: "image/png" });
    const key = keyFromUrl(upload.body.user.avatarUrl);

    const remove = await request(app).delete("/api/users/me/avatar").set(authHeader(user.token));
    expect(remove.status).toBe(200);
    expect(remove.body.user.avatarUrl).toBeNull();
    expect(await avatarRows(user.userId)).toBe(0);
    expect((await request(app).get(`/uploads/avatars/${key}`)).status).toBe(404);

    await cleanupUser(user.userId);
  });

  it("excluir a conta apaga a foto junto", async () => {
    const user = await registerTestUser("avatar-delete-account");
    const upload = await request(app)
      .post("/api/users/me/avatar")
      .set(authHeader(user.token))
      .attach("avatar", PNG, { filename: "foto.png", contentType: "image/png" });
    const key = keyFromUrl(upload.body.user.avatarUrl);

    const del = await request(app).delete("/api/users/me").set(authHeader(user.token)).send({ password: "senha12345" });
    expect(del.status).toBe(204);
    expect((await request(app).get(`/uploads/avatars/${key}`)).status).toBe(404);
  });

  it("chave fora do formato (inclusive nomes de arquivo antigos) devolve 404", async () => {
    expect((await request(app).get("/uploads/avatars/abc.png")).status).toBe(404);
    expect((await request(app).get("/uploads/avatars/00000000-0000-0000-0000-000000000000")).status).toBe(404);
  });
});

describe("Perfil -- senha alterada", () => {
  it("passwordChangedAt começa nulo e é preenchido ao trocar a senha", async () => {
    const user = await registerTestUser("pwd-changed");

    const before = await request(app).get("/api/users/me").set(authHeader(user.token));
    expect(before.body.user.passwordChangedAt).toBeNull();

    await request(app)
      .put("/api/users/me/password")
      .set(authHeader(user.token))
      .send({ currentPassword: "senha12345", newPassword: "novaSenha123" });

    // troca de senha revoga o refresh token desta sessão, mas o access
    // token (15min) continua válido para esta chamada de verificação
    const after = await request(app).get("/api/users/me").set(authHeader(user.token));
    expect(after.body.user.passwordChangedAt).not.toBeNull();

    await cleanupUser(user.userId);
  });
});

describe("Perfil -- sessões ativas", () => {
  it("lista a sessão criada no cadastro, marcada como atual", async () => {
    const user = await registerTestUser("sessions-list");

    const res = await request(app)
      .get("/api/users/me/sessions")
      .set(authHeader(user.token))
      .set("X-Refresh-Token", user.refreshToken);

    expect(res.status).toBe(200);
    expect(res.body.sessions).toHaveLength(1);
    expect(res.body.sessions[0]).toMatchObject({ current: true });

    await cleanupUser(user.userId);
  });

  it("login cria uma segunda sessão -- duas linhas na lista", async () => {
    const user = await registerTestUser("sessions-multi");
    await request(app).post("/api/auth/login").send({ email: user.email, password: "senha12345" });

    const res = await request(app).get("/api/users/me/sessions").set(authHeader(user.token));
    expect(res.body.sessions).toHaveLength(2);

    await cleanupUser(user.userId);
  });

  it("encerra uma sessão específica pelo id", async () => {
    const user = await registerTestUser("sessions-revoke-one");
    await request(app).post("/api/auth/login").send({ email: user.email, password: "senha12345" });

    const list = await request(app).get("/api/users/me/sessions").set(authHeader(user.token));
    expect(list.body.sessions).toHaveLength(2);

    const revoke = await request(app)
      .delete(`/api/users/me/sessions/${list.body.sessions[0].id}`)
      .set(authHeader(user.token));
    expect(revoke.status).toBe(204);

    const after = await request(app).get("/api/users/me/sessions").set(authHeader(user.token));
    expect(after.body.sessions).toHaveLength(1);

    await cleanupUser(user.userId);
  });

  it("encerra todas as outras sessões, preservando a atual", async () => {
    const user = await registerTestUser("sessions-revoke-others");
    await request(app).post("/api/auth/login").send({ email: user.email, password: "senha12345" });
    await request(app).post("/api/auth/login").send({ email: user.email, password: "senha12345" });

    const before = await request(app).get("/api/users/me/sessions").set(authHeader(user.token));
    expect(before.body.sessions).toHaveLength(3);

    await request(app)
      .delete("/api/users/me/sessions/other")
      .set(authHeader(user.token))
      .set("X-Refresh-Token", user.refreshToken);

    const after = await request(app)
      .get("/api/users/me/sessions")
      .set(authHeader(user.token))
      .set("X-Refresh-Token", user.refreshToken);
    expect(after.body.sessions).toHaveLength(1);
    expect(after.body.sessions[0].current).toBe(true);

    await cleanupUser(user.userId);
  });

  it("usuário B não consegue encerrar sessão de A (IDOR)", async () => {
    const userA = await registerTestUser("sessions-idor-a");
    const userB = await registerTestUser("sessions-idor-b");

    const listA = await request(app).get("/api/users/me/sessions").set(authHeader(userA.token));
    const sessionId = listA.body.sessions[0].id;

    const attempt = await request(app)
      .delete(`/api/users/me/sessions/${sessionId}`)
      .set(authHeader(userB.token));
    expect(attempt.status).toBe(404);

    const stillThere = await request(app).get("/api/users/me/sessions").set(authHeader(userA.token));
    expect(stillThere.body.sessions).toHaveLength(1);

    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("exige autenticação (401 sem token)", async () => {
    const res = await request(app).get("/api/users/me/sessions");
    expect(res.status).toBe(401);
  });
});

describe("Perfil -- preferências de notificação", () => {
  it("começam todas ativadas por padrão", async () => {
    const user = await registerTestUser("prefs-default");
    const res = await request(app).get("/api/users/me/notification-preferences").set(authHeader(user.token));

    expect(res.status).toBe(200);
    expect(res.body.preferences).toEqual({
      limit_exceeded: true,
      goal_achieved: true,
      objective_deadline: true,
      category_budget_exceeded: true,
      onboarding_pending: true,
      debt_due_date: true,
      debt_paid_off: true,
      net_worth_positive: true,
    });

    await cleanupUser(user.userId);
  });

  it("desativa um tipo e o valor persiste", async () => {
    const user = await registerTestUser("prefs-update");

    const update = await request(app)
      .put("/api/users/me/notification-preferences/limit_exceeded")
      .set(authHeader(user.token))
      .send({ enabled: false });

    expect(update.status).toBe(200);
    expect(update.body.preferences.limit_exceeded).toBe(false);
    expect(update.body.preferences.goal_achieved).toBe(true);

    const reread = await request(app).get("/api/users/me/notification-preferences").set(authHeader(user.token));
    expect(reread.body.preferences.limit_exceeded).toBe(false);

    await cleanupUser(user.userId);
  });

  it("rejeita um tipo de notificação inexistente", async () => {
    const user = await registerTestUser("prefs-invalid-type");

    const res = await request(app)
      .put("/api/users/me/notification-preferences/tipo_invalido")
      .set(authHeader(user.token))
      .send({ enabled: false });

    expect(res.status).toBe(404);
    await cleanupUser(user.userId);
  });
});

describe("Perfil -- perfil financeiro", () => {
  it("usuário novo não tem perfil financeiro preenchido e não recebe recomendações", async () => {
    const user = await registerTestUser("finprofile-fresh");
    const res = await request(app).get("/api/users/me/financial-profile").set(authHeader(user.token));

    expect(res.status).toBe(200);
    expect(res.body.profile).toMatchObject({
      experienceLevel: null,
      incomeRange: null,
      priorities: [],
      recommendations: [],
    });

    await cleanupUser(user.userId);
  });

  it("salva o perfil e passa a gerar recomendações baseadas nas respostas", async () => {
    const user = await registerTestUser("finprofile-fill");

    const update = await request(app)
      .put("/api/users/me/financial-profile")
      .set(authHeader(user.token))
      .send({
        experienceLevel: "iniciante",
        incomeRange: "2k_5k",
        priorities: ["reserva_emergencia", "investir"],
      });

    expect(update.status).toBe(200);
    expect(update.body.profile.experienceLevel).toBe("iniciante");
    expect(update.body.profile.priorities).toEqual(["reserva_emergencia", "investir"]);

    const ids = update.body.profile.recommendations.map((r: { id: string }) => r.id);
    // prioriza reserva sem ter objetivo de reserva -> criar reserva; nenhum objetivo cadastrado -> criar primeira meta
    // (recomendação de trilha saiu daqui -- agora é a Trilha Estratégica na própria Educação Financeira, ver strategicPlan.ts no frontend)
    expect(ids).toEqual(expect.arrayContaining(["criar-reserva", "criar-primeira-meta"]));

    await cleanupUser(user.userId);
  });

  it("rejeita prioridade inválida", async () => {
    const user = await registerTestUser("finprofile-invalid");

    const res = await request(app)
      .put("/api/users/me/financial-profile")
      .set(authHeader(user.token))
      .send({ experienceLevel: null, incomeRange: null, priorities: ["nao-existe"] });

    expect(res.status).toBe(400);
    await cleanupUser(user.userId);
  });

  it("salva o perfil aos pedaços -- um PUT parcial não apaga o que outro já salvou (onboarding v2)", async () => {
    const user = await registerTestUser("finprofile-partial");

    const step1 = await request(app)
      .put("/api/users/me/financial-profile")
      .set(authHeader(user.token))
      .send({ priorities: ["organizar_financas", "controlar_gastos"] });
    expect(step1.status).toBe(200);
    expect(step1.body.profile.priorities).toEqual(["organizar_financas", "controlar_gastos"]);

    const step2 = await request(app)
      .put("/api/users/me/financial-profile")
      .set(authHeader(user.token))
      .send({ experienceLevel: "intermediario", financialSituation: "aperta_mas_consigo" });
    expect(step2.status).toBe(200);
    // O que o passo 1 salvou continua lá -- o passo 2 só mandou campos novos.
    expect(step2.body.profile.priorities).toEqual(["organizar_financas", "controlar_gastos"]);
    expect(step2.body.profile.experienceLevel).toBe("intermediario");
    expect(step2.body.profile.financialSituation).toBe("aperta_mas_consigo");

    await cleanupUser(user.userId);
  });

  it("salva renda variável, fontes de renda e hábitos, e calcula o perfil comportamental", async () => {
    const user = await registerTestUser("finprofile-habits");

    const res = await request(app)
      .put("/api/users/me/financial-profile")
      .set(authHeader(user.token))
      .send({
        incomeVariable: true,
        incomeMin: 2000,
        incomeMax: 4500,
        incomeSources: ["Salário", "Freelance"],
        habits: {
          tracksSpending: "sim",
          overspends: "nunca",
          creditCardUsage: "nao",
          investsRegularly: "regularmente",
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.profile).toMatchObject({
      incomeVariable: true,
      incomeMin: 2000,
      incomeMax: 4500,
      incomeSources: ["Salário", "Freelance"],
    });
    expect(res.body.profile.behaviorProfile).toMatchObject({ label: "Consciente" });

    await cleanupUser(user.userId);
  });

  it("rejeita resposta de hábito fora do enum", async () => {
    const user = await registerTestUser("finprofile-invalid-habit");

    const res = await request(app)
      .put("/api/users/me/financial-profile")
      .set(authHeader(user.token))
      .send({ habits: { tracksSpending: "sempre", overspends: "nunca", creditCardUsage: "nao", investsRegularly: "nunca" } });

    expect(res.status).toBe(400);
    await cleanupUser(user.userId);
  });
});

describe("Onboarding -- conclusão e etapas puladas", () => {
  it("conclui sem pular nada -- não gera notificação de pendência", async () => {
    const user = await registerTestUser("onboarding-complete");

    const res = await request(app)
      .put("/api/users/me/onboarding")
      .set(authHeader(user.token))
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.user.onboardingCompletedAt).toBeTruthy();

    const notifications = await request(app).get("/api/notifications").set(authHeader(user.token));
    expect(notifications.body.notifications.find((n: { type: string }) => n.type === "onboarding_pending")).toBeFalsy();

    await cleanupUser(user.userId);
  });

  it("pular etapas gera uma notificação real listando o que falta", async () => {
    const user = await registerTestUser("onboarding-skip");

    const res = await request(app)
      .put("/api/users/me/onboarding")
      .set(authHeader(user.token))
      .send({ skippedSteps: ["renda", "dividas"] });

    expect(res.status).toBe(200);

    const notifications = await request(app).get("/api/notifications").set(authHeader(user.token));
    const found = notifications.body.notifications.find((n: { type: string }) => n.type === "onboarding_pending");
    expect(found).toBeTruthy();
    expect(found.message).toContain("Renda");
    expect(found.message).toContain("Dívidas");

    await cleanupUser(user.userId);
  });

  it("é idempotente -- concluir de novo não falha nem duplica notificação", async () => {
    const user = await registerTestUser("onboarding-idempotent");

    await request(app)
      .put("/api/users/me/onboarding")
      .set(authHeader(user.token))
      .send({ skippedSteps: ["habitos"] });

    const second = await request(app)
      .put("/api/users/me/onboarding")
      .set(authHeader(user.token))
      .send({ skippedSteps: ["habitos"] });
    expect(second.status).toBe(200);

    const notifications = await request(app).get("/api/notifications").set(authHeader(user.token));
    const matches = notifications.body.notifications.filter((n: { type: string }) => n.type === "onboarding_pending");
    expect(matches).toHaveLength(1);

    await cleanupUser(user.userId);
  });

  it("rejeita corpo com skippedSteps fora do formato esperado", async () => {
    const user = await registerTestUser("onboarding-invalid");

    const res = await request(app)
      .put("/api/users/me/onboarding")
      .set(authHeader(user.token))
      .send({ skippedSteps: "renda" });

    expect(res.status).toBe(400);
    await cleanupUser(user.userId);
  });
});
