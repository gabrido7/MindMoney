/**
 * Modelo de conteúdo da trilha de aprendizado. O conteúdo em si (trilhas,
 * cursos, aulas) é editorial -- igual pra todo mundo -- e por isso vive
 * como dado estático no código (não em banco). O que é real e por
 * usuário é o PROGRESSO (backend/src/modules/education), guardado por
 * lessonId.
 *
 * "content" numa aula é opcional de propósito: uma aula com `content`
 * ausente é uma aula cuja estrutura (o título, a posição na trilha) já
 * existe, mas cujo conteúdo completo ainda está sendo escrito -- a UI
 * mostra isso honestamente como "em construção", nunca finge um texto
 * que não existe.
 */

export type DiagramSpec =
  | { type: "steps"; steps: string[] }
  | { type: "comparison"; left: { label: string; items: string[] }; right: { label: string; items: string[] } }
  | { type: "bars"; caption?: string; bars: { label: string; value: number; suffix?: string }[] }
  | { type: "formula"; formula: string; caption?: string };

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonContent {
  explanation: string[];
  examples: string[];
  diagram?: DiagramSpec;
  keyConcepts: string[];
  quiz: QuizQuestion[];
  exercise: { prompt: string; placeholder: string };
}

export interface Lesson {
  /** slug único global, ex.: "fundamentos.reserva-emergencia.aula-1" */
  id: string;
  title: string;
  content?: LessonContent;
}

export interface Course {
  /** slug único dentro da trilha, ex.: "reserva-emergencia" */
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export type TrailColor = "green" | "blue" | "amber" | "purple" | "red" | "orange";

export interface Trail {
  id: string;
  title: string;
  description: string;
  color: TrailColor;
  courses: Course[];
}
