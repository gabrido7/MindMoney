import { z } from "zod";

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export const categoryBudgetListQuerySchema = z.object({
  month: z.string().regex(MONTH_REGEX, "month deve estar no formato YYYY-MM").optional(),
});

export const categoryBudgetBodySchema = z.object({
  month: z.string().regex(MONTH_REGEX, "month deve estar no formato YYYY-MM"),
  amount: z.coerce.number().positive("amount deve ser maior que zero"),
});

export const categoryBudgetDeleteQuerySchema = z.object({
  month: z.string().regex(MONTH_REGEX, "month deve estar no formato YYYY-MM"),
});

export type CategoryBudgetListQuery = z.infer<typeof categoryBudgetListQuerySchema>;
export type CategoryBudgetBodyInput = z.infer<typeof categoryBudgetBodySchema>;
export type CategoryBudgetDeleteQuery = z.infer<typeof categoryBudgetDeleteQuerySchema>;
