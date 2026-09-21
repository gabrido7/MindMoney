import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";
import type { DebtType, DebtPaymentBodyInput } from "./debts.validation";

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
  paid_off_notified_at: string | null;
  created_at: string;
}

export interface DebtWithPaidRow extends DebtRow {
  paid_amount: string;
}

export interface DebtPaymentRow extends RowDataPacket {
  id: number;
  debt_id: number;
  amount: string;
  paid_at: string;
  note: string | null;
  transaction_id: number | null;
  created_at: string;
}

export interface DebtPaymentWithDebtNameRow extends DebtPaymentRow {
  debt_name: string;
}

export const debtsRepository = {
  /**
   * Uma query só (LEFT JOIN + agregação), nunca N+1 buscando pagamentos
   * separadamente por dívida. `p.paid_at <= ?` no próprio JOIN (não WHERE)
   * de propósito -- filtra só o que entra na soma, sem derrubar a linha da
   * dívida quando todos os pagamentos dela são parcelas futuras (LEFT JOIN +
   * COALESCE ainda devolve paid_amount=0 nesse caso). Parcela agendada pro
   * futuro (ver installmentDueDates) ainda não é dinheiro pago de verdade --
   * mesmo raciocínio já usado em totalRemainingAsOf. `asOfDate` é um
   * parâmetro (não CURDATE() direto no SQL) pelo mesmo motivo de
   * totalRemainingAsOf: quem decide "o que é hoje" é a camada de aplicação
   * (utils/month.todayISO), não o relógio do servidor MySQL -- testável com
   * vi.setSystemTime, já que o MySQL não tem como ser "congelado" junto.
   */
  async listByUser(userId: number, asOfDate: string): Promise<DebtWithPaidRow[]> {
    const [rows] = await pool.query<DebtWithPaidRow[]>(
      `SELECT d.*, COALESCE(SUM(p.amount), 0) AS paid_amount
       FROM debts d
       LEFT JOIN debt_payments p ON p.debt_id = d.id AND p.paid_at <= ?
       WHERE d.user_id = ?
       GROUP BY d.id
       ORDER BY d.created_at DESC`,
      [asOfDate, userId]
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

  /** Só pagamentos já realizados (paid_at <= asOfDate) -- parcela agendada pro futuro não conta como paga ainda, ver listByUser. */
  async paidAmount(debtId: number, asOfDate: string): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM debt_payments WHERE debt_id = ? AND paid_at <= ?",
      [debtId, asOfDate]
    );
    return Number(rows[0]?.total ?? 0);
  },

  async listPayments(debtId: number): Promise<DebtPaymentRow[]> {
    const [rows] = await pool.query<DebtPaymentRow[]>(
      "SELECT * FROM debt_payments WHERE debt_id = ? ORDER BY paid_at DESC, id DESC",
      [debtId]
    );
    return rows;
  },

  /** Todos os pagamentos do usuário, de todas as dívidas, com o nome da dívida já junto -- pro histórico global. */
  async listAllPaymentsByUser(userId: number): Promise<DebtPaymentWithDebtNameRow[]> {
    const [rows] = await pool.query<DebtPaymentWithDebtNameRow[]>(
      `SELECT p.*, d.name AS debt_name
       FROM debt_payments p
       JOIN debts d ON d.id = p.debt_id
       WHERE d.user_id = ?
       ORDER BY p.paid_at DESC, p.id DESC`,
      [userId]
    );
    return rows;
  },

  async createPayment(
    debtId: number,
    input: DebtPaymentBodyInput,
    transactionId: number | null
  ): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO debt_payments (debt_id, amount, paid_at, note, transaction_id) VALUES (?, ?, ?, ?, ?)",
      [debtId, input.amount, input.paidAt, input.note ?? null, transactionId]
    );
    return result.insertId;
  },

  async findPaymentByIdAndDebt(id: number, debtId: number): Promise<DebtPaymentRow | null> {
    const [rows] = await pool.query<DebtPaymentRow[]>(
      "SELECT * FROM debt_payments WHERE id = ? AND debt_id = ? LIMIT 1",
      [id, debtId]
    );
    return rows[0] ?? null;
  },

  async removePayment(id: number, debtId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM debt_payments WHERE id = ? AND debt_id = ?",
      [id, debtId]
    );
    return result.affectedRows > 0;
  },

  async updatePayment(id: number, debtId: number, input: DebtPaymentBodyInput): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE debt_payments SET amount = ?, paid_at = ?, note = ? WHERE id = ? AND debt_id = ?",
      [input.amount, input.paidAt, input.note ?? null, id, debtId]
    );
    return result.affectedRows > 0;
  },

  /** INSERT IGNORE -- devolve true só quando o marco é realmente novo (não tinha sido registrado ainda pra esse vencimento específico). Base do dedupe do alerta de vencimento (ver debts.service.checkDueDates). */
  async recordDueAlert(debtId: number, milestoneDays: number, dueDate: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT IGNORE INTO debt_due_alerts (debt_id, milestone_days, due_date) VALUES (?, ?, ?)",
      [debtId, milestoneDays, dueDate]
    );
    return result.affectedRows > 0;
  },

  /**
   * Snapshot de quanto o usuário devia numa data no passado -- mesma lógica
   * de saldo por dívida do enrich() (GREATEST(total-pago,0), nunca
   * negativo), só que "pago" e "existia" são cortados em dateISO em vez de
   * hoje. Dívida criada depois de dateISO não entra (d.created_at <= ?);
   * pagamento feito depois de dateISO não conta como pago ainda
   * (paid_at <= ? dentro do subquery). Usado pra comparar a dívida total de
   * hoje com a de meses atrás (tendência real, não só o snapshot atual).
   */
  async totalRemainingAsOf(userId: number, dateISO: string): Promise<number> {
    // DATE(d.created_at) de propósito -- d.created_at é TIMESTAMP (tem hora
    // real), e comparar direto "TIMESTAMP <= '2026-09-02'" MySQL trata como
    // "<= 2026-09-02 00:00:00", excluindo qualquer dívida criada mais tarde
    // no PRÓPRIO dia (confirmado: NOW() <= CURDATE() é falso). O que
    // queremos é "criada até esse dia civil", não até esse instante exato.
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(GREATEST(d.total_amount - COALESCE(paid.amount, 0), 0)), 0) AS remaining
       FROM debts d
       LEFT JOIN (
         SELECT debt_id, SUM(amount) AS amount FROM debt_payments WHERE paid_at <= ? GROUP BY debt_id
       ) paid ON paid.debt_id = d.id
       WHERE d.user_id = ? AND DATE(d.created_at) <= ?`,
      [dateISO, userId, dateISO]
    );
    return Number(rows[0]?.remaining ?? 0);
  },

  /**
   * Data do pagamento REALIZADO mais recente de cada dívida do usuário (null
   * se a dívida nunca recebeu pagamento) -- base da regra de "atrasada"
   * (ver debts.service.computeStatus) e de debtAdvice.service. Parcela
   * agendada pro futuro não conta aqui: se contasse, uma dívida com 12
   * parcelas pré-geradas pareceria "em dia" por causa de um pagamento que
   * ainda nem aconteceu. LEFT JOIN de propósito: dívida sem nenhum
   * pagamento realizado ainda precisa aparecer, com last_paid_at nulo.
   */
  async lastPaymentDates(userId: number, asOfDate: string): Promise<{ debtId: number; lastPaidAt: string | null }[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT d.id AS debt_id, MAX(p.paid_at) AS last_paid_at
       FROM debts d
       LEFT JOIN debt_payments p ON p.debt_id = d.id AND p.paid_at <= ?
       WHERE d.user_id = ?
       GROUP BY d.id`,
      [asOfDate, userId]
    );
    return rows.map((r) => ({ debtId: r.debt_id, lastPaidAt: r.last_paid_at ?? null }));
  },

  /** Mesma coisa que lastPaymentDates, mas pra uma única dívida -- usado nos caminhos que já têm o id (create/addPayment/etc.), evitando buscar a lista inteira do usuário só pra recalcular o status de uma dívida. */
  async lastPaymentDate(debtId: number, asOfDate: string): Promise<string | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT MAX(paid_at) AS last_paid_at FROM debt_payments WHERE debt_id = ? AND paid_at <= ?",
      [debtId, asOfDate]
    );
    return rows[0]?.last_paid_at ?? null;
  },

  /**
   * IDs das transações ligadas a parcelas ainda não realizadas (paid_at no
   * futuro) -- usado por remove() pra apagar só o que ainda não é dinheiro
   * gasto de verdade. Pagamento passado nunca entra aqui (mesmo princípio
   * de sempre: histórico financeiro real não é reescrito).
   */
  async futurePaymentTransactionIds(debtId: number, asOfDate: string): Promise<number[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT transaction_id FROM debt_payments WHERE debt_id = ? AND paid_at > ? AND transaction_id IS NOT NULL",
      [debtId, asOfDate]
    );
    return rows.map((r) => r.transaction_id as number);
  },

  /** Marca que a comemoração de quitação (XP + notificação) já disparou pra essa dívida -- evita disparar de novo a cada list() (ver debts.service.list). */
  async markPaidOffNotified(debtId: number): Promise<void> {
    await pool.query("UPDATE debts SET paid_off_notified_at = NOW() WHERE id = ?", [debtId]);
  },
};
