import { apiRequest } from "./api";
import type { PublicUser } from "../types/api";

export const usersService = {
  updateProfile: (input: { name: string; email: string }) =>
    apiRequest<{ user: PublicUser }>("/users/me", { method: "PUT", body: input }),

  changePassword: (input: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ message: string }>("/users/me/password", { method: "PUT", body: input }),

  deleteAccount: (input: { password: string }) =>
    apiRequest<void>("/users/me", { method: "DELETE", body: input }),
};
