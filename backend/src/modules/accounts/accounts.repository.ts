import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";
import type { AccountType } from "./accounts.validation";

export interface AccountRow extends RowDataPacket {
  id: number;
  user_id: number;
  type: AccountType;
  name: string;
  initial_balance: string;
  created_at: string;
}

export interface AccountWithBalanceRow extends AccountRow {
  balance: string;
}

export const accountsRepository = {
  /**
   * Saldo = initial_balance + soma das transações (entrada soma, saída
   * subtrai) -- nunca guardado, sempre derivado (mesmo princípio de
   * assets/debts/score). LEFT JOIN + subquery agregada por conta numa
   * query só, nunca N+1 por conta.
   */
  async listByUser(userId: number): Promise<AccountWithBalanceRow[]> {
    const [rows] = await pool.query<AccountWithBalanceRow[]>(
      `SELECT a.*,
              a.initial_balance + COALESCE(SUM(
                CASE WHEN t.type = 'entrada' THEN t.amount WHEN t.type = 'saida' THEN -t.amount ELSE 0 END
              ), 0) AS balance
       FROM accounts a
       LEFT JOIN transactions t ON t.account_id = a.id
       WHERE a.user_id = ?
       GROUP BY a.id
       ORDER BY a.created_at ASC`,
      [userId]
    );
    return rows;
  },

  async create(userId: number, input: { type: AccountType; name: string; initialBalance: number }): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO accounts (user_id, type, name, initial_balance) VALUES (?, ?, ?, ?)",
      [userId, input.type, input.name, input.initialBalance]
    );
    return result.insertId;
  },

  /** Conta "padrão" de um usuário -- a mais antiga (primeira criada, seedada no cadastro). Usada quando a transação não especifica conta (ex: importação CSV) e como valor inicial do formulário quando o usuário só tem uma. */
  async findDefaultForUser(userId: number): Promise<AccountRow | null> {
    const [rows] = await pool.query<AccountRow[]>(
      "SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at ASC, id ASC LIMIT 1",
      [userId]
    );
    return rows[0] ?? null;
  },

  async findByIdAndUser(id: number, userId: number): Promise<AccountRow | null> {
    const [rows] = await pool.query<AccountRow[]>("SELECT * FROM accounts WHERE id = ? AND user_id = ? LIMIT 1", [
      id,
      userId,
    ]);
    return rows[0] ?? null;
  },

  async countTransactions(accountId: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS total FROM transactions WHERE account_id = ?",
      [accountId]
    );
    return Number(rows[0]?.total ?? 0);
  },

  async remove(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM accounts WHERE id = ? AND user_id = ?", [
      id,
      userId,
    ]);
    return result.affectedRows > 0;
  },

  /**
   * Espelha assetsRepository.totalValueAsOf/debtsRepository.totalRemainingAsOf:
   * saldo de cada conta cortado em dateISO (transação depois dessa data não
   * conta ainda) -- base do patrimônio líquido histórico.
   */
  async totalBalanceAsOf(userId: number, dateISO: string): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(a.initial_balance), 0) + COALESCE(SUM(t.signed_amount), 0) AS total
       FROM accounts a
       LEFT JOIN (
         SELECT account_id, SUM(CASE WHEN type = 'entrada' THEN amount ELSE -amount END) AS signed_amount
         FROM transactions
         WHERE transaction_date <= ?
         GROUP BY account_id
       ) t ON t.account_id = a.id
       WHERE a.user_id = ?`,
      [dateISO, userId]
    );
    return Number(rows[0]?.total ?? 0);
  },
};
