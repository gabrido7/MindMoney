import { useState } from "react";
import { calculateEmergencyFund } from "../utils/calculations";
import { parseLocaleNumber } from "../utils/number";
import { formatCurrency, formatPercent } from "../../../utils/formatters";
import NumberField from "../components/NumberField";
import ResultStat from "../components/ResultStat";
import CalculatorLayout from "../components/CalculatorLayout";
import ScoreArc from "../../../components/ui/ScoreArc";

export default function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState("3000");
  const [monthsCoverage, setMonthsCoverage] = useState("6");
  const [currentSavings, setCurrentSavings] = useState("1000");
  const [monthlyContribution, setMonthlyContribution] = useState("400");

  const expensesNum = parseLocaleNumber(monthlyExpenses);
  const coverageNum = parseLocaleNumber(monthsCoverage);
  const savingsNum = parseLocaleNumber(currentSavings);
  const contributionNum = parseLocaleNumber(monthlyContribution);
  const valid = [expensesNum, coverageNum, savingsNum, contributionNum].every((n) => Number.isFinite(n)) && expensesNum > 0 && coverageNum > 0;

  const result = valid
    ? calculateEmergencyFund({
        monthlyExpenses: expensesNum,
        monthsCoverage: coverageNum,
        currentSavings: savingsNum,
        monthlyContribution: contributionNum,
      })
    : null;

  return (
    <CalculatorLayout
      inputs={
        <>
          <NumberField id="ef-expenses" label="Gastos mensais essenciais" prefix="R$" value={monthlyExpenses} onChange={setMonthlyExpenses} placeholder="3000" />
          <NumberField id="ef-coverage" label="Meses de cobertura desejados" value={monthsCoverage} onChange={setMonthsCoverage} suffix="meses" placeholder="6" />
          <NumberField id="ef-savings" label="Quanto você já tem guardado" prefix="R$" value={currentSavings} onChange={setCurrentSavings} placeholder="1000" />
          <NumberField id="ef-contribution" label="Quanto consegue guardar por mês" prefix="R$" value={monthlyContribution} onChange={setMonthlyContribution} placeholder="400" />
        </>
      }
      results={
        result ? (
          <>
            <div className="flex items-center gap-5">
              <ScoreArc value={savingsNum} max={result.targetAmount} size="lg" color="var(--brand)">
                <span className="font-data text-lg font-bold text-ink">
                  {formatPercent(Math.min(100, (savingsNum / result.targetAmount) * 100), 0)}
                </span>
              </ScoreArc>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">Tamanho da reserva</span>
                <span className="font-data text-2xl font-bold text-brand">{formatCurrency(result.targetAmount)}</span>
              </div>
            </div>
            <ResultStat label="Falta guardar" value={formatCurrency(result.remaining)} />
            <ResultStat
              label="Tempo até completar"
              value={
                result.monthsToReach === null
                  ? "Defina um valor de aporte mensal"
                  : result.monthsToReach === 0
                    ? "Você já atingiu a meta!"
                    : `${result.monthsToReach} ${result.monthsToReach === 1 ? "mês" : "meses"}`
              }
              tone={result.monthsToReach === 0 ? "positive" : "default"}
            />
          </>
        ) : (
          <p className="text-sm text-ink-soft">Preencha os dados para calcular.</p>
        )
      }
      note="A recomendação mais comum é de 3 a 6 meses de gastos essenciais, guardados em algo de liquidez alta e baixo risco (como Tesouro Selic) — não precisa render muito, precisa estar disponível quando você precisar."
    />
  );
}
