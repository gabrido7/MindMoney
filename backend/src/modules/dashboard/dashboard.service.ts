import { transactionsRepository } from "../transactions/transactions.repository";
import { goalsRepository } from "../goals/goals.repository";
import { calcPercentChange, currentMonth, getPreviousMonth } from "../../utils/month";

const ALERT_PERCENT = 70;

export const dashboardService = {
  async build(userId: number, month: string = currentMonth()) {
    const previousMonth = getPreviousMonth(month);

    const [totals, previousTotals, categoryBreakdown, evolution, goal] = await Promise.all([
      transactionsRepository.sumByTypeForMonth(userId, month),
      transactionsRepository.sumByTypeForMonth(userId, previousMonth),
      transactionsRepository.categoryBreakdownForMonth(userId, month),
      transactionsRepository.monthlyEvolution(userId),
      goalsRepository.findByMonth(userId, month),
    ]);

    const saldo = totals.entradas - totals.saidas;
    const previousSaldo = previousTotals.entradas - previousTotals.saidas;

    const gastoPercentual = totals.entradas > 0 ? (totals.saidas / totals.entradas) * 100 : 0;
    const alertStatus =
      totals.entradas > 0 && gastoPercentual > ALERT_PERCENT
        ? "over"
        : totals.entradas > 0 && gastoPercentual >= ALERT_PERCENT * 0.8
          ? "near"
          : "ok";

    return {
      month,
      totals: { ...totals, saldo },
      previousMonth: { month: previousMonth, ...previousTotals, saldo: previousSaldo },
      changes: {
        entradas: calcPercentChange(totals.entradas, previousTotals.entradas),
        saidas: calcPercentChange(totals.saidas, previousTotals.saidas),
        saldo: calcPercentChange(saldo, previousSaldo),
      },
      categoryBreakdown,
      ranking: categoryBreakdown.slice(0, 3),
      evolution,
      goal: goal
        ? {
            id: goal.id,
            targetAmount: goal.target_amount,
            progressPercent: goal.target_amount > 0 ? (saldo / goal.target_amount) * 100 : 0,
          }
        : null,
      alert: { status: alertStatus, gastoPercentual: Number(gastoPercentual.toFixed(1)), threshold: ALERT_PERCENT },
    };
  },
};
