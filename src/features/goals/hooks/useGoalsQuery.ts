import { useQuery } from "@tanstack/react-query";
import { goalsService } from "../../../services/goalsService";

/**
 * Query canônica de metas (com saldo/progressPercent já calculados pelo
 * servidor) -- tanto useSavingGoals (usado pelo GoalCard do Dashboard)
 * quanto a página Metas consomem esta mesma chave de cache, em vez de
 * cada um buscar a lista de novo.
 */
export function useGoalsQuery() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const { goals } = await goalsService.list();
      return goals;
    },
  });
}
