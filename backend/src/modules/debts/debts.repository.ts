import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";
import type { DebtType } from "./debts.validation";

export interface DebtRow extends RowDataPacket {
  id: number;
  user_id: number;
  type: DebtType;
  name: string;
  total_amount: string;
  installment_amount: string | null;
  interest_rate: string | null;
  installments_count: number | null;
  due_day: number | null;
  created_at: string;
}

export const debtsRepository = {
  async listByUser(userId: number): Promise<DebtRow[]> {
    const [rows] = await pool.query<DebtRow[]>(
      "SELECT * FROM debts WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return rows;
  },

  async create(
    userId: number,
    input: {
      type: DebtType;
      name: string;
      totalAmount: number;
      installmentAmount: number | null;
      interestRate: number | null;
      installmentsCount: number | null;
      dueDay: number | null;
    }
  ): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO debts
         (user_id, type, name, total_amount, installment_amount, interest_rate, installments_count, due_day)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        input.type,
        input.name,
        input.totalAmount,
        input.installmentAmount,
        input.interestRate,
        input.installmentsCount,
        input.dueDay,
      ]
    );
    return result.insertId;
  },

  async findByIdAndUser(id: number, userId: number): Promise<DebtRow | null> {
    const [rows] = await pool.query<DebtRow[]>("SELECT * FROM debts WHERE id = ? AND user_id = ? LIMIT 1", [
      id,
      userId,
    ]);
    return rows[0] ?? null;
  },

  async remove(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM debts WHERE id = ? AND user_id = ?", [
      id,
      userId,
    ]);
    return result.affectedRows > 0;
  },
};
