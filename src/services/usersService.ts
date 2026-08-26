import { apiRequest } from "./api";
import { getRefreshToken } from "../utils/token";
import type {
  ApiSession,
  FinancialProfile,
  NotificationPreferences,
  NotificationType,
  PublicUser,
  UpdateFinancialProfileInput,
} from "../types/api";

/** Identifica a sessão desta aba pro backend marcar `current` na lista -- nunca enviado a mais além disso. */
const currentSessionHeader = (): Record<string, string> => {
  const refreshToken = getRefreshToken();
  return refreshToken ? { "X-Refresh-Token": refreshToken } : {};
};

export const usersService = {
  updateProfile: (input: { name: string; email: string }) =>
    apiRequest<{ user: PublicUser }>("/users/me", { method: "PUT", body: input }),

  changePassword: (input: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ message: string }>("/users/me/password", { method: "PUT", body: input }),

  deleteAccount: (input: { password: string }) =>
    apiRequest<void>("/users/me", { method: "DELETE", body: input }),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiRequest<{ user: PublicUser }>("/users/me/avatar", { method: "POST", body: formData });
  },

  removeAvatar: () => apiRequest<{ user: PublicUser }>("/users/me/avatar", { method: "DELETE" }),

  listSessions: () =>
    apiRequest<{ sessions: ApiSession[] }>("/users/me/sessions", { headers: currentSessionHeader() }),

  revokeSession: (id: number) => apiRequest<void>(`/users/me/sessions/${id}`, { method: "DELETE" }),

  revokeOtherSessions: () =>
    apiRequest<void>("/users/me/sessions/other", { method: "DELETE", headers: currentSessionHeader() }),

  getNotificationPreferences: () =>
    apiRequest<{ preferences: NotificationPreferences }>("/users/me/notification-preferences"),

  updateNotificationPreference: (type: NotificationType, enabled: boolean) =>
    apiRequest<{ preferences: NotificationPreferences }>(`/users/me/notification-preferences/${type}`, {
      method: "PUT",
      body: { enabled },
    }),

  completeOnboarding: (input: { skippedSteps: string[] } = { skippedSteps: [] }) =>
    apiRequest<{ user: PublicUser }>("/users/me/onboarding", { method: "PUT", body: input }),

  getFinancialProfile: () => apiRequest<{ profile: FinancialProfile }>("/users/me/financial-profile"),

  updateFinancialProfile: (input: UpdateFinancialProfileInput) =>
    apiRequest<{ profile: FinancialProfile }>("/users/me/financial-profile", { method: "PUT", body: input }),
};
