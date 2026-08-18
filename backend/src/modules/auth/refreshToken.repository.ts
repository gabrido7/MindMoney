import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";

export interface RefreshTokenRow extends RowDataPacket {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
}

export const refreshTokenRepository = {
  async create(userId: number, tokenHash: string, expiresAt: Date): Promise<void> {
    await pool.query<ResultSetHeader>(
      "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
      [userId, tokenHash, expiresAt]
    );
  },

  async findValidByHash(tokenHash: string): Promise<RefreshTokenRow | null> {
    const [rows] = await pool.query<RefreshTokenRow[]>(
      "SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW() LIMIT 1",
      [tokenHash]
    );
    return rows[0] ?? null;
  },

  async revoke(id: number): Promise<void> {
    await pool.query("UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = ?", [id]);
  },

  async revokeByHash(tokenHash: string): Promise<void> {
    await pool.query(
      "UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ? AND revoked_at IS NULL",
      [tokenHash]
    );
  },

  /** Chamado ao trocar/redefinir senha: força qualquer outra sessão ativa a se autenticar de novo. */
  async revokeAllForUser(userId: number): Promise<void> {
    await pool.query(
      "UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL",
      [userId]
    );
  },
};
