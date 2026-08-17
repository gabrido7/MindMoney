import { apiRequest } from "./api";
import type { AuthResponse, PublicUser } from "../types/api";

export const authService = {
  register: (input: { name: string; email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/register", { method: "POST", body: input }),

  login: (input: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/login", { method: "POST", body: input }),

  me: () => apiRequest<{ user: PublicUser }>("/users/me"),
};
