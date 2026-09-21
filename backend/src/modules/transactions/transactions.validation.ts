import { z } from "zod";

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const transactionBodySchema = z.object({
  accountId: z.coerce.number().int().positive(),
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
  accountId: z.coerce.number().int().positive().optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const importRowSchema = z.object({
  date: z.string().regex(DATE_REGEX, "Data deve estar no formato YYYY-MM-DD"),
  description: z.string().trim().min(1).max(255),
  category: z.string().trim().min(1).max(60),
  subcategory: z.string().trim().max(60).optional(),
  type: z.enum(["entrada", "saida"]),
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
});

export const importTransactionsSchema = z.object({
  transactions: z.array(importRowSchema).min(1, "Nenhuma transação para importar").max(1000, "Máximo de 1000 transações por importação"),
});

export type TransactionBodyInput = z.infer<typeof transactionBodySchema>;
export type TransactionListQuery = z.infer<typeof transactionListQuerySchema>;
export type ImportRow = z.infer<typeof importRowSchema>;
export type ImportTransactionsInput = z.infer<typeof importTransactionsSchema>;
