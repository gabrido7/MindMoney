import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import { formatCurrency, formatMonthBR } from "../../../utils/formatters";
import type { ObjectiveEvolutionPoint } from "../../../types/api";

export default function ObjectiveEvolutionChart({ data }: { data: ObjectiveEvolutionPoint[] }) {
  return (
    <Card title="Evolução das Metas" className="flex flex-col h-full">
      {data.length === 0 ? (
        <EmptyState message="Ainda não há aportes registrados para mostrar a evolução." />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
            <XAxis dataKey="month" tickFormatter={formatMonthBR} stroke="var(--ink-soft)" fontSize={12} />
            <YAxis stroke="var(--ink-soft)" fontSize={12} />
            <Tooltip
              formatter={(value: unknown) => [formatCurrency(Number(value) || 0), "Total acumulado"]}
              labelFormatter={(label) => (typeof label === "string" ? formatMonthBR(label) : "")}
              contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12 }}
            />
            <Line
              type="monotone"
              dataKey="totalSaved"
              name="Total acumulado"
              stroke="var(--brand)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
