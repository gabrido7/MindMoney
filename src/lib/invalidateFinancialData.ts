import type { QueryClient } from "@tanstack/react-query";

/**
 * Transações, metas e os agregados do dashboard dependem uns dos outros
 * (saldo de uma meta vem de transactions; o resumo do dashboard inclui
 * o progresso da meta) -- qualquer mutação que altere dado financeiro
 * real precisa invalidar os três, senão uma tela fica com número velho
 * até o usuário trocar de mês ou recarregar a página.
 */
export function invalidateFinancialData(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["transactions"] });
  queryClient.invalidateQueries({ queryKey: ["goals"] });
  queryClient.invalidateQueries({ queryKey: ["dashboardRange"] });
  queryClient.invalidateQueries({ queryKey: ["score"] });
  queryClient.invalidateQueries({ queryKey: ["insights"] });
}
