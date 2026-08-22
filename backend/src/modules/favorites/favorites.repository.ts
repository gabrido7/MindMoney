import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";

export interface FavoriteRow extends RowDataPacket {
  id: number;
  user_id: number;
  content_type: "lesson" | "tool";
  content_id: string;
  created_at: string;
}

export const favoritesRepository = {
  async listByUser(userId: number): Promise<FavoriteRow[]> {
    const [rows] = await pool.query<FavoriteRow[]>(
      "SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return rows;
  },

  /** INSERT IGNORE -- favoritar de novo o mesmo conteúdo é inofensivo (idempotente). */
  async add(userId: number, contentType: string, contentId: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT IGNORE INTO favorites (user_id, content_type, content_id) VALUES (?, ?, ?)",
      [userId, contentType, contentId]
    );
    return result.affectedRows > 0;
  },

  async remove(userId: number, contentType: string, contentId: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM favorites WHERE user_id = ? AND content_type = ? AND content_id = ?",
      [userId, contentType, contentId]
    );
    return result.affectedRows > 0;
  },
};
