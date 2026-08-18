import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(120),
  email: z.string().trim().toLowerCase().email("E-mail inválido").max(255),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres").max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().length(64, "Token inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres").max(72),
});

export const refreshSchema = z.object({
  refreshToken: z.string().length(64, "Token de renovação inválido"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
