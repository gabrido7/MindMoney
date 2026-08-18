import { apiRequest } from "./api";
import type { AuthResponse, PublicUser } from "../types/api";

export const authService = {
  register: (input: { name: string; email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/register", { method: "POST", body: input }),

  login: (input: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/login", { method: "POST", body: input }),

  me: () => apiRequest<{ user: PublicUser }>("/users/me"),

  forgotPassword: (input: { email: string }) =>
    apiRequest<{ message: string; demoMode: boolean; token?: string; expiresAt?: string }>(
      "/auth/forgot-password",
      { method: "POST", body: input }
    ),

  resetPassword: (input: { token: string; password: string }) =>
    apiRequest<{ message: string }>("/auth/reset-password", { method: "POST", body: input }),
};
