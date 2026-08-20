import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import { TRAILS } from "../features/education/data/trails";
import { TRAIL_COLOR_DOT } from "../features/education/data/trailColors";
import { trailLessonCount, trailCompletedCount, trailProgressPercent } from "../features/education/utils/trailProgress";
import { useEducationProgress } from "../features/education/hooks/useEducationProgress";

export default function FinancialEducation() {
  const { progress, isLoading, error } = useEducationProgress();

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Educação Financeira</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Trilhas de aprendizado, do básico ao avançado — cada assunto é um curso completo, com aulas, exemplos, quiz e exercício prático.
        </p>
      </div>

      {isLoading && <p className="text-gray-500 dark:text-gray-400">Carregando...</p>}
      {error && <p className="text-red-500">Não foi possível carregar seu progresso agora.</p>}

      {!isLoading && (
        <div className="flex flex-col gap-4">
          {TRAILS.map((trail) => {
            const total = trailLessonCount(trail);
            const completed = trailCompletedCount(trail, progress);
            const percent = trailProgressPercent(trail, progress);

            return (
              <Link key={trail.id} to={`/educacao-financeira/${trail.id}`}>
                <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl leading-none mt-0.5">{TRAIL_COLOR_DOT[trail.color]}</span>
                      <div>
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                          {trail.title}
                          <span className="ml-2 text-xs font-normal text-gray-400">{trail.courses.length} cursos</span>
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{trail.description}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 shrink-0">{percent}%</span>
                  </div>

                  <div className="mt-4">
                    <ProgressBar percent={percent} />
                    <p className="text-xs text-gray-400 mt-1.5">
                      {completed} de {total} aulas concluídas
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
