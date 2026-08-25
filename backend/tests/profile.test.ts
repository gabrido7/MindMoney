import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import fs from "node:fs";
import path from "node:path";
import { app } from "../src/app";
import { registerTestUser, cleanupUser, authHeader } from "./helpers";

const AVATAR_DIR = path.join(__dirname, "..", "uploads", "avatars");
const uploadedFiles: string[] = [];

afterEach(() => {
  for (const filename of uploadedFiles.splice(0)) {
    try {
      fs.unlinkSync(path.join(AVATAR_DIR, filename));
    } catch {
      // já removido pelo próprio endpoint (setAvatar/removeAvatar) -- ok
    }
  }
});

const filenameFromUrl = (url: string) => url.split("/").pop()!;

describe("Perfil -- foto", () => {
  it("usuário novo não tem avatar", async () => {
    const user = await registerTestUser("avatar-fresh");
    const res = await request(app).get("/api/users/me").set(authHeader(user.token));
    expect(res.body.user.avatarUrl).toBeNull();
    await cleanupUser(user.userId);
  });

  it("envia uma foto e ela aparece no perfil", async () => {
    const user = await registerTestUser("avatar-upload");

    const res = await request(app)
      .post("/api/users/me/avatar")
      .set(authHeader(user.token))
      .attach("avatar", Buffer.from("fake-png-bytes"), { filename: "foto.png", contentType: "image/png" });

    expect(res.status).toBe(200);
    expect(res.body.user.avatarUrl).toMatch(/^\/uploads\/avatars\//);
    uploadedFiles.push(filenameFromUrl(res.body.user.avatarUrl));

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

  it("enviar uma nova foto substitui a antiga (apaga o arquivo anterior do disco)", async () => {
    const user = await registerTestUser("avatar-replace");

    const first = await request(app)
      .post("/api/users/me/avatar")
      .set(authHeader(user.token))
      .attach("avatar", Buffer.from("primeira-foto"), { filename: "a.png", contentType: "image/png" });
    const firstFilename = filenameFromUrl(first.body.user.avatarUrl);

    const second = await request(app)
      .post("/api/users/me/avatar")
      .set(authHeader(user.token))
      .attach("avatar", Buffer.from("segunda-foto"), { filename: "b.png", contentType: "image/png" });
    const secondFilename = filenameFromUrl(second.body.user.avatarUrl);
    uploadedFiles.push(secondFilename);

    expect(secondFilename).not.toBe(firstFilename);
    expect(fs.existsSync(path.join(AVATAR_DIR, firstFilename))).toBe(false);
    expect(fs.existsSync(path.join(AVATAR_DIR, secondFilename))).toBe(true);

    await cleanupUser(user.userId);
  });

  it("remove a foto", async () => {
    const user = await registerTestUser("avatar-remove");

    const upload = await request(app)
      .post("/api/users/me/avatar")
      .set(authHeader(user.token))
      .attach("avatar", Buffer.from("foto"), { filename: "foto.png", contentType: "image/png" });
    const filename = filenameFromUrl(upload.body.user.avatarUrl);

    const remove = await request(app).delete("/api/users/me/avatar").set(authHeader(user.token));
    expect(remove.status).toBe(200);
    expect(remove.body.user.avatarUrl).toBeNull();
    expect(fs.existsSync(path.join(AVATAR_DIR, filename))).toBe(false);

    await cleanupUser(user.userId);
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
    // iniciante -> trilha fundamentos; prioriza reserva sem ter objetivo de reserva -> criar reserva;
    // prioriza investir -> trilha investimentos; sem meta do mês -> definir meta mensal
    expect(ids).toEqual(
      expect.arrayContaining(["trilha-fundamentos", "criar-reserva", "trilha-investimentos", "definir-meta-mensal"])
    );

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
});
