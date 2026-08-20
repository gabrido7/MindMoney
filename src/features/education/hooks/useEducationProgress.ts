import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { educationService, type ProgressUpsertInput } from "../../../services/educationService";
import type { ApiLessonProgress } from "../../../types/api";
import type { ProgressMap } from "../utils/trailProgress";

export function useEducationProgress() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["educationProgress"],
    queryFn: () => educationService.listProgress(),
  });

  const rawProgress: ApiLessonProgress[] = useMemo(() => data?.progress ?? [], [data]);

  const progress: ProgressMap = useMemo(() => {
    const map: ProgressMap = {};
    for (const p of rawProgress) {
      map[p.lessonId] = { completed: p.completed };
    }
    return map;
  }, [rawProgress]);

  const upsertMutation = useMutation({
    mutationFn: (input: { lessonId: string; values: ProgressUpsertInput }) =>
      educationService.upsertProgress(input.lessonId, input.values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["educationProgress"] }),
  });

  return { progress, rawProgress, isLoading, error, upsertMutation };
}
