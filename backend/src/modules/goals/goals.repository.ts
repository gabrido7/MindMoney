import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";

export interface GoalRow extends RowDataPacket {
  id: number;
  user_id: number;
  reference_month: string;
  target_amount: number;
  created_at: string;
  updated_at: string;
}

export interface GoalWithTotalsRow extends GoalRow {
  entradas: number;
  saidas: number;
}

export const goalsRepository = {
  async listByUser(userId: number, month?: string): Promise<GoalRow[]> {
    if (month) {
      const [rows] = await pool.query<GoalRow[]>(
        "SELECT * FROM saving_goals WHERE user_id = ? AND reference_month = ?",
        [userId, month]
      );
      return rows;
    }
    const [rows] = await pool.query<GoalRow[]>(
      "SELECT * FROM saving_goals WHERE user_id = ? ORDER BY reference_month DESC",
      [userId]
    );
    return rows;
  },

  /**
   * Metas já com entradas/saidas do mês de referência de cada uma,
   * calculadas numa única query (LEFT JOIN + agregação) -- antes disso o
   * frontend buscava a lista de metas e depois um dashboard inteiro por
   * meta só para ler o saldo (1+N chamadas).
   */
  async listByUserWithTotals(userId: number, month?: string): Promise<GoalWithTotalsRow[]> {
    const condition = month ? "AND g.reference_month = ?" : "";

    const [rows] = await pool.query<GoalWithTotalsRow[]>(
      `SELECT
         g.*,
         COALESCE(SUM(CASE WHEN t.type = 'entrada' THEN t.amount ELSE 0 END), 0) AS entradas,
         COALESCE(SUM(CASE WHEN t.type = 'saida' THEN t.amount ELSE 0 END), 0) AS saidas
       FROM saving_goals g
       LEFT JOIN transactions t
         ON t.user_id = g.user_id AND t.transaction_date LIKE CONCAT(g.reference_month, '%')
       WHERE g.user_id = ? ${condition}
       GROUP BY g.id
       ORDER BY g.reference_month DESC`,
      condition ? [userId, month] : [userId]
    );
    return rows;
  },

  async findByMonth(userId: number, month: string): Promise<GoalRow | null> {
    const [rows] = await pool.query<GoalRow[]>(
      "SELECT * FROM saving_goals WHERE user_id = ? AND reference_month = ? LIMIT 1",
      [userId, month]
    );
    return rows[0] ?? null;
  },

  async findByIdAndUser(id: number, userId: number): Promise<GoalRow | null> {
    const [rows] = await pool.query<GoalRow[]>(
      "SELECT * FROM saving_goals WHERE id = ? AND user_id = ? LIMIT 1",
      [id, userId]
    );
    return rows[0] ?? null;
  },

  async create(userId: number, referenceMonth: string, targetAmount: number): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO saving_goals (user_id, reference_month, target_amount) VALUES (?, ?, ?)",
      [userId, referenceMonth, targetAmount]
    );
    return result.insertId;
  },

  async update(id: number, userId: number, targetAmount: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE saving_goals SET target_amount = ? WHERE id = ? AND user_id = ?",
      [targetAmount, id, userId]
    );
    return result.affectedRows > 0;
  },

  async delete(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM saving_goals WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return result.affectedRows > 0;
  },
};
