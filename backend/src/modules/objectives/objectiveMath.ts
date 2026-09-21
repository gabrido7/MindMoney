import { monthsBetween, currentMonth } from "../../utils/month";
import type { ObjectiveWithCurrentRow } from "./objectives.repository";

export interface ObjectiveStatus {
  achieved: boolean;
  overdue: boolean;
  monthsRemaining: number;
  remainingAmount: number;
  requiredMonthlyAmount: number;
}

/**
 * Status derivado de um objetivo (achieved/overdue/quanto falta guardar por
 * mês) -- função pura, sem dependência de outro módulo de serviço. Extraída
 * de objectives.service.enrich() porque score.service e notifications.service
 * também precisam desse cálculo, e importar objectives.service diretamente
 * criaria um ciclo (objectives.service já importa notifications.service pro
 * aviso de prazo, e score fica mais simples sem carregar o serviço inteiro
 * só pra somar um número).
 */
export function computeObjectiveStatus(row: ObjectiveWithCurrentRow): ObjectiveStatus {
  const currentAmount = Number(row.current_amount);
  const targetAmount = Number(row.target_amount);
  const achieved = currentAmount >= targetAmount;
  const remainingAmount = Math.max(targetAmount - currentAmount, 0);

  const rawMonthsRemaining = monthsBetween(currentMonth(), row.target_month);
  const overdue = !achieved && rawMonthsRemaining < 0;
  const monthsRemaining = Math.max(rawMonthsRemaining, 0);
  const requiredMonthlyAmount = achieved || overdue ? 0 : remainingAmount / Math.max(monthsRemaining, 1);

  return { achieved, overdue, monthsRemaining, remainingAmount, requiredMonthlyAmount };
}

/**
 * "Meta do mês" derivada: soma de requiredMonthlyAmount entre os objetivos
 * ativos (não atingidos, não atrasados) do usuário -- não existe tabela
 * própria de meta mensal, ela nasce da soma do que os objetivos reais
 * exigem pra ficar no prazo.
 */
export function monthlySavingsTarget(rows: ObjectiveWithCurrentRow[]): number {
  return rows.reduce((sum, row) => {
    const { achieved, overdue, requiredMonthlyAmount } = computeObjectiveStatus(row);
    return achieved || overdue ? sum : sum + requiredMonthlyAmount;
  }, 0);
}
