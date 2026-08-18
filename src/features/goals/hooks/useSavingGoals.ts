import { useCallback, useEffect, useState } from "react";
import { goalsService } from "../../../services/goalsService";
import { ApiError } from "../../../services/api";
import type { SavingGoals } from "../../../types";

/** Metas vêm da API/MySQL agora — localStorage não é mais a fonte dos dados financeiros. */
export function useSavingGoals() {
  const [goals, setGoals] = useState<SavingGoals>({});
  const [goalIds, setGoalIds] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { goals: apiGoals } = await goalsService.list();
      const values: SavingGoals = {};
      const ids: Record<string, number> = {};
      apiGoals.forEach((g) => {
        values[g.reference_month] = g.target_amount;
        ids[g.reference_month] = g.id;
      });
      setGoals(values);
      setGoalIds(ids);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao carregar metas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setGoalForMonth = useCallback(
    async (month: string, amount: number) => {
      const existingId = goalIds[month];

      if (amount <= 0) {
        if (existingId) await goalsService.remove(existingId);
      } else if (existingId) {
        await goalsService.update(existingId, { targetAmount: amount });
      } else {
        await goalsService.create({ referenceMonth: month, targetAmount: amount });
      }

      await load();
    },
    [goalIds, load]
  );

  const getGoalForMonth = useCallback((month: string) => goals[month] ?? 0, [goals]);

  return { goals, loading, error, setGoalForMonth, getGoalForMonth };
}
