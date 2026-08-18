import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";

export interface PasswordResetTokenRow extends RowDataPacket {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export const passwordResetRepository = {
  async create(userId: number, tokenHash: string, expiresAt: Date): Promise<void> {
    await pool.query<ResultSetHeader>(
      "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
      [userId, tokenHash, expiresAt]
    );
  },

  async findValidByHash(tokenHash: string): Promise<PasswordResetTokenRow | null> {
    const [rows] = await pool.query<PasswordResetTokenRow[]>(
      "SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW() LIMIT 1",
      [tokenHash]
    );
    return rows[0] ?? null;
  },

  async markUsed(id: number): Promise<void> {
    await pool.query("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?", [id]);
  },

  /** Pedir um novo link invalida qualquer link anterior ainda não usado. */
  async invalidateAllForUser(userId: number): Promise<void> {
    await pool.query(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL",
      [userId]
    );
  },
};
