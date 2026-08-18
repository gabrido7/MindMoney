import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import ProgressBar from "../components/ui/ProgressBar";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { goalsService } from "../services/goalsService";
import { errorMessage } from "../services/api";
import { invalidateFinancialData } from "../lib/invalidateFinancialData";
import { useGoalsQuery } from "../features/goals/hooks/useGoalsQuery";
import { formatCurrency, formatMonthBR, currentMonth } from "../utils/formatters";
import GoalFormModal, { type GoalFormValues } from "../features/goals/components/GoalFormModal";
import type { ApiGoal } from "../types/api";

type GoalStatus = "atingida" | "em_andamento" | "nao_atingida" | "futura";

function statusFor(goal: ApiGoal): GoalStatus {
  if (goal.progressPercent >= 100) return "atingida";
  if (goal.reference_month > currentMonth()) return "futura";
  if (goal.reference_month === currentMonth()) return "em_andamento";
  return "nao_atingida";
}

const STATUS_LABEL: Record<GoalStatus, { label: string; className: string }> = {
  atingida: { label: "Atingida", className: "bg-[#0ca30c]/10 text-[#0ca30c]" },
  em_andamento: { label: "Em andamento", className: "bg-blue-500/10 text-blue-600" },
  nao_atingida: { label: "Não atingida", className: "bg-[#d03b3b]/10 text-[#d03b3b]" },
  futura: { label: "Planejada", className: "bg-gray-500/10 text-gray-500" },
};

export default function Goals() {
  const queryClient = useQueryClient();
  // GET /api/goals já devolve saldo/progressPercent calculados pelo
  // backend numa chamada só, cacheada e compartilhada com o GoalCard do
  // Dashboard (mesma query key, via useSavingGoals).
  const { data, isLoading: loading, error: queryError } = useGoalsQuery();
  const error = errorMessage(queryError);
  const goals = useMemo(
    () => [...(data ?? [])].sort((a, b) => b.reference_month.localeCompare(a.reference_month)),
    [data]
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<ApiGoal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiGoal | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const invalidate = () => invalidateFinancialData(queryClient);

  const createMutation = useMutation({
    mutationFn: (values: GoalFormValues) => goalsService.create(values),
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: (input: { id: number; targetAmount: number }) =>
      goalsService.update(input.id, { targetAmount: input.targetAmount }),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({
    mutationFn: (id: number) => goalsService.remove(id),
    onSuccess: invalidate,
  });

  const handleCreate = async (values: GoalFormValues) => {
    await createMutation.mutateAsync(values);
  };

  const handleUpdate = async (values: GoalFormValues) => {
    if (!editingGoal) return;
    await updateMutation.mutateAsync({ id: editingGoal.id, targetAmount: values.targetAmount });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError(null);
    try {
      await removeMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(errorMessage(err) ?? "Não foi possível excluir a meta.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Metas</h1>
        <Button
          onClick={() => {
            setEditingGoal(null);
            setIsFormOpen(true);
          }}
        >
          <Icon name="plus" size={16} />
          Nova Meta
        </Button>
      </div>

      <Card>
        {loading && <p className="text-gray-500 dark:text-gray-400">Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && goals.length === 0 && (
          <EmptyState icon="target" message="Você ainda não definiu nenhuma meta de economia." />
        )}

        {!loading && !error && goals.length > 0 && (
          <ul className="flex flex-col gap-5">
            {goals.map((goal) => {
              const status = statusFor(goal);
              return (
                <li
                  key={goal.id}
                  className="border-b border-gray-100 dark:border-gray-700 pb-5 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatMonthBR(goal.reference_month)}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_LABEL[status].className}`}
                      >
                        {STATUS_LABEL[status].label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingGoal(goal);
                          setIsFormOpen(true);
                        }}
                        aria-label={`Editar meta de ${formatMonthBR(goal.reference_month)}`}
                        className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                      >
                        <Icon name="edit" size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(goal)}
                        aria-label={`Excluir meta de ${formatMonthBR(goal.reference_month)}`}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </div>

                  <ProgressBar percent={goal.progressPercent} />

                  <div className="flex flex-wrap justify-between gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      Atual: <strong className="text-gray-700 dark:text-gray-200">{formatCurrency(goal.saldo)}</strong>
                    </span>
                    <span>
                      Meta: <strong className="text-gray-700 dark:text-gray-200">{formatCurrency(goal.target_amount)}</strong>
                    </span>
                    <span>
                      Restante:{" "}
                      <strong className="text-gray-700 dark:text-gray-200">
                        {formatCurrency(Math.max(goal.target_amount - goal.saldo, 0))}
                      </strong>
                    </span>
                    <span>{goal.progressPercent.toFixed(1)}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {isFormOpen && (
        <GoalFormModal
          initial={
            editingGoal
              ? { referenceMonth: editingGoal.reference_month, targetAmount: editingGoal.target_amount }
              : undefined
          }
          lockMonth={Boolean(editingGoal)}
          onSubmit={editingGoal ? handleUpdate : handleCreate}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Excluir meta"
          message={`Tem certeza que deseja excluir a meta de ${formatMonthBR(deleteTarget.reference_month)}?`}
          confirmLabel="Excluir"
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={() => {
            setDeleteTarget(null);
            setDeleteError(null);
          }}
        />
      )}
    </div>
  );
}
