import { assetsRepository } from "../assets/assets.repository";
import { accountsRepository } from "../accounts/accounts.repository";
import { debtsRepository } from "../debts/debts.repository";
import { currentMonth, getPreviousMonth, endOfMonthISO } from "../../utils/month";

export interface NetWorthSnapshot {
  month: string;
  totalAssets: number;
  totalAccounts: number;
  totalDebts: number;
  netWorth: number;
}

const DEFAULT_MONTHS = 6;

/**
 * Patrimônio líquido = saldo das contas + valor dos ativos - dívidas, sob
 * demanda, nunca armazenado -- mesmo princípio de sempre derivar em vez de
 * guardar o que dá pra recalcular (mesmo espírito de
 * financial_score_history/category_budgets). Reaproveita
 * totalBalanceAsOf/totalValueAsOf/totalRemainingAsOf, que já existiam pra
 * alimentar as tendências de accounts/assets/debtAdvice -- este módulo só
 * combina os três numa série temporal, sem repository próprio (mesmo
 * formato sem-repositório de insights/debtAdvice).
 */
export const netWorthService = {
  async getHistory(userId: number, months: number = DEFAULT_MONTHS): Promise<NetWorthSnapshot[]> {
    const month = currentMonth();
    const today = new Date().toISOString().slice(0, 10);

    const monthList: string[] = [];
    let cursor = month;
    for (let i = 0; i < months; i++) {
      monthList.push(cursor);
      cursor = getPreviousMonth(cursor);
    }
    monthList.reverse(); // mais antigo primeiro -- ordem cronológica pro gráfico

    const snapshots = await Promise.all(
      monthList.map(async (m, index) => {
        // O mês atual usa "hoje" como corte (retrato exato de agora); os
        // anteriores usam o fim do próprio mês (retrato de "como estava
        // quando aquele mês terminou").
        const isCurrent = index === monthList.length - 1;
        const dateISO = isCurrent ? today : endOfMonthISO(m);

        const [totalAssets, totalAccounts, totalDebts] = await Promise.all([
          assetsRepository.totalValueAsOf(userId, dateISO),
          accountsRepository.totalBalanceAsOf(userId, dateISO),
          debtsRepository.totalRemainingAsOf(userId, dateISO),
        ]);

        return {
          month: m,
          totalAssets,
          totalAccounts,
          totalDebts,
          netWorth: totalAssets + totalAccounts - totalDebts,
        };
      })
    );

    return snapshots;
  },
};
