import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/db";

export const gamificationRepository = {
  /** INSERT IGNORE -- se (user_id, reason, reference_id) já existe, não faz nada e affectedRows vem 0. */
  async insertXpEvent(userId: number, amount: number, reason: string, referenceId: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT IGNORE INTO xp_events (user_id, amount, reason, reference_id) VALUES (?, ?, ?, ?)",
      [userId, amount, reason, referenceId]
    );
    return result.affectedRows > 0;
  },

  async totalXp(userId: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM xp_events WHERE user_id = ?",
      [userId]
    );
    return Number(rows[0]?.total ?? 0);
  },

  async unlockedAchievementIds(userId: number): Promise<string[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = ?",
      [userId]
    );
    return rows.map((r) => r.achievement_id as string);
  },

  async unlockedAchievements(userId: number): Promise<{ achievementId: string; unlockedAt: string }[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = ?",
      [userId]
    );
    return rows.map((r) => ({ achievementId: r.achievement_id as string, unlockedAt: r.unlocked_at as string }));
  },

  /** INSERT IGNORE -- desbloquear a mesma conquista duas vezes é inofensivo e não duplica. */
  async unlockAchievement(userId: number, achievementId: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)",
      [userId, achievementId]
    );
    return result.affectedRows > 0;
  },

  async countCompletedLessons(userId: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS total FROM lesson_progress WHERE user_id = ? AND completed_at IS NOT NULL",
      [userId]
    );
    return Number(rows[0]?.total ?? 0);
  },

  async countCompletedLessonsLike(userId: number, lessonIdPrefix: string): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS total FROM lesson_progress WHERE user_id = ? AND completed_at IS NOT NULL AND lesson_id LIKE ?",
      [userId, `${lessonIdPrefix}%`]
    );
    return Number(rows[0]?.total ?? 0);
  },

  async countCompletedLessonsIn(userId: number, lessonIds: string[]): Promise<number> {
    if (lessonIds.length === 0) return 0;
    const placeholders = lessonIds.map(() => "?").join(",");
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM lesson_progress WHERE user_id = ? AND completed_at IS NOT NULL AND lesson_id IN (${placeholders})`,
      [userId, ...lessonIds]
    );
    return Number(rows[0]?.total ?? 0);
  },

  async countQuizzesTaken(userId: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS total FROM lesson_progress WHERE user_id = ? AND quiz_total IS NOT NULL",
      [userId]
    );
    return Number(rows[0]?.total ?? 0);
  },

  /** Dias distintos (formato 'YYYY-MM-DD') em que o usuário concluiu pelo menos uma aula. */
  async completedLessonDates(userId: number): Promise<string[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT DISTINCT DATE(completed_at) AS d FROM lesson_progress WHERE user_id = ? AND completed_at IS NOT NULL ORDER BY d DESC",
      [userId]
    );
    return rows.map((r) => String(r.d));
  },

  /**
   * Quantos objetivos financeiros do usuário já foram atingidos (aportes >= valor alvo).
   * Consulta direta em financial_objectives/objective_contributions -- evita depender do
   * módulo objectives (que por sua vez chama gamification ao registrar um aporte) e criar
   * um ciclo de import entre os dois módulos.
   */
  async countAchievedObjectives(userId: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total FROM (
         SELECT o.id, COALESCE(SUM(c.amount), 0) AS current_amount, o.target_amount
         FROM financial_objectives o
         LEFT JOIN objective_contributions c ON c.objective_id = o.id
         WHERE o.user_id = ?
         GROUP BY o.id
       ) AS totals
       WHERE current_amount >= target_amount`,
      [userId]
    );
    return Number(rows[0]?.total ?? 0);
  },
};
