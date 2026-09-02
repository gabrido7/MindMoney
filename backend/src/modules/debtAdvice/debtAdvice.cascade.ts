export interface CascadeDebt {
  id: number;
  remainingAmount: number;
  interestRate: number | null;
  installmentAmount: number | null;
  paidOff: boolean;
}

export interface CascadeSimulation {
  totalMonths: number;
  totalInterest: number;
  /** Dívidas ativas sem parcela definida -- ficam de fora da simulação (não dá pra atacar o que não tem valor mensal). */
  excludedCount: number;
}

const CASCADE_MONTHS_CAP = 600; // 50 anos -- guarda contra "nunca converge"

/**
 * Espelho server-side de src/features/debts/utils/rankDebts.ts (só a
 * ordenação avalanche, a única que o diagnóstico geral usa) +
 * src/features/debts/utils/simulateCascade.ts -- backend não importa TS do
 * frontend, mesmo motivo de debtAdvice.math.ts já espelhar simulatePayoff.ts.
 */
export function rankByAvalanche(debts: CascadeDebt[]): CascadeDebt[] {
  return debts.filter((d) => !d.paidOff).sort((a, b) => (b.interestRate ?? -1) - (a.interestRate ?? -1));
}

export function simulateCascade(debts: CascadeDebt[]): CascadeSimulation | null {
  const ranked = rankByAvalanche(debts);
  const qualified = ranked.filter((d) => d.installmentAmount !== null && d.installmentAmount > 0);
  const excludedCount = ranked.length - qualified.length;
  if (qualified.length === 0) return null;

  const balances = qualified.map((d) => ({
    balance: d.remainingAmount,
    rate: (d.interestRate ?? 0) / 100,
    minPay: d.installmentAmount as number,
  }));
  const totalBudget = balances.reduce((sum, b) => sum + b.minPay, 0);

  let month = 0;
  let totalInterest = 0;

  while (balances.some((b) => b.balance > 0)) {
    month++;
    if (month > CASCADE_MONTHS_CAP) return null;

    for (const b of balances) {
      if (b.balance <= 0) continue;
      const interest = b.balance * b.rate;
      totalInterest += interest;
      b.balance += interest;
    }

    let freeBudget = totalBudget;
    for (const b of balances) {
      if (b.balance <= 0) continue;
      const pay = Math.min(b.minPay, b.balance);
      b.balance -= pay;
      freeBudget -= pay;
    }

    for (const b of balances) {
      if (freeBudget <= 0) break;
      if (b.balance <= 0) continue;
      const pay = Math.min(freeBudget, b.balance);
      b.balance -= pay;
      freeBudget -= pay;
    }
  }

  return { totalMonths: month, totalInterest, excludedCount };
}
