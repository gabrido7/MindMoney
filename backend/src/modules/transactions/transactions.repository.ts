import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";
import type { TransactionBodyInput, TransactionListQuery } from "./transactions.validation";

export interface TransactionRow extends RowDataPacket {
  id: number;
  user_id: number;
  category_id: number;
  subcategory_id: number | null;
  category_name: string;
  category_color: string;
  subcategory_name: string | null;
  description: string;
  amount: number;
  type: "entrada" | "saida";
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

const SELECT_WITH_JOINS = `
  SELECT
    t.id, t.user_id, t.category_id, t.subcategory_id,
    c.name AS category_name, c.color AS category_color,
    sc.name AS subcategory_name,
    t.description, t.amount, t.type, t.transaction_date, t.created_at, t.updated_at
  FROM transactions t
  JOIN categories c ON c.id = t.category_id
  LEFT JOIN subcategories sc ON sc.id = t.subcategory_id
`;

/** Monta as condições WHERE compartilhadas por list() e count() -- os mesmos filtros têm que valer para os dois, senão a paginação (total/totalPages) fica inconsistente com as linhas devolvidas. */
function buildFilterConditions(userId: number, filters: TransactionListQuery) {
  const conditions = ["t.user_id = ?"];
  const params: unknown[] = [userId];

  if (filters.month) {
    conditions.push("t.transaction_date LIKE ?");
    params.push(`${filters.month}%`);
  }
  if (filters.type) {
    conditions.push("t.type = ?");
    params.push(filters.type);
  }
  if (filters.categoryId) {
    conditions.push("t.category_id = ?");
    params.push(filters.categoryId);
  }
  if (filters.search) {
    conditions.push("(t.description LIKE ? OR c.name LIKE ?)");
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  return { where: conditions.join(" AND "), params };
}

export const transactionsRepository = {
  async list(
    userId: number,
    filters: TransactionListQuery,
    pagination: { page: number; limit: number }
  ): Promise<TransactionRow[]> {
    const { where, params } = buildFilterConditions(userId, filters);
    const offset = (pagination.page - 1) * pagination.limit;

    const [rows] = await pool.query<TransactionRow[]>(
      `${SELECT_WITH_JOINS} WHERE ${where} ORDER BY t.transaction_date DESC, t.id DESC LIMIT ? OFFSET ?`,
      [...params, pagination.limit, offset]
    );
    return rows;
  },

  async count(userId: number, filters: TransactionListQuery): Promise<number> {
    const { where, params } = buildFilterConditions(userId, filters);
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM transactions t JOIN categories c ON c.id = t.category_id WHERE ${where}`,
      params
    );
    return Number(rows[0]?.total ?? 0);
  },

  async findByIdAndUser(id: number, userId: number): Promise<TransactionRow | null> {
    const [rows] = await pool.query<TransactionRow[]>(
      `${SELECT_WITH_JOINS} WHERE t.id = ? AND t.user_id = ? LIMIT 1`,
      [id, userId]
    );
    return rows[0] ?? null;
  },

  async create(userId: number, input: TransactionBodyInput): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO transactions (user_id, category_id, subcategory_id, description, amount, type, transaction_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        input.categoryId,
        input.subcategoryId ?? null,
        input.description,
        input.amount,
        input.type,
        input.transactionDate,
      ]
    );
    return result.insertId;
  },

  async update(id: number, userId: number, input: TransactionBodyInput): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE transactions
       SET category_id = ?, subcategory_id = ?, description = ?, amount = ?, type = ?, transaction_date = ?
       WHERE id = ? AND user_id = ?`,
      [
        input.categoryId,
        input.subcategoryId ?? null,
        input.description,
        input.amount,
        input.type,
        input.transactionDate,
        id,
        userId,
      ]
    );
    return result.affectedRows > 0;
  },

  async delete(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM transactions WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  async sumByTypeForMonth(userId: number, month: string): Promise<{ entradas: number; saidas: number }> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT type, SUM(amount) AS total FROM transactions
       WHERE user_id = ? AND transaction_date LIKE ? GROUP BY type`,
      [userId, `${month}%`]
    );
    const totals = { entradas: 0, saidas: 0 };
    for (const row of rows) {
      if (row.type === "entrada") totals.entradas = Number(row.total);
      if (row.type === "saida") totals.saidas = Number(row.total);
    }
    return totals;
  },

  async categoryBreakdownForMonth(
    userId: number,
    month: string
  ): Promise<{ categoryId: number; name: string; color: string; value: number }[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT c.id AS categoryId, c.name, c.color, SUM(t.amount) AS value
       FROM transactions t
       JOIN categories c ON c.id = t.category_id
       WHERE t.user_id = ? AND t.type = 'saida' AND t.transaction_date LIKE ?
       GROUP BY c.id, c.name, c.color
       ORDER BY value DESC`,
      [userId, `${month}%`]
    );
    return rows.map((r) => ({
      categoryId: r.categoryId,
      name: r.name,
      color: r.color,
      value: Number(r.value),
    }));
  },

  async monthlyEvolution(userId: number): Promise<{ month: string; saldo: number }[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(transaction_date, '%Y-%m') AS month, type, SUM(amount) AS total
       FROM transactions
       WHERE user_id = ?
       GROUP BY month, type
       ORDER BY month ASC`,
      [userId]
    );

    const byMonth = new Map<string, { entradas: number; saidas: number }>();
    for (const row of rows) {
      const entry = byMonth.get(row.month) ?? { entradas: 0, saidas: 0 };
      if (row.type === "entrada") entry.entradas = Number(row.total);
      if (row.type === "saida") entry.saidas = Number(row.total);
      byMonth.set(row.month, entry);
    }

    return Array.from(byMonth.entries()).map(([month, { entradas, saidas }]) => ({
      month,
      saldo: entradas - saidas,
    }));
  },
};
