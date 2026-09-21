import { AppError } from "../../utils/AppError";
import { debtsRepository, type DebtRow, type DebtWithPaidRow, type DebtPaymentRow, type DebtPaymentWithDebtNameRow } from "./debts.repository";
import { categoriesRepository } from "../categories/categories.repository";
import { accountsRepository } from "../accounts/accounts.repository";
import { transactionsRepository } from "../transactions/transactions.repository";
import { notificationsService } from "../notifications/notifications.service";
import { gamificationService, type GamificationResult } from "../gamification/gamification.service";
import { currentMonth, daysUntilNextDueDay, installmentDueDates, nextDueDateISO, todayISO } from "../../utils/month";
import { computeMilestone } from "../../utils/milestones";
import { DEBT_DUE_MILESTONES, DEBT_PAYMENT_CATEGORY_NAME } from "../../config/rules";
import type { CreateDebtInput, DebtPaymentBodyInput } from "./debts.validation";

const PAYMENT_CONSISTENCY_DAYS = 45; // mesmo limiar de debtAdvice.service.ts -- fonte única de verdade agora
const DAY_MS = 1000 * 60 * 60 * 24;

/**
 * "atrasada" não é o simples "dueDay já passou" -- daysUntilNextDueDay
 * sempre aponta pra frente (rola pro mês seguinte automaticamente), então
 * não existe um jeito de ler "venceu e não foi pago" só olhando a próxima
 * data. O sinal real é comportamental: dívida com parcela esperada (não
 * importa se tem dueDay definido ou não -- installmentAmount já basta pra
 * saber que existe um ciclo de pagamento esperado), madura o bastante pra
 * já ter passado por um ciclo (>= PAYMENT_CONSISTENCY_DAYS desde que foi
 * criada), sem nenhum pagamento nesse mesmo intervalo.
 */
function computeStatus(
  paidOff: boolean,
  installmentAmount: number | null,
  createdAt: string,
  lastPaidAt: string | null
): "ativa" | "atrasada" | "quitada" {
  if (paidOff) return "quitada";
  if (installmentAmount === null) return "ativa";

  const ageDays = (Date.now() - new Date(createdAt).getTime()) / DAY_MS;
  if (ageDays < PAYMENT_CONSISTENCY_DAYS) return "ativa";

  const daysSincePayment = lastPaidAt ? (Date.now() - new Date(lastPaidAt).getTime()) / DAY_MS : Infinity;
  return daysSincePayment >= PAYMENT_CONSISTENCY_DAYS ? "atrasada" : "ativa";
}

function enrich(row: DebtRow, paidAmount: number, lastPaidAt: string | null) {
  const totalAmount = Number(row.total_amount);
  const remainingAmount = Math.max(0, totalAmount - paidAmount);
  const progressPercent = totalAmount > 0 ? Math.min(100, (paidAmount / totalAmount) * 100) : 0;
  const paidOff = remainingAmount <= 0;
  const installmentAmount = row.installment_amount !== null ? Number(row.installment_amount) : null;

  return {
    id: row.id,
    type: row.type,
    name: row.name,
    totalAmount,
    installmentAmount,
    interestRate: row.interest_rate !== null ? Number(row.interest_rate) : null,
    installmentsCount: row.installments_count,
    dueDay: row.due_day,
    createdAt: row.created_at,
    paidAmount,
    remainingAmount,
    progressPercent,
    paidOff,
    status: computeStatus(paidOff, installmentAmount, row.created_at, lastPaidAt),
    // Só faz sentido "dias até o vencimento" pra dívida com dia definido e ainda em aberto.
    daysUntilDue: row.due_day !== null && !paidOff ? daysUntilNextDueDay(row.due_day) : null,
  };
}

