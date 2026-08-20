import { Link, Navigate, useParams } from "react-router-dom";
import Card from "../components/ui/Card";
import Icon from "../components/ui/Icon";
import ProgressBar from "../components/ui/ProgressBar";
import { findTrail } from "../features/education/data/trails";
import { TRAIL_COLOR_DOT, TRAIL_COLOR_HEX } from "../features/education/data/trailColors";
import { courseStatuses, trailProgressPercent } from "../features/education/utils/trailProgress";
import { useEducationProgress } from "../features/education/hooks/useEducationProgress";

export default function EducationTrail() {
  const { trailId } = useParams<{ trailId: string }>();
  const trail = trailId ? findTrail(trailId) : undefined;
  const { progress, isLoading } = useEducationProgress();

  if (!trail) return <Navigate to="/educacao-financeira" replace />;

  const percent = trailProgressPercent(trail, progress);
  const statuses = courseStatuses(trail, progress);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <div>
        <Link to="/educacao-financeira" className="text-sm text-gray-400 hover:text-green-600 transition-colors">
          ← Todas as trilhas
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-2xl">{TRAIL_COLOR_DOT[trail.color]}</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{trail.title}</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{trail.description}</p>
      </div>

      {!isLoading && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Progresso da trilha</span>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{percent}%</span>
          </div>
          <ProgressBar percent={percent} />
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {statuses.map(({ course, status, completedCount, totalCount, hasContent }) => (
          <Link key={course.id} to={`/educacao-financeira/${trail.id}/${course.id}`}>
            <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
              <div className="flex items-center gap-3">
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                  style={
                    status === "completed"
                      ? { backgroundColor: "#0ca30c1a", color: "#0ca30c" }
                      : status === "current"
                        ? { backgroundColor: `${TRAIL_COLOR_HEX[trail.color]}1a`, color: TRAIL_COLOR_HEX[trail.color] }
                        : { backgroundColor: "#9ca3af1a", color: "#9ca3af" }
                  }
                >
                  {status === "completed" ? <Icon name="check" size={14} /> : status === "current" ? "→" : "○"}
                </span>
                <span className="text-xl shrink-0">{course.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{course.title}</p>
                  <p className="text-xs text-gray-400 truncate">{course.description}</p>
                </div>
                <div className="text-right shrink-0">
                  {hasContent ? (
                    <span className="text-xs text-gray-400">
                      {completedCount}/{totalCount} aulas
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                      Em construção
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
