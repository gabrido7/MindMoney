import { AppError } from "../../utils/AppError";
import { debtsRepository, type DebtRow, type DebtWithPaidRow, type DebtPaymentRow, type DebtPaymentWithDebtNameRow } from "./debts.repository";
import { categoriesRepository } from "../categories/categories.repository";
import { transactionsRepository } from "../transactions/transactions.repository";
import { notificationsService } from "../notifications/notifications.service";
import { daysUntilNextDueDay, nextDueDateISO } from "../../utils/month";
import { DEBT_DUE_MILESTONES, DEBT_PAYMENT_CATEGORY_NAME } from "../../config/rules";
import type { CreateDebtInput, DebtPaymentBodyInput } from "./debts.validation";

function enrich(row: DebtRow, paidAmount: number) {
  const totalAmount = Number(row.total_amount);
  const remainingAmount = Math.max(0, totalAmount - paidAmount);
  const progressPercent = totalAmount > 0 ? Math.min(100, (paidAmount / totalAmount) * 100) : 0;
  const paidOff = remainingAmount <= 0;

  return {
    id: row.id,
    type: row.type,
    name: row.name,
    totalAmount,
    installmentAmount: row.installment_amount !== null ? Number(row.installment_amount) : null,
    interestRate: row.interest_rate !== null ? Number(row.interest_rate) : null,
    installmentsCount: row.installments_count,
    dueDay: row.due_day,
    createdAt: row.created_at,
    paidAmount,
    remainingAmount,
    progressPercent,
    paidOff,
    // Só faz sentido "dias até o vencimento" pra dívida com dia definido e ainda em aberto.
    daysUntilDue: row.due_day !== null && !paidOff ? daysUntilNextDueDay(row.due_day) : null,
  };
}

function enrichWithPaid(row: DebtWithPaidRow) {
  return enrich(row, Number(row.paid_amount));
}

function enrichPayment(row: DebtPaymentRow) {
  return {
    id: row.id,
    amount: Number(row.amount),
    paidAt: row.paid_at,
    note: row.note,
    transactionId: row.transaction_id,
    createdAt: row.created_at,
  };
}

function enrichPaymentWithDebtName(row: DebtPaymentWithDebtNameRow) {
  return { ...enrichPayment(row), debtName: row.debt_name };
}

export type EnrichedDebt = ReturnType<typeof enrich>;
export type EnrichedDebtPayment = ReturnType<typeof enrichPayment>;
export type EnrichedDebtPaymentWithDebtName = ReturnType<typeof enrichPaymentWithDebtName>;

async function getEnriched(debtId: number, userId: number): Promise<EnrichedDebt> {
  const row = await debtsRepository.findByIdAndUser(debtId, userId);
  if (!row) throw AppError.notFound("Dívida não encontrada.");
  const paidAmount = await debtsRepository.paidAmount(debtId);
  return enrich(row, paidAmount);
}

/**
 * Avalia os 5 marcos de vencimento (30/15/7/3/0 dias antes) pra cada dívida
 * ativa -- sem cron: reavaliado sempre que a lista de dívidas é carregada,
 * mesmo espírito de objectivesService.summary()/checkObjectiveDeadline.
 * Cada dívida que bater um marco hoje recebe seu próprio alerta (não só "a
 * mais urgente" -- duas dívidas vencendo na mesma semana merecem dois
 * avisos). recordDueAlert garante que o mesmo marco, pro mesmo vencimento,
 * só notifica uma vez -- revisitar a página no mesmo dia não duplica, mas o
 * ciclo seguinte (devido muda de data todo mês) volta a disparar normal.
 */
async function checkDueDates(userId: number, debts: EnrichedDebt[]): Promise<void> {
  for (const debt of debts) {
    if (debt.dueDay === null || debt.daysUntilDue === null) continue;
    if (!DEBT_DUE_MILESTONES.includes(debt.daysUntilDue)) continue;

    const dueDate = nextDueDateISO(debt.dueDay);
    const isNew = await debtsRepository.recordDueAlert(debt.id, debt.daysUntilDue, dueDate);
    if (!isNew) continue;

    await notificationsService.checkDebtDueSoon(userId, { name: debt.name, daysRemaining: debt.daysUntilDue });
  }
}

