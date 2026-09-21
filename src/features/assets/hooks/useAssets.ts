import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assetsService } from "../../../services/assetsService";
import { errorMessage } from "../../../services/api";
import { useGamification } from "../../gamification/hooks/useGamification";
import type { AssetInput } from "../../../types/api";

export function useAssets() {
  const queryClient = useQueryClient();
  const { celebrate } = useGamification();

  const { data, isLoading, error } = useQuery({
    queryKey: ["assets"],
    queryFn: () => assetsService.list(),
  });

  /** assetValueHistory (histórico global) também depende do estado dos ativos -- invalida os dois juntos, mesma lição aprendida com o cache do debtAdvice (ver useDebts.ts). */
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["assets"] });
    queryClient.invalidateQueries({ queryKey: ["assetValueHistory"] });
  };

  const createMutation = useMutation({
    mutationFn: (input: AssetInput) => assetsService.create(input),
    onSuccess: ({ gamification }) => {
      invalidate();
      celebrate(gamification);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => assetsService.remove(id),
    onSuccess: invalidate,
  });

  return {
    assets: data?.assets ?? [],
    isLoading,
    error: errorMessage(error),
    addAsset: (input: AssetInput) => createMutation.mutateAsync(input),
    removeAsset: (id: number) => removeMutation.mutateAsync(id),
    isSaving: createMutation.isPending,
  };
}
