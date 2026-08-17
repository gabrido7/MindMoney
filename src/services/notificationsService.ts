import { apiRequest } from "./api";
import type { ApiNotification } from "../types/api";

export const notificationsService = {
  list: () => apiRequest<{ notifications: ApiNotification[] }>("/notifications"),

  markRead: (id: number) =>
    apiRequest<{ notification: ApiNotification }>(`/notifications/${id}/read`, { method: "PUT" }),
};
