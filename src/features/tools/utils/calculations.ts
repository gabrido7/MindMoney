export type RatePeriod = "monthly" | "annual";

/** Converte uma taxa percentual (mensal ou anual) para a taxa mensal decimal usada em todos os cálculos. */
export function toMonthlyRate(ratePercent: number, period: RatePeriod): number {
  const r = ratePercent / 100;
  return period === "monthly" ? r : Math.pow(1 + r, 1 / 12) - 1;
}

export type DurationUnit = "months" | "years";

/** Converte um período (em meses ou anos) para o total de meses usado em todos os cálculos. */
export function toMonths(value: number, unit: DurationUnit): number {
  return unit === "months" ? value : value * 12;
}

export interface SeriesPoint {
  period: number;
  invested: number;
  balance: number;
}

// ---------------------------------------------------------------------
// Juros simples
// ---------------------------------------------------------------------

export interface SimpleInterestInput {
  principal: number;
  monthlyRate: number;
  months: number;
}

export interface SimpleInterestResult {
  futureValue: number;
  totalInterest: number;
  series: SeriesPoint[];
}

export function calculateSimpleInterest({ principal, monthlyRate, months }: SimpleInterestInput): SimpleInterestResult {
  const series: SeriesPoint[] = [];
  for (let m = 0; m <= months; m++) {
    series.push({ period: m, invested: principal, balance: principal + principal * monthlyRate * m });
  }
  const totalInterest = principal * monthlyRate * months;
  return { futureValue: principal + totalInterest, totalInterest, series };
}

// ---------------------------------------------------------------------
// Juros compostos
// ---------------------------------------------------------------------

export interface CompoundInterestInput {
  initial: number;
  monthlyContribution: number;
  monthlyRate: number;
  months: number;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalInvested: number;
  totalInterest: number;
  series: SeriesPoint[];
}

export function calculateCompoundInterest({
  initial,
  monthlyContribution,
  monthlyRate,
  months,
}: CompoundInterestInput): CompoundInterestResult {
  const series: SeriesPoint[] = [{ period: 0, invested: initial, balance: initial }];
  let balance = initial;
  let invested = initial;
  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    invested += monthlyContribution;
    series.push({ period: m, invested, balance });
  }
  return { futureValue: balance, totalInvested: invested, totalInterest: balance - invested, series };
}

// ---------------------------------------------------------------------
// Inflação (valor nominal futuro necessário para manter o poder de compra)
// ---------------------------------------------------------------------

export interface InflationImpactInput {
  currentAmount: number;
  monthlyRate: number;
  months: number;
}

export interface InflationImpactResult {
  futureAmount: number;
  totalIncrease: number;
  series: SeriesPoint[];
}

export function calculateInflationImpact({ currentAmount, monthlyRate, months }: InflationImpactInput): InflationImpactResult {
  const compound = calculateCompoundInterest({ initial: currentAmount, monthlyContribution: 0, monthlyRate, months });
  return { futureAmount: compound.futureValue, totalIncrease: compound.futureValue - currentAmount, series: compound.series };
}

// ---------------------------------------------------------------------
// Poder de compra (erosão do valor real de uma quantia parada)
// ---------------------------------------------------------------------

export interface PurchasingPowerInput {
  amount: number;
  monthlyRate: number;
  months: number;
}

export interface PurchasingPowerPoint {
  period: number;
  value: number;
}

export interface PurchasingPowerResult {
  futureRealValue: number;
  lossAmount: number;
  lossPercent: number;
  series: PurchasingPowerPoint[];
}

export function calculatePurchasingPower({ amount, monthlyRate, months }: PurchasingPowerInput): PurchasingPowerResult {
  const series: PurchasingPowerPoint[] = [];
  for (let m = 0; m <= months; m++) {
    series.push({ period: m, value: amount / Math.pow(1 + monthlyRate, m) });
  }
  const futureRealValue = series[series.length - 1].value;
  const lossAmount = amount - futureRealValue;
  return { futureRealValue, lossAmount, lossPercent: amount > 0 ? (lossAmount / amount) * 100 : 0, series };
}

// ---------------------------------------------------------------------
// Reserva de emergência
// ---------------------------------------------------------------------

export interface EmergencyFundInput {
  monthlyExpenses: number;
  monthsCoverage: number;
  currentSavings: number;
  monthlyContribution: number;
}

export interface EmergencyFundResult {
  targetAmount: number;
  remaining: number;
  monthsToReach: number | null;
}

export function calculateEmergencyFund({
  monthlyExpenses,
  monthsCoverage,
  currentSavings,
  monthlyContribution,
}: EmergencyFundInput): EmergencyFundResult {
  const targetAmount = monthlyExpenses * monthsCoverage;
  const remaining = Math.max(0, targetAmount - currentSavings);
  const monthsToReach = remaining === 0 ? 0 : monthlyContribution > 0 ? Math.ceil(remaining / monthlyContribution) : null;
  return { targetAmount, remaining, monthsToReach };
}

// ---------------------------------------------------------------------
// Aposentadoria (regra dos 4%, com taxa de saque ajustável)
// ---------------------------------------------------------------------

export interface RetirementTargetInput {
  desiredMonthlyIncome: number;
  withdrawalRatePercent: number;
}

export interface RetirementTargetResult {
  targetAmount: number;
  annualIncome: number;
}

export function calculateRetirementTarget({
  desiredMonthlyIncome,
  withdrawalRatePercent,
}: RetirementTargetInput): RetirementTargetResult {
  const annualIncome = desiredMonthlyIncome * 12;
  const targetAmount = annualIncome / (withdrawalRatePercent / 100);
  return { targetAmount, annualIncome };
}

