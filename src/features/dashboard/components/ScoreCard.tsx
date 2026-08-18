import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import { scoreService } from "../../../services/scoreService";
import { useApiRequest } from "../../../hooks/useApiRequest";
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
  const { data, loading, error } = useApiRequest(
    () => Promise.all([scoreService.get(month), scoreService.history(6)]),
    [month]
  );

  const score = data?.[0] ?? null;
  const history = data?.[1]?.history ?? [];

  return (
    <Card title="Score Financeiro">
      {loading && <p className="text-gray-500 dark:text-gray-400">Calculando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {score && (
        <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="flex flex-col items-center justify-center">
            <div
              className="flex h-28 w-28 items-center justify-center rounded-full text-3xl font-bold text-white"
              style={{ backgroundColor: LEVEL_COLOR[score.level] }}
            >
              {score.score}
            </div>
            <span
              className="mt-2 text-sm font-semibold"
              style={{ color: LEVEL_COLOR[score.level] }}
            >
              {score.level}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {COMPONENT_LABELS.map(({ key, label, max }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-300 w-44 shrink-0">
                  {label}
                </span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(Number(score.breakdown[key]) / max) * 100}%`,
                      backgroundColor: LEVEL_COLOR[score.level],
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-12 text-right">
                  {score.breakdown[key]}/{max}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Evolução do score
        </h3>
        {history.length > 1 ? (
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={history}>
              <XAxis dataKey="month" tickFormatter={formatMonthBR} stroke="#898781" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#898781" fontSize={11} width={28} />
              <Tooltip
                formatter={(value?: number) => [value ?? 0, "Score"]}
                labelFormatter={(label) => (typeof label === "string" ? formatMonthBR(label) : "")}
              />
              <Line type="monotone" dataKey="score" stroke="#2a78d6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState message="Ainda não há histórico suficiente para mostrar a evolução." />
        )}
      </div>
    </Card>
  );
}
