import { AppError } from "../../utils/AppError";
import { usersRepository, type UserRow } from "./users.repository";

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
};
