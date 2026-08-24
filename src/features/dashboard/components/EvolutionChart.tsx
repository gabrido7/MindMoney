import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import { formatCurrency, formatMonthBR } from "../../../utils/formatters";

export default function EvolutionChart({
  data,
}: {
  data: { month: string; saldo: number }[];
}) {
  return (
    <Card title="Evolução Financeira">
      {data.length === 0 ? (
        <EmptyState message="Ainda não há dados suficientes." />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonthBR}
              stroke="var(--ink-soft)"
              fontSize={12}
            />
            <YAxis stroke="var(--ink-soft)" fontSize={12} />
            <Tooltip
              formatter={(value: unknown) => [formatCurrency(Number(value) || 0), "Saldo"]}
              labelFormatter={(label) =>
                typeof label === "string" ? formatMonthBR(label) : ""
              }
              contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12 }}
            />
            <Line
              type="monotone"
              dataKey="saldo"
              name="Saldo"
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
