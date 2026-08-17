import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";

export interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
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
};
