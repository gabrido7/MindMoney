import { educationRepository, type LessonProgressRow } from "./education.repository";
import type { ProgressUpsertInput } from "./education.validation";

function enrich(row: LessonProgressRow) {
  return {
    lessonId: row.lesson_id,
    completed: row.completed_at !== null,
    completedAt: row.completed_at,
    quizScore: row.quiz_score,
    quizTotal: row.quiz_total,
    exerciseResponse: row.exercise_response,
    updatedAt: row.updated_at,
  };
}

export type EnrichedLessonProgress = ReturnType<typeof enrich>;

export const educationService = {
  async list(userId: number): Promise<EnrichedLessonProgress[]> {
    const rows = await educationRepository.listByUser(userId);
    return rows.map(enrich);
  },

  async upsert(userId: number, lessonId: string, input: ProgressUpsertInput): Promise<EnrichedLessonProgress> {
    await educationRepository.upsert(userId, lessonId, input);
    const row = await educationRepository.findByUserAndLesson(userId, lessonId);
    return enrich(row!);
  },

  async remove(userId: number, lessonId: string): Promise<void> {
    await educationRepository.remove(userId, lessonId);
  },
};
