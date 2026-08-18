import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import EmptyState from "../components/ui/EmptyState";
import { dashboardService } from "../services/dashboardService";
import { errorMessage } from "../services/api";
import { formatCurrency, formatMonthBR, currentMonth } from "../utils/formatters";
import { exportReportCSV, type MonthReport } from "../features/reports/utils/exportReport";

const MONTHS_IN_REPORT = 6;

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth());

  const {
    data: rangeData,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["dashboardRange", selectedMonth, MONTHS_IN_REPORT],
    queryFn: () => dashboardService.range(MONTHS_IN_REPORT, selectedMonth),
  });
  const error = errorMessage(queryError);

  const rows: MonthReport[] = useMemo(
    () =>
      (rangeData?.months ?? []).map((d) => ({
        month: d.month,
        entradas: d.totals.entradas,
        saidas: d.totals.saidas,
        saldo: d.totals.saldo,
        savingsRate: d.totals.entradas > 0 ? (d.totals.saldo / d.totals.entradas) * 100 : 0,
      })),
    [rangeData]
  );
  const selected = rangeData?.months.at(-1);
  const maiorCategoria = selected?.ranking[0];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
        <div className="flex items-end gap-3">
          <Input
            label="Mês de referência"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <Button variant="secondary" disabled={rows.length === 0} onClick={() => exportReportCSV(rows)}>
            <Icon name="download" size={16} />
            Exportar CSV
          </Button>
        </div>
      </div>

      {loading && <p className="text-gray-500 dark:text-gray-400">Carregando relatório...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {selected && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <h3 className="text-gray-500 dark:text-gray-300 text-sm">Entradas</h3>
              <p className="text-xl font-bold text-[#0ca30c]">{formatCurrency(selected.totals.entradas)}</p>
            </Card>
            <Card>
              <h3 className="text-gray-500 dark:text-gray-300 text-sm">Saídas</h3>
              <p className="text-xl font-bold text-[#d03b3b]">{formatCurrency(selected.totals.saidas)}</p>
            </Card>
            <Card>
              <h3 className="text-gray-500 dark:text-gray-300 text-sm">Saldo</h3>
              <p
                className={`text-xl font-bold ${selected.totals.saldo >= 0 ? "text-[#0ca30c]" : "text-[#d03b3b]"}`}
              >
                {formatCurrency(selected.totals.saldo)}
              </p>
            </Card>
            <Card>
              <h3 className="text-gray-500 dark:text-gray-300 text-sm">% de economia</h3>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {selected.totals.entradas > 0
                  ? `${((selected.totals.saldo / selected.totals.entradas) * 100).toFixed(1)}%`
                  : "—"}
              </p>
            </Card>
          </div>

          <Card title="Maior categoria de gasto">
            {maiorCategoria ? (
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: maiorCategoria.color }}
                />
                <span className="font-medium text-gray-900 dark:text-white">{maiorCategoria.name}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {formatCurrency(maiorCategoria.value)}
                </span>
              </div>
            ) : (
              <EmptyState message="Nenhuma saída registrada neste mês." />
            )}
          </Card>

          <Card title={`Comparação — últimos ${MONTHS_IN_REPORT} meses`}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e0d9" />
                <XAxis dataKey="month" tickFormatter={formatMonthBR} stroke="#898781" fontSize={12} />
                <YAxis stroke="#898781" fontSize={12} />
                <Tooltip
                  formatter={(value: unknown) => formatCurrency(Number(value) || 0)}
                  labelFormatter={(label) => (typeof label === "string" ? formatMonthBR(label) : "")}
                />
                <Bar dataKey="entradas" name="Entradas" fill="#0ca30c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saidas" name="Saídas" fill="#d03b3b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    <th className="py-2 pr-4">Mês</th>
                    <th className="py-2 pr-4">Entradas</th>
                    <th className="py-2 pr-4">Saídas</th>
                    <th className="py-2 pr-4">Saldo</th>
                    <th className="py-2">% economia</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.month} className="border-b border-gray-50 dark:border-gray-700 last:border-0">
                      <td className="py-2 pr-4 text-gray-900 dark:text-white">{formatMonthBR(r.month)}</td>
                      <td className="py-2 pr-4 text-[#0ca30c]">{formatCurrency(r.entradas)}</td>
                      <td className="py-2 pr-4 text-[#d03b3b]">{formatCurrency(r.saidas)}</td>
                      <td className={`py-2 pr-4 ${r.saldo >= 0 ? "text-[#0ca30c]" : "text-[#d03b3b]"}`}>
                        {formatCurrency(r.saldo)}
                      </td>
                      <td className="py-2 text-gray-700 dark:text-gray-200">
                        {r.entradas > 0 ? `${r.savingsRate.toFixed(1)}%` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
