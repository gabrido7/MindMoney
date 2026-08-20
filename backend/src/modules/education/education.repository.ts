import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";
import type { ProgressUpsertInput } from "./education.validation";

export interface LessonProgressRow extends RowDataPacket {
  id: number;
  user_id: number;
  lesson_id: string;
  completed_at: string | null;
  quiz_score: number | null;
  quiz_total: number | null;
  exercise_response: string | null;
  created_at: string;
  updated_at: string;
}

export const educationRepository = {
  async listByUser(userId: number): Promise<LessonProgressRow[]> {
    const [rows] = await pool.query<LessonProgressRow[]>(
      "SELECT * FROM lesson_progress WHERE user_id = ?",
      [userId]
    );
    return rows;
  },

  async findByUserAndLesson(userId: number, lessonId: string): Promise<LessonProgressRow | null> {
    const [rows] = await pool.query<LessonProgressRow[]>(
      "SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ? LIMIT 1",
      [userId, lessonId]
    );
    return rows[0] ?? null;
  },

  /** Upsert -- uma aula só tem uma linha de progresso por usuário (uq_lesson_progress_user_lesson). */
  async upsert(userId: number, lessonId: string, input: ProgressUpsertInput): Promise<void> {
    await pool.query<ResultSetHeader>(
      `INSERT INTO lesson_progress (user_id, lesson_id, completed_at, quiz_score, quiz_total, exercise_response)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         completed_at = VALUES(completed_at),
         quiz_score = VALUES(quiz_score),
         quiz_total = VALUES(quiz_total),
         exercise_response = VALUES(exercise_response)`,
      [
        userId,
        lessonId,
        input.completed ? new Date() : null,
        input.quizScore ?? null,
        input.quizTotal ?? null,
        input.exerciseResponse ?? null,
      ]
    );
  },

  async remove(userId: number, lessonId: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM lesson_progress WHERE user_id = ? AND lesson_id = ?",
      [userId, lessonId]
    );
    return result.affectedRows > 0;
  },
};
