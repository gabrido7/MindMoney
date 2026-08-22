import { TRAILS } from "../../education/data/trails";
import { TOOLS } from "../../tools/data/tools";
import type { SearchDocument } from "../types";

/**
 * Índice de busca construído uma única vez a partir do catálogo estático de
 * trilhas e ferramentas. Só entram aulas com `content` definido -- uma aula
 * "em construção" não deveria aparecer como resultado de busca, mesma regra
 * de honestidade já aplicada na UI de trilhas (ver features/education/types.ts).
 */
function buildSearchIndex(): SearchDocument[] {
  const lessonDocs: SearchDocument[] = TRAILS.flatMap((trail) =>
    trail.courses.flatMap((course) =>
      course.lessons
        .filter((lesson) => lesson.content !== undefined)
        .map((lesson) => ({
          type: "lesson" as const,
          id: lesson.id,
          title: lesson.title,
          subtitle: `${trail.title} · ${course.title}`,
          href: `/educacao-financeira/${trail.id}/${course.id}/${lesson.id}`,
          keywords: [
            lesson.title,
            course.title,
            course.description,
            trail.title,
            ...(lesson.content?.keyConcepts ?? []),
            ...(lesson.content?.explanation ?? []),
          ].join(" "),
        }))
    )
  );

  const toolDocs: SearchDocument[] = TOOLS.map((tool) => ({
    type: "tool" as const,
    id: tool.id,
    title: tool.title,
    subtitle: "Calculadora",
    href: `/ferramentas/${tool.id}`,
    keywords: [tool.title, tool.description].join(" "),
  }));

  return [...lessonDocs, ...toolDocs];
}

export const SEARCH_INDEX: SearchDocument[] = buildSearchIndex();

export function findSearchDocument(type: SearchDocument["type"], id: string): SearchDocument | undefined {
  return SEARCH_INDEX.find((d) => d.type === type && d.id === id);
}
