import { z } from "zod";

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const OBJECTIVE_CATEGORIES = [
  "compra",
  "viagem",
  "educacao",
  "reserva",
  "patrimonio",
  "personalizada",
] as const;

export const OBJECTIVE_PRIORITIES = ["alta", "media", "baixa"] as const;

export const objectiveBodySchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(120),
  category: z.enum(OBJECTIVE_CATEGORIES),
  priority: z.enum(OBJECTIVE_PRIORITIES).default("media"),
  targetAmount: z.coerce.number().positive("O valor deve ser maior que zero"),
  targetMonth: z.string().regex(MONTH_REGEX, "Prazo deve estar no formato YYYY-MM"),
});

export const contributionBodySchema = z.object({
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
  contributedAt: z.string().regex(DATE_REGEX, "Data deve estar no formato YYYY-MM-DD"),
  note: z.string().trim().max(255).optional(),
});

export type ObjectiveCategory = (typeof OBJECTIVE_CATEGORIES)[number];
export type ObjectivePriority = (typeof OBJECTIVE_PRIORITIES)[number];
export type ObjectiveBodyInput = z.infer<typeof objectiveBodySchema>;
export type ContributionBodyInput = z.infer<typeof contributionBodySchema>;
