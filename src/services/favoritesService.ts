import { apiRequest } from "./api";
import type { ApiFavorite, FavoriteContentType } from "../types/api";

export const favoritesService = {
  list: () => apiRequest<{ favorites: ApiFavorite[] }>("/favorites"),

  add: (contentType: FavoriteContentType, contentId: string) =>
    apiRequest<{ contentType: FavoriteContentType; contentId: string }>("/favorites", {
      method: "POST",
      body: { contentType, contentId },
    }),

  remove: (contentType: FavoriteContentType, contentId: string) =>
    apiRequest<void>(`/favorites/${contentType}/${encodeURIComponent(contentId)}`, { method: "DELETE" }),
};
