import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import ProgressBar from "../../../components/ui/ProgressBar";
import { objectivesService } from "../../../services/objectivesService";
import { errorMessage } from "../../../services/api";
import { formatCurrency, formatMonthBR } from "../../../utils/formatters";
import { CATEGORY_BY_VALUE } from "../data/categoryPresets";
import { PRIORITY_BY_VALUE } from "../data/priorityPresets";
import { invalidateObjectives } from "../hooks/invalidateObjectives";
import { tipMessage } from "../utils/tipMessage";
import type { ApiObjective } from "../../../types/api";

export default function ObjectiveCard({
  objective,
  onEdit,
  onDelete,
  onAddContribution,
}: {
  objective: ApiObjective;
  onEdit: () => void;
  onDelete: () => void;
  onAddContribution: () => void;
}) {
  const queryClient = useQueryClient();
  const [showContributions, setShowContributions] = useState(false);
  const preset = CATEGORY_BY_VALUE[objective.category];
  const priorityPreset = PRIORITY_BY_VALUE[objective.priority];

  const { data, isLoading } = useQuery({
    queryKey: ["objectiveContributions", objective.id],
    queryFn: () => objectivesService.listContributions(objective.id),
    enabled: showContributions,
  });

  const [removeError, setRemoveError] = useState<string | null>(null);
  const removeMutation = useMutation({
    mutationFn: (contributionId: number) => objectivesService.removeContribution(objective.id, contributionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objectiveContributions", objective.id] });
      invalidateObjectives(queryClient);
      setRemoveError(null);
    },
    onError: (err) => setRemoveError(errorMessage(err) ?? "Não foi possível remover o aporte."),
  });

  return (
    <Card>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{preset.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <span title={`Prioridade ${priorityPreset.label}`}>{priorityPreset.dot}</span>
              {objective.name}
            </h3>
            <p className="text-xs text-gray-400">{preset.label}</p>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onEdit}
            aria-label={`Editar meta ${objective.name}`}
            className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
          >
            <Icon name="edit" size={16} />
          </button>
          <button
            onClick={onDelete}
            aria-label={`Excluir meta ${objective.name}`}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            <strong className="text-base text-gray-900 dark:text-white">
              {formatCurrency(objective.currentAmount)}
            </strong>{" "}
            / {formatCurrency(objective.targetAmount)}
          </span>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
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
        {objective.achieved ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#0ca30c]/10 text-[#0ca30c]">
            Concluída
          </span>
        ) : objective.overdue ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#d03b3b]/10 text-[#d03b3b]">
            Atrasada
          </span>
        ) : (
          <span className="text-xs text-gray-400">
            {objective.monthsRemaining === 0
              ? "vence este mês"
              : `${objective.monthsRemaining} ${objective.monthsRemaining === 1 ? "mês restante" : "meses restantes"}`}
          </span>
        )}
      </div>

      <p className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/40 rounded-lg text-sm text-gray-700 dark:text-gray-100">
        {tipMessage(objective)}
      </p>

      <div className="flex items-center gap-3 mt-4">
        <Button onClick={onAddContribution} className="text-sm">
          <Icon name="plus" size={14} />
          Aporte
        </Button>
        <button
          onClick={() => setShowContributions((v) => !v)}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600"
        >
          {showContributions ? "Ocultar aportes" : "Ver aportes"}
        </button>
      </div>

      {showContributions && (
        <div className="mt-3 border-t border-gray-100 dark:border-gray-700 pt-3">
          {isLoading && <p className="text-xs text-gray-400">Carregando...</p>}
          {removeError && <p className="text-xs text-red-500 mb-2">{removeError}</p>}
          {data && data.contributions.length === 0 && (
            <p className="text-xs text-gray-400">Nenhum aporte lançado ainda.</p>
          )}
          {data && data.contributions.length > 0 && (
            <ul className="flex flex-col gap-2">
              {data.contributions.map((c) => (
                <li key={c.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    {c.contributed_at.split("-").reverse().join("/")} · {formatCurrency(Number(c.amount))}
                    {c.note ? ` · ${c.note}` : ""}
                  </span>
                  <button
                    onClick={() => removeMutation.mutate(c.id)}
                    disabled={removeMutation.isPending}
                    aria-label="Remover aporte"
                    className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}
