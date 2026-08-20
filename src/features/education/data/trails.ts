import type { Trail, Course, Lesson } from "../types";
import { fundamentosTrail } from "./fundamentos";
import { organizacaoFinanceiraTrail } from "./organizacaoFinanceira";
import { investimentosTrail } from "./investimentos";
import { financasAvancadasTrail } from "./financasAvancadas";
import { creditoEDividasTrail } from "./creditoEDividas";
import { aposentadoriaTrail } from "./aposentadoria";

export const TRAILS: Trail[] = [
  fundamentosTrail,
  organizacaoFinanceiraTrail,
  investimentosTrail,
  financasAvancadasTrail,
  creditoEDividasTrail,
  aposentadoriaTrail,
];

export function findTrail(trailId: string): Trail | undefined {
  return TRAILS.find((t) => t.id === trailId);
}

export function findCourse(trailId: string, courseId: string): { trail: Trail; course: Course } | undefined {
  const trail = findTrail(trailId);
  const course = trail?.courses.find((c) => c.id === courseId);
  if (!trail || !course) return undefined;
  return { trail, course };
}

export function findLesson(
  trailId: string,
  courseId: string,
  lessonId: string
): { trail: Trail; course: Course; lesson: Lesson } | undefined {
  const found = findCourse(trailId, courseId);
  const lesson = found?.course.lessons.find((l) => l.id === lessonId);
  if (!found || !lesson) return undefined;
  return { ...found, lesson };
}
