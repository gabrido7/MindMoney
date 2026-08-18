import { AppError } from "../../utils/AppError";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";
import { generateResetToken, hashResetToken } from "../../utils/passwordResetToken";
import { usersRepository } from "../users/users.repository";
import { toPublicUser, type PublicUser } from "../users/users.service";
import { passwordResetRepository } from "./passwordReset.repository";
import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./auth.validation";

export interface AuthResult {
  token: string;
  user: PublicUser;
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
    const token = signToken({ userId });

    return { token, user: toPublicUser(user!) };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await usersRepository.findByEmail(input.email);
    if (!user) throw AppError.unauthorized("E-mail ou senha inválidos.");

    const valid = await comparePassword(input.password, user.password_hash);
    if (!valid) throw AppError.unauthorized("E-mail ou senha inválidos.");

    const token = signToken({ userId: user.id });
    return { token, user: toPublicUser(user) };
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

    return { message: "Senha redefinida com sucesso." };
  },
};
