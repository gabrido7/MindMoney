import { addMonths, currentMonth, monthsBetween } from "../../../utils/formatters";

export interface GoalSimulation {
  monthsNeeded: number;
  projectedMonth: string;
  /** > 0: projeção fica depois do prazo atual; < 0: fica antes; 0: no mesmo mês. */
  deltaVsDeadlineMonths: number;
  /** Nesse ritmo, levaria mais de 50 anos -- uma data exata não diz muita coisa útil aqui. */
  tooFar: boolean;
}

const TOO_FAR_MONTHS = 240; // 20 anos -- além disso, uma data exata de calendário deixa de ser útil

/** Cálculo puro (sem chamada ao backend): dado o que falta e um valor mensal hipotético, quando a meta seria atingida. */
export function simulateGoal(
  remainingAmount: number,
  targetMonth: string,
  hypotheticalMonthlyAmount: number
): GoalSimulation | null {
  if (!(hypotheticalMonthlyAmount > 0)) return null;

  const monthsNeeded = Math.max(Math.ceil(remainingAmount / hypotheticalMonthlyAmount), 0);
  const projectedMonth = addMonths(currentMonth(), monthsNeeded);

  return {
    monthsNeeded,
    projectedMonth,
    deltaVsDeadlineMonths: monthsBetween(targetMonth, projectedMonth),
    tooFar: monthsNeeded > TOO_FAR_MONTHS,
  };
}
