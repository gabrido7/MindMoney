import { z } from "zod";

export const DEBT_TYPES = [
  "cartao_credito",
  "emprestimo",
  "financiamento",
  "cheque_especial",
  "parcelamento",
  "outro",
] as const;

export const createDebtSchema = z.object({
  type: z.enum(DEBT_TYPES),
  name: z.string().trim().min(1, "Nome é obrigatório").max(120),
  totalAmount: z.coerce.number().positive("totalAmount deve ser maior que zero"),
  installmentAmount: z.coerce.number().positive().nullable().optional(),
  interestRate: z.coerce.number().min(0).max(999.99).nullable().optional(),
  installmentsCount: z.coerce.number().int().positive().max(999).nullable().optional(),
  dueDay: z.coerce.number().int().min(1).max(31).nullable().optional(),
});

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const debtPaymentBodySchema = z.object({
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
  paidAt: z.string().regex(DATE_REGEX, "Data deve estar no formato YYYY-MM-DD"),
  note: z.string().trim().max(255).optional(),
});

export type CreateDebtInput = z.infer<typeof createDebtSchema>;
export type DebtType = (typeof DEBT_TYPES)[number];
export type DebtPaymentBodyInput = z.infer<typeof debtPaymentBodySchema>;
