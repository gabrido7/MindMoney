import { z } from "zod";

export const ACCOUNT_TYPES = ["corrente", "poupanca", "carteira", "outro"] as const;

export const createAccountSchema = z.object({
  type: z.enum(ACCOUNT_TYPES),
  name: z.string().trim().min(1, "Nome é obrigatório").max(120),
  initialBalance: z.coerce.number().default(0),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type AccountType = (typeof ACCOUNT_TYPES)[number];
