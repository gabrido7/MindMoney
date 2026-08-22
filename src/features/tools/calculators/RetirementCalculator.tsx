import { useState } from "react";
import { calculateRetirementTarget } from "../utils/calculations";
import { parseLocaleNumber } from "../utils/number";
import { formatCurrency } from "../../../utils/formatters";
import NumberField from "../components/NumberField";
import ResultStat from "../components/ResultStat";
import CalculatorLayout from "../components/CalculatorLayout";

const WITHDRAWAL_RATE_OPTIONS = [3, 3.5, 4, 4.5, 5];

export default function RetirementCalculator() {
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState("5000");
  const [withdrawalRate, setWithdrawalRate] = useState(4);

  const incomeNum = parseLocaleNumber(desiredMonthlyIncome);
  const valid = Number.isFinite(incomeNum) && incomeNum > 0;

  const result = valid ? calculateRetirementTarget({ desiredMonthlyIncome: incomeNum, withdrawalRatePercent: withdrawalRate }) : null;

  return (
    <CalculatorLayout
      inputs={
        <>
          <NumberField
            id="rt-income"
            label="Renda mensal desejada"
            prefix="R$"
            value={desiredMonthlyIncome}
            onChange={setDesiredMonthlyIncome}
            placeholder="5000"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Taxa de saque anual (regra dos 4%)</label>
            <div className="flex flex-wrap gap-1.5">
              {WITHDRAWAL_RATE_OPTIONS.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setWithdrawalRate(rate)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    withdrawalRate === rate
                      ? "bg-green-600 text-white"
                      : "border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">Taxas menores são mais conservadoras — exigem mais patrimônio, mas dão mais segurança.</p>
          </div>
        </>
      }
      results={
        result ? (
          <>
            <ResultStat label="Patrimônio necessário" value={formatCurrency(result.targetAmount)} tone="positive" size="lg" />
            <ResultStat label="Renda anual equivalente" value={formatCurrency(result.annualIncome)} />
          </>
        ) : (
          <p className="text-sm text-gray-400">Preencha os dados para calcular.</p>
        )
      }
      note="A regra dos 4% é uma heurística baseada em estudos históricos do mercado americano — uma referência prática, não uma garantia matemática. Veja a trilha 'Aposentadoria e independência financeira' na Educação Financeira para entender suas limitações."
    />
  );
}
