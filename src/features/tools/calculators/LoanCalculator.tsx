import { useState } from "react";
import { calculateLoan, toMonthlyRate, type RatePeriod } from "../utils/calculations";
import { parseLocaleNumber } from "../utils/number";
import { formatCurrency, formatPercent } from "../../../utils/formatters";
import NumberField from "../components/NumberField";
import RateField from "../components/RateField";
import ResultStat from "../components/ResultStat";
import CalculatorLayout from "../components/CalculatorLayout";

export default function LoanCalculator() {
  const [amount, setAmount] = useState("5000");
  const [rate, setRate] = useState("3,5");
  const [ratePeriod, setRatePeriod] = useState<RatePeriod>("monthly");
  const [months, setMonths] = useState("24");
  const [extraFees, setExtraFees] = useState("0");

  const amountNum = parseLocaleNumber(amount);
  const rateNum = parseLocaleNumber(rate);
  const monthsNum = parseLocaleNumber(months);
  const feesNum = parseLocaleNumber(extraFees);
  const valid = [amountNum, rateNum, monthsNum, feesNum].every((n) => Number.isFinite(n)) && amountNum > 0 && monthsNum > 0;

  const result = valid
    ? calculateLoan({
        amount: amountNum,
        monthlyRate: toMonthlyRate(rateNum, ratePeriod),
        months: Math.round(monthsNum),
        extraFees: feesNum,
      })
    : null;

  return (
    <CalculatorLayout
      inputs={
        <>
          <NumberField id="lo-amount" label="Valor do empréstimo" prefix="R$" value={amount} onChange={setAmount} placeholder="5000" />
          <RateField id="lo-rate" label="Taxa de juros" value={rate} onChange={setRate} period={ratePeriod} onPeriodChange={setRatePeriod} />
          <NumberField id="lo-months" label="Número de parcelas" value={months} onChange={setMonths} suffix="meses" placeholder="24" />
          <NumberField
            id="lo-fees"
            label="Tarifas e IOF (se houver)"
            prefix="R$"
            value={extraFees}
            onChange={setExtraFees}
            placeholder="0"
          />
        </>
      }
      results={
        result ? (
          <>
            <ResultStat label="Valor da parcela" value={formatCurrency(result.installment)} tone="negative" size="lg" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <ResultStat label="Total pago" value={formatCurrency(result.totalPaid)} />
              <ResultStat label="Custo total" value={formatCurrency(result.totalCost)} tone="negative" />
            </div>
            <ResultStat label="Custo total sobre o valor emprestado" value={formatPercent(result.effectiveTotalCostPercent, 1)} tone="negative" />
          </>
        ) : (
          <p className="text-sm text-ink-soft">Preencha os dados para calcular.</p>
        )
      }
      note="O custo total inclui juros e tarifas — é o número mais próximo do CET (Custo Efetivo Total) que um empréstimo real informa. Compare sempre por esse número, não só pela taxa de juros anunciada."
    />
  );
}
