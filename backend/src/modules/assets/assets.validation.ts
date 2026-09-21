import { z } from "zod";

// "conta_corrente"/"poupanca" saíram daqui -- viraram Accounts (migration
// 022), com saldo derivado das transações reais em vez de valor digitado à
// mão. O que sobra aqui não tem ledger de transações no app, então continua
// sendo valor logado manualmente, que já é a coisa certa pra esses tipos.
export const ASSET_TYPES = ["investimento", "imovel", "veiculo", "outro"] as const;

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const createAssetSchema = z.object({
  type: z.enum(ASSET_TYPES),
  name: z.string().trim().min(1, "Nome é obrigatório").max(120),
  initialValue: z.coerce.number().nonnegative("initialValue não pode ser negativo"),
  valuedAt: z.string().regex(DATE_REGEX, "Data deve estar no formato YYYY-MM-DD"),
});

export const assetValueUpdateBodySchema = z.object({
  value: z.coerce.number().nonnegative("O valor não pode ser negativo"),
  valuedAt: z.string().regex(DATE_REGEX, "Data deve estar no formato YYYY-MM-DD"),
  note: z.string().trim().max(255).optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type AssetType = (typeof ASSET_TYPES)[number];
export type AssetValueUpdateBodyInput = z.infer<typeof assetValueUpdateBodySchema>;
