import { z } from "zod";

export const PRIORITY_OPTIONS = [
  "reserva_emergencia",
  "quitar_dividas",
  "investir",
  "comprar_um_bem",
  "aposentadoria",
  "educacao",
] as const;

export const updateFinancialProfileSchema = z.object({
  experienceLevel: z.enum(["iniciante", "intermediario", "avancado"]).nullable(),
  incomeRange: z.enum(["ate_2k", "2k_5k", "5k_10k", "10k_20k", "acima_20k"]).nullable(),
  priorities: z.array(z.enum(PRIORITY_OPTIONS)).max(PRIORITY_OPTIONS.length),
});

export type UpdateFinancialProfileInput = z.infer<typeof updateFinancialProfileSchema>;
export type PriorityOption = (typeof PRIORITY_OPTIONS)[number];
