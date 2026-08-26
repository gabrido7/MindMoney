import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "../../../services/notificationsService";

/**
 * Antes disso o sino guardava seu próprio estado (useState + setInterval de
 * 60s), sem nenhuma relação com o resto do app -- uma notificação real
 * gerada por criar uma transação (limite/meta/orçamento estourado) só
 * aparecia até 1 minuto depois, ou só num refresh manual da página. Com
 * react-query, a mesma invalidateFinancialData que já atualiza
 * score/dashboard/metas a cada mutação também atualiza isto, na mesma hora.
 * O polling de 60s continua como rede de segurança (ex.: notificação criada
 * por uma ação em outra aba), não como o único jeito de atualizar.
 */
export function useNotifications() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsService.list(),
    refetchInterval: 60000,
  });

  const notifications = data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const markReadMutation = useMutation({
    mutationFn: (id: number) => notificationsService.markRead(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData<{ notifications: typeof notifications }>(["notifications"]);
      queryClient.setQueryData(["notifications"], (old: typeof previous) =>
        old
          ? {
              notifications: old.notifications.map((n) =>
                n.id === id ? { ...n, read_at: new Date().toISOString() } : n
              ),
            }
          : old
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(["notifications"], context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: (id: number) => markReadMutation.mutate(id),
  };
}
