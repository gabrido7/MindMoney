import Card from "../../../components/ui/Card";
import Icon from "../../../components/ui/Icon";
import { formatCurrency } from "../../../utils/formatters";

function TrendBadge({ change }: { change: number }) {
  const isPositive = change >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isPositive ? "text-[#0ca30c]" : "text-[#d03b3b]"
      }`}
    >
      <Icon name={isPositive ? "trendUp" : "trendDown"} size={14} />
      {Math.abs(change).toFixed(1)}%
    </span>
  );
}

export default function SummaryCards({
  totalEntradas,
  totalSaidas,
  saldo,
  entradasChange,
  saidasChange,
  saldoChange,
}: {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  entradasChange: number;
  saidasChange: number;
  saldoChange: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-gray-500 dark:text-gray-300 text-sm">Entradas</h3>
          <TrendBadge change={entradasChange} />
        </div>
        <p className="text-2xl font-bold text-[#0ca30c]">
          {formatCurrency(totalEntradas)}
        </p>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-gray-500 dark:text-gray-300 text-sm">Saídas</h3>
          <TrendBadge change={saidasChange} />
        </div>
        <p className="text-2xl font-bold text-[#d03b3b]">
          {formatCurrency(totalSaidas)}
        </p>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-gray-500 dark:text-gray-300 text-sm">Saldo</h3>
          <TrendBadge change={saldoChange} />
        </div>
        <p
          className={`text-2xl font-bold ${
            saldo >= 0 ? "text-[#0ca30c]" : "text-[#d03b3b]"
          }`}
        >
          {formatCurrency(saldo)}
        </p>
      </Card>
    </div>
  );
}
