import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { registerTestUser, cleanupUser, authHeader } from "./helpers";

describe("Ativos (patrimônio)", () => {
  it("lista vazia para um usuário novo", async () => {
    const user = await registerTestUser("assets-fresh");
    const res = await request(app).get("/api/assets").set(authHeader(user.token));

    expect(res.status).toBe(200);
    expect(res.body.assets).toEqual([]);

    await cleanupUser(user.userId);
  });

  it("cria um ativo com valor inicial e ele aparece na lista com currentValue certo", async () => {
    const user = await registerTestUser("assets-create");

    const res = await request(app)
      .post("/api/assets")
      .set(authHeader(user.token))
      .send({ type: "investimento", name: "Poupança Itaú", initialValue: 5000, valuedAt: "2026-08-01" });

    expect(res.status).toBe(201);
    expect(res.body.asset).toMatchObject({
      type: "investimento",
      name: "Poupança Itaú",
      currentValue: 5000,
      valuedAt: "2026-08-01",
    });

    const list = await request(app).get("/api/assets").set(authHeader(user.token));
    expect(list.body.assets).toHaveLength(1);
    expect(list.body.assets[0].currentValue).toBe(5000);

    await cleanupUser(user.userId);
  });

  it("rejeita valor inicial negativo e tipo fora do enum", async () => {
    const user = await registerTestUser("assets-invalid");

    const badValue = await request(app)
      .post("/api/assets")
      .set(authHeader(user.token))
      .send({ type: "investimento", name: "Teste", initialValue: -10, valuedAt: "2026-08-01" });
    expect(badValue.status).toBe(400);

    const badType = await request(app)
      .post("/api/assets")
      .set(authHeader(user.token))
      .send({ type: "nao-existe", name: "Teste", initialValue: 100, valuedAt: "2026-08-01" });
    expect(badType.status).toBe(400);

    await cleanupUser(user.userId);
  });

  it("registrar uma atualização de saldo recalcula o currentValue pro valor mais recente", async () => {
    const user = await registerTestUser("assets-update-value");

    const create = await request(app)
      .post("/api/assets")
      .set(authHeader(user.token))
      .send({ type: "investimento", name: "Tesouro Direto", initialValue: 1000, valuedAt: "2026-06-01" });
    const assetId = create.body.asset.id;

    const update = await request(app)
      .post(`/api/assets/${assetId}/updates`)
      .set(authHeader(user.token))
      .send({ value: 1200, valuedAt: "2026-08-01" });

    expect(update.status).toBe(201);
    expect(update.body.asset.currentValue).toBe(1200);
    expect(update.body.asset.valuedAt).toBe("2026-08-01");

    const updates = await request(app).get(`/api/assets/${assetId}/updates`).set(authHeader(user.token));
    expect(updates.body.updates).toHaveLength(2);

    await cleanupUser(user.userId);
  });

  it("editar uma atualização de saldo recalcula o currentValue", async () => {
    const user = await registerTestUser("assets-edit-value");

    const create = await request(app)
      .post("/api/assets")
      .set(authHeader(user.token))
      .send({ type: "investimento", name: "CDB", initialValue: 1000, valuedAt: "2026-08-01" });
    const assetId = create.body.asset.id;

    const list = await request(app).get(`/api/assets/${assetId}/updates`).set(authHeader(user.token));
    const updateId = list.body.updates[0].id;

    const edited = await request(app)
      .put(`/api/assets/${assetId}/updates/${updateId}`)
      .set(authHeader(user.token))
      .send({ value: 1500, valuedAt: "2026-08-01" });

    expect(edited.status).toBe(200);
    expect(edited.body.asset.currentValue).toBe(1500);

    await cleanupUser(user.userId);
  });

  it("remover uma atualização de saldo recalcula o currentValue pro registro restante mais recente", async () => {
    const user = await registerTestUser("assets-remove-value");

    const create = await request(app)
      .post("/api/assets")
      .set(authHeader(user.token))
      .send({ type: "investimento", name: "Ações", initialValue: 1000, valuedAt: "2026-06-01" });
    const assetId = create.body.asset.id;

    await request(app)
      .post(`/api/assets/${assetId}/updates`)
      .set(authHeader(user.token))
      .send({ value: 2000, valuedAt: "2026-08-01" });

    const list = await request(app).get(`/api/assets/${assetId}/updates`).set(authHeader(user.token));
    const latestUpdateId = list.body.updates[0].id; // mais recente primeiro (2026-08-01, valor 2000)

    const removed = await request(app)
      .delete(`/api/assets/${assetId}/updates/${latestUpdateId}`)
      .set(authHeader(user.token));

    expect(removed.status).toBe(200);
    expect(removed.body.asset.currentValue).toBe(1000); // volta pro valor inicial (2026-06-01)

    await cleanupUser(user.userId);
  });

  it("remove um ativo e apaga o histórico de valor em cascata", async () => {
    const user = await registerTestUser("assets-remove");

    const create = await request(app)
      .post("/api/assets")
      .set(authHeader(user.token))
      .send({ type: "veiculo", name: "Carro", initialValue: 30000, valuedAt: "2026-08-01" });
    const assetId = create.body.asset.id;

    const remove = await request(app).delete(`/api/assets/${assetId}`).set(authHeader(user.token));
    expect(remove.status).toBe(204);

    const list = await request(app).get("/api/assets").set(authHeader(user.token));
    expect(list.body.assets).toEqual([]);

    const updates = await request(app).get(`/api/assets/${assetId}/updates`).set(authHeader(user.token));
    expect(updates.status).toBe(404); // ativo já não existe mais pra esse usuário

    await cleanupUser(user.userId);
  });

  it("remover um ativo inexistente devolve 404", async () => {
    const user = await registerTestUser("assets-remove-missing");
    const res = await request(app).delete("/api/assets/999999999").set(authHeader(user.token));
    expect(res.status).toBe(404);
    await cleanupUser(user.userId);
  });

  it("histórico global de atualizações de valor traz o nome do ativo, só do próprio usuário", async () => {
    const user = await registerTestUser("assets-history");

    const assetA = await request(app)
      .post("/api/assets")
      .set(authHeader(user.token))
      .send({ type: "investimento", name: "Conta A", initialValue: 100, valuedAt: "2026-08-01" });
    const assetB = await request(app)
      .post("/api/assets")
      .set(authHeader(user.token))
      .send({ type: "imovel", name: "Conta B", initialValue: 200, valuedAt: "2026-08-02" });

    const res = await request(app).get("/api/assets/updates").set(authHeader(user.token));
    expect(res.status).toBe(200);
    expect(res.body.updates).toHaveLength(2);
    const names = res.body.updates.map((u: { assetName: string }) => u.assetName).sort();
    expect(names).toEqual(["Conta A", "Conta B"]);
    void assetA;
    void assetB;

    await cleanupUser(user.userId);
  });

  it("usuário B não vê, atualiza nem apaga ativo de A (IDOR)", async () => {
    const userA = await registerTestUser("assets-idor-a");
    const userB = await registerTestUser("assets-idor-b");

    const created = await request(app)
      .post("/api/assets")
      .set(authHeader(userA.token))
      .send({ type: "imovel", name: "Apê de A", initialValue: 300000, valuedAt: "2026-08-01" });
    const assetId = created.body.asset.id;

    const listB = await request(app).get("/api/assets").set(authHeader(userB.token));
    expect(listB.body.assets.find((a: { id: number }) => a.id === assetId)).toBeUndefined();

    const updateB = await request(app)
      .post(`/api/assets/${assetId}/updates`)
      .set(authHeader(userB.token))
      .send({ value: 1, valuedAt: "2026-08-10" });
    expect(updateB.status).toBe(404);

    const deleteB = await request(app).delete(`/api/assets/${assetId}`).set(authHeader(userB.token));
    expect(deleteB.status).toBe(404);

    await cleanupUser(userA.userId);
    await cleanupUser(userB.userId);
  });

  it("todas as rotas exigem autenticação (401 sem token)", async () => {
    const list = await request(app).get("/api/assets");
    expect(list.status).toBe(401);

    const create = await request(app)
      .post("/api/assets")
      .send({ type: "outro", name: "x", initialValue: 1, valuedAt: "2026-08-01" });
    expect(create.status).toBe(401);
  });
});
