import { gamificationRepository } from "./gamification.repository";
import {
  ACHIEVEMENTS,
  COURSE_LESSON_SETS,
  STREAK_MILESTONES,
  TRAIL_LESSON_SETS,
  XP_AMOUNTS,
  levelInfo,
  type Achievement,
  type XpReason,
} from "./gamification.constants";

interface XpEventInput {
  amount: number;
  reason: XpReason;
  referenceId: string;
}

export interface GamificationResult {
  xpAwarded: number;
  totalXp: number;
  level: number;
  leveledUp: boolean;
  newAchievements: Achievement[];
}

/**
 * Sequência de dias seguidos de estudo, olhando pra trás a partir de hoje.
 * "Hoje" ainda sem nenhuma aula concluída não quebra a sequência (dá a
 * margem de terminar o dia); só conta como quebrada se o dia mais recente
 * de atividade for anterior a ontem.
 *
 * `today` é sempre passado explicitamente (vindo de gamificationRepository.today(),
 * ou seja, do próprio MySQL) -- nunca calculado aqui via `new Date()`, pra não
 * divergir do fuso horário que resolveu as datas em `sortedDatesDesc`.
 */
export function calculateStreak(sortedDatesDesc: string[], today: string): number {
  if (sortedDatesDesc.length === 0) return 0;

  const DAY_MS = 24 * 60 * 60 * 1000;
  const todayMs = Date.parse(today);
  const mostRecentMs = Date.parse(sortedDatesDesc[0]);
  const daysSinceLast = Math.round((todayMs - mostRecentMs) / DAY_MS);
  if (daysSinceLast > 1) return 0;

  let streak = 1;
  let cursor = mostRecentMs;
  for (let i = 1; i < sortedDatesDesc.length; i++) {
    const prevMs = Date.parse(sortedDatesDesc[i]);
    const diffDays = Math.round((cursor - prevMs) / DAY_MS);
    if (diffDays === 1) {
      streak += 1;
      cursor = prevMs;
    } else if (diffDays !== 0) {
      break;
    }
  }
  return streak;
}

async function evaluateAchievement(userId: number, achievementId: string): Promise<boolean> {
  switch (achievementId) {
    case "primeira-aula":
      return (await gamificationRepository.countCompletedLessons(userId)) >= 1;
    case "primeiro-quiz":
      return (await gamificationRepository.countQuizzesTaken(userId)) >= 1;
    case "cinco-aulas":
      return (await gamificationRepository.countCompletedLessons(userId)) >= 5;
    case "vinte-aulas":
      return (await gamificationRepository.countCompletedLessons(userId)) >= 20;
    case "mestre-orcamento": {
      const set = COURSE_LESSON_SETS["fundamentos.como-montar-um-orcamento"];
      return (await gamificationRepository.countCompletedLessonsIn(userId, set)) >= set.length;
    }
    case "trilha-fundamentos": {
      const set = TRAIL_LESSON_SETS.fundamentos;
      return (await gamificationRepository.countCompletedLessonsIn(userId, set)) >= set.length;
    }
    case "trilha-organizacao": {
      const set = TRAIL_LESSON_SETS["organizacao-financeira"];
      return (await gamificationRepository.countCompletedLessonsIn(userId, set)) >= set.length;
    }
    case "primeira-meta":
      return (await gamificationRepository.countAchievedObjectives(userId)) >= 1;
    case "investidor-consciente":
      return (await gamificationRepository.countCompletedLessonsLike(userId, "investimentos.")) >= 1;
    case "sequencia-3-dias": {
      const [dates, today] = await Promise.all([
        gamificationRepository.completedLessonDates(userId),
        gamificationRepository.today(),
      ]);
      return calculateStreak(dates, today) >= 3;
    }
    default:
      return false;
  }
}

