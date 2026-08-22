import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import LessonDiagram from "../features/education/components/LessonDiagram";
import LessonQuiz from "../features/education/components/LessonQuiz";
import LessonExercise from "../features/education/components/LessonExercise";
import { findLesson } from "../features/education/data/trails";
import { useEducationProgress } from "../features/education/hooks/useEducationProgress";
import { useGamification } from "../features/gamification/hooks/useGamification";
import FavoriteButton from "../features/favorites/components/FavoriteButton";
import { useToast } from "../hooks/useToast";
import type { ApiLessonProgress, GamificationResult } from "../types/api";
import type { Course, Lesson, LessonContent, Trail } from "../features/education/types";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ProgressUpsertInput } from "../services/educationService";

export default function EducationLesson() {
  const { trailId, courseId, lessonId } = useParams<{ trailId: string; courseId: string; lessonId: string }>();
  const found = trailId && courseId && lessonId ? findLesson(trailId, courseId, lessonId) : undefined;
  const { rawProgress, isLoading, upsertMutation } = useEducationProgress();

  const content = found?.lesson.content;
  if (!found || !content) return <Navigate to="/educacao-financeira" replace />;

  const currentProgress = rawProgress.find((p) => p.lessonId === found.lesson.id);

  // key={lesson.id} força um remount completo ao navegar entre aulas -- sem isso, o React Router
  // reaproveita a mesma instância do componente e os estados locais do quiz/exercício da aula
  // anterior (dimensionados para as perguntas de outra aula) vazam para a aula nova.
  return (
    <LessonView
      key={found.lesson.id}
      trail={found.trail}
      course={found.course}
      lesson={found.lesson}
      content={content}
      currentProgress={currentProgress}
      isLoading={isLoading}
      upsertMutation={upsertMutation}
    />
  );
}

function LessonView({
  trail,
  course,
  lesson,
  content,
  currentProgress,
  isLoading,
  upsertMutation,
}: {
  trail: Trail;
  course: Course;
  lesson: Lesson;
  content: LessonContent;
  currentProgress: ApiLessonProgress | undefined;
  isLoading: boolean;
  upsertMutation: UseMutationResult<
    { progress: ApiLessonProgress; gamification: GamificationResult | null },
    Error,
    { lessonId: string; values: ProgressUpsertInput }
  >;
}) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { celebrate } = useGamification();

  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(
    currentProgress?.quizScore != null && currentProgress?.quizTotal != null
      ? { score: currentProgress.quizScore, total: currentProgress.quizTotal }
      : null
  );
  const [exerciseValue, setExerciseValue] = useState(currentProgress?.exerciseResponse ?? "");

  const lessonIndex = course.lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : undefined;
  const nextLesson = lessonIndex < course.lessons.length - 1 ? course.lessons[lessonIndex + 1] : undefined;
  const isCompleted = Boolean(currentProgress?.completed);

  const saveExercise = () => {
    upsertMutation.mutate({
      lessonId: lesson.id,
      values: {
        completed: isCompleted,
        quizScore: quizResult?.score,
        quizTotal: quizResult?.total,
        exerciseResponse: exerciseValue,
      },
    });
  };

  const handleQuizFinish = (score: number, total: number) => {
    setQuizResult({ score, total });
    upsertMutation.mutate(
      {
        lessonId: lesson.id,
        values: { completed: isCompleted, quizScore: score, quizTotal: total, exerciseResponse: exerciseValue },
      },
      { onSuccess: ({ gamification }) => celebrate(gamification) }
    );
  };

  const handleMarkComplete = () => {
    upsertMutation.mutate(
      {
        lessonId: lesson.id,
        values: {
          completed: true,
          quizScore: quizResult?.score,
          quizTotal: quizResult?.total,
          exerciseResponse: exerciseValue,
        },
      },
      {
        onSuccess: ({ gamification }) => {
          showToast(`✓ Aula "${lesson.title}" concluída com sucesso.`);
          celebrate(gamification);
          if (nextLesson?.content) {
            navigate(`/educacao-financeira/${trail.id}/${course.id}/${nextLesson.id}`);
          }
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <div>
        <Link
          to={`/educacao-financeira/${trail.id}/${course.id}`}
          className="text-sm text-gray-400 hover:text-green-600 transition-colors"
        >
          ← {course.title}
        </Link>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
          {isCompleted && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#0ca30c]/10 text-[#0ca30c] flex items-center gap-1">
              <Icon name="check" size={12} /> Concluída
            </span>
          )}
          <FavoriteButton contentType="lesson" contentId={lesson.id} />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Aula {lessonIndex + 1} de {course.lessons.length} — {course.title}
        </p>
      </div>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">Explicação</h2>
        <div className="flex flex-col gap-3">
          {content.explanation.map((paragraph, i) => (
            <p key={i} className="text-gray-700 dark:text-gray-200 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </Card>

      {content.examples.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">Exemplos</h2>
          <ul className="flex flex-col gap-2">
            {content.examples.map((example, i) => (
              <li key={i} className="flex gap-2 text-gray-700 dark:text-gray-200">
                <span className="text-green-600 shrink-0">✓</span>
                <span>{example}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {content.diagram && (
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">Visualizando</h2>
          <LessonDiagram diagram={content.diagram} />
        </Card>
      )}

      {content.keyConcepts.length > 0 && (
        <Card className="bg-blue-50/60 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300 mb-3">
            Conceitos importantes
          </h2>
          <ul className="flex flex-col gap-1.5">
            {content.keyConcepts.map((concept, i) => (
              <li key={i} className="text-sm text-gray-700 dark:text-gray-200">
                • {concept}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {content.quiz.length > 0 && (
        <Card className="border-purple-100 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/30">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300 mb-3">
            🧠 Teste seus conhecimentos
          </h2>
          <LessonQuiz questions={content.quiz} onFinish={handleQuizFinish} />
        </Card>
      )}

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">Exercício prático</h2>
        <LessonExercise
          prompt={content.exercise.prompt}
          placeholder={content.exercise.placeholder}
          value={exerciseValue}
          onChange={setExerciseValue}
          onSave={saveExercise}
          saving={upsertMutation.isPending}
        />
      </Card>

      <div className="flex items-center justify-between gap-3 flex-wrap pb-4">
        {prevLesson?.content ? (
          <Link to={`/educacao-financeira/${trail.id}/${course.id}/${prevLesson.id}`}>
            <Button variant="secondary" className="text-sm">
              ← Aula anterior
            </Button>
          </Link>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          {!isCompleted && !isLoading && (
            <Button onClick={handleMarkComplete} disabled={upsertMutation.isPending} className="text-sm">
              <Icon name="check" size={14} />
              {upsertMutation.isPending ? "Salvando..." : "Marcar aula como concluída"}
            </Button>
          )}
          {isCompleted && nextLesson?.content && (
            <Link to={`/educacao-financeira/${trail.id}/${course.id}/${nextLesson.id}`}>
              <Button className="text-sm">
                Próxima aula
                <Icon name="arrowRight" size={14} />
              </Button>
            </Link>
          )}
          {isCompleted && !nextLesson?.content && (
            <Link to={`/educacao-financeira/${trail.id}/${course.id}`}>
              <Button className="text-sm">Voltar ao curso</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
