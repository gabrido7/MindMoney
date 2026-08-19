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
import ObjectiveFormModal from "../features/objectives/components/ObjectiveFormModal";
import ContributionModal from "../features/objectives/components/ContributionModal";
import type { ApiObjective } from "../types/api";

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

  const objectives = objectivesData?.objectives ?? [];
  const loading = objectivesLoading || summaryLoading;
  const error = errorMessage(objectivesQueryError) ?? errorMessage(summaryQueryError);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<ApiObjective | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiObjective | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [contributingTo, setContributingTo] = useState<ApiObjective | null>(null);

  const invalidate = () => invalidateObjectives(queryClient);

  const createMutation = useMutation({
    mutationFn: (input: ObjectiveInput) => objectivesService.create(input),
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: (input: { id: number; values: ObjectiveInput }) =>
      objectivesService.update(input.id, input.values),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({
    mutationFn: (id: number) => objectivesService.remove(id),
    onSuccess: invalidate,
  });
  const contributeMutation = useMutation({
    mutationFn: (input: { id: number; values: ContributionInput }) =>
      objectivesService.addContribution(input.id, input.values),
    onSuccess: invalidate,
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
      await removeMutation.mutateAsync(deleteTarget.id);
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
    <div className="max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Metas</h1>
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
        <div className="grid md:grid-cols-2 gap-4">
          {objectives.map((objective) => (
            <ObjectiveCard
              key={objective.id}
              objective={objective}
              onEdit={() => {
                setEditingObjective(objective);
                setIsFormOpen(true);
              }}
              onDelete={() => setDeleteTarget(objective)}
              onAddContribution={() => setContributingTo(objective)}
            />
          ))}
        </div>
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
