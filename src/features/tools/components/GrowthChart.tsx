import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "../../../utils/formatters";

export interface GrowthChartSeries {
  key: string;
  name: string;
  color: string;
}

export default function GrowthChart({
  data,
  series,
  xLabel = "Mês",
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  series: GrowthChartSeries[];
  xLabel?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e1e0d9" />
        <XAxis
          dataKey="period"
          stroke="#898781"
          fontSize={12}
          label={{ value: xLabel, position: "insideBottom", offset: -2, fontSize: 11, fill: "#898781" }}
        />
        <YAxis
          stroke="#898781"
          fontSize={12}
          tickFormatter={(v: number) => formatCurrency(v).replace(",00", "")}
          width={72}
        />
        <Tooltip formatter={(value: unknown) => formatCurrency(Number(value) || 0)} labelFormatter={(label) => `${xLabel} ${label}`} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            fill={s.color}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
