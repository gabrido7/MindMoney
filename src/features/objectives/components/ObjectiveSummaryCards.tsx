import Card from "../../../components/ui/Card";
import { formatCurrency } from "../../../utils/formatters";
import type { ObjectiveSummary } from "../../../types/api";

export default function ObjectiveSummaryCards({ summary }: { summary: ObjectiveSummary }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <h3 className="text-gray-500 dark:text-gray-300 text-sm">Total em metas</h3>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(summary.totalTarget)}
        </p>
      </Card>
      <Card>
        <h3 className="text-gray-500 dark:text-gray-300 text-sm">Total acumulado</h3>
        <p className="text-xl font-bold text-[#0ca30c]">{formatCurrency(summary.totalSaved)}</p>
      </Card>
      <Card>
        <h3 className="text-gray-500 dark:text-gray-300 text-sm">Progresso geral</h3>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {summary.overallProgressPercent.toFixed(1)}%
        </p>
      </Card>
      <Card>
        <h3 className="text-gray-500 dark:text-gray-300 text-sm">Próximas do prazo</h3>
        <p
          className={`text-xl font-bold ${summary.nearDeadlineCount > 0 ? "text-[#fab219]" : "text-gray-900 dark:text-white"}`}
        >
          {summary.nearDeadlineCount}
        </p>
      </Card>
    </div>
  );
}
