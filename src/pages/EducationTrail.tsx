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

      {/*
        Caminho da trilha, não lista de cards -- os cursos já têm uma ordem e um
        estado real (concluído / atual / a seguir, ver courseStatuses), então o
        formato certo é um percurso com nós conectados, não cartões soltos
        empilhados. A cor de cada nó/linha é a cor da própria trilha
        (TRAIL_COLOR_HEX), reforçando a identidade visual que hoje só aparece
        no emoji do topo.
      */}
      <ol className="flex flex-col">
        {statuses.map(({ course, status, completedCount, totalCount, hasContent }, index) => {
          const isLast = index === statuses.length - 1;
          const trailColor = TRAIL_COLOR_HEX[trail.color];

          return (
            <li key={course.id} className="relative flex gap-4">
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-9 h-[calc(100%-1.25rem)] w-0.5 -translate-x-1/2"
                  style={{ backgroundColor: status === "completed" ? trailColor : "var(--line)" }}
                />
              )}

              <span
                className="relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold"
                style={
                  status === "completed"
                    ? { backgroundColor: trailColor, borderColor: trailColor, color: "#fff" }
                    : status === "current"
                      ? { backgroundColor: `${trailColor}1a`, borderColor: trailColor, color: trailColor }
                      : { backgroundColor: "var(--surface-alt)", borderColor: "var(--line)", color: "var(--ink-soft)" }
                }
              >
                {status === "completed" ? <Icon name="check" size={14} /> : status === "current" ? "→" : "○"}
              </span>

              <Link
                to={`/educacao-financeira/${trail.id}/${course.id}`}
                className="mb-3 min-w-0 flex-1 rounded-xl px-3 py-2 transition-colors hover:bg-surface-alt"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl shrink-0">{course.icon}</span>
                  <div className="min-w-0 flex-1">
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
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
