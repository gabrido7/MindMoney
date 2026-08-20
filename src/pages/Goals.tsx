import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Card from "../components/ui/Card";
import { objectivesService, type ContributionInput, type ObjectiveInput } from "../services/objectivesService";
import { errorMessage } from "../services/api";
import { invalidateObjectives } from "../features/objectives/hooks/invalidateObjectives";
import ObjectiveSummaryCards from "../features/objectives/components/ObjectiveSummaryCards";
import ObjectiveCard from "../features/objectives/components/ObjectiveCard";
import MainObjectiveCard from "../features/objectives/components/MainObjectiveCard";
import ObjectiveEvolutionChart from "../features/objectives/components/ObjectiveEvolutionChart";
import ObjectiveFormModal from "../features/objectives/components/ObjectiveFormModal";
import ContributionModal from "../features/objectives/components/ContributionModal";
import { useToast } from "../hooks/useToast";
import { celebrationMessage } from "../features/objectives/utils/celebrationMessage";
import { formatCurrency } from "../utils/formatters";
import type { ApiObjective } from "../types/api";

type ObjectiveFilter = "todas" | "ativas" | "concluidas" | "atrasadas";

const FILTERS: { value: ObjectiveFilter; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "ativas", label: "Ativas" },
  { value: "concluidas", label: "Concluídas" },
  { value: "atrasadas", label: "Atrasadas" },
];

