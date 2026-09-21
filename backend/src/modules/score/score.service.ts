import { transactionsRepository } from "../transactions/transactions.repository";
import { objectivesRepository } from "../objectives/objectives.repository";
import { monthlySavingsTarget } from "../objectives/objectiveMath";
import { scoreRepository } from "./score.repository";
import { currentMonth, getPreviousMonth } from "../../utils/month";
import { ALERT_PERCENT, SAVINGS_RATE_FULL_SCORE } from "../../config/rules";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export type ScoreLevel = "Excelente" | "Bom" | "Regular" | "Atenção" | "Crítico";

const levelFor = (score: number): ScoreLevel => {
  if (score >= 80) return "Excelente";
  if (score >= 60) return "Bom";
  if (score >= 40) return "Regular";
  if (score >= 20) return "Atenção";
  return "Crítico";
};

/**
 * Score financeiro (0-100), quatro componentes determinísticos que somam
 * 100 pontos. A cada consulta o valor é recalculado a partir de
 * transações/metas reais e gravado em financial_score_history (upsert) —
 * funciona como um cache sempre atualizado, não como um livro-razão
 * imutável, então editar uma transação de um mês passado atualiza o score
 * daquele mês na próxima vez que for consultado.
 *
 *  1) Controle de gastos (0-40): quanto menor a % das entradas gasta no
 *     mês, maior a pontuação. 0% gasto = 40 pts; 100%+ gasto = 0 pts.
 *  2) Capacidade de economia (0-30): se há objetivo(s) financeiro(s) ativos
 *     (não atingidos, não atrasados) no mês corrente, usa o progresso contra
 *     a soma do "quanto precisa guardar por mês" de cada um
 *     (monthlySavingsTarget, ver objectiveMath.ts) -- não existe tabela
 *     própria de "meta mensal", ela é derivada dos objetivos reais do
 *     usuário. Sem objetivo ativo, usa uma taxa de poupança genérica:
 *     guardar 20% ou mais das entradas já vale os 30 pontos cheios
 *     (referência comum de educação financeira), 0% ou negativo vale 0.
 *  3) Evolução financeira (0-15): compara o saldo deste mês com o do mês
 *     anterior, normalizado pelas entradas do mês. Sem variação = 7-8 pts
 *     (neutro); melhora de 50%+ das entradas = 15 pts; piora equivalente
 *     = 0 pts.
 *  4) Consistência (0-15): dos últimos 3 meses (incluindo o atual),
 *     quantos NÃO ultrapassaram o limite de alerta de gastos (70% das
 *     entradas) — quanto mais meses dentro do limite, maior a pontuação.
 */
export const scoreService = {
  async calculate(userId: number, month: string = currentMonth()) {
    const previousMonth = getPreviousMonth(month);

    // requiredMonthlyAmount é sempre "quanto falta guardar por mês a partir de
    // HOJE" (objectives.service deriva isso de currentMonth(), não do `month`
    // sendo pontuado) -- não existe um jeito honesto de reconstruir qual era
    // essa meta num mês passado, então só entra na conta quando `month` é o
    // mês corrente. Meses passados (recalculados por history()) sempre caem
    // no fallback genérico -- mesmo comportamento de "sem meta" de antes.
    const isCurrentMonth = month === currentMonth();

    const [totals, previousTotals, objectiveRows, last3Months] = await Promise.all([
      transactionsRepository.sumByTypeForMonth(userId, month),
      transactionsRepository.sumByTypeForMonth(userId, previousMonth),
      isCurrentMonth ? objectivesRepository.listByUser(userId) : Promise.resolve([]),
      Promise.all(
        [0, 1, 2].map((offset) => {
          let m = month;
          for (let i = 0; i < offset; i++) m = getPreviousMonth(m);
          return transactionsRepository.sumByTypeForMonth(userId, m);
        })
      ),
    ]);

    const saldo = totals.entradas - totals.saidas;
    const previousSaldo = previousTotals.entradas - previousTotals.saidas;

    // 1) controle de gastos
    const gastoPercentual = totals.entradas > 0 ? (totals.saidas / totals.entradas) * 100 : 0;
    const spendingControl =
      totals.entradas > 0 ? Math.round(clamp(40 * (1 - gastoPercentual / 100), 0, 40)) : 0;

    // 2) capacidade de economia / metas: meta do mês = soma do que falta
    // guardar por mês em cada objetivo ativo (não atingido, não atrasado).
    const monthlyTarget = monthlySavingsTarget(objectiveRows);
    const hasGoal = monthlyTarget > 0;

    let savingsCapacity: number;
    if (hasGoal) {
      savingsCapacity = Math.round(clamp(30 * (saldo / monthlyTarget), 0, 30));
    } else {
      const savingsRate = totals.entradas > 0 ? saldo / totals.entradas : 0;
      savingsCapacity = Math.round(clamp(30 * (savingsRate / SAVINGS_RATE_FULL_SCORE), 0, 30));
    }

    // 3) evolução financeira
    const denom = totals.entradas > 0 ? totals.entradas : previousTotals.entradas || 1;
    const deltaRatio = (saldo - previousSaldo) / denom;
    const evolution = Math.round(clamp(7.5 + 15 * deltaRatio, 0, 15));

    // 4) consistência (últimos 3 meses dentro do limite de alerta)
    const monthsWithinLimit = last3Months.filter((m) => {
      if (m.entradas <= 0) return true; // sem entradas, não há "excesso" a penalizar
      return (m.saidas / m.entradas) * 100 <= ALERT_PERCENT;
    }).length;
    const consistency = Math.round((monthsWithinLimit / 3) * 15);

    const score = spendingControl + savingsCapacity + evolution + consistency;
    const level = levelFor(score);

    const breakdown = {
      spendingControl,
      savingsCapacity,
      evolution,
      consistency,
      hasGoal,
      gastoPercentual: Number(gastoPercentual.toFixed(1)),
      monthsWithinLimit,
    };

    await scoreRepository.upsert(userId, month, score, breakdown);

    return { month, score, level, breakdown };
  },

  async history(userId: number, limit = 6) {
    // garante que os últimos `limit` meses estejam calculados/atualizados
    let month = currentMonth();
    const months: string[] = [];
    for (let i = 0; i < limit; i++) {
      months.push(month);
      month = getPreviousMonth(month);
    }
    await Promise.all(months.map((m) => this.calculate(userId, m)));

    const rows = await scoreRepository.listForUser(userId, limit);
    return rows
      .map((r) => ({
        month: r.reference_month,
        score: r.score,
        level: levelFor(r.score),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },
};
