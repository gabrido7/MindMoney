import { z } from "zod";

export const lessonIdParamSchema = z.object({
  lessonId: z.string().trim().min(1).max(150),
});

export const progressUpsertSchema = z.object({
  completed: z.boolean(),
  quizScore: z.coerce.number().int().min(0).max(50).optional(),
  quizTotal: z.coerce.number().int().min(0).max(50).optional(),
  exerciseResponse: z.string().trim().max(5000).optional(),
});

export type LessonIdParam = z.infer<typeof lessonIdParamSchema>;
export type ProgressUpsertInput = z.infer<typeof progressUpsertSchema>;
