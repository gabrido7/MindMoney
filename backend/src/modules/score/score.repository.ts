import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";

export interface ScoreHistoryRow extends RowDataPacket {
  id: number;
  user_id: number;
  reference_month: string;
  score: number;
  details: string | null;
  calculated_at: string;
}

export const scoreRepository = {
  async upsert(userId: number, month: string, score: number, details: unknown): Promise<void> {
    await pool.query<ResultSetHeader>(
      `INSERT INTO financial_score_history (user_id, reference_month, score, details)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE score = VALUES(score), details = VALUES(details)`,
      [userId, month, score, JSON.stringify(details)]
    );
  },

  async listForUser(userId: number, limit: number): Promise<ScoreHistoryRow[]> {
    const [rows] = await pool.query<ScoreHistoryRow[]>(
      `SELECT * FROM financial_score_history WHERE user_id = ?
       ORDER BY reference_month DESC LIMIT ?`,
      [userId, limit]
    );
    return rows;
  },
};
