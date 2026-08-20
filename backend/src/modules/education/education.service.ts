import { educationRepository, type LessonProgressRow } from "./education.repository";
import { gamificationService, type GamificationResult } from "../gamification/gamification.service";
import { XP_AMOUNTS } from "../gamification/gamification.constants";
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

  async upsert(
    userId: number,
    lessonId: string,
    input: ProgressUpsertInput
  ): Promise<{ progress: EnrichedLessonProgress; gamification: GamificationResult | null }> {
    const previous = await educationRepository.findByUserAndLesson(userId, lessonId);
    const wasCompleted = Boolean(previous?.completed_at);
    const hadQuiz = previous?.quiz_total != null;

    await educationRepository.upsert(userId, lessonId, input);
    const row = await educationRepository.findByUserAndLesson(userId, lessonId);
    const progress = enrich(row!);

    const events: { amount: number; reason: "lesson_completed" | "quiz_completed"; referenceId: string }[] = [];
    if (progress.completed && !wasCompleted) {
      events.push({ amount: XP_AMOUNTS.lesson_completed, reason: "lesson_completed", referenceId: lessonId });
    }
    if (progress.quizTotal != null && !hadQuiz) {
      events.push({ amount: XP_AMOUNTS.quiz_completed, reason: "quiz_completed", referenceId: lessonId });
    }

    const gamification =
      events.length > 0 ? await gamificationService.processLessonEvents(userId, lessonId, events) : null;

    return { progress, gamification };
  },

  async remove(userId: number, lessonId: string): Promise<void> {
    await educationRepository.remove(userId, lessonId);
  },
};