// ---------------------------------------------------------------------
// Aportes mensais necessários para atingir um objetivo
// ---------------------------------------------------------------------

export interface MonthlyContributionInput {
  targetAmount: number;
  initial: number;
  monthlyRate: number;
  months: number;
}

export interface MonthlyContributionResult {
  requiredMonthlyContribution: number;
  alreadyReached: boolean;
  series: SeriesPoint[];
}

export function calculateMonthlyContribution({
  targetAmount,
  initial,
  monthlyRate,
  months,
}: MonthlyContributionInput): MonthlyContributionResult {
  const growthOfInitial = initial * Math.pow(1 + monthlyRate, months);

  if (growthOfInitial >= targetAmount) {
    return {
      requiredMonthlyContribution: 0,
      alreadyReached: true,
      series: calculateCompoundInterest({ initial, monthlyContribution: 0, monthlyRate, months }).series,
    };
  }

  const annuityFactor = monthlyRate === 0 ? months : (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  const requiredMonthlyContribution = (targetAmount - growthOfInitial) / annuityFactor;

  return {
    requiredMonthlyContribution,
    alreadyReached: false,
    series: calculateCompoundInterest({ initial, monthlyContribution: requiredMonthlyContribution, monthlyRate, months }).series,
  };
}

// ---------------------------------------------------------------------
// Financiamento (Price x SAC)
// ---------------------------------------------------------------------

export type AmortizationSystem = "price" | "sac";

export interface FinancingInput {
  amount: number;
  monthlyRate: number;
  months: number;
  system: AmortizationSystem;
}

export interface AmortizationRow {
  period: number;
  installment: number;
  interest: number;
  amortization: number;
  balance: number;
}

export interface FinancingResult {
  firstInstallment: number;
  lastInstallment: number;
  totalPaid: number;
  totalInterest: number;
  schedule: AmortizationRow[];
}

export function calculateFinancing({ amount, monthlyRate, months, system }: FinancingInput): FinancingResult {
  const schedule: AmortizationRow[] = [];
  let balance = amount;

  if (system === "price") {
    const installment =
      monthlyRate === 0 ? amount / months : (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    for (let m = 1; m <= months; m++) {
      const interest = balance * monthlyRate;
      const amortization = installment - interest;
      balance = Math.max(0, balance - amortization);
      schedule.push({ period: m, installment, interest, amortization, balance });
    }
  } else {
    const amortization = amount / months;
    for (let m = 1; m <= months; m++) {
      const interest = balance * monthlyRate;
      const installment = amortization + interest;
      balance = Math.max(0, balance - amortization);
      schedule.push({ period: m, installment, interest, amortization, balance });
    }
  }

  const totalPaid = schedule.reduce((sum, row) => sum + row.installment, 0);
  return {
    firstInstallment: schedule[0].installment,
    lastInstallment: schedule[schedule.length - 1].installment,
    totalPaid,
    totalInterest: totalPaid - amount,
    schedule,
  };
}

// ---------------------------------------------------------------------
// Empréstimo pessoal (Price + tarifas/IOF, foco no custo total)
// ---------------------------------------------------------------------

export interface LoanInput {
  amount: number;
  monthlyRate: number;
  months: number;
  extraFees: number;
}

export interface LoanResult {
  installment: number;
  totalPaid: number;
  totalCost: number;
  effectiveTotalCostPercent: number;
}

export function calculateLoan({ amount, monthlyRate, months, extraFees }: LoanInput): LoanResult {
  const installment =
    monthlyRate === 0 ? amount / months : (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  const totalPaidInstallments = installment * months;
  const totalPaid = totalPaidInstallments + extraFees;
  const totalCost = totalPaid - amount;
  return {
    installment,
    totalPaid,
    totalCost,
    effectiveTotalCostPercent: amount > 0 ? (totalCost / amount) * 100 : 0,
  };
}

// ---------------------------------------------------------------------
// Comparação de investimentos
// ---------------------------------------------------------------------

export interface InvestmentScenarioInput {
  name: string;
  initial: number;
  monthlyContribution: number;
  monthlyRate: number;
}

export interface InvestmentScenarioResult {
  name: string;
  futureValue: number;
  totalInvested: number;
  totalInterest: number;
  series: SeriesPoint[];
}

export function compareInvestments(scenarios: InvestmentScenarioInput[], months: number): InvestmentScenarioResult[] {
  return scenarios.map((s) => {
    const result = calculateCompoundInterest({
      initial: s.initial,
      monthlyContribution: s.monthlyContribution,
      monthlyRate: s.monthlyRate,
      months,
    });
    return {
      name: s.name,
      futureValue: result.futureValue,
      totalInvested: result.totalInvested,
      totalInterest: result.totalInterest,
      series: result.series,
    };
  });
}

// ---------------------------------------------------------------------
// Rentabilidade real (fórmula de Fisher)
// ---------------------------------------------------------------------

export interface RealReturnInput {
  nominalRatePercent: number;
  inflationRatePercent: number;
}

export interface RealReturnResult {
  realRatePercent: number;
  approxRealRatePercent: number;
}

export function calculateRealReturn({ nominalRatePercent, inflationRatePercent }: RealReturnInput): RealReturnResult {
  const nominal = nominalRatePercent / 100;
  const inflation = inflationRatePercent / 100;
  const real = (1 + nominal) / (1 + inflation) - 1;
  return { realRatePercent: real * 100, approxRealRatePercent: nominalRatePercent - inflationRatePercent };
}
