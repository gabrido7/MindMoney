import Card from "../../../components/ui/Card";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import { categoryTip } from "../utils/insights";
import type { CategoryComparison } from "../../../types";

export default function InsightsCard({
  biggestIncrease,
  biggestDecrease,
  top3Increases,
}: {
  biggestIncrease: CategoryComparison | undefined;
  biggestDecrease: CategoryComparison | undefined;
  top3Increases: CategoryComparison[];
}) {
  const hasInsights = biggestIncrease || biggestDecrease;

  return (
    <Card title="Insights Inteligentes">
      {!hasInsights ? (
        <EmptyState message="Sem dados suficientes para gerar insights ainda." />
      ) : (
        <div className="space-y-3">
          {biggestIncrease && (
            <p className="flex items-center gap-2 text-ink-soft">
              <Icon name="trendUp" size={16} className="text-negative" />
              Maior aumento:{" "}
              <span className="font-bold text-negative">
                {biggestIncrease.category}
              </span>{" "}
              <span className="font-data">({biggestIncrease.change.toFixed(1)}%)</span>
            </p>
          )}

          {biggestDecrease && (
            <p className="flex items-center gap-2 text-ink-soft">
              <Icon name="trendDown" size={16} className="text-brand" />
              Maior redução:{" "}
              <span className="font-bold text-brand">
                {biggestDecrease.category}
              </span>{" "}
              <span className="font-data">({Math.abs(biggestDecrease.change).toFixed(1)}%)</span>
            </p>
          )}

          {top3Increases.length > 0 && (
            <div className="pt-2">
              <p className="font-display font-semibold text-ink mb-2">
                Top 3 aumentos
              </p>
              <ul className="list-disc ml-5 text-ink-soft space-y-1">
                {top3Increases.map((item) => (
                  <li key={item.category}>
                    {item.category} <span className="font-data">({item.change.toFixed(1)}%)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {biggestIncrease && (
            <div className="mt-2 p-3 bg-warning-soft rounded-lg text-sm text-ink-soft">
              {categoryTip(biggestIncrease.category)}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
