import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import ProgressBar from "../../../components/ui/ProgressBar";
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

  return (
    <Card
      className={`border-2 border-green-500/30 flex flex-col h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        justCompleted ? "motion-safe:animate-goal-complete" : ""
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400 mb-2">
        Meta principal
      </p>

      <div className="flex items-center gap-2.5">
        <span className="text-3xl">{preset.icon}</span>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <span title={`Prioridade ${priorityPreset.label}`}>{priorityPreset.dot}</span>
            {objective.name}
          </h3>
          <p className="text-xs text-gray-400">{preset.label}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            <strong className="text-xl text-gray-900 dark:text-white">
              {formatCurrency(objective.currentAmount)}
            </strong>{" "}
            / {formatCurrency(objective.targetAmount)}
          </span>
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            {objective.progressPercent.toFixed(1)}%
          </span>
        </div>

        <ProgressBar percent={objective.progressPercent} />

        <span className="text-sm text-gray-500 dark:text-gray-400">
          {objective.achieved
            ? "Meta atingida"
            : `${formatCurrency(objective.remainingAmount)} restantes`}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-3 text-sm">
        <span className="text-gray-500 dark:text-gray-400">Meta: {formatMonthBR(objective.targetMonth)}</span>
        {objective.overdue && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#d03b3b]/10 text-[#d03b3b]">
            Atrasada
          </span>
        )}
      </div>

      <p className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/40 rounded-lg text-sm text-gray-700 dark:text-gray-100">
        {tipMessage(objective)}
      </p>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
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
