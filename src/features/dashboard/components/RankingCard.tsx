import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import { formatCurrency } from "../../../utils/formatters";
import type { CategoryTotal } from "../../../types";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function RankingCard({ ranking }: { ranking: CategoryTotal[] }) {
  return (
    <Card title="Ranking de Gastos">
      {ranking.length === 0 ? (
        <EmptyState message="Sem dados" />
      ) : (
        <ul className="max-h-96 space-y-3 overflow-y-auto pr-1">
          {ranking.map((item, index) => (
            <li key={item.name} className="flex justify-between">
              <span className="text-ink-soft">
                {MEDALS[index]} {item.name}
              </span>
              <span className="font-data text-negative font-bold">
                {formatCurrency(item.value)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
