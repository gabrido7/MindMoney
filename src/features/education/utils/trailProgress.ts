import type { Course, Lesson, Trail } from "../types";

export interface LessonProgressEntry {
  completed: boolean;
}

export type ProgressMap = Record<string, LessonProgressEntry>;

export type CourseStatus = "completed" | "current" | "upcoming";

export interface CourseProgress {
  course: Course;
  status: CourseStatus;
  completedCount: number;
  totalCount: number;
  hasContent: boolean;
}

const isLessonComplete = (lesson: Lesson, progress: ProgressMap) => Boolean(progress[lesson.id]?.completed);

export function courseCompletedCount(course: Course, progress: ProgressMap): number {
  return course.lessons.filter((l) => isLessonComplete(l, progress)).length;
}

export function courseHasContent(course: Course): boolean {
  return course.lessons.some((l) => l.content);
}

/**
 * Status por curso dentro de uma trilha (o que aparece na visão geral, ex.:
 * ✓ concluído / → em andamento / ○ ainda não começou). Só o primeiro curso
 * incompleto vira "current" -- os demais depois dele ficam "upcoming",
 * espelhando a leitura de "próximo da fila" do mockup original.
 */
export function courseStatuses(trail: Trail, progress: ProgressMap): CourseProgress[] {
  let foundCurrent = false;

  return trail.courses.map((course) => {
    const totalCount = course.lessons.length;
    const completedCount = courseCompletedCount(course, progress);
    const isComplete = totalCount > 0 && completedCount === totalCount;

    let status: CourseStatus;
    if (isComplete) {
      status = "completed";
    } else if (!foundCurrent) {
      status = "current";
      foundCurrent = true;
    } else {
      status = "upcoming";
    }

    return { course, status, completedCount, totalCount, hasContent: courseHasContent(course) };
  });
}

export function trailLessonCount(trail: Trail): number {
  return trail.courses.reduce((sum, c) => sum + c.lessons.length, 0);
}

export function trailCompletedCount(trail: Trail, progress: ProgressMap): number {
  return trail.courses.reduce((sum, c) => sum + courseCompletedCount(c, progress), 0);
}

export function trailProgressPercent(trail: Trail, progress: ProgressMap): number {
  const total = trailLessonCount(trail);
  if (total === 0) return 0;
  return Math.round((trailCompletedCount(trail, progress) / total) * 100);
}

/** Primeira aula ainda não concluída do curso -- ou a primeira de todas, se nenhuma foi concluída ainda. */
export function nextLessonInCourse(course: Course, progress: ProgressMap): Lesson | undefined {
  return course.lessons.find((l) => !isLessonComplete(l, progress)) ?? course.lessons[0];
}
