import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";
import type { ObjectiveBodyInput, ContributionBodyInput } from "./objectives.validation";

export interface ObjectiveRow extends RowDataPacket {
  id: number;
  user_id: number;
  name: string;
  category: string;
  priority: string;
  target_amount: number;
  target_month: string;
  created_at: string;
  updated_at: string;
}

export interface ObjectiveWithCurrentRow extends ObjectiveRow {
  current_amount: number;
}

export interface ContributionRow extends RowDataPacket {
  id: number;
  objective_id: number;
  amount: number;
  contributed_at: string;
  note: string | null;
  created_at: string;
}

export const objectivesRepository = {
  /** Uma query só (LEFT JOIN + agregação), nunca N+1 buscando aportes separadamente por objetivo. */
  async listByUser(userId: number): Promise<ObjectiveWithCurrentRow[]> {
    const [rows] = await pool.query<ObjectiveWithCurrentRow[]>(
      `SELECT o.*, COALESCE(SUM(c.amount), 0) AS current_amount
       FROM financial_objectives o
       LEFT JOIN objective_contributions c ON c.objective_id = o.id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY FIELD(o.priority, 'alta', 'media', 'baixa'), o.target_month ASC, o.created_at ASC`,
      [userId]
    );
    return rows;
  },

  async findByIdAndUser(id: number, userId: number): Promise<ObjectiveRow | null> {
    const [rows] = await pool.query<ObjectiveRow[]>(
      "SELECT * FROM financial_objectives WHERE id = ? AND user_id = ? LIMIT 1",
      [id, userId]
    );
    return rows[0] ?? null;
  },

  async create(userId: number, input: ObjectiveBodyInput): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO financial_objectives (user_id, name, category, priority, target_amount, target_month) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, input.name, input.category, input.priority, input.targetAmount, input.targetMonth]
    );
    return result.insertId;
  },

  async update(id: number, userId: number, input: ObjectiveBodyInput): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE financial_objectives SET name = ?, category = ?, priority = ?, target_amount = ?, target_month = ? WHERE id = ? AND user_id = ?",
      [input.name, input.category, input.priority, input.targetAmount, input.targetMonth, id, userId]
    );
    return result.affectedRows > 0;
  },

  async delete(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM financial_objectives WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  async listContributions(objectiveId: number): Promise<ContributionRow[]> {
    const [rows] = await pool.query<ContributionRow[]>(
      "SELECT * FROM objective_contributions WHERE objective_id = ? ORDER BY contributed_at DESC, id DESC",
      [objectiveId]
    );
    return rows;
  },

  async addContribution(objectiveId: number, input: ContributionBodyInput): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO objective_contributions (objective_id, amount, contributed_at, note) VALUES (?, ?, ?, ?)",
      [objectiveId, input.amount, input.contributedAt, input.note ?? null]
    );
    return result.insertId;
  },

  async findContributionByIdAndObjective(id: number, objectiveId: number): Promise<ContributionRow | null> {
    const [rows] = await pool.query<ContributionRow[]>(
      "SELECT * FROM objective_contributions WHERE id = ? AND objective_id = ? LIMIT 1",
      [id, objectiveId]
    );
    return rows[0] ?? null;
  },

  async removeContribution(id: number, objectiveId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM objective_contributions WHERE id = ? AND objective_id = ?",
      [id, objectiveId]
    );
    return result.affectedRows > 0;
  },

  async currentAmount(objectiveId: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM objective_contributions WHERE objective_id = ?",
      [objectiveId]
    );
    return Number(rows[0]?.total ?? 0);
  },

  /** Soma real de aportes por mês, entre todos os objetivos do usuário -- só meses com aporte, sem preencher lacuna. */
  async monthlyContributionsByUser(userId: number): Promise<{ month: string; total: number }[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(c.contributed_at, '%Y-%m') AS month, SUM(c.amount) AS total
       FROM objective_contributions c
       JOIN financial_objectives o ON o.id = c.objective_id
       WHERE o.user_id = ?
       GROUP BY month
       ORDER BY month ASC`,
      [userId]
    );
    return rows.map((row) => ({ month: String(row.month), total: Number(row.total) }));
  },
};
