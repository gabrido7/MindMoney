import { Link, Navigate, useParams } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import EmptyState from "../components/ui/EmptyState";
import { findCourse } from "../features/education/data/trails";
import { TRAIL_COLOR_HEX } from "../features/education/data/trailColors";
import { courseCompletedCount, nextLessonInCourse } from "../features/education/utils/trailProgress";
import { useEducationProgress } from "../features/education/hooks/useEducationProgress";

export default function EducationCourse() {
  const { trailId, courseId } = useParams<{ trailId: string; courseId: string }>();
  const found = trailId && courseId ? findCourse(trailId, courseId) : undefined;
  const { progress, isLoading } = useEducationProgress();

  if (!found) return <Navigate to="/educacao-financeira" replace />;
  const { trail, course } = found;

  const hasContent = course.lessons.some((l) => l.content);
  const completedCount = courseCompletedCount(course, progress);
  const nextLesson = nextLessonInCourse(course, progress);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <div>
        <Link
          to={`/educacao-financeira/${trail.id}`}
          className="text-sm text-gray-400 hover:text-green-600 transition-colors"
        >
          ← {trail.title}
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-2xl">{course.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{course.description}</p>
          </div>
        </div>
      </div>

      {!hasContent ? (
        <Card>
          <EmptyState
            icon="book"
            message="Esse curso ainda está em produção — as aulas abaixo mostram o que está planejado, mas o conteúdo completo ainda não foi escrito."
          />
        </Card>
      ) : (
        !isLoading && (
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {completedCount} de {course.lessons.length} aulas concluídas
            </p>
            {nextLesson && (
              <Link to={`/educacao-financeira/${trail.id}/${course.id}/${nextLesson.id}`}>
                <Button className="text-sm">
                  {completedCount === 0 ? "Começar curso" : completedCount === course.lessons.length ? "Revisar curso" : "Continuar"}
                  <Icon name="arrowRight" size={14} />
                </Button>
              </Link>
            )}
          </Card>
        )
      )}

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {course.lessons.length} {course.lessons.length === 1 ? "aula" : "aulas"}
        </p>
        {course.lessons.map((lesson, index) => {
          const completed = Boolean(progress[lesson.id]?.completed);
          const isNext = nextLesson?.id === lesson.id && !completed;

          const row = (
            <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
              <div className="flex items-center gap-3">
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={
                    completed
                      ? { backgroundColor: "#0ca30c1a", color: "#0ca30c" }
                      : isNext
                        ? { backgroundColor: `${TRAIL_COLOR_HEX[trail.color]}1a`, color: TRAIL_COLOR_HEX[trail.color] }
                        : { backgroundColor: "#9ca3af1a", color: "#9ca3af" }
                  }
                >
                  {completed ? <Icon name="check" size={14} /> : index + 1}
                </span>
                <p className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{lesson.title}</p>
                {isNext && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 shrink-0">
                    Continuar
                  </span>
                )}
                {!lesson.content && (
                  <span className="text-xs text-gray-400 shrink-0">Em breve</span>
                )}
              </div>
            </Card>
          );

          return lesson.content ? (
            <Link key={lesson.id} to={`/educacao-financeira/${trail.id}/${course.id}/${lesson.id}`}>
              {row}
            </Link>
          ) : (
            <div key={lesson.id} className="opacity-70 cursor-not-allowed">
              {row}
            </div>
          );
        })}
      </div>
    </div>
  );
}
