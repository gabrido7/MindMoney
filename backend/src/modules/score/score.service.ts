import { transactionsRepository } from "../transactions/transactions.repository";
import { goalsRepository } from "../goals/goals.repository";
import { currentMonth } from "../../utils/month";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * Score financeiro (0-100), calculado sob demanda a partir de transações e
 * metas — nunca persistido (é dado derivado, ver database/README.md). Duas
 * componentes de 50 pontos cada, primeira versão da fórmula:
 *
 *  - controle de gastos: quanto menor o % das entradas gasto no mês, maior
 *    a pontuação (0% gasto = 50 pts; 100%+ gasto = 0 pts).
 *  - meta de economia: quanto mais perto (ou acima) da meta do mês, maior a
 *    pontuação. Sem meta definida, entra com metade dos pontos (neutro).
 */
export const scoreService = {
  async calculate(userId: number, month: string = currentMonth()) {
    const totals = await transactionsRepository.sumByTypeForMonth(userId, month);
    const saldo = totals.entradas - totals.saidas;

    const gastoPercentual = totals.entradas > 0 ? (totals.saidas / totals.entradas) * 100 : 0;
    const spendingControl =
      totals.entradas > 0 ? Math.round(clamp(50 * (1 - gastoPercentual / 100), 0, 50)) : 0;

    const goal = await goalsRepository.findByMonth(userId, month);
    const goalAchievement = goal
      ? Math.round(clamp(50 * (saldo / goal.target_amount), 0, 50))
      : 25;

    const score = spendingControl + goalAchievement;

    return {
      month,
      score,
      breakdown: {
        spendingControl,
        goalAchievement,
        hasGoal: Boolean(goal),
        gastoPercentual: Number(gastoPercentual.toFixed(1)),
      },
    };
  },
};
