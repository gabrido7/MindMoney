import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";

export interface CategoryBudgetRow extends RowDataPacket {
  id: number;
  category_id: number;
  category_name: string;
  category_color: string;
  amount: number;
  spent: number;
}

export const categoryBudgetsRepository = {
  /**
   * Uma query só (LEFT JOIN + agregação), mesmo padrão anti-N+1 do resto do
   * projeto: orçamento + gasto real do mês, sem uma consulta por categoria.
   */
  async listByUserAndMonth(userId: number, month: string): Promise<CategoryBudgetRow[]> {
    const [rows] = await pool.query<CategoryBudgetRow[]>(
      `SELECT
         cb.id, cb.category_id, c.name AS category_name, c.color AS category_color, cb.amount,
         COALESCE(SUM(CASE WHEN t.type = 'saida' THEN t.amount ELSE 0 END), 0) AS spent
       FROM category_budgets cb
       JOIN categories c ON c.id = cb.category_id
       LEFT JOIN transactions t
         ON t.category_id = cb.category_id AND t.user_id = cb.user_id AND t.transaction_date LIKE ?
       WHERE cb.user_id = ? AND cb.reference_month = ?
       GROUP BY cb.id, cb.category_id, c.name, c.color, cb.amount
       ORDER BY c.name ASC`,
      [`${month}%`, userId, month]
    );
    return rows;
  },

  async findByUserCategoryMonth(userId: number, categoryId: number, month: string): Promise<CategoryBudgetRow | null> {
    const [rows] = await pool.query<CategoryBudgetRow[]>(
      `SELECT cb.id, cb.category_id, c.name AS category_name, c.color AS category_color, cb.amount, 0 AS spent
       FROM category_budgets cb
       JOIN categories c ON c.id = cb.category_id
       WHERE cb.user_id = ? AND cb.category_id = ? AND cb.reference_month = ? LIMIT 1`,
      [userId, categoryId, month]
    );
    return rows[0] ?? null;
  },

  async upsert(userId: number, categoryId: number, month: string, amount: number): Promise<void> {
    await pool.query<ResultSetHeader>(
      `INSERT INTO category_budgets (user_id, category_id, reference_month, amount) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE amount = VALUES(amount)`,
      [userId, categoryId, month, amount]
    );
  },

  async remove(userId: number, categoryId: number, month: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM category_budgets WHERE user_id = ? AND category_id = ? AND reference_month = ?",
      [userId, categoryId, month]
    );
    return result.affectedRows > 0;
  },
};
