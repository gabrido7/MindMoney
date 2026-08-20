import { describe, it, expect } from "vitest";
import {
  courseCompletedCount,
  courseHasContent,
  courseStatuses,
  nextLessonInCourse,
  trailCompletedCount,
  trailLessonCount,
  trailProgressPercent,
} from "./trailProgress";
import type { Trail } from "../types";

const makeTrail = (): Trail => ({
  id: "t1",
  title: "Trilha teste",
  description: "",
  color: "green",
  courses: [
    {
      id: "c1",
      title: "Curso 1",
      description: "",
      icon: "🟢",
      lessons: [
        { id: "t1.c1.aula-1", title: "Aula 1", content: undefined },
        { id: "t1.c1.aula-2", title: "Aula 2", content: undefined },
      ],
    },
    {
      id: "c2",
      title: "Curso 2",
      description: "",
      icon: "🔵",
      lessons: [
        { id: "t1.c2.aula-1", title: "Aula 1", content: undefined },
        { id: "t1.c2.aula-2", title: "Aula 2", content: undefined },
      ],
    },
    {
      id: "c3",
      title: "Curso 3 (sem conteúdo)",
      description: "",
      icon: "🟡",
      lessons: [{ id: "t1.c3.aula-1", title: "Aula 1", content: undefined }],
    },
  ],
});

// marca content: {} só pra simular "tem conteúdo" sem precisar escrever o corpo inteiro
const withContent = (trail: Trail, lessonIds: string[]): Trail => ({
  ...trail,
  courses: trail.courses.map((c) => ({
    ...c,
    lessons: c.lessons.map((l) =>
      lessonIds.includes(l.id)
        ? {
            ...l,
            content: {
              explanation: [],
              examples: [],
              keyConcepts: [],
              quiz: [],
              exercise: { prompt: "", placeholder: "" },
            },
          }
        : l
    ),
  })),
});

describe("courseCompletedCount / trailLessonCount / trailCompletedCount", () => {
  it("conta corretamente aulas concluídas por curso e por trilha", () => {
    const trail = makeTrail();
    const progress = { "t1.c1.aula-1": { completed: true }, "t1.c2.aula-1": { completed: true } };

    expect(courseCompletedCount(trail.courses[0], progress)).toBe(1);
    expect(courseCompletedCount(trail.courses[1], progress)).toBe(1);
    expect(courseCompletedCount(trail.courses[2], progress)).toBe(0);
    expect(trailLessonCount(trail)).toBe(5);
    expect(trailCompletedCount(trail, progress)).toBe(2);
  });
});

describe("trailProgressPercent", () => {
  it("calcula o percentual arredondado de conclusão da trilha", () => {
    const trail = makeTrail();
    const progress = { "t1.c1.aula-1": { completed: true } };
    expect(trailProgressPercent(trail, progress)).toBe(20); // 1 de 5 aulas
  });

  it("retorna 0 quando não há nenhuma aula concluída", () => {
    const trail = makeTrail();
    expect(trailProgressPercent(trail, {})).toBe(0);
  });

  it("retorna 100 quando todas as aulas estão concluídas", () => {
    const trail = makeTrail();
    const progress = Object.fromEntries(
      trail.courses.flatMap((c) => c.lessons.map((l) => [l.id, { completed: true }]))
    );
    expect(trailProgressPercent(trail, progress)).toBe(100);
  });
});

describe("courseHasContent", () => {
  it("true quando pelo menos uma aula tem content, false quando nenhuma tem", () => {
    const trail = withContent(makeTrail(), ["t1.c1.aula-1"]);
    expect(courseHasContent(trail.courses[0])).toBe(true);
    expect(courseHasContent(trail.courses[2])).toBe(false);
  });
});

describe("courseStatuses", () => {
  it("marca como 'completed' só o curso 100% concluído, 'current' o primeiro incompleto, e 'upcoming' os demais", () => {
    const trail = makeTrail();
    const progress = { "t1.c1.aula-1": { completed: true }, "t1.c1.aula-2": { completed: true } };

    const statuses = courseStatuses(trail, progress);
    expect(statuses[0].status).toBe("completed");
    expect(statuses[1].status).toBe("current");
    expect(statuses[2].status).toBe("upcoming");
  });

  it("quando nada foi concluído, o primeiro curso é 'current' e os demais 'upcoming'", () => {
    const trail = makeTrail();
    const statuses = courseStatuses(trail, {});
    expect(statuses[0].status).toBe("current");
    expect(statuses[1].status).toBe("upcoming");
    expect(statuses[2].status).toBe("upcoming");
  });

  it("quando tudo está concluído, todos os cursos ficam 'completed'", () => {
    const trail = makeTrail();
    const progress = Object.fromEntries(
      trail.courses.flatMap((c) => c.lessons.map((l) => [l.id, { completed: true }]))
    );
    const statuses = courseStatuses(trail, progress);
    expect(statuses.every((s) => s.status === "completed")).toBe(true);
  });
});

describe("nextLessonInCourse", () => {
  it("retorna a primeira aula não concluída", () => {
    const trail = makeTrail();
    const progress = { "t1.c1.aula-1": { completed: true } };
    expect(nextLessonInCourse(trail.courses[0], progress)?.id).toBe("t1.c1.aula-2");
  });

  it("retorna a primeira aula do curso quando nada foi concluído ainda", () => {
    const trail = makeTrail();
    expect(nextLessonInCourse(trail.courses[0], {})?.id).toBe("t1.c1.aula-1");
  });

  it("retorna a primeira aula (pra revisão) quando todas já foram concluídas", () => {
    const trail = makeTrail();
    const progress = { "t1.c1.aula-1": { completed: true }, "t1.c1.aula-2": { completed: true } };
    expect(nextLessonInCourse(trail.courses[0], progress)?.id).toBe("t1.c1.aula-1");
  });
});
