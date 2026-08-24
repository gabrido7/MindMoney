import { useState } from "react";
import { compareInvestments, toMonthlyRate, toMonths, type RatePeriod, type DurationUnit } from "../utils/calculations";
import { parseLocaleNumber } from "../utils/number";
import { formatCurrency } from "../../../utils/formatters";
import NumberField from "../components/NumberField";
import RateField from "../components/RateField";
import DurationField from "../components/DurationField";
import ResultStat from "../components/ResultStat";
import GrowthChart from "../components/GrowthChart";
import Card from "../../../components/ui/Card";

interface ScenarioState {
  name: string;
  initial: string;
  contribution: string;
  rate: string;
  ratePeriod: RatePeriod;
  color: string;
}

const COLORS = { a: "var(--brand)", b: "var(--warning)" };

function ScenarioForm({
  scenario,
  onChange,
  idPrefix,
}: {
  scenario: ScenarioState;
  onChange: (next: ScenarioState) => void;
  idPrefix: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line p-4">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: scenario.color }} />
        <input
          value={scenario.name}
          onChange={(e) => onChange({ ...scenario, name: e.target.value })}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-ink focus:outline-none"
        />
      </div>
      <NumberField
        id={`${idPrefix}-initial`}
        label="Investimento inicial"
        prefix="R$"
        value={scenario.initial}
        onChange={(v) => onChange({ ...scenario, initial: v })}
      />
      <NumberField
        id={`${idPrefix}-contribution`}
        label="Aporte mensal"
        prefix="R$"
        value={scenario.contribution}
        onChange={(v) => onChange({ ...scenario, contribution: v })}
      />
      <RateField
        id={`${idPrefix}-rate`}
        label="Taxa de retorno"
        value={scenario.rate}
        onChange={(v) => onChange({ ...scenario, rate: v })}
        period={scenario.ratePeriod}
        onPeriodChange={(p) => onChange({ ...scenario, ratePeriod: p })}
      />
    </div>
  );
}

export default function InvestmentComparisonCalculator() {
  const [scenarioA, setScenarioA] = useState<ScenarioState>({
    name: "Investimento A",
    initial: "5000",
    contribution: "200",
    rate: "0,7",
    ratePeriod: "monthly",
    color: COLORS.a,
  });
  const [scenarioB, setScenarioB] = useState<ScenarioState>({
    name: "Investimento B",
    initial: "5000",
    contribution: "200",
    rate: "1,1",
    ratePeriod: "monthly",
    color: COLORS.b,
  });
  const [duration, setDuration] = useState("60");
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("months");

  const durationNum = parseLocaleNumber(duration);
  const months = Number.isFinite(durationNum) && durationNum > 0 ? toMonths(durationNum, durationUnit) : 0;

  const scenarios = [scenarioA, scenarioB].map((s) => ({
    name: s.name || "Investimento",
    initial: parseLocaleNumber(s.initial),
    monthlyContribution: parseLocaleNumber(s.contribution),
    monthlyRate: toMonthlyRate(parseLocaleNumber(s.rate), s.ratePeriod),
  }));

  const valid = months > 0 && scenarios.every((s) => [s.initial, s.monthlyContribution, s.monthlyRate].every(Number.isFinite));
  const results = valid ? compareInvestments(scenarios, months) : null;

  const chartData =
    results &&
    results[0].series.map((point, i) => ({
      period: point.period,
      a: point.balance,
      b: results[1].series[i].balance,
    }));

  return (
    <div className="flex flex-col gap-6">
      <Card title="Dados de entrada">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ScenarioForm scenario={scenarioA} onChange={setScenarioA} idPrefix="cmp-a" />
            <ScenarioForm scenario={scenarioB} onChange={setScenarioB} idPrefix="cmp-b" />
          </div>
          <DurationField id="cmp-duration" label="Período de comparação" value={duration} onChange={setDuration} unit={durationUnit} onUnitChange={setDurationUnit} />
        </div>
      </Card>

      <Card title="Resultado">
        {results ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {results.map((r, i) => (
              <div key={r.name} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: i === 0 ? COLORS.a : COLORS.b }} />
                  <span className="text-sm font-semibold text-ink-soft">{r.name}</span>
                </div>
                <ResultStat label="Valor final" value={formatCurrency(r.futureValue)} tone="positive" size="lg" />
                <ResultStat label="Total em juros" value={formatCurrency(r.totalInterest)} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-soft">Preencha os dados para calcular.</p>
        )}
        {results && results[0].futureValue !== results[1].futureValue && (
          <p className="mt-4 text-sm text-ink-soft">
            {results[0].futureValue > results[1].futureValue ? results[0].name : results[1].name} rende{" "}
            <span className="font-data">{formatCurrency(Math.abs(results[0].futureValue - results[1].futureValue))}</span> a mais no
            período.
          </p>
        )}
      </Card>

      {chartData && (
        <Card title="Evolução ao longo do tempo">
          <GrowthChart
            data={chartData}
            series={[
              { key: "a", name: scenarioA.name || "Investimento A", color: COLORS.a },
              { key: "b", name: scenarioB.name || "Investimento B", color: COLORS.b },
            ]}
          />
        </Card>
      )}
    </div>
  );
}
