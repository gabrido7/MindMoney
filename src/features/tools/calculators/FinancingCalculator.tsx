import { useState } from "react";
import { calculateFinancing, toMonthlyRate, type RatePeriod, type AmortizationSystem } from "../utils/calculations";
import { parseLocaleNumber } from "../utils/number";
import { formatCurrency } from "../../../utils/formatters";
import NumberField from "../components/NumberField";
import RateField from "../components/RateField";
import ResultStat from "../components/ResultStat";
import GrowthChart from "../components/GrowthChart";
import CalculatorLayout from "../components/CalculatorLayout";

const SYSTEM_OPTIONS: { id: AmortizationSystem; label: string }[] = [
  { id: "price", label: "Price (parcelas fixas)" },
  { id: "sac", label: "SAC (parcelas decrescentes)" },
];

export default function FinancingCalculator() {
  const [amount, setAmount] = useState("300000");
  const [rate, setRate] = useState("9");
  const [ratePeriod, setRatePeriod] = useState<RatePeriod>("annual");
  const [months, setMonths] = useState("360");
  const [system, setSystem] = useState<AmortizationSystem>("price");

  const amountNum = parseLocaleNumber(amount);
  const rateNum = parseLocaleNumber(rate);
  const monthsNum = parseLocaleNumber(months);
  const valid = [amountNum, rateNum, monthsNum].every((n) => Number.isFinite(n)) && amountNum > 0 && monthsNum > 0;

  const result = valid
    ? calculateFinancing({ amount: amountNum, monthlyRate: toMonthlyRate(rateNum, ratePeriod), months: Math.round(monthsNum), system })
    : null;

  return (
    <CalculatorLayout
      inputs={
        <>
          <NumberField id="fi-amount" label="Valor financiado" prefix="R$" value={amount} onChange={setAmount} placeholder="300000" />
          <RateField id="fi-rate" label="Taxa de juros" value={rate} onChange={setRate} period={ratePeriod} onPeriodChange={setRatePeriod} placeholder="9" />
          <NumberField id="fi-months" label="Número de parcelas" value={months} onChange={setMonths} suffix="meses" placeholder="360" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sistema de amortização</label>
            <div className="flex flex-col gap-1.5 sm:flex-row">
              {SYSTEM_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSystem(opt.id)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    system === opt.id
                      ? "bg-green-600 text-white"
                      : "border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      }
      results={
        result ? (
          <>
            <ResultStat
              label={system === "price" ? "Parcela (fixa)" : "1ª parcela"}
              value={formatCurrency(result.firstInstallment)}
              tone="negative"
              size="lg"
            />
            {system === "sac" && <ResultStat label="Última parcela" value={formatCurrency(result.lastInstallment)} />}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <ResultStat label="Total pago" value={formatCurrency(result.totalPaid)} />
              <ResultStat label="Total em juros" value={formatCurrency(result.totalInterest)} tone="negative" />
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400">Preencha os dados para calcular.</p>
        )
      }
      chart={
        result && (
          <GrowthChart data={result.schedule} series={[{ key: "installment", name: "Parcela", color: "#b91c1c" }]} />
        )
      }
      note="No sistema Price, a parcela é sempre a mesma, mas a composição entre juros e amortização muda mês a mês. No SAC, a amortização é constante e a parcela (e os juros) diminuem ao longo do tempo — geralmente com menos juros totais pagos."
    />
  );
}
