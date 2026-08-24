import { useState } from "react";
import { calculateMonthlyContribution, toMonthlyRate, toMonths, type RatePeriod, type DurationUnit } from "../utils/calculations";
import { parseLocaleNumber } from "../utils/number";
import { formatCurrency } from "../../../utils/formatters";
import NumberField from "../components/NumberField";
import RateField from "../components/RateField";
import DurationField from "../components/DurationField";
import ResultStat from "../components/ResultStat";
import GrowthChart from "../components/GrowthChart";
import CalculatorLayout from "../components/CalculatorLayout";

export default function MonthlyContributionCalculator() {
  const [targetAmount, setTargetAmount] = useState("1500000");
  const [initial, setInitial] = useState("0");
  const [rate, setRate] = useState("0,7");
  const [ratePeriod, setRatePeriod] = useState<RatePeriod>("monthly");
  const [duration, setDuration] = useState("20");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("years");

  const targetNum = parseLocaleNumber(targetAmount);
  const initialNum = parseLocaleNumber(initial);
  const rateNum = parseLocaleNumber(rate);
  const durationNum = parseLocaleNumber(duration);
  const valid = [targetNum, initialNum, rateNum, durationNum].every((n) => Number.isFinite(n)) && targetNum > 0 && durationNum > 0;

  const result = valid
    ? calculateMonthlyContribution({
        targetAmount: targetNum,
        initial: initialNum,
        monthlyRate: toMonthlyRate(rateNum, ratePeriod),
        months: toMonths(durationNum, durationUnit),
      })
    : null;

  return (
    <CalculatorLayout
      inputs={
        <>
          <NumberField id="mc-target" label="Objetivo (valor final desejado)" prefix="R$" value={targetAmount} onChange={setTargetAmount} placeholder="1500000" />
          <NumberField id="mc-initial" label="Valor já investido hoje" prefix="R$" value={initial} onChange={setInitial} placeholder="0" />
          <RateField id="mc-rate" label="Retorno esperado" value={rate} onChange={setRate} period={ratePeriod} onPeriodChange={setRatePeriod} />
          <DurationField id="mc-duration" label="Prazo" value={duration} onChange={setDuration} unit={durationUnit} onUnitChange={setDurationUnit} />
        </>
      }
      results={
        result ? (
          result.alreadyReached ? (
            <p className="text-sm text-brand font-medium">
              Com o valor já investido e o retorno esperado, você atinge o objetivo sem precisar de nenhum aporte novo.
            </p>
          ) : (
            <ResultStat label="Aporte mensal necessário" value={formatCurrency(result.requiredMonthlyContribution)} tone="positive" size="lg" />
          )
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
      note="Quanto maior o prazo disponível, menor o aporte mensal necessário para chegar ao mesmo objetivo — o tempo faz boa parte do trabalho nos juros compostos."
    />
  );
}
