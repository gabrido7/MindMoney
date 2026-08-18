import { QueryClient } from "@tanstack/react-query";

/**
 * Camada de cache/dados compartilhada entre páginas. Antes disso, cada
 * página buscava tudo de novo com seu próprio useEffect -- navegar
 * Dashboard → Metas → Dashboard refazia todas as chamadas do zero, sem
 * nenhum cache entre elas.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // evita refetch imediato ao trocar de página e voltar
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
