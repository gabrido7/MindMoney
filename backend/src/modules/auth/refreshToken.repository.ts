import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";

export interface RefreshTokenRow extends RowDataPacket {
  id: number;
  user_id: number;
  token_hash: string;
  user_agent: string | null;
  expires_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export const refreshTokenRepository = {
  async create(userId: number, tokenHash: string, expiresAt: Date, userAgent: string | null): Promise<void> {
    await pool.query<ResultSetHeader>(
      "INSERT INTO refresh_tokens (user_id, token_hash, expires_at, user_agent, last_used_at) VALUES (?, ?, ?, ?, NOW())",
      [userId, tokenHash, expiresAt, userAgent]
    );
  },

  async findValidByHash(tokenHash: string): Promise<RefreshTokenRow | null> {
    const [rows] = await pool.query<RefreshTokenRow[]>(
      "SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW() LIMIT 1",
      [tokenHash]
    );
    return rows[0] ?? null;
  },

  async touchLastUsed(id: number): Promise<void> {
    await pool.query("UPDATE refresh_tokens SET last_used_at = NOW() WHERE id = ?", [id]);
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

  /** Sessões ativas (visíveis na tela de Segurança) -- ainda não revogadas e ainda não expiradas. */
  async listActiveForUser(userId: number): Promise<RefreshTokenRow[]> {
    const [rows] = await pool.query<RefreshTokenRow[]>(
      "SELECT * FROM refresh_tokens WHERE user_id = ? AND revoked_at IS NULL AND expires_at > NOW() ORDER BY last_used_at DESC",
      [userId]
    );
    return rows;
  },

  /** Encerrar uma sessão específica -- escopado por usuário, pra não permitir revogar sessão de outra conta. */
  async revokeForUserAndId(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = ? AND user_id = ? AND revoked_at IS NULL",
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  /** "Encerrar todas as outras sessões" -- preserva a sessão atual (currentHash pode ser null se não identificada). */
  async revokeAllForUserExceptHash(userId: number, currentHash: string | null): Promise<void> {
    await pool.query(
      "UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL AND token_hash != ?",
      [userId, currentHash ?? ""]
    );
  },
};
