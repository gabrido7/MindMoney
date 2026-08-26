import { z } from "zod";

export const PRIORITY_OPTIONS = [
  "reserva_emergencia",
  "quitar_dividas",
  "investir",
  "comprar_um_bem",
  "aposentadoria",
  "educacao",
  // Adicionados no onboarding v2 -- motivações de "por que você está aqui",
  // um universo um pouco diferente das prioridades financeiras originais,
  // mas guardadas na mesma coluna (mesma cardinalidade curta, mesmo uso).
  "organizar_financas",
  "alcancar_objetivos",
  "controlar_gastos",
  "construir_patrimonio",
] as const;

export const FINANCIAL_SITUATION_OPTIONS = [
  "tudo_controle",
  "aperta_mas_consigo",
  "vivo_no_limite",
  "endividado",
] as const;

const habitsSchema = z.object({
  tracksSpending: z.enum(["sim", "as_vezes", "nao"]),
  overspends: z.enum(["nunca", "as_vezes", "frequentemente"]),
  creditCardUsage: z.enum(["nao", "pouco", "frequentemente"]),
  investsRegularly: z.enum(["nunca", "as_vezes", "regularmente"]),
});

/**
 * Todos os campos são opcionais de propósito: o onboarding salva o perfil
 * aos pedaços (motivação num passo, renda em outro, hábitos em outro),
 * então cada PUT só manda o que aquele passo perguntou -- não dá pra exigir
 * o objeto inteiro sem forçar o cliente a sempre reenviar tudo que já foi
 * salvo antes. financialProfile.repository.patch() só atualiza as colunas
 * presentes no payload.
 */
export const updateFinancialProfileSchema = z.object({
  experienceLevel: z.enum(["iniciante", "intermediario", "avancado"]).nullable().optional(),
  financialSituation: z.enum(FINANCIAL_SITUATION_OPTIONS).nullable().optional(),
  incomeRange: z.enum(["ate_2k", "2k_5k", "5k_10k", "10k_20k", "acima_20k"]).nullable().optional(),
  incomeVariable: z.boolean().optional(),
  incomeMin: z.number().positive().nullable().optional(),
  incomeMax: z.number().positive().nullable().optional(),
  incomeSources: z.array(z.string().trim().min(1).max(60)).max(8).optional(),
  priorities: z.array(z.enum(PRIORITY_OPTIONS)).max(PRIORITY_OPTIONS.length).optional(),
  habits: habitsSchema.nullable().optional(),
});

export type UpdateFinancialProfileInput = z.infer<typeof updateFinancialProfileSchema>;
export type PriorityOption = (typeof PRIORITY_OPTIONS)[number];
export type FinancialSituationOption = (typeof FINANCIAL_SITUATION_OPTIONS)[number];
export type HabitsInput = z.infer<typeof habitsSchema>;
