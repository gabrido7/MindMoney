import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import Dial from "../../../components/ui/Dial";
import { scoreService } from "../../../services/scoreService";
import { errorMessage } from "../../../services/api";
import { formatMonthBR } from "../../../utils/formatters";
import type { ScoreData, ScoreLevel } from "../../../types/api";

const LEVEL_COLOR: Record<ScoreLevel, string> = {
  Excelente: "#0ca30c",
  Bom: "#2a78d6",
  Regular: "#fab219",
  Atenção: "#ec835a",
  Crítico: "#d03b3b",
};

const COMPONENT_LABELS: { key: keyof ScoreData["breakdown"]; label: string; max: number }[] = [
  { key: "spendingControl", label: "Controle de gastos", max: 40 },
  { key: "savingsCapacity", label: "Capacidade de economia", max: 30 },
  { key: "evolution", label: "Evolução financeira", max: 15 },
  { key: "consistency", label: "Consistência", max: 15 },
];

export default function ScoreCard({ month }: { month: string }) {
  const { data, isLoading: loading, error: queryError } = useQuery({
    queryKey: ["score", month],
    queryFn: () => Promise.all([scoreService.get(month), scoreService.history(6)]),
  });
  const error = errorMessage(queryError);

  const score = data?.[0] ?? null;
  const history = data?.[1]?.history ?? [];

  return (
    <Card title="Score Financeiro">
      {loading && <p className="text-ink-soft">Calculando...</p>}
      {error && <p className="text-negative">{error}</p>}

      {score && (
        <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center">
          <Dial value={score.score} color={LEVEL_COLOR[score.level]} size="lg" sublabel={score.level} />

          <div className="flex flex-col gap-2">
            {COMPONENT_LABELS.map(({ key, label, max }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-sm text-ink-soft w-44 shrink-0">{label}</span>
                <div className="flex-1 bg-surface-alt rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(Number(score.breakdown[key]) / max) * 100}%`,
                      backgroundColor: LEVEL_COLOR[score.level],
                    }}
                  />
                </div>
                <span className="font-data text-xs text-ink-soft w-12 text-right">
                  {score.breakdown[key]}/{max}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-line pt-4">
        <h3 className="font-display text-sm font-semibold text-ink mb-2">Evolução do score</h3>
        {history.length > 1 ? (
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={history}>
              <XAxis dataKey="month" tickFormatter={formatMonthBR} stroke="var(--ink-soft)" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="var(--ink-soft)" fontSize={11} width={28} />
              <Tooltip
                formatter={(value: unknown) => [Number(value) || 0, "Score"]}
                labelFormatter={(label) => (typeof label === "string" ? formatMonthBR(label) : "")}
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12 }}
              />
              <Line type="monotone" dataKey="score" stroke="var(--brand)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState message="Ainda não há histórico suficiente para mostrar a evolução." />
        )}
      </div>
    </Card>
  );
}
