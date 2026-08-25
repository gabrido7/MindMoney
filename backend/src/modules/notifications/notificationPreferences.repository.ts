import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";
import type { NotificationType } from "./notifications.repository";

interface PreferenceRow extends RowDataPacket {
  type: NotificationType;
  enabled: number;
}

export const notificationPreferencesRepository = {
  /** Só as linhas que existem -- tipo ausente é tratado como ativado por quem chama (ver notifications.service). */
  async listByUser(userId: number): Promise<Record<string, boolean>> {
    const [rows] = await pool.query<PreferenceRow[]>(
      "SELECT type, enabled FROM notification_preferences WHERE user_id = ?",
      [userId]
    );
    return Object.fromEntries(rows.map((row) => [row.type, Boolean(row.enabled)]));
  },

  async isEnabled(userId: number, type: NotificationType): Promise<boolean> {
    const [rows] = await pool.query<PreferenceRow[]>(
      "SELECT enabled FROM notification_preferences WHERE user_id = ? AND type = ? LIMIT 1",
      [userId, type]
    );
    return rows.length === 0 ? true : Boolean(rows[0].enabled);
  },

  async upsert(userId: number, type: NotificationType, enabled: boolean): Promise<void> {
    await pool.query<ResultSetHeader>(
      `INSERT INTO notification_preferences (user_id, type, enabled) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE enabled = VALUES(enabled)`,
      [userId, type, enabled]
    );
  },
};
