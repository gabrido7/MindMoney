import { AppError } from "../../utils/AppError";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";
import { usersRepository } from "../users/users.repository";
import { toPublicUser, type PublicUser } from "../users/users.service";
import type { LoginInput, RegisterInput } from "./auth.validation";

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
};
