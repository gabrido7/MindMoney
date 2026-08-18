import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(120),
  email: z.string().trim().toLowerCase().email("E-mail inválido").max(255),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres").max(72),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Senha é obrigatória para confirmar a exclusão"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
