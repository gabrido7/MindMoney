import { AppError } from "../../utils/AppError";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";
import { generateResetToken, hashResetToken } from "../../utils/passwordResetToken";
import { generateRefreshToken, hashRefreshToken } from "../../utils/refreshToken";
import { usersRepository } from "../users/users.repository";
import { toPublicUser, type PublicUser } from "../users/users.service";
import { passwordResetRepository } from "./passwordReset.repository";
import { refreshTokenRepository } from "./refreshToken.repository";
import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  RefreshInput,
} from "./auth.validation";

export interface AuthResult {
  token: string;
  refreshToken: string;
  user: PublicUser;
}

/** Emite o par de tokens e persiste o hash do refresh token -- usado em register/login/refresh. */
async function issueTokens(userId: number): Promise<{ token: string; refreshToken: string }> {
  const token = signToken({ userId });
  const { token: refreshToken, tokenHash, expiresAt } = generateRefreshToken();
  await refreshTokenRepository.create(userId, tokenHash, expiresAt);
  return { token, refreshToken };
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await usersRepository.findByEmail(input.email);
    if (existing) throw AppError.conflict("Já existe uma conta com esse e-mail.");

    const passwordHash = await hashPassword(input.password);
    const userId = await usersRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    // Cada conta nova começa com as categorias/subcategorias padrão
    // (mesma procedure testada na etapa do banco de dados).
    await usersRepository.seedDefaultCategories(userId);

    const user = await usersRepository.findById(userId);
    const { token, refreshToken } = await issueTokens(userId);

    return { token, refreshToken, user: toPublicUser(user!) };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await usersRepository.findByEmail(input.email);
    if (!user) throw AppError.unauthorized("E-mail ou senha inválidos.");

    const valid = await comparePassword(input.password, user.password_hash);
    if (!valid) throw AppError.unauthorized("E-mail ou senha inválidos.");

    const { token, refreshToken } = await issueTokens(user.id);
    return { token, refreshToken, user: toPublicUser(user) };
  },

  /**
   * Renova o access token a partir de um refresh token válido. Rotação:
   * o token usado é revogado e um novo é emitido junto -- um refresh
   * token roubado e reusado depois do dono já ter renovado fica
   * imediatamente inválido (o dono já rotacionou pra outro hash).
   */
  async refresh(input: RefreshInput): Promise<{ token: string; refreshToken: string }> {
    const tokenHash = hashRefreshToken(input.refreshToken);
    const record = await refreshTokenRepository.findValidByHash(tokenHash);
    if (!record) throw AppError.unauthorized("Sessão expirada. Faça login novamente.");

    await refreshTokenRepository.revoke(record.id);
    return issueTokens(record.user_id);
  },

  /** Revogação real no servidor -- limpar o token só no navegador não impede reuso se ele vazou. */
  async logout(input: RefreshInput): Promise<void> {
    const tokenHash = hashRefreshToken(input.refreshToken);
    await refreshTokenRepository.revokeByHash(tokenHash);
  },

  /**
   * Sem serviço de e-mail configurado no projeto (mesma decisão consciente
   * documentada para a IA em SECURITY.md/DOCUMENTATION.md: não fingir uma
   * integração que não existe). O token é real (hash SHA-256 persistido,
   * expira em 30min, uso único) — só a entrega é em "modo demonstração",
   * devolvida direto na resposta em vez de por e-mail. Não revela se o
   * e-mail existe: resposta genérica quando o usuário não é encontrado.
   */
  async forgotPassword(
    input: ForgotPasswordInput
  ): Promise<{ message: string; demoMode: boolean; token?: string; expiresAt?: string }> {
    const user = await usersRepository.findByEmail(input.email);
    if (!user) {
      return {
        demoMode: true,
        message: "Se esse e-mail estiver cadastrado, um link de redefinição foi gerado.",
      };
    }

    await passwordResetRepository.invalidateAllForUser(user.id);
    const { token, tokenHash, expiresAt } = generateResetToken();
    await passwordResetRepository.create(user.id, tokenHash, expiresAt);

    return {
      demoMode: true,
      message: "Projeto sem envio de e-mail configurado: use o link abaixo para redefinir sua senha.",
      token,
      expiresAt: expiresAt.toISOString(),
    };
  },

  async resetPassword(input: ResetPasswordInput): Promise<{ message: string }> {
    const tokenHash = hashResetToken(input.token);
    const record = await passwordResetRepository.findValidByHash(tokenHash);
    if (!record) throw AppError.badRequest("Link de redefinição inválido ou expirado.");

    const passwordHash = await hashPassword(input.password);
    await usersRepository.updatePassword(record.user_id, passwordHash);
    await passwordResetRepository.markUsed(record.id);
    // Sessões existentes não deveriam sobreviver a uma redefinição de senha
    // (o cenário típico é justamente "perdi acesso, alguém pode ter a senha antiga").
    await refreshTokenRepository.revokeAllForUser(record.user_id);

    return { message: "Senha redefinida com sucesso." };
  },
};
