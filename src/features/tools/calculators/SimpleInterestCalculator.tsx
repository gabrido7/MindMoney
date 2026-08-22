import { useState } from "react";
import { calculateSimpleInterest, calculateCompoundInterest, toMonthlyRate, toMonths, type RatePeriod, type DurationUnit } from "../utils/calculations";
import { parseLocaleNumber } from "../utils/number";
import { formatCurrency } from "../../../utils/formatters";
import NumberField from "../components/NumberField";
import RateField from "../components/RateField";
import DurationField from "../components/DurationField";
import ResultStat from "../components/ResultStat";
import GrowthChart from "../components/GrowthChart";
import CalculatorLayout from "../components/CalculatorLayout";

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState("1000");
  const [rate, setRate] = useState("1");
  const [ratePeriod, setRatePeriod] = useState<RatePeriod>("monthly");
  const [duration, setDuration] = useState("12");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("months");

  const principalNum = parseLocaleNumber(principal);
  const rateNum = parseLocaleNumber(rate);
  const durationNum = parseLocaleNumber(duration);
  const valid = [principalNum, rateNum, durationNum].every((n) => Number.isFinite(n)) && durationNum > 0;

  const monthlyRate = valid ? toMonthlyRate(rateNum, ratePeriod) : 0;
  const months = valid ? toMonths(durationNum, durationUnit) : 0;

  const simple = valid ? calculateSimpleInterest({ principal: principalNum, monthlyRate, months }) : null;
  const compoundForComparison = valid
    ? calculateCompoundInterest({ initial: principalNum, monthlyContribution: 0, monthlyRate, months })
    : null;

  return (
    <CalculatorLayout
      inputs={
        <>
          <NumberField id="si-principal" label="Valor inicial" prefix="R$" value={principal} onChange={setPrincipal} placeholder="1000" />
          <RateField id="si-rate" label="Taxa de juros" value={rate} onChange={setRate} period={ratePeriod} onPeriodChange={setRatePeriod} />
          <DurationField id="si-duration" label="Período" value={duration} onChange={setDuration} unit={durationUnit} onUnitChange={setDurationUnit} />
        </>
      }
      results={
        simple ? (
          <>
            <ResultStat label="Valor final" value={formatCurrency(simple.futureValue)} tone="positive" size="lg" />
            <ResultStat label="Total em juros" value={formatCurrency(simple.totalInterest)} tone="positive" />
            {compoundForComparison && (
              <p className="text-xs text-gray-400 pt-1">
                No mesmo período, a juros compostos esse valor seria {formatCurrency(compoundForComparison.futureValue)}.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-400">Preencha os dados para calcular.</p>
        )
      }
      chart={
        simple &&
        compoundForComparison && (
          <GrowthChart
            data={simple.series.map((p, i) => ({ period: p.period, simples: p.balance, compostos: compoundForComparison.series[i].balance }))}
            series={[
              { key: "simples", name: "Juros simples", color: "#898781" },
              { key: "compostos", name: "Juros compostos", color: "#0ca30c" },
            ]}
          />
        )
      }
      note="Nos juros simples, os juros incidem sempre sobre o valor inicial — o crescimento é uma linha reta, diferente da curva dos juros compostos."
    />
  );
}
