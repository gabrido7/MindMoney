import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";

export type NotificationType = "limit_exceeded" | "goal_achieved" | "objective_deadline";

export interface NotificationRow extends RowDataPacket {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
}

export const notificationsRepository = {
  async listByUser(userId: number): Promise<NotificationRow[]> {
    const [rows] = await pool.query<NotificationRow[]>(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
      [userId]
    );
    return rows;
  },

  async findByIdAndUser(id: number, userId: number): Promise<NotificationRow | null> {
    const [rows] = await pool.query<NotificationRow[]>(
      "SELECT * FROM notifications WHERE id = ? AND user_id = ? LIMIT 1",
      [id, userId]
    );
    return rows[0] ?? null;
  },

  async hasUnreadOfType(userId: number, type: NotificationType): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM notifications WHERE user_id = ? AND type = ? AND read_at IS NULL LIMIT 1",
      [userId, type]
    );
    return rows.length > 0;
  },

  async create(userId: number, type: NotificationType, title: string, message: string): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)",
      [userId, type, title, message]
    );
    return result.insertId;
  },

  async markRead(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE notifications SET read_at = NOW() WHERE id = ? AND user_id = ? AND read_at IS NULL",
      [id, userId]
    );
    return result.affectedRows > 0;
  },
};