export default function Goals() {
  const queryClient = useQueryClient();

  const {
    data: objectivesData,
    isLoading: objectivesLoading,
    error: objectivesQueryError,
  } = useQuery({
    queryKey: ["objectives"],
    queryFn: () => objectivesService.list(),
  });

  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryQueryError,
  } = useQuery({
    queryKey: ["objectivesSummary"],
    queryFn: () => objectivesService.summary(),
  });

  const {
    data: evolutionData,
    isLoading: evolutionLoading,
    error: evolutionQueryError,
  } = useQuery({
    queryKey: ["objectivesEvolution"],
    queryFn: () => objectivesService.evolution(),
  });

  const objectives = objectivesData?.objectives ?? [];
  const evolution = evolutionData?.evolution ?? [];
  const loading = objectivesLoading || summaryLoading || evolutionLoading;
  const error = errorMessage(objectivesQueryError) ?? errorMessage(summaryQueryError) ?? errorMessage(evolutionQueryError);

  // objectives já vem ordenado do backend por prioridade (alta -> média -> baixa) e depois por
  // prazo mais próximo -- a primeira não concluída da lista já é, por construção, a de maior
  // prioridade com o prazo mais próximo.
  const mainObjective = objectives.find((o) => !o.achieved);

  const [filter, setFilter] = useState<ObjectiveFilter>("todas");
  const filteredObjectives = objectives.filter((o) => {
    if (filter === "ativas") return !o.achieved && !o.overdue;
    if (filter === "concluidas") return o.achieved;
    if (filter === "atrasadas") return o.overdue;
    return true;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<ApiObjective | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiObjective | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [contributingTo, setContributingTo] = useState<ApiObjective | null>(null);
  const [justCompletedId, setJustCompletedId] = useState<number | null>(null);

  const { showToast } = useToast();
  const invalidate = () => invalidateObjectives(queryClient);

  const createMutation = useMutation({
    mutationFn: (input: ObjectiveInput) => objectivesService.create(input),
    onSuccess: ({ objective }) => {
      invalidate();
      showToast(`✓ Meta "${objective.name}" criada com sucesso.`);
    },
  });
  const updateMutation = useMutation({
    mutationFn: (input: { id: number; values: ObjectiveInput }) =>
      objectivesService.update(input.id, input.values),
    onSuccess: ({ objective }) => {
      invalidate();
      showToast(`✓ Meta "${objective.name}" atualizada com sucesso.`);
    },
  });
  const removeMutation = useMutation({
    mutationFn: (input: { id: number; name: string }) => objectivesService.remove(input.id),
    onSuccess: (_data, variables) => {
      invalidate();
      showToast(`✓ Meta "${variables.name}" excluída com sucesso.`);
    },
  });
  const contributeMutation = useMutation({
    mutationFn: (input: { id: number; values: ContributionInput }) =>
      objectivesService.addContribution(input.id, input.values),
    onSuccess: ({ objective, milestoneReached }, variables) => {
      invalidate();
      if (milestoneReached !== null) {
        showToast(celebrationMessage(milestoneReached, objective.name), "celebration");
        if (milestoneReached === 100) {
          setJustCompletedId(objective.id);
          setTimeout(() => setJustCompletedId(null), 1500);
        }
      } else {
        showToast(`✓ Aporte de ${formatCurrency(variables.values.amount)} registrado com sucesso.`);
      }
    },
  });

  const handleCreate = async (values: ObjectiveInput) => {
    await createMutation.mutateAsync(values);
  };

  const handleCreateWithInitialContribution = async (values: ObjectiveInput, initialAmount: number) => {
    const { objective } = await createMutation.mutateAsync(values);
    await contributeMutation.mutateAsync({
      id: objective.id,
      values: { amount: initialAmount, contributedAt: new Date().toISOString().slice(0, 10), note: "Aporte inicial" },
    });
  };

  const handleUpdate = async (values: ObjectiveInput) => {
    if (!editingObjective) return;
    await updateMutation.mutateAsync({ id: editingObjective.id, values });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError(null);
    try {
      await removeMutation.mutateAsync({ id: deleteTarget.id, name: deleteTarget.name });
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(errorMessage(err) ?? "Não foi possível excluir a meta.");
    }
  };

  const handleContribute = async (values: ContributionInput) => {
    if (!contributingTo) return;
    await contributeMutation.mutateAsync({ id: contributingTo.id, values });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Metas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Planeje seus objetivos financeiros</p>
        </div>
        <Button
          onClick={() => {
            setEditingObjective(null);
            setIsFormOpen(true);
          }}
        >
          <Icon name="plus" size={16} />
          Nova Meta
        </Button>
      </div>

      {loading && <p className="text-gray-500 dark:text-gray-400">Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && summary && <ObjectiveSummaryCards summary={summary} />}

      {!loading && !error && objectives.length === 0 && (
        <Card>
          <EmptyState
            icon="target"
            message="Você ainda não tem nenhuma meta. Crie a primeira e acompanhe o progresso até o objetivo."
          />
        </Card>
      )}

      {!loading && !error && objectives.length > 0 && (
        <>
          {mainObjective && (
            <div className="grid lg:grid-cols-12 gap-4 items-stretch">
              <div className="lg:col-span-5">
                <MainObjectiveCard
                  objective={mainObjective}
                  onAddContribution={() => setContributingTo(mainObjective)}
                  justCompleted={mainObjective.id === justCompletedId}
                />
              </div>
              <div className="lg:col-span-7">
                <ObjectiveEvolutionChart data={evolution} />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Suas metas</h2>
              <div className="flex gap-2 flex-wrap">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-all active:scale-95 ${
                      filter === f.value
                        ? "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                        : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredObjectives.length === 0 ? (
              <Card>
                <EmptyState message="Nenhuma meta encontrada para esse filtro." />
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredObjectives.map((objective) => (
                  <ObjectiveCard
                    key={objective.id}
                    objective={objective}
                    onEdit={() => {
                      setEditingObjective(objective);
                      setIsFormOpen(true);
                    }}
                    onDelete={() => setDeleteTarget(objective)}
                    onAddContribution={() => setContributingTo(objective)}
                    justCompleted={objective.id === justCompletedId}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {isFormOpen && (
        <ObjectiveFormModal
          initial={editingObjective ?? undefined}
          onSubmit={editingObjective ? handleUpdate : handleCreate}
          onSubmitWithInitialContribution={editingObjective ? undefined : handleCreateWithInitialContribution}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {contributingTo && (
        <ContributionModal
          objectiveName={contributingTo.name}
          onSubmit={handleContribute}
          onClose={() => setContributingTo(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Excluir meta"
          message={`Tem certeza que deseja excluir "${deleteTarget.name}"? Os aportes registrados também serão apagados.`}
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
