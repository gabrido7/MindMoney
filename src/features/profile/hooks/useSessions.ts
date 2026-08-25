import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../../../services/usersService";

export function useSessions() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => usersService.listSessions(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["sessions"] });

  const revokeMutation = useMutation({
    mutationFn: (id: number) => usersService.revokeSession(id),
    onSuccess: invalidate,
  });

  const revokeOthersMutation = useMutation({
    mutationFn: () => usersService.revokeOtherSessions(),
    onSuccess: invalidate,
  });

  return {
    sessions: data?.sessions ?? [],
    isLoading,
    error,
    revoke: revokeMutation.mutate,
    isRevoking: revokeMutation.isPending,
    revokeOthers: revokeOthersMutation.mutate,
    isRevokingOthers: revokeOthersMutation.isPending,
  };
}
