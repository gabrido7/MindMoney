import type { QueryClient } from "@tanstack/react-query";

export function invalidateObjectives(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["objectives"] });
  queryClient.invalidateQueries({ queryKey: ["objectivesSummary"] });
}
