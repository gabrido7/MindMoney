import { useState } from "react";
import { calculatePurchasingPower, toMonthlyRate, toMonths, type RatePeriod, type DurationUnit } from "../utils/calculations";
import { parseLocaleNumber } from "../utils/number";
import { formatCurrency, formatPercent } from "../../../utils/formatters";
import NumberField from "../components/NumberField";
import RateField from "../components/RateField";
import DurationField from "../components/DurationField";
import ResultStat from "../components/ResultStat";
import GrowthChart from "../components/GrowthChart";
import CalculatorLayout from "../components/CalculatorLayout";

export default function PurchasingPowerCalculator() {
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState("5");
  const [ratePeriod, setRatePeriod] = useState<RatePeriod>("annual");
  const [duration, setDuration] = useState("5");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("years");

  const amountNum = parseLocaleNumber(amount);
  const rateNum = parseLocaleNumber(rate);
  const durationNum = parseLocaleNumber(duration);
  const valid = [amountNum, rateNum, durationNum].every((n) => Number.isFinite(n)) && durationNum > 0;

  const result = valid
    ? calculatePurchasingPower({
        amount: amountNum,
        monthlyRate: toMonthlyRate(rateNum, ratePeriod),
        months: toMonths(durationNum, durationUnit),
      })
    : null;

  return (
    <CalculatorLayout
      inputs={
        <>
          <NumberField id="pp-amount" label="Valor parado hoje" prefix="R$" value={amount} onChange={setAmount} placeholder="10000" />
          <RateField id="pp-rate" label="Inflação" value={rate} onChange={setRate} period={ratePeriod} onPeriodChange={setRatePeriod} placeholder="5" />
          <DurationField id="pp-duration" label="Período" value={duration} onChange={setDuration} unit={durationUnit} onUnitChange={setDurationUnit} />
        </>
      }
      results={
        result ? (
          <>
            <ResultStat label="Poder de compra no futuro" value={formatCurrency(result.futureRealValue)} tone="negative" size="lg" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <ResultStat label="Perda em valor" value={formatCurrency(result.lossAmount)} tone="negative" />
              <ResultStat label="Perda percentual" value={formatPercent(result.lossPercent, 1)} tone="negative" />
            </div>
          </>
        ) : (
          <p className="text-sm text-ink-soft">Preencha os dados para calcular.</p>
        )
      }
      chart={
        result && (
          <GrowthChart
            data={result.series.map((p) => ({ period: p.period, value: p.value }))}
            series={[{ key: "value", name: "Poder de compra", color: "var(--negative)" }]}
          />
        )
      }
      note="Isso mostra o que o mesmo valor, parado e sem nenhum rendimento, ainda conseguiria comprar no futuro — o quanto a inflação corrói o dinheiro parado."
    />
  );
}
