import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import { useFinancialProfile } from "../../profile/hooks/useFinancialProfile";
import { useDebts } from "../../debts/hooks/useDebts";
import { useAssets } from "../../assets/hooks/useAssets";
import { useEducationProgress } from "../hooks/useEducationProgress";
import { objectivesService } from "../../../services/objectivesService";
import { buildStrategicPlan, type StrategicPlanItem } from "../utils/strategicPlan";
import { nextLessonInCourse, courseCompletedCount } from "../utils/trailProgress";
import { TRAIL_COLOR_DOT } from "../data/trailColors";

/**
 * Quando vários cursos empatam no mesmo sinal mais forte (ex: a mesma
 * dívida de juro alto explica 4 cursos de uma vez), repetir a frase
 * idêntica em cada linha lê como texto de máquina, mesmo sendo real.
 * A partir do 2º item, se o motivo for igual ao do destaque #1, mostra a
 * descrição real do curso em vez de repetir a mesma frase.
 */
function PlanRow({ item, topReason }: { item: StrategicPlanItem; topReason: string }) {
  const to = `/educacao-financeira/${item.trail.id}/${item.course.id}`;
  const subtitle = item.reason === topReason ? item.course.description : item.reason;
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-brand"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{item.course.title}</p>
        <p className="truncate text-xs text-ink-soft">{subtitle}</p>
      </div>
      <span className="flex shrink-0 items-center gap-1 text-xs text-ink-soft">
        {TRAIL_COLOR_DOT[item.trail.color]} {item.trail.title}
      </span>
    </Link>
  );
}

/**
 * "Sua trilha estratégica" -- ao contrário do catálogo abaixo (trilhas
 * inteiras, soltas), isto é um plano individual: os cursos que mais fazem
 * sentido AGORA pra esse usuário específico, puxados de qualquer trilha,
 * com o motivo real de cada recomendação (buildStrategicPlan.ts). Nunca diz
 * "recomendado pra você" sem dizer por quê.
 */
export default function StrategicPlanCard() {
  const { profile, isLoading: profileLoading } = useFinancialProfile();
  const { debts, isLoading: debtsLoading } = useDebts();
  const { assets, isLoading: assetsLoading } = useAssets();
  const { progress, isLoading: progressLoading } = useEducationProgress();
  const { data: objectivesData, isLoading: objectivesLoading } = useQuery({
    queryKey: ["objectives"],
    queryFn: () => objectivesService.list(),
  });

  const isLoading = profileLoading || debtsLoading || assetsLoading || progressLoading || objectivesLoading;

  const plan = isLoading
    ? []
    : buildStrategicPlan({
        profile,
        debts,
        assets,
        objectives: objectivesData?.objectives ?? [],
        progress,
      });

  const [top, ...rest] = plan;
  const nextLesson = top ? nextLessonInCourse(top.course, progress) : null;
  const topCompletedCount = top ? courseCompletedCount(top.course, progress) : 0;

  return (
    <Card title="Sua trilha estratégica">
      {isLoading && <p className="text-ink-soft">Montando sua trilha...</p>}

      {!isLoading && !top && (
        <EmptyState
          icon="sparkles"
          message="Sua trilha personalizada aparece aqui conforme você preenche o perfil financeiro e usa o app -- por enquanto, comece explorando as trilhas abaixo."
        />
      )}

      {!isLoading && top && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-brand bg-brand-soft p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
              <span>{TRAIL_COLOR_DOT[top.trail.color]}</span>
              <span>{top.trail.title}</span>
            </div>
            <p className="font-display mt-1 text-lg font-semibold text-ink">{top.course.title}</p>
            <p className="mt-1 text-sm text-ink">{top.reason}</p>
            {nextLesson && (
              <Link to={`/educacao-financeira/${top.trail.id}/${top.course.id}/${nextLesson.id}`} className="mt-3 inline-block">
                <Button className="text-sm">
                  {topCompletedCount === 0 ? "Começar" : "Continuar"}
                  <Icon name="arrowRight" size={14} />
                </Button>
              </Link>
            )}
          </div>

          {rest.length > 0 && (
            <ul className="flex flex-col gap-2">
              {rest.map((item) => (
                <li key={item.course.id}>
                  <PlanRow item={item} topReason={top.reason} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}
