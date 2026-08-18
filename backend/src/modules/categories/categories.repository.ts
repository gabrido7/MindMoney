import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";

export interface CategoryRow extends RowDataPacket {
  id: number;
  user_id: number;
  name: string;
  color: string;
  type: "entrada" | "saida" | "ambos";
  is_builtin: number;
  archived_at: string | null;
}

export interface SubcategoryRow extends RowDataPacket {
  id: number;
  category_id: number;
  name: string;
  color: string;
  archived_at: string | null;
}

export const categoriesRepository = {
  async findAllByUser(userId: number): Promise<CategoryRow[]> {
    const [rows] = await pool.query<CategoryRow[]>(
      "SELECT * FROM categories WHERE user_id = ? AND archived_at IS NULL ORDER BY id ASC",
      [userId]
    );
    return rows;
  },

  async findByIdAndUser(id: number, userId: number): Promise<CategoryRow | null> {
    const [rows] = await pool.query<CategoryRow[]>(
      "SELECT * FROM categories WHERE id = ? AND user_id = ? LIMIT 1",
      [id, userId]
    );
    return rows[0] ?? null;
  },

  async findSubcategories(categoryId: number): Promise<SubcategoryRow[]> {
    const [rows] = await pool.query<SubcategoryRow[]>(
      "SELECT * FROM subcategories WHERE category_id = ? AND archived_at IS NULL ORDER BY id ASC",
      [categoryId]
    );
    return rows;
  },

  async findSubcategoryByIdAndCategory(id: number, categoryId: number): Promise<SubcategoryRow | null> {
    const [rows] = await pool.query<SubcategoryRow[]>(
      "SELECT * FROM subcategories WHERE id = ? AND category_id = ? LIMIT 1",
      [id, categoryId]
    );
    return rows[0] ?? null;
  },

  async findByNameAndUser(name: string, userId: number): Promise<CategoryRow | null> {
    const [rows] = await pool.query<CategoryRow[]>(
      "SELECT * FROM categories WHERE user_id = ? AND name = ? LIMIT 1",
      [userId, name]
    );
    return rows[0] ?? null;
  },

  async create(userId: number, name: string, color: string, type: string): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO categories (user_id, name, color, type, is_builtin) VALUES (?, ?, ?, ?, FALSE)",
      [userId, name, color, type]
    );
    return result.insertId;
  },

  async archive(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE categories SET archived_at = NOW() WHERE id = ? AND user_id = ? AND is_builtin = FALSE AND archived_at IS NULL",
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  async findSubcategoryByNameAndCategory(name: string, categoryId: number): Promise<SubcategoryRow | null> {
    const [rows] = await pool.query<SubcategoryRow[]>(
      "SELECT * FROM subcategories WHERE category_id = ? AND name = ? LIMIT 1",
      [categoryId, name]
    );
    return rows[0] ?? null;
  },

  async createSubcategory(categoryId: number, name: string, color: string): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO subcategories (category_id, name, color) VALUES (?, ?, ?)",
      [categoryId, name, color]
    );
    return result.insertId;
  },

  async archiveSubcategory(id: number, categoryId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE subcategories SET archived_at = NOW() WHERE id = ? AND category_id = ? AND archived_at IS NULL",
      [id, categoryId]
    );
    return result.affectedRows > 0;
  },
};
