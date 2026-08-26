import type { QueryClient } from "@tanstack/react-query";

/**
 * Transações, metas, orçamento por categoria, notificações e os agregados
 * do dashboard dependem uns dos outros (saldo de uma meta vem de
 * transactions; o gasto de um orçamento por categoria também; criar uma
 * transação pode gerar uma notificação real de limite/meta/orçamento
 * estourado) -- qualquer mutação que altere dado financeiro real precisa
 * invalidar todos, senão uma tela fica com número velho (ou o sino de
 * notificações demora até 1 minuto pra mostrar algo que já aconteceu)
 * até o usuário trocar de mês ou recarregar a página.
 */
export function invalidateFinancialData(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["transactions"] });
  queryClient.invalidateQueries({ queryKey: ["goals"] });
  queryClient.invalidateQueries({ queryKey: ["category-budgets"] });
  queryClient.invalidateQueries({ queryKey: ["dashboardRange"] });
  queryClient.invalidateQueries({ queryKey: ["score"] });
  queryClient.invalidateQueries({ queryKey: ["insights"] });
  queryClient.invalidateQueries({ queryKey: ["notifications"] });
}
