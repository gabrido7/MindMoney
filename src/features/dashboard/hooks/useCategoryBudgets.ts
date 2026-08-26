import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryBudgetsService } from "../../../services/categoryBudgetsService";

export function useCategoryBudgets(month: string) {
  const queryClient = useQueryClient();
  const queryKey = ["category-budgets", month];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => categoryBudgetsService.list(month),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const setMutation = useMutation({
    mutationFn: ({ categoryId, amount }: { categoryId: number; amount: number }) =>
      categoryBudgetsService.upsert(categoryId, month, amount),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (categoryId: number) => categoryBudgetsService.remove(categoryId, month),
    onSuccess: invalidate,
  });

  return {
    budgets: data?.budgets ?? [],
    isLoading,
    error,
    setBudget: (categoryId: number, amount: number) => setMutation.mutate({ categoryId, amount }),
    isSaving: setMutation.isPending,
    removeBudget: (categoryId: number) => removeMutation.mutate(categoryId),
    isRemoving: removeMutation.isPending,
  };
}
