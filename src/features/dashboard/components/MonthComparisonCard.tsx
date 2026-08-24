import Card from "../../../components/ui/Card";
import Icon from "../../../components/ui/Icon";

function Row({ label, change }: { label: string; change: number }) {
  const isPositive = change >= 0;
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-soft">{label}</span>
      <span
        className={`font-data inline-flex items-center gap-1 font-medium ${
          isPositive ? "text-brand" : "text-negative"
        }`}
      >
        <Icon name={isPositive ? "trendUp" : "trendDown"} size={16} />
        {change.toFixed(1)}%
      </span>
    </div>
  );
}

export default function MonthComparisonCard({
  entradasChange,
  saidasChange,
  saldoChange,
}: {
  entradasChange: number;
  saidasChange: number;
  saldoChange: number;
}) {
  return (
    <Card title="Comparação com mês anterior">
      <div className="space-y-3">
        <Row label="Entradas" change={entradasChange} />
        <Row label="Saídas" change={saidasChange} />
        <Row label="Saldo" change={saldoChange} />
      </div>
    </Card>
  );
}