function enrichWithPaid(row: DebtWithPaidRow, lastPaidAt: string | null) {
  return enrich(row, Number(row.paid_amount), lastPaidAt);
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
  const asOfDate = todayISO();
  const [paidAmount, lastPaidAt] = await Promise.all([
    debtsRepository.paidAmount(debtId, asOfDate),
    debtsRepository.lastPaymentDate(debtId, asOfDate),
  ]);
  return enrich(row, paidAmount, lastPaidAt);
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

/**
 * Quitação de uma dívida com parcelas pré-agendadas (ver generateInstallments)
 * acontece só porque o tempo passou -- nenhuma mutação dispara isso, ao
 * contrário de addPayment. Reavaliado a cada list() (mesmo padrão de
 * checkDueDates), com o mesmo dedupe "marca primeiro, só notifica se era
 * novo": paid_off_notified_at evita comemorar (XP + notificação) a mesma
 * quitação duas vezes -- addPayment também marca essa coluna quando é ELE
 * quem cruza 100%, então os dois caminhos nunca se pisam.
 */
async function checkNaturalPayoffs(userId: number, rows: DebtWithPaidRow[], debts: EnrichedDebt[]): Promise<void> {
  const notifiedAtByDebt = new Map(rows.map((r) => [r.id, r.paid_off_notified_at]));
  for (const debt of debts) {
    if (!debt.paidOff || notifiedAtByDebt.get(debt.id)) continue;

    await debtsRepository.markPaidOffNotified(debt.id);
    await gamificationService.processDebtPaidOff(userId, debt.id);
    await notificationsService.notifyDebtPaidOff(userId, debt.name);
  }
}

/**
 * Gera de uma vez as N parcelas futuras de uma compra parcelada -- cada uma
 * vira uma transação real (mesmo mecanismo de addPayment: categoria
 * "Dívidas") e uma linha de debt_payments já ligada a ela, datada no
 * vencimento daquele mês (installmentDueDates, clamp de fim de mês
 * independente por parcela). checkAndNotify só roda pro mês corrente, se
 * alguma parcela cair nele -- reavaliar limite/orçamento de meses que ainda
 * nem chegaram na hora do cadastro não faz sentido.
 */
async function generateInstallments(
  userId: number,
  debtId: number,
  debtName: string,
  installmentAmount: number,
  installmentsCount: number,
  dueDay: number
): Promise<void> {
  const dates = installmentDueDates(dueDay, installmentsCount);
  const [category, account] = await Promise.all([
    categoriesRepository.findByNameAndUser(DEBT_PAYMENT_CATEGORY_NAME, userId),
    accountsRepository.findDefaultForUser(userId),
  ]);

  let notifiedCurrentMonth = false;
  for (let i = 0; i < dates.length; i++) {
    const paidAt = dates[i];
    const label = `Parcela ${i + 1}/${installmentsCount}`;

    let transactionId: number | null = null;
    if (category && account) {
      transactionId = await transactionsRepository.create(userId, {
        accountId: account.id,
        categoryId: category.id,
        description: `${label} — ${debtName}`,
        amount: installmentAmount,
        type: "saida",
        transactionDate: paidAt,
      });
    }

    await debtsRepository.createPayment(debtId, { amount: installmentAmount, paidAt, note: label }, transactionId);

    if (category && !notifiedCurrentMonth && paidAt.slice(0, 7) === currentMonth()) {
      notifiedCurrentMonth = true;
      await notificationsService.checkAndNotify(userId, paidAt.slice(0, 7));
    }
  }
}

export const debtsService = {
  async list(userId: number): Promise<EnrichedDebt[]> {
    const asOfDate = todayISO();
    const [rows, lastPayments] = await Promise.all([
      debtsRepository.listByUser(userId, asOfDate),
      debtsRepository.lastPaymentDates(userId, asOfDate),
    ]);
    const lastPaidByDebt = new Map(lastPayments.map((p) => [p.debtId, p.lastPaidAt]));
    const debts = rows.map((row) => enrichWithPaid(row, lastPaidByDebt.get(row.id) ?? null));
    await checkDueDates(userId, debts);
    await checkNaturalPayoffs(userId, rows, debts);
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

    if (input.autoGenerateInstallments && input.installmentAmount && input.installmentsCount && input.dueDay) {
      await generateInstallments(
        userId,
        id,
        input.name,
        input.installmentAmount,
        input.installmentsCount,
        input.dueDay
      );
    }

    return getEnriched(id, userId);
  },

  async remove(userId: number, id: number): Promise<void> {
    const debt = await debtsRepository.findByIdAndUser(id, userId);
    if (!debt) throw AppError.notFound("Dívida não encontrada.");

    // Pagamento passado não é apagado, de propósito: o dinheiro foi gasto de
    // verdade, parar de rastrear a dívida não deveria reescrever o histórico
    // financeiro real do usuário. Parcela FUTURA (pré-agendada, ver
    // generateInstallments) é diferente -- ainda não é dinheiro gasto de
    // verdade, então some junto com a dívida (debt_payments em si já
    // cascateia via FK ao apagar debts).
    const futureTransactionIds = await debtsRepository.futurePaymentTransactionIds(id, todayISO());
    for (const transactionId of futureTransactionIds) {
      await transactionsRepository.delete(transactionId, userId);
    }

    await debtsRepository.remove(id, userId);
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
  /**
   * Além de registrar o pagamento (ver doc acima), detecta se ELE PRÓPRIO
   * fez o progresso da dívida cruzar um marco (25/50/75/100%) -- mesmo
   * padrão de objectivesService.addContribution, incluindo o motivo de só
   * comparar antes/depois (senão uma dívida já em 80% "comemoraria" 25%/50%
   * de novo a cada pagamento). Só ao cruzar 100% (quitada de vez) é que
   * ganha XP + roda as checagens de conquista; qualquer outro pagamento
   * ainda roda as checagens de conquista sem XP novo (checkFinancialAchievements),
   * porque "patrimônio no azul" pode passar a valer em QUALQUER pagamento
   * que reduza a dívida o suficiente, não só num que quite ela inteira.
   */
  async addPayment(
    userId: number,
    debtId: number,
    input: DebtPaymentBodyInput
  ): Promise<{ debt: EnrichedDebt; milestoneReached: number | null; gamification: GamificationResult | null }> {
    const debt = await debtsRepository.findByIdAndUser(debtId, userId);
    if (!debt) throw AppError.notFound("Dívida não encontrada.");

    const totalAmount = Number(debt.total_amount);
    const previousPaidAmount = await debtsRepository.paidAmount(debtId, todayISO());
    const previousProgressPercent = totalAmount > 0 ? Math.min(100, (previousPaidAmount / totalAmount) * 100) : 0;

    let transactionId: number | null = null;
    const [category, account] = await Promise.all([
      categoriesRepository.findByNameAndUser(DEBT_PAYMENT_CATEGORY_NAME, userId),
      accountsRepository.findDefaultForUser(userId),
    ]);
    if (category && account) {
      transactionId = await transactionsRepository.create(userId, {
        accountId: account.id,
        categoryId: category.id,
        description: `Pagamento — ${debt.name}`,
        amount: input.amount,
        type: "saida",
        transactionDate: input.paidAt,
      });
      await notificationsService.checkAndNotify(userId, input.paidAt.slice(0, 7));
    }

    await debtsRepository.createPayment(debtId, input, transactionId);
    const enriched = await getEnriched(debtId, userId);

    const milestoneReached = computeMilestone(previousProgressPercent, enriched.progressPercent);
    const gamification =
      milestoneReached === 100
        ? await gamificationService.processDebtPaidOff(userId, debtId)
        : await gamificationService.checkFinancialAchievements(userId);

    if (milestoneReached === 100) {
      await notificationsService.notifyDebtPaidOff(userId, debt.name);
      // Marca aqui também -- se essa dívida tiver parcelas futuras pré-agendadas
      // que nunca vão ser lançadas (quitada antes da hora por este pagamento
      // extra), checkNaturalPayoffs não pode comemorar de novo quando o list()
      // seguinte reavaliar.
      await debtsRepository.markPaidOffNotified(debtId);
    }
    if (gamification.newAchievements.some((a) => a.id === "patrimonio-no-azul")) {
      await notificationsService.notifyNetWorthPositive(userId);
    }

    return { debt: enriched, milestoneReached, gamification };
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
      const [category, existingTransaction] = await Promise.all([
        categoriesRepository.findByNameAndUser(DEBT_PAYMENT_CATEGORY_NAME, userId),
        transactionsRepository.findByIdAndUser(payment.transaction_id, userId),
      ]);
      if (category && existingTransaction) {
        await transactionsRepository.update(payment.transaction_id, userId, {
          accountId: existingTransaction.account_id,
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
