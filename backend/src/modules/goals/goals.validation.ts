import { z } from "zod";

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export const goalBodySchema = z.object({
  referenceMonth: z.string().regex(MONTH_REGEX, "referenceMonth deve estar no formato YYYY-MM"),
  targetAmount: z.coerce.number().positive("targetAmount deve ser maior que zero"),
});

export const goalUpdateSchema = z.object({
  targetAmount: z.coerce.number().positive("targetAmount deve ser maior que zero"),
});

export const goalListQuerySchema = z.object({
  month: z.string().regex(MONTH_REGEX).optional(),
});

export type GoalBodyInput = z.infer<typeof goalBodySchema>;
export type GoalUpdateInput = z.infer<typeof goalUpdateSchema>;
