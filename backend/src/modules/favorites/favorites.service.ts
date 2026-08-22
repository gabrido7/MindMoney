import { favoritesRepository, type FavoriteRow } from "./favorites.repository";

function enrich(row: FavoriteRow) {
  return {
    contentType: row.content_type,
    contentId: row.content_id,
    createdAt: row.created_at,
  };
}

export type EnrichedFavorite = ReturnType<typeof enrich>;

export const favoritesService = {
  async list(userId: number): Promise<EnrichedFavorite[]> {
    const rows = await favoritesRepository.listByUser(userId);
    return rows.map(enrich);
  },

  async add(userId: number, contentType: string, contentId: string): Promise<void> {
    await favoritesRepository.add(userId, contentType, contentId);
  },

  async remove(userId: number, contentType: string, contentId: string): Promise<void> {
    await favoritesRepository.remove(userId, contentType, contentId);
  },
};
