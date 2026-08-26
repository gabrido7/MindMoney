import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { debtsService } from "../../../services/debtsService";
import { errorMessage } from "../../../services/api";
import type { DebtInput } from "../../../types/api";

export function useDebts() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["debts"],
    queryFn: () => debtsService.list(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["debts"] });

  const createMutation = useMutation({
    mutationFn: (input: DebtInput) => debtsService.create(input),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => debtsService.remove(id),
    onSuccess: invalidate,
  });

  return {
    debts: data?.debts ?? [],
    isLoading,
    error: errorMessage(error),
    addDebt: (input: DebtInput) => createMutation.mutateAsync(input),
    removeDebt: (id: number) => removeMutation.mutateAsync(id),
    isSaving: createMutation.isPending,
  };
}
