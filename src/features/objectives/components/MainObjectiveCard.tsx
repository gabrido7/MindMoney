import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import ScoreArc from "../../../components/ui/ScoreArc";
import { formatCurrency, formatMonthBR } from "../../../utils/formatters";
import { CATEGORY_BY_VALUE } from "../data/categoryPresets";
import { PRIORITY_BY_VALUE } from "../data/priorityPresets";
import { tipMessage } from "../utils/tipMessage";
import GoalSimulator from "./GoalSimulator";
import type { ApiObjective } from "../../../types/api";

export default function MainObjectiveCard({
  objective,
  onAddContribution,
  justCompleted = false,
}: {
  objective: ApiObjective;
  onAddContribution: () => void;
  justCompleted?: boolean;
}) {
  const preset = CATEGORY_BY_VALUE[objective.category];
  const priorityPreset = PRIORITY_BY_VALUE[objective.priority];
  const arcColor = objective.overdue ? "var(--negative)" : "var(--brand)";

  return (
    <Card
      className={`border-2 border-brand-soft flex flex-col h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        justCompleted ? "motion-safe:animate-goal-complete" : ""
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-brand mb-2">
        Meta principal
      </p>

      <div className="flex items-center gap-2.5">
        <span className="text-3xl">{preset.icon}</span>
        <div>
          <h3 className="font-display text-lg font-bold text-ink flex items-center gap-1.5">
            <span title={`Prioridade ${priorityPreset.label}`}>{priorityPreset.dot}</span>
            {objective.name}
          </h3>
          <p className="text-xs text-ink-soft">{preset.label}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[auto_1fr] gap-4 items-center">
        <ScoreArc value={objective.progressPercent} color={arcColor} size="md">
          <span className="font-data text-lg font-bold text-ink">
            {objective.progressPercent.toFixed(0)}%
          </span>
        </ScoreArc>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-ink-soft font-data">
            <strong className="text-xl text-ink">
              {formatCurrency(objective.currentAmount)}
            </strong>{" "}
            / {formatCurrency(objective.targetAmount)}
          </span>

          <span className="text-sm text-ink-soft font-data">
            {objective.achieved
              ? "Meta atingida"
              : `${formatCurrency(objective.remainingAmount)} restantes`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 text-sm">
        <span className="text-ink-soft">Meta: {formatMonthBR(objective.targetMonth)}</span>
        {objective.overdue && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-negative-soft text-negative">
            Atrasada
          </span>
        )}
      </div>

      <p className="mt-3 p-3 bg-warning-soft rounded-lg text-sm text-ink">
        {tipMessage(objective)}
      </p>

      <div className="mt-4 pt-4 border-t border-line">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">
          🔮 Simulador de meta
        </p>
        <GoalSimulator objective={objective} />
      </div>

      <div className="mt-auto pt-4">
        <Button onClick={onAddContribution} className="text-sm">
          <Icon name="plus" size={14} />
          Aporte
        </Button>
      </div>
    </Card>
  );
}
