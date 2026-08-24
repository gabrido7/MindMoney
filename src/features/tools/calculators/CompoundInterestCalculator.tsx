import { useState } from "react";
import { calculateCompoundInterest, toMonthlyRate, toMonths, type RatePeriod, type DurationUnit } from "../utils/calculations";
import { parseLocaleNumber } from "../utils/number";
import { formatCurrency } from "../../../utils/formatters";
import NumberField from "../components/NumberField";
import RateField from "../components/RateField";
import DurationField from "../components/DurationField";
import ResultStat from "../components/ResultStat";
import GrowthChart from "../components/GrowthChart";
import CalculatorLayout from "../components/CalculatorLayout";

export default function CompoundInterestCalculator() {
  const [initial, setInitial] = useState("1000");
  const [monthlyContribution, setMonthlyContribution] = useState("300");
  const [rate, setRate] = useState("0,8");
  const [ratePeriod, setRatePeriod] = useState<RatePeriod>("monthly");
  const [duration, setDuration] = useState("60");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("months");

  const initialNum = parseLocaleNumber(initial);
  const contributionNum = parseLocaleNumber(monthlyContribution);
  const rateNum = parseLocaleNumber(rate);
  const durationNum = parseLocaleNumber(duration);
  const valid = [initialNum, contributionNum, rateNum, durationNum].every((n) => Number.isFinite(n)) && durationNum > 0;

  const result = valid
    ? calculateCompoundInterest({
        initial: initialNum,
        monthlyContribution: contributionNum,
        monthlyRate: toMonthlyRate(rateNum, ratePeriod),
        months: toMonths(durationNum, durationUnit),
      })
    : null;

  return (
    <CalculatorLayout
      inputs={
        <>
          <NumberField id="ci-initial" label="Investimento inicial" prefix="R$" value={initial} onChange={setInitial} placeholder="1000" />
          <NumberField
            id="ci-contribution"
            label="Aporte mensal"
            prefix="R$"
            value={monthlyContribution}
            onChange={setMonthlyContribution}
            placeholder="300"
          />
          <RateField id="ci-rate" label="Taxa de juros" value={rate} onChange={setRate} period={ratePeriod} onPeriodChange={setRatePeriod} />
          <DurationField id="ci-duration" label="Período" value={duration} onChange={setDuration} unit={durationUnit} onUnitChange={setDurationUnit} />
        </>
      }
      results={
        result ? (
          <>
            <ResultStat label="Valor final" value={formatCurrency(result.futureValue)} tone="positive" size="lg" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <ResultStat label="Total investido" value={formatCurrency(result.totalInvested)} />
              <ResultStat label="Total em juros" value={formatCurrency(result.totalInterest)} tone="positive" />
            </div>
          </>
        ) : (
          <p className="text-sm text-ink-soft">Preencha os dados para calcular.</p>
        )
      }
      chart={
        result && (
          <GrowthChart
            data={result.series}
            series={[
              { key: "invested", name: "Total investido", color: "var(--ink-soft)" },
              { key: "balance", name: "Saldo acumulado", color: "var(--brand)" },
            ]}
          />
        )
      }
      note="Juros compostos incidem sobre o saldo total (principal + juros já ganhos), não só sobre o valor investido inicialmente — por isso o crescimento acelera com o tempo."
    />
  );
}
