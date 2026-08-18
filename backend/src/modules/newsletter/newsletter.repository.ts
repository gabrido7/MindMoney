import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";

export interface NewsletterSubscriberRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export const newsletterRepository = {
  async findByEmail(email: string): Promise<NewsletterSubscriberRow | null> {
    const [rows] = await pool.query<NewsletterSubscriberRow[]>(
      "SELECT * FROM newsletter_subscribers WHERE email = ? LIMIT 1",
      [email]
    );
    return rows[0] ?? null;
  },

  async create(name: string, email: string): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO newsletter_subscribers (name, email) VALUES (?, ?)",
      [name, email]
    );
    return result.insertId;
  },
};
