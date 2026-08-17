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
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <Icon name="trendUp" size={16} className="text-[#d03b3b]" />
              Maior aumento:{" "}
              <span className="font-bold text-[#d03b3b]">
                {biggestIncrease.category}
              </span>{" "}
              ({biggestIncrease.change.toFixed(1)}%)
            </p>
          )}

          {biggestDecrease && (
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
              <Icon name="trendDown" size={16} className="text-[#0ca30c]" />
              Maior redução:{" "}
              <span className="font-bold text-[#0ca30c]">
                {biggestDecrease.category}
              </span>{" "}
              ({Math.abs(biggestDecrease.change).toFixed(1)}%)
            </p>
          )}

          {top3Increases.length > 0 && (
            <div className="pt-2">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">
                Top 3 aumentos
              </p>
              <ul className="list-disc ml-5 text-gray-700 dark:text-gray-200 space-y-1">
                {top3Increases.map((item) => (
                  <li key={item.category}>
                    {item.category} ({item.change.toFixed(1)}%)
                  </li>
                ))}
              </ul>
            </div>
          )}

          {biggestIncrease && (
            <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/40 rounded-lg text-sm text-gray-700 dark:text-gray-100">
              {categoryTip(biggestIncrease.category)}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
