import { AppError } from "../../utils/AppError";
import {
  assetsRepository,
  type AssetWithCurrentValueRow,
  type AssetValueUpdateRow,
  type AssetValueUpdateWithAssetNameRow,
} from "./assets.repository";
import { gamificationService, type GamificationResult } from "../gamification/gamification.service";
import { notificationsService } from "../notifications/notifications.service";
import type { CreateAssetInput, AssetValueUpdateBodyInput } from "./assets.validation";

function enrich(row: AssetWithCurrentValueRow) {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    currentValue: row.current_value !== null ? Number(row.current_value) : 0,
    valuedAt: row.valued_at,
    createdAt: row.created_at,
  };
}

function enrichValueUpdate(row: AssetValueUpdateRow) {
  return {
    id: row.id,
    value: Number(row.value),
    valuedAt: row.valued_at,
    note: row.note,
    createdAt: row.created_at,
  };
}

function enrichValueUpdateWithAssetName(row: AssetValueUpdateWithAssetNameRow) {
  return { ...enrichValueUpdate(row), assetName: row.asset_name };
}

export type EnrichedAsset = ReturnType<typeof enrich>;
export type EnrichedAssetValueUpdate = ReturnType<typeof enrichValueUpdate>;
export type EnrichedAssetValueUpdateWithAssetName = ReturnType<typeof enrichValueUpdateWithAssetName>;

async function getEnriched(assetId: number, userId: number): Promise<EnrichedAsset> {
  const row = await assetsRepository.findByIdAndUser(assetId, userId);
  if (!row) throw AppError.notFound("Ativo não encontrado.");
  const current = await assetsRepository.currentValue(assetId);
  return enrich({ ...row, current_value: current ? String(current.value) : null, valued_at: current?.valuedAt ?? null });
}

/**
 * Qualquer mutação de ativo pode ser o momento em que o patrimônio líquido
 * (ativos - dívidas) vira positivo pela primeira vez -- diferente de dívida
 * (que só sobe ao criar/só desce ao pagar), o valor de um ativo pode subir
 * ou descer livremente, então não dá pra restringir a checagem a "só numa
 * mutação específica" como foi possível pra dívida quitada. checkFinancialAchievements
 * já é barato (idempotente via unlockAchievement) e não gera XP fantasma.
 */
async function checkNetWorthAchievement(userId: number): Promise<GamificationResult> {
  const gamification = await gamificationService.checkFinancialAchievements(userId);
  if (gamification.newAchievements.some((a) => a.id === "patrimonio-no-azul")) {
    await notificationsService.notifyNetWorthPositive(userId);
  }
  return gamification;
}

export const assetsService = {
  async list(userId: number): Promise<EnrichedAsset[]> {
    const rows = await assetsRepository.listByUser(userId);
    return rows.map(enrich);
  },

  async create(userId: number, input: CreateAssetInput): Promise<{ asset: EnrichedAsset; gamification: GamificationResult }> {
    const id = await assetsRepository.create(userId, { type: input.type, name: input.name });
    await assetsRepository.addValueUpdate(id, {
      value: input.initialValue,
      valuedAt: input.valuedAt,
      note: undefined,
    });
    const [asset, gamification] = await Promise.all([getEnriched(id, userId), checkNetWorthAchievement(userId)]);
    return { asset, gamification };
  },

  async remove(userId: number, id: number): Promise<void> {
    const removed = await assetsRepository.remove(id, userId);
    if (!removed) throw AppError.notFound("Ativo não encontrado.");
  },

  async listValueUpdates(userId: number, assetId: number): Promise<EnrichedAssetValueUpdate[]> {
    const asset = await assetsRepository.findByIdAndUser(assetId, userId);
    if (!asset) throw AppError.notFound("Ativo não encontrado.");
    const rows = await assetsRepository.listValueUpdates(assetId);
    return rows.map(enrichValueUpdate);
  },

  /** Histórico global: atualizações de valor de todos os ativos do usuário, mais recentes primeiro. */
  async listAllValueUpdates(userId: number): Promise<EnrichedAssetValueUpdateWithAssetName[]> {
    const rows = await assetsRepository.listAllValueUpdatesByUser(userId);
    return rows.map(enrichValueUpdateWithAssetName);
  },

  async addValueUpdate(
    userId: number,
    assetId: number,
    input: AssetValueUpdateBodyInput
  ): Promise<{ asset: EnrichedAsset; gamification: GamificationResult }> {
    const asset = await assetsRepository.findByIdAndUser(assetId, userId);
    if (!asset) throw AppError.notFound("Ativo não encontrado.");

    await assetsRepository.addValueUpdate(assetId, input);
    const [enriched, gamification] = await Promise.all([
      getEnriched(assetId, userId),
      checkNetWorthAchievement(userId),
    ]);
    return { asset: enriched, gamification };
  },

  async updateValueUpdate(
    userId: number,
    assetId: number,
    updateId: number,
    input: AssetValueUpdateBodyInput
  ): Promise<{ asset: EnrichedAsset; gamification: GamificationResult }> {
    const asset = await assetsRepository.findByIdAndUser(assetId, userId);
    if (!asset) throw AppError.notFound("Ativo não encontrado.");

    const existing = await assetsRepository.findValueUpdateByIdAndAsset(updateId, assetId);
    if (!existing) throw AppError.notFound("Registro de valor não encontrado.");

    await assetsRepository.updateValueUpdate(updateId, assetId, input);
    const [enriched, gamification] = await Promise.all([
      getEnriched(assetId, userId),
      checkNetWorthAchievement(userId),
    ]);
    return { asset: enriched, gamification };
  },

  async removeValueUpdate(
    userId: number,
    assetId: number,
    updateId: number
  ): Promise<{ asset: EnrichedAsset; gamification: GamificationResult }> {
    const asset = await assetsRepository.findByIdAndUser(assetId, userId);
    if (!asset) throw AppError.notFound("Ativo não encontrado.");

    const existing = await assetsRepository.findValueUpdateByIdAndAsset(updateId, assetId);
    if (!existing) throw AppError.notFound("Registro de valor não encontrado.");

    await assetsRepository.removeValueUpdate(updateId, assetId);
    const [enriched, gamification] = await Promise.all([
      getEnriched(assetId, userId),
      checkNetWorthAchievement(userId),
    ]);
    return { asset: enriched, gamification };
  },
};
