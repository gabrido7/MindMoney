import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../../../services/usersService";
import type { NotificationType } from "../../../types/api";

export function useNotificationPreferences() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: () => usersService.getNotificationPreferences(),
  });

  const mutation = useMutation({
    mutationFn: ({ type, enabled }: { type: NotificationType; enabled: boolean }) =>
      usersService.updateNotificationPreference(type, enabled),
    onSuccess: (result) => queryClient.setQueryData(["notification-preferences"], result),
  });

  return {
    preferences: data?.preferences ?? null,
    isLoading,
    error,
    setPreference: (type: NotificationType, enabled: boolean) => mutation.mutate({ type, enabled }),
    isSaving: mutation.isPending,
  };
}
