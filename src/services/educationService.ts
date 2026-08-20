import { apiRequest } from "./api";
import type { ApiLessonProgress } from "../types/api";

export interface ProgressUpsertInput {
  completed: boolean;
  quizScore?: number;
  quizTotal?: number;
  exerciseResponse?: string;
}

export const educationService = {
  listProgress: () => apiRequest<{ progress: ApiLessonProgress[] }>("/education/progress"),

  upsertProgress: (lessonId: string, input: ProgressUpsertInput) =>
    apiRequest<{ progress: ApiLessonProgress }>(`/education/progress/${encodeURIComponent(lessonId)}`, {
      method: "PUT",
      body: input,
    }),

  removeProgress: (lessonId: string) =>
    apiRequest<void>(`/education/progress/${encodeURIComponent(lessonId)}`, { method: "DELETE" }),
};
