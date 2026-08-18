import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { goalsService } from "../../../services/goalsService";
import { errorMessage } from "../../../services/api";
import { invalidateFinancialData } from "../../../lib/invalidateFinancialData";
import { useGoalsQuery } from "./useGoalsQuery";
import type { SavingGoals } from "../../../types";

/** Usado pelo GoalCard do Dashboard -- mesma query de useGoalsQuery, só reformatada como Record<mês, valor>. */
export function useSavingGoals() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useGoalsQuery();

  const goals = useMemo(() => {
    const map: SavingGoals = {};
    (data ?? []).forEach((g) => {
      map[g.reference_month] = g.target_amount;
    });
    return map;
  }, [data]);

  const goalIds = useMemo(() => {
    const map: Record<string, number> = {};
    (data ?? []).forEach((g) => {
      map[g.reference_month] = g.id;
    });
    return map;
  }, [data]);

  const mutation = useMutation({
    mutationFn: async ({ month, amount }: { month: string; amount: number }) => {
      const existingId = goalIds[month];
      if (amount <= 0) {
        if (existingId) await goalsService.remove(existingId);
      } else if (existingId) {
        await goalsService.update(existingId, { targetAmount: amount });
      } else {
        await goalsService.create({ referenceMonth: month, targetAmount: amount });
      }
    },
    onSuccess: () => invalidateFinancialData(queryClient),
  });

  const setGoalForMonth = (month: string, amount: number) => mutation.mutateAsync({ month, amount });
  const getGoalForMonth = (month: string) => goals[month] ?? 0;

  return { goals, loading: isLoading, error: errorMessage(error), setGoalForMonth, getGoalForMonth };
}
