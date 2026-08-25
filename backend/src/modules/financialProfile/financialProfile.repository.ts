import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";

export interface FinancialProfileRow extends RowDataPacket {
  user_id: number;
  experience_level: "iniciante" | "intermediario" | "avancado" | null;
  income_range: "ate_2k" | "2k_5k" | "5k_10k" | "10k_20k" | "acima_20k" | null;
  priorities: string | null; // JSON, parseado pelo service
  updated_at: string;
}

export const financialProfileRepository = {
  async findByUser(userId: number): Promise<FinancialProfileRow | null> {
    const [rows] = await pool.query<FinancialProfileRow[]>(
      "SELECT * FROM user_financial_profiles WHERE user_id = ? LIMIT 1",
      [userId]
    );
    return rows[0] ?? null;
  },

  async upsert(
    userId: number,
    experienceLevel: string | null,
    incomeRange: string | null,
    priorities: string[]
  ): Promise<void> {
    await pool.query<ResultSetHeader>(
      `INSERT INTO user_financial_profiles (user_id, experience_level, income_range, priorities)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         experience_level = VALUES(experience_level),
         income_range = VALUES(income_range),
         priorities = VALUES(priorities)`,
      [userId, experienceLevel, incomeRange, JSON.stringify(priorities)]
    );
  },
};
