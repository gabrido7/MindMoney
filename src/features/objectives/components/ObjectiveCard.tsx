import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import Dial from "../../../components/ui/Dial";
import { objectivesService } from "../../../services/objectivesService";
import { errorMessage } from "../../../services/api";
import { useToast } from "../../../hooks/useToast";
import { formatCurrency, formatMonthBR } from "../../../utils/formatters";
import { CATEGORY_BY_VALUE } from "../data/categoryPresets";
import { PRIORITY_BY_VALUE } from "../data/priorityPresets";
import { invalidateObjectives } from "../hooks/invalidateObjectives";
import { tipMessage } from "../utils/tipMessage";
import GoalSimulator from "./GoalSimulator";
import type { ApiObjective } from "../../../types/api";

export default function ObjectiveCard({
  objective,
  onEdit,
  onDelete,
  onAddContribution,
  justCompleted = false,
}: {
  objective: ApiObjective;
  onEdit: () => void;
  onDelete: () => void;
  onAddContribution: () => void;
  justCompleted?: boolean;
}) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [showContributions, setShowContributions] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const preset = CATEGORY_BY_VALUE[objective.category];
  const priorityPreset = PRIORITY_BY_VALUE[objective.priority];
  const arcColor = objective.overdue ? "var(--negative)" : "var(--brand)";

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
      showToast("✓ Aporte removido com sucesso.");
    },
    onError: (err) => setRemoveError(errorMessage(err) ?? "Não foi possível remover o aporte."),
  });

  return (
    <Card
      className={`transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        justCompleted ? "motion-safe:animate-goal-complete" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{preset.icon}</span>
          <div>
            <h3 className="font-display font-semibold text-ink flex items-center gap-1.5">
              <span title={`Prioridade ${priorityPreset.label}`}>{priorityPreset.dot}</span>
              {objective.name}
            </h3>
            <p className="text-xs text-ink-soft">{preset.label}</p>
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onEdit}
            aria-label={`Editar meta ${objective.name}`}
            className="p-2 rounded-lg text-brand hover:bg-brand-soft transition-colors active:scale-90"
          >
            <Icon name="edit" size={16} />
          </button>
          <button
            onClick={onDelete}
            aria-label={`Excluir meta ${objective.name}`}
            className="p-2 rounded-lg text-negative hover:bg-negative-soft transition-colors active:scale-90"
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
        <Dial value={objective.progressPercent} color={arcColor} size="sm" center={`${objective.progressPercent.toFixed(0)}%`} />

        <div className="flex flex-col gap-1">
          <span className="text-sm text-ink-soft font-data">
            <strong className="text-base text-ink">
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
        {objective.achieved ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-soft text-brand-deep">
            Concluída
          </span>
        ) : objective.overdue ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-negative-soft text-negative">
            Atrasada
          </span>
        ) : (
          <span className="text-xs text-ink-soft">
            {objective.monthsRemaining === 0
              ? "vence este mês"
              : `${objective.monthsRemaining} ${objective.monthsRemaining === 1 ? "mês restante" : "meses restantes"}`}
          </span>
        )}
      </div>

      <p className="mt-3 p-3 bg-warning-soft rounded-lg text-sm text-ink">
        {tipMessage(objective)}
      </p>

      <div className="flex items-center gap-3 mt-4">
        <Button onClick={onAddContribution} className="text-sm">
          <Icon name="plus" size={14} />
          Aporte
        </Button>
        <button
          onClick={() => setShowContributions((v) => !v)}
          className="text-sm text-ink-soft hover:text-brand flex items-center gap-1 transition-colors"
        >
          {showContributions ? "Ocultar aportes" : "Ver aportes"}
          <Icon
            name="chevronDown"
            size={14}
            className={`transition-transform duration-200 ${showContributions ? "rotate-180" : ""}`}
          />
        </button>
        {!objective.achieved && (
          <button
            onClick={() => setShowSimulator((v) => !v)}
            className="text-sm text-ink-soft hover:text-brand flex items-center gap-1 transition-colors"
          >
            <Icon name="sparkles" size={14} />
            {showSimulator ? "Ocultar simulador" : "E se...?"}
            <Icon
              name="chevronDown"
              size={14}
              className={`transition-transform duration-200 ${showSimulator ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {showSimulator && (
        <div className="mt-3 border-t border-line pt-3 motion-safe:animate-fade-in">
          <GoalSimulator objective={objective} />
        </div>
      )}

      {showContributions && (
        <div className="mt-3 border-t border-line pt-3 motion-safe:animate-fade-in">
          {isLoading && <p className="text-xs text-ink-soft">Carregando...</p>}
          {removeError && <p className="text-xs text-negative mb-2">{removeError}</p>}
          {data && data.contributions.length === 0 && (
            <p className="text-xs text-ink-soft">Nenhum aporte lançado ainda.</p>
          )}
          {data && data.contributions.length > 0 && (
            <ul className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-1">
              {data.contributions.map((c) => (
                <li key={c.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink-soft font-data">
                    {c.contributed_at.split("-").reverse().join("/")} · {formatCurrency(Number(c.amount))}
                    {c.note ? ` · ${c.note}` : ""}
                  </span>
                  <button
                    onClick={() => removeMutation.mutate(c.id)}
                    disabled={removeMutation.isPending}
                    aria-label="Remover aporte"
                    className="p-1 rounded text-negative hover:bg-negative-soft transition-colors active:scale-90"
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
