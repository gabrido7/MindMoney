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
        <Link to="/educacao-financeira" className="text-sm text-ink-soft hover:text-brand transition-colors">
          ← Todas as trilhas
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-2xl">{TRAIL_COLOR_DOT[trail.color]}</span>
          <h1 className="font-display text-2xl font-bold text-ink">{trail.title}</h1>
        </div>
        <p className="text-sm text-ink-soft mt-1">{trail.description}</p>
      </div>

      {!isLoading && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-ink">Progresso da trilha</span>
            <span className="font-data text-sm font-semibold text-ink-soft">{percent}%</span>
          </div>
          <ProgressBar percent={percent} />
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {statuses.map(({ course, status, completedCount, totalCount, hasContent }) => (
          <Link key={course.id} to={`/educacao-financeira/${trail.id}/${course.id}`}>
            <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <span
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    status === "completed"
                      ? "bg-brand-soft text-brand-deep"
                      : status === "current"
                        ? ""
                        : "bg-surface-alt text-ink-soft"
                  }`}
                  style={
                    status === "current"
                      ? { backgroundColor: `${TRAIL_COLOR_HEX[trail.color]}1a`, color: TRAIL_COLOR_HEX[trail.color] }
                      : undefined
                  }
                >
                  {status === "completed" ? <Icon name="check" size={14} /> : status === "current" ? "→" : "○"}
                </span>
                <span className="text-xl shrink-0">{course.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{course.title}</p>
                  <p className="text-xs text-ink-soft truncate">{course.description}</p>
                </div>
                <div className="text-right shrink-0">
                  {hasContent ? (
                    <span className="font-data text-xs text-ink-soft">
                      {completedCount}/{totalCount} aulas
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-alt text-ink-soft">
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
