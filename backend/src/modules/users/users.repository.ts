import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";

export interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  avatar_path: string | null;
  password_changed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const usersRepository = {
  async findByEmail(email: string): Promise<UserRow | null> {
    const [rows] = await pool.query<UserRow[]>("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    return rows[0] ?? null;
  },

  async findById(id: number): Promise<UserRow | null> {
    const [rows] = await pool.query<UserRow[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
    return rows[0] ?? null;
  },

  async create(data: { name: string; email: string; passwordHash: string }): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [data.name, data.email, data.passwordHash]
    );
    return result.insertId;
  },

  async seedDefaultCategories(userId: number): Promise<void> {
    await pool.query("CALL sp_seed_user_categories(?)", [userId]);
  },

  /** password_changed_at anda sempre junto com o hash -- toda troca real de senha passa por aqui (comum ou reset). */
  async updatePassword(id: number, passwordHash: string): Promise<void> {
    await pool.query("UPDATE users SET password_hash = ?, password_changed_at = NOW() WHERE id = ?", [
      passwordHash,
      id,
    ]);
  },

  async updateProfile(id: number, name: string, email: string): Promise<void> {
    await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id]);
  },

  async updateAvatar(id: number, avatarPath: string | null): Promise<void> {
    await pool.query("UPDATE users SET avatar_path = ? WHERE id = ?", [avatarPath, id]);
  },

  /**
   * transactions.category_id é ON DELETE RESTRICT de propósito (ver
   * database/README.md) -- apagar um usuário direto falharia no meio do
   * CASCADE se ele tiver qualquer transação. Por isso: apagar as
   * transações primeiro, depois o usuário (o resto cascateia limpo). As
   * duas exclusões numa transação só, pra nunca sobrar um estado parcial.
   */
  async deleteAccount(id: number): Promise<void> {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query("DELETE FROM transactions WHERE user_id = ?", [id]);
      await conn.query("DELETE FROM users WHERE id = ?", [id]);
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};
