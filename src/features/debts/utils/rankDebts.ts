import type { Debt } from "../../../types/api";

export type DebtStrategy = "bola_de_neve" | "avalanche";

/**
 * Ordenação pura sobre dado real (remainingAmount/interestRate, já
 * calculados pelo backend) -- não é um dado novo, é uma lente sobre o que
 * já existe. Dívidas quitadas saem do ranking (não há "por onde começar"
 * pra uma dívida que já acabou).
 */
export function rankDebts(debts: Debt[], strategy: DebtStrategy): Debt[] {
  const active = debts.filter((d) => !d.paidOff);

  if (strategy === "bola_de_neve") {
    // Menor saldo restante primeiro -- motivação psicológica, quita mais dívidas mais rápido.
    return [...active].sort((a, b) => a.remainingAmount - b.remainingAmount);
  }

  // Avalanche: maior juro primeiro -- matematicamente ótimo, economiza mais no total.
  // Juro não informado (null) vai pro fim -- custo desconhecido não é o mesmo que custo zero.
  return [...active].sort((a, b) => (b.interestRate ?? -1) - (a.interestRate ?? -1));
}
