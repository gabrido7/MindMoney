import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoritesService } from "../../../services/favoritesService";
import type { FavoriteContentType } from "../../../types/api";

export function useFavorites() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => favoritesService.list(),
  });

  const favorites = useMemo(() => data?.favorites ?? [], [data]);
  const favoriteKeys = useMemo(
    () => new Set(favorites.map((f) => `${f.contentType}:${f.contentId}`)),
    [favorites]
  );

  const isFavorited = (contentType: FavoriteContentType, contentId: string) =>
    favoriteKeys.has(`${contentType}:${contentId}`);

  const addMutation = useMutation({
    mutationFn: ({ contentType, contentId }: { contentType: FavoriteContentType; contentId: string }) =>
      favoritesService.add(contentType, contentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const removeMutation = useMutation({
    mutationFn: ({ contentType, contentId }: { contentType: FavoriteContentType; contentId: string }) =>
      favoritesService.remove(contentType, contentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const toggle = (contentType: FavoriteContentType, contentId: string) => {
    if (isFavorited(contentType, contentId)) {
      removeMutation.mutate({ contentType, contentId });
    } else {
      addMutation.mutate({ contentType, contentId });
    }
  };

  return {
    favorites,
    isLoading,
    error,
    isFavorited,
    toggle,
    isToggling: addMutation.isPending || removeMutation.isPending,
  };
}
