import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../../../services/usersService";
import type { ExperienceLevel, FinancialPriority, IncomeRange } from "../../../types/api";

export function useFinancialProfile() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["financial-profile"],
    queryFn: () => usersService.getFinancialProfile(),
  });

  const mutation = useMutation({
    mutationFn: (input: {
      experienceLevel: ExperienceLevel | null;
      incomeRange: IncomeRange | null;
      priorities: FinancialPriority[];
    }) => usersService.updateFinancialProfile(input),
    onSuccess: (result) => queryClient.setQueryData(["financial-profile"], result),
  });

  return {
    profile: data?.profile ?? null,
    isLoading,
    error,
    save: mutation.mutate,
    isSaving: mutation.isPending,
  };
}
