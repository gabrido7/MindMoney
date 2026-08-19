import Card from "../../../components/ui/Card";
import { formatCurrency } from "../../../utils/formatters";
import { CATEGORY_BY_VALUE } from "../data/categoryPresets";
import type { ObjectiveSummary } from "../../../types/api";

function deadlineLabel(daysRemaining: number): string {
  if (daysRemaining <= 0) return "vence hoje";
  if (daysRemaining === 1) return "vence amanhã";
  return `vence em ${daysRemaining} dias`;
}

export default function ObjectiveSummaryCards({ summary }: { summary: ObjectiveSummary }) {
  const { nearDeadlineCount, mostUrgentObjective } = summary;
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
        {nearDeadlineCount === 0 || !mostUrgentObjective ? (
          <>
            <h3 className="text-gray-500 dark:text-gray-300 text-sm">Próximas do prazo</h3>
            <p className="text-xl font-bold text-gray-900 dark:text-white">0</p>
          </>
        ) : (
          <>
            <h3 className="text-gray-500 dark:text-gray-300 text-sm">
              {nearDeadlineCount} {nearDeadlineCount === 1 ? "meta próxima" : "metas próximas"} do prazo
            </h3>
            <p className="mt-1 flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
              <span>🚨</span>
              <span className="truncate" title={mostUrgentObjective.name}>
                {CATEGORY_BY_VALUE[mostUrgentObjective.category].icon} {mostUrgentObjective.name}
              </span>
            </p>
            <p className="text-sm text-[#fab219] font-medium">
              {deadlineLabel(mostUrgentObjective.daysRemaining)}
              {nearDeadlineCount > 1 && (
                <span className="text-gray-400 dark:text-gray-500 font-normal">
                  {" "}
                  · +{nearDeadlineCount - 1} {nearDeadlineCount - 1 === 1 ? "outra" : "outras"}
                </span>
              )}
            </p>
          </>
        )}
      </Card>
    </div>
  );
}
