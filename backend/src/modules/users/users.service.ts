import fs from "node:fs/promises";
import path from "node:path";
import { AppError } from "../../utils/AppError";
import { hashPassword, comparePassword } from "../../utils/password";
import { usersRepository, type UserRow } from "./users.repository";
import { refreshTokenRepository } from "../auth/refreshToken.repository";
import { notificationsService } from "../notifications/notifications.service";
import { AVATAR_UPLOAD_DIR } from "../../middlewares/upload";
import type { ChangePasswordInput, DeleteAccountInput, UpdateProfileInput } from "./users.validation";

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  passwordChangedAt: string | null;
  onboardingCompletedAt: string | null;
  createdAt: string;
}

export const toPublicUser = (user: UserRow): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatarUrl: user.avatar_path ? `/uploads/avatars/${user.avatar_path}` : null,
  passwordChangedAt: user.password_changed_at,
  onboardingCompletedAt: user.onboarding_completed_at,
  createdAt: user.created_at,
});

async function deleteAvatarFile(filename: string | null): Promise<void> {
  if (!filename) return;
  try {
    await fs.unlink(path.join(AVATAR_UPLOAD_DIR, filename));
  } catch {
    // arquivo já não existe (ou nunca existiu) -- nada a fazer, não é motivo pra falhar a request
  }
}

export const usersService = {
  async getById(userId: number): Promise<PublicUser> {
    const user = await usersRepository.findById(userId);
    if (!user) throw AppError.notFound("Usuário não encontrado.");
    return toPublicUser(user);
  },

  async updateProfile(userId: number, input: UpdateProfileInput): Promise<PublicUser> {
    const existing = await usersRepository.findByEmail(input.email);
    if (existing && existing.id !== userId) {
      throw AppError.conflict("Já existe uma conta com esse e-mail.");
    }

    await usersRepository.updateProfile(userId, input.name, input.email);
    const user = await usersRepository.findById(userId);
    if (!user) throw AppError.notFound("Usuário não encontrado.");
    return toPublicUser(user);
  },

  async changePassword(userId: number, input: ChangePasswordInput): Promise<void> {
    const user = await usersRepository.findById(userId);
    if (!user) throw AppError.notFound("Usuário não encontrado.");

    // 403, não 401: o usuário está autenticado (o token é válido), só essa
    // reverificação pontual falhou. 401 aqui dispararia o handler global
    // de "sessão expirada" em api.ts (que desloga em qualquer 401),
    // derrubando a sessão inteira por causa de um campo digitado errado.
    const valid = await comparePassword(input.currentPassword, user.password_hash);
    if (!valid) throw AppError.forbidden("Senha atual incorreta.");

    const passwordHash = await hashPassword(input.newPassword);
    await usersRepository.updatePassword(userId, passwordHash);
    // Mesmo raciocínio do reset de senha: trocar a senha encerra qualquer
    // outra sessão ativa (o access token de 15min desta sessão continua
    // valendo até expirar naturalmente, mas não renova mais depois disso).
    await refreshTokenRepository.revokeAllForUser(userId);
  },

  /** Substitui a foto atual -- apaga o arquivo antigo do disco (se houver) só depois do upload novo já ter sucesso. */
  async setAvatar(userId: number, filename: string): Promise<PublicUser> {
    const user = await usersRepository.findById(userId);
    if (!user) throw AppError.notFound("Usuário não encontrado.");

    await usersRepository.updateAvatar(userId, filename);
    await deleteAvatarFile(user.avatar_path);

    const updated = await usersRepository.findById(userId);
    return toPublicUser(updated!);
  },

  async removeAvatar(userId: number): Promise<PublicUser> {
    const user = await usersRepository.findById(userId);
    if (!user) throw AppError.notFound("Usuário não encontrado.");

    await usersRepository.updateAvatar(userId, null);
    await deleteAvatarFile(user.avatar_path);

    const updated = await usersRepository.findById(userId);
    return toPublicUser(updated!);
  },

  async completeOnboarding(userId: number, skippedSteps: string[]): Promise<PublicUser> {
    await usersRepository.completeOnboarding(userId, skippedSteps);
    await notificationsService.notifyOnboardingPending(userId, skippedSteps);
    const user = await usersRepository.findById(userId);
    if (!user) throw AppError.notFound("Usuário não encontrado.");
    return toPublicUser(user);
  },

  async deleteAccount(userId: number, input: DeleteAccountInput): Promise<void> {
    const user = await usersRepository.findById(userId);
    if (!user) throw AppError.notFound("Usuário não encontrado.");

    // mesmo motivo do changePassword: 403, não 401.
    const valid = await comparePassword(input.password, user.password_hash);
    if (!valid) throw AppError.forbidden("Senha incorreta.");

    await usersRepository.deleteAccount(userId);
    await deleteAvatarFile(user.avatar_path);
  },
};