async function runAchievementChecks(userId: number): Promise<Achievement[]> {
  const unlocked = new Set(await gamificationRepository.unlockedAchievementIds(userId));
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (unlocked.has(achievement.id)) continue;
    if (!(await evaluateAchievement(userId, achievement.id))) continue;

    const wasNew = await gamificationRepository.unlockAchievement(userId, achievement.id);
    if (wasNew) {
      await gamificationRepository.insertXpEvent(userId, XP_AMOUNTS.achievement, "achievement", achievement.id);
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}

async function processEvents(userId: number, events: XpEventInput[]): Promise<GamificationResult> {
  const totalBefore = await gamificationRepository.totalXp(userId);
  const levelBefore = levelInfo(totalBefore).level;

  for (const event of events) {
    await gamificationRepository.insertXpEvent(userId, event.amount, event.reason, event.referenceId);
  }

  const newAchievements = await runAchievementChecks(userId);

  const totalAfter = await gamificationRepository.totalXp(userId);
  const afterInfo = levelInfo(totalAfter);

  return {
    xpAwarded: totalAfter - totalBefore,
    totalXp: totalAfter,
    level: afterInfo.level,
    leveledUp: afterInfo.level > levelBefore,
    newAchievements,
  };
}

export const gamificationService = {
  calculateStreak,

  async getSummary(userId: number) {
    const totalXp = await gamificationRepository.totalXp(userId);
    const info = levelInfo(totalXp);
    const unlocked = await gamificationRepository.unlockedAchievements(userId);
    const unlockedMap = new Map(unlocked.map((a) => [a.achievementId, a.unlockedAt]));
    const [dates, today] = await Promise.all([
      gamificationRepository.completedLessonDates(userId),
      gamificationRepository.today(),
    ]);

    return {
      totalXp: info.totalXp,
      level: info.level,
      xpIntoLevel: info.xpIntoLevel,
      xpForNextLevel: info.xpForNextLevel,
      streak: calculateStreak(dates, today),
      achievements: ACHIEVEMENTS.map((a) => ({
        ...a,
        unlocked: unlockedMap.has(a.id),
        unlockedAt: unlockedMap.get(a.id) ?? null,
      })),
    };
  },

  /**
   * Chamado depois de uma aula ser salva. `baseEvents` já vem decidido pelo
   * educationService (se a aula acabou de ser concluída, se o quiz acabou de
   * ser respondido pela primeira vez) -- aqui só se acrescenta o que depende
   * de conhecer o conjunto de aulas do curso/trilha: bônus de curso/trilha
   * completos e sequência de estudos, só verificados quando a aula em si
   * acabou de ser concluída.
   */
  async processLessonEvents(userId: number, lessonId: string, baseEvents: XpEventInput[]): Promise<GamificationResult> {
    const events = [...baseEvents];
    const justCompletedLesson = baseEvents.some((e) => e.reason === "lesson_completed");

    if (justCompletedLesson) {
      for (const [courseKey, lessonIds] of Object.entries(COURSE_LESSON_SETS)) {
        if (!lessonIds.includes(lessonId)) continue;
        const completedCount = await gamificationRepository.countCompletedLessonsIn(userId, lessonIds);
        if (completedCount >= lessonIds.length) {
          events.push({ amount: XP_AMOUNTS.course_completed, reason: "course_completed", referenceId: courseKey });
        }
      }

      for (const [trailId, lessonIds] of Object.entries(TRAIL_LESSON_SETS)) {
        if (!lessonIds.includes(lessonId)) continue;
        const completedCount = await gamificationRepository.countCompletedLessonsIn(userId, lessonIds);
        if (completedCount >= lessonIds.length) {
          events.push({ amount: XP_AMOUNTS.trail_completed, reason: "trail_completed", referenceId: trailId });
        }
      }

      const [dates, today] = await Promise.all([
        gamificationRepository.completedLessonDates(userId),
        gamificationRepository.today(),
      ]);
      const streak = calculateStreak(dates, today);
      const milestone = STREAK_MILESTONES.find((m) => m.days === streak);
      if (milestone) {
        events.push({ amount: milestone.xp, reason: "streak_bonus", referenceId: `streak-${milestone.days}` });
      }
    }

    return processEvents(userId, events);
  },

  async processGoalAchieved(userId: number, objectiveId: number): Promise<GamificationResult> {
    return processEvents(userId, [
      { amount: XP_AMOUNTS.goal_achieved, reason: "goal_achieved", referenceId: String(objectiveId) },
    ]);
  },
};
