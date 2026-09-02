import { rankDebts, type DebtStrategy } from "./rankDebts";
import type { Debt } from "../../../types/api";

export interface CascadeSimulation {
  totalMonths: number;
  totalInterest: number;
  /** Dívidas ativas sem parcela definida -- ficam de fora da simulação (não dá pra atacar o que não tem valor mensal). */
  excludedCount: number;
}

const CASCADE_MONTHS_CAP = 600; // 50 anos -- guarda contra "nunca converge" (parcelas somadas não cobrem o juro total)

/**
 * Simula mês a mês o efeito de atacar as dívidas na ordem de uma estratégia
 * (bola de neve ou avalanche): o "orçamento" mensal fica fixo (soma de
 * todas as parcelas atuais); cada dívida recebe sua parcela mínima, e
 * qualquer sobra -- de uma dívida já quitada -- é redirecionada pra próxima
 * da fila, na ordem escolhida. É o mecanismo real por trás dos dois
 * métodos, não só uma comparação de texto.
 */
export function simulateCascade(debts: Debt[], strategy: DebtStrategy): CascadeSimulation | null {
  const ranked = rankDebts(debts, strategy);
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
