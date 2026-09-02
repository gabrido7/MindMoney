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

  // debtAdvice depende da lista de dívidas (comprometimento de renda,
  // fragmentação etc.) e debtPaymentHistory precisa sumir com os pagamentos
  // em cascata quando uma dívida é removida (debt_payments.debt_id é ON
  // DELETE CASCADE no banco) -- sem invalidar os dois aqui, "Como sair da
  // dívida" e o Histórico de pagamentos só atualizavam depois de recarregar
  // a página manualmente.
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["debts"] });
    queryClient.invalidateQueries({ queryKey: ["debtAdvice"] });
    queryClient.invalidateQueries({ queryKey: ["debtPaymentHistory"] });
  };

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
