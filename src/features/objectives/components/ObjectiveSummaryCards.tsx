import Card from "../../../components/ui/Card";
import ScoreArc from "../../../components/ui/ScoreArc";
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
        <h3 className="text-ink-soft text-sm">Total em metas</h3>
        <p className="text-xl font-bold text-ink font-data">
          {formatCurrency(summary.totalTarget)}
        </p>
      </Card>
      <Card>
        <h3 className="text-ink-soft text-sm">Total acumulado</h3>
        <p className="text-xl font-bold text-brand font-data">{formatCurrency(summary.totalSaved)}</p>
      </Card>
      <Card>
        <h3 className="text-ink-soft text-sm mb-1">Progresso geral</h3>
        <div className="flex items-center gap-3">
          <ScoreArc value={summary.overallProgressPercent} size="sm">
            <span className="font-data text-xs font-bold text-ink">
              {summary.overallProgressPercent.toFixed(0)}%
            </span>
          </ScoreArc>
        </div>
      </Card>
      <Card>
        {nearDeadlineCount === 0 || !mostUrgentObjective ? (
          <>
            <h3 className="text-ink-soft text-sm">Próximas do prazo</h3>
            <p className="text-xl font-bold text-ink font-data">0</p>
          </>
        ) : (
          <>
            <h3 className="text-ink-soft text-sm">
              {nearDeadlineCount} {nearDeadlineCount === 1 ? "meta próxima" : "metas próximas"} do prazo
            </h3>
            <p className="mt-1 flex items-center gap-1.5 font-bold text-ink">
              <span>🚨</span>
              <span className="truncate" title={mostUrgentObjective.name}>
                {CATEGORY_BY_VALUE[mostUrgentObjective.category].icon} {mostUrgentObjective.name}
              </span>
            </p>
            <p className="text-sm text-warning font-medium">
              {deadlineLabel(mostUrgentObjective.daysRemaining)}
              {nearDeadlineCount > 1 && (
                <span className="text-ink-soft font-normal">
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
