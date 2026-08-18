import { AppError } from "../../utils/AppError";
import { hashPassword, comparePassword } from "../../utils/password";
import { usersRepository, type UserRow } from "./users.repository";
import { refreshTokenRepository } from "../auth/refreshToken.repository";
import type { ChangePasswordInput, DeleteAccountInput, UpdateProfileInput } from "./users.validation";

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export const toPublicUser = (user: UserRow): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.created_at,
});

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

  async deleteAccount(userId: number, input: DeleteAccountInput): Promise<void> {
    const user = await usersRepository.findById(userId);
    if (!user) throw AppError.notFound("Usuário não encontrado.");

    // mesmo motivo do changePassword: 403, não 401.
    const valid = await comparePassword(input.password, user.password_hash);
    if (!valid) throw AppError.forbidden("Senha incorreta.");

    await usersRepository.deleteAccount(userId);
  },
};
