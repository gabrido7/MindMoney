export interface PayoffSimulation {
  monthsNeeded: number;
  totalPaid: number;
  totalInterest: number;
  /** A parcela nem cobre o juro do mês -- a dívida cresceria em vez de diminuir. */
  insufficientPayment: boolean;
  /** Levaria mais de 20 anos -- uma projeção exata deixa de ser útil. */
  tooFar: boolean;
}

const TOO_FAR_MONTHS = 240; // 20 anos, mesmo teto de simulateGoal.ts

/**
 * Cálculo puro (sem chamada ao backend): dado o saldo restante, o juro
 * mensal e uma parcela fixa, em quantos meses a dívida é quitada e quanto
 * de juros isso representa no total. Fórmula padrão de amortização com
 * parcela fixa -- direção inversa de calculateLoan/calculateFinancing
 * (src/features/tools/utils/calculations.ts), que partem de "quantos meses"
 * pra chegar na parcela; aqui a parcela já é conhecida e o que falta
 * descobrir é o nº de meses.
 */
export function simulatePayoff(
  remainingAmount: number,
  monthlyRatePercent: number,
  installmentAmount: number
): PayoffSimulation | null {
  if (!(installmentAmount > 0) || !(remainingAmount > 0)) return null;

  const r = monthlyRatePercent / 100;

  if (r <= 0) {
    const monthsNeeded = Math.ceil(remainingAmount / installmentAmount);
    const totalPaid = monthsNeeded * installmentAmount;
    return {
      monthsNeeded,
      totalPaid,
      totalInterest: Math.max(0, totalPaid - remainingAmount),
      insufficientPayment: false,
      tooFar: monthsNeeded > TOO_FAR_MONTHS,
    };
  }

  const monthlyInterest = remainingAmount * r;
  if (installmentAmount <= monthlyInterest) {
    return { monthsNeeded: 0, totalPaid: 0, totalInterest: 0, insufficientPayment: true, tooFar: false };
  }

  const monthsNeeded = Math.ceil(-Math.log(1 - monthlyInterest / installmentAmount) / Math.log(1 + r));
  const totalPaid = monthsNeeded * installmentAmount;

  return {
    monthsNeeded,
    totalPaid,
    totalInterest: totalPaid - remainingAmount,
    insufficientPayment: false,
    tooFar: monthsNeeded > TOO_FAR_MONTHS,
  };
}
