import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsService } from "../../../services/accountsService";
import { errorMessage } from "../../../services/api";
import type { AccountInput } from "../../../types/api";

export function useAccounts() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => accountsService.list(),
  });

  /** Patrimônio líquido depende do saldo das contas -- invalida junto com a própria lista de contas, mesma lição de useAssets/useDebts. */
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
    queryClient.invalidateQueries({ queryKey: ["netWorthHistory"] });
  };

  const createMutation = useMutation({
    mutationFn: (input: AccountInput) => accountsService.create(input),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => accountsService.remove(id),
    onSuccess: invalidate,
  });

  return {
    accounts: data?.accounts ?? [],
    isLoading,
    error: errorMessage(error),
    addAccount: (input: AccountInput) => createMutation.mutateAsync(input),
    removeAccount: (id: number) => removeMutation.mutateAsync(id),
    isSaving: createMutation.isPending,
  };
}
