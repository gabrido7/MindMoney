import { z } from "zod";

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const transactionBodySchema = z.object({
  categoryId: z.coerce.number().int().positive(),
  subcategoryId: z.coerce.number().int().positive().optional(),
  description: z.string().trim().min(1).max(255),
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
  type: z.enum(["entrada", "saida"]),
  transactionDate: z.string().regex(DATE_REGEX, "Data deve estar no formato YYYY-MM-DD"),
});

export const transactionListQuerySchema = z.object({
  month: z.string().regex(MONTH_REGEX, "month deve estar no formato YYYY-MM").optional(),
  type: z.enum(["entrada", "saida"]).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type TransactionBodyInput = z.infer<typeof transactionBodySchema>;
export type TransactionListQuery = z.infer<typeof transactionListQuerySchema>;