export const debtsService = {
  async list(userId: number): Promise<EnrichedDebt[]> {
    const rows = await debtsRepository.listByUser(userId);
    const debts = rows.map(enrichWithPaid);
    await checkDueDates(userId, debts);
    return debts;
  },

  async create(userId: number, input: CreateDebtInput): Promise<EnrichedDebt> {
    const id = await debtsRepository.create(userId, {
      type: input.type,
      name: input.name,
      totalAmount: input.totalAmount,
      installmentAmount: input.installmentAmount ?? null,
      interestRate: input.interestRate ?? null,
      installmentsCount: input.installmentsCount ?? null,
      dueDay: input.dueDay ?? null,
    });
    const row = await debtsRepository.findByIdAndUser(id, userId);
    return enrich(row!, 0);
  },

  async remove(userId: number, id: number): Promise<void> {
    // De propósito: não apaga as transações já geradas pelos pagamentos dessa
    // dívida -- o dinheiro foi gasto de verdade, parar de rastrear a dívida
    // não deveria reescrever o histórico financeiro real do usuário.
    const removed = await debtsRepository.remove(id, userId);
    if (!removed) throw AppError.notFound("Dívida não encontrada.");
  },

  async listPayments(userId: number, debtId: number): Promise<EnrichedDebtPayment[]> {
    const debt = await debtsRepository.findByIdAndUser(debtId, userId);
    if (!debt) throw AppError.notFound("Dívida não encontrada.");
    const rows = await debtsRepository.listPayments(debtId);
    return rows.map(enrichPayment);
  },

  /** Histórico global: pagamentos de todas as dívidas do usuário, mais recentes primeiro. */
  async listAllPayments(userId: number): Promise<EnrichedDebtPaymentWithDebtName[]> {
    const rows = await debtsRepository.listAllPaymentsByUser(userId);
    return rows.map(enrichPaymentWithDebtName);
  },

  /**
   * Um pagamento de dívida é uma saída financeira real -- gera uma transação
   * de verdade na categoria "Dívidas" (seedada por padrão pra todo usuário,
   * ver migration 016), pra aparecer no Dashboard/score/orçamento por
   * categoria como qualquer outro gasto, e dispara os mesmos efeitos
   * colaterais que uma transação normal (checkAndNotify). Se por algum
   * motivo a categoria não existir (usuário apagou manualmente antes desta
   * migration), o pagamento ainda é salvo, só sem transação vinculada --
   * não falha a operação por causa disso.
   */
  async addPayment(userId: number, debtId: number, input: DebtPaymentBodyInput): Promise<EnrichedDebt> {
    const debt = await debtsRepository.findByIdAndUser(debtId, userId);
    if (!debt) throw AppError.notFound("Dívida não encontrada.");

    let transactionId: number | null = null;
    const category = await categoriesRepository.findByNameAndUser(DEBT_PAYMENT_CATEGORY_NAME, userId);
    if (category) {
      transactionId = await transactionsRepository.create(userId, {
        categoryId: category.id,
        description: `Pagamento — ${debt.name}`,
        amount: input.amount,
        type: "saida",
        transactionDate: input.paidAt,
      });
      await notificationsService.checkAndNotify(userId, input.paidAt.slice(0, 7));
    }

    await debtsRepository.createPayment(debtId, input, transactionId);
    return getEnriched(debtId, userId);
  },

  async removePayment(userId: number, debtId: number, paymentId: number): Promise<EnrichedDebt> {
    const debt = await debtsRepository.findByIdAndUser(debtId, userId);
    if (!debt) throw AppError.notFound("Dívida não encontrada.");

    const payment = await debtsRepository.findPaymentByIdAndDebt(paymentId, debtId);
    if (!payment) throw AppError.notFound("Pagamento não encontrado.");

    if (payment.transaction_id) {
      await transactionsRepository.delete(payment.transaction_id, userId);
    }
    await debtsRepository.removePayment(paymentId, debtId);
    return getEnriched(debtId, userId);
  },

  /**
   * Corrige um pagamento já lançado (valor, data ou nota errados) -- se
   * ele tiver uma transação vinculada, atualiza ela junto (mesmo valor/data/
   * descrição), pra não deixar o Dashboard/score com um número desatualizado.
   * transactionsRepository.update exige o objeto completo (não é PATCH
   * parcial), por isso reconstrói com a categoria "Dívidas" de novo.
   */
  async updatePayment(
    userId: number,
    debtId: number,
    paymentId: number,
    input: DebtPaymentBodyInput
  ): Promise<EnrichedDebt> {
    const debt = await debtsRepository.findByIdAndUser(debtId, userId);
    if (!debt) throw AppError.notFound("Dívida não encontrada.");

    const payment = await debtsRepository.findPaymentByIdAndDebt(paymentId, debtId);
    if (!payment) throw AppError.notFound("Pagamento não encontrado.");

    if (payment.transaction_id) {
      const category = await categoriesRepository.findByNameAndUser(DEBT_PAYMENT_CATEGORY_NAME, userId);
      if (category) {
        await transactionsRepository.update(payment.transaction_id, userId, {
          categoryId: category.id,
          description: `Pagamento — ${debt.name}`,
          amount: input.amount,
          type: "saida",
          transactionDate: input.paidAt,
        });
        await notificationsService.checkAndNotify(userId, input.paidAt.slice(0, 7));
      }
    }

    await debtsRepository.updatePayment(paymentId, debtId, input);
    return getEnriched(debtId, userId);
  },
};
