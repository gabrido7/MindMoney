import { useState } from "react";
import { calculateInflationImpact, toMonthlyRate, toMonths, type RatePeriod, type DurationUnit } from "../utils/calculations";
import { parseLocaleNumber } from "../utils/number";
import { formatCurrency } from "../../../utils/formatters";
import NumberField from "../components/NumberField";
import RateField from "../components/RateField";
import DurationField from "../components/DurationField";
import ResultStat from "../components/ResultStat";
import GrowthChart from "../components/GrowthChart";
import CalculatorLayout from "../components/CalculatorLayout";

export default function InflationCalculator() {
  const [currentAmount, setCurrentAmount] = useState("1000");
  const [rate, setRate] = useState("5");
  const [ratePeriod, setRatePeriod] = useState<RatePeriod>("annual");
  const [duration, setDuration] = useState("5");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("years");

  const amountNum = parseLocaleNumber(currentAmount);
  const rateNum = parseLocaleNumber(rate);
  const durationNum = parseLocaleNumber(duration);
  const valid = [amountNum, rateNum, durationNum].every((n) => Number.isFinite(n)) && durationNum > 0;

  const result = valid
    ? calculateInflationImpact({
        currentAmount: amountNum,
        monthlyRate: toMonthlyRate(rateNum, ratePeriod),
        months: toMonths(durationNum, durationUnit),
      })
    : null;

  return (
    <CalculatorLayout
      inputs={
        <>
          <NumberField id="in-amount" label="Valor hoje" prefix="R$" value={currentAmount} onChange={setCurrentAmount} placeholder="1000" />
          <RateField id="in-rate" label="Inflação" value={rate} onChange={setRate} period={ratePeriod} onPeriodChange={setRatePeriod} placeholder="5" />
          <DurationField id="in-duration" label="Período" value={duration} onChange={setDuration} unit={durationUnit} onUnitChange={setDurationUnit} />
        </>
      }
      results={
        result ? (
          <>
            <ResultStat label="Valor equivalente no futuro" value={formatCurrency(result.futureAmount)} tone="negative" size="lg" />
            <ResultStat label="Aumento nominal necessário" value={formatCurrency(result.totalIncrease)} tone="negative" />
          </>
        ) : (
          <p className="text-sm text-ink-soft">Preencha os dados para calcular.</p>
        )
      }
      chart={
        result && (
          <GrowthChart
            data={result.series}
            series={[{ key: "balance", name: "Valor nominal equivalente", color: "var(--negative)" }]}
          />
        )
      }
      note="Esse é o valor nominal que você precisaria ter no futuro para comprar exatamente o que R$ hoje compra — não é um investimento, é o efeito da inflação sobre o preço das coisas."
    />
  );
}
