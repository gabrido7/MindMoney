import { transactionsRepository } from "../transactions/transactions.repository";
import { calcPercentChange, currentMonth, getPreviousMonth } from "../../utils/month";
import { ALERT_PERCENT, NEAR_ALERT_RATIO } from "../../config/rules";

type Totals = { entradas: number; saidas: number };
type CategoryBreakdown = { categoryId: number; name: string; color: string; value: number }[];

function alertFor(totals: Totals) {
  const gastoPercentual = totals.entradas > 0 ? (totals.saidas / totals.entradas) * 100 : 0;
  const status =
    totals.entradas > 0 && gastoPercentual > ALERT_PERCENT
      ? "over"
      : totals.entradas > 0 && gastoPercentual >= ALERT_PERCENT * NEAR_ALERT_RATIO
        ? "near"
        : "ok";
  return { status, gastoPercentual: Number(gastoPercentual.toFixed(1)), threshold: ALERT_PERCENT } as const;
}

async function buildMonthSummary(userId: number, month: string) {
  const previousMonth = getPreviousMonth(month);

  const [totals, previousTotals, categoryBreakdown] = await Promise.all([
    transactionsRepository.sumByTypeForMonth(userId, month),
    transactionsRepository.sumByTypeForMonth(userId, previousMonth),
    transactionsRepository.categoryBreakdownForMonth(userId, month),
  ]);

  const saldo = totals.entradas - totals.saidas;
  const previousSaldo = previousTotals.entradas - previousTotals.saidas;

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
    ranking: categoryBreakdown.slice(0, 3) as CategoryBreakdown,
    alert: alertFor(totals),
  };
}

export const dashboardService = {
  async build(userId: number, month: string = currentMonth()) {
    const [summary, evolution] = await Promise.all([
      buildMonthSummary(userId, month),
      transactionsRepository.monthlyEvolution(userId),
    ]);

    return { ...summary, evolution };
  },

  /**
   * Resumo de N meses numa chamada só. Existe pra substituir o padrão que
   * Relatórios usava antes (N chamadas separadas a build(), uma por mês
   * exibido) -- monthlyEvolution() já traz o histórico completo, então só
   * precisa ser buscado uma vez aqui, não uma vez por mês do intervalo.
   */
  async buildRange(userId: number, months: number, endMonth: string = currentMonth()) {
    const monthList: string[] = [];
    let cursor = endMonth;
    for (let i = 0; i < months; i++) {
      monthList.push(cursor);
      cursor = getPreviousMonth(cursor);
    }
    monthList.reverse();

    const [summaries, evolution] = await Promise.all([
      Promise.all(monthList.map((month) => buildMonthSummary(userId, month))),
      transactionsRepository.monthlyEvolution(userId),
    ]);

    return { months: summaries, evolution };
  },
};
