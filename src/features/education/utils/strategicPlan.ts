import { TRAILS, findTrail } from "../data/trails";
import { COURSE_RELEVANCE } from "../data/courseRelevance";
import { courseCompletedCount, courseHasContent, type ProgressMap } from "./trailProgress";
import type { Course, Trail } from "../types";
import type { Asset, Debt, FinancialPriority, FinancialProfile, ApiObjective } from "../../../types/api";

/** Mesmo limiar de cartão rotativo caro já usado no motor de conselhos de dívida (debtAdvice.service.ts, backend) -- um sinal, um número, os dois lados concordam. */
const REVOLVING_CARD_RATE_THRESHOLD = 10;

const PRIORITY_LABELS: Record<FinancialPriority, string> = {
  reserva_emergencia: "montar uma reserva de emergência",
  quitar_dividas: "quitar dívidas",
  investir: "investir",
  comprar_um_bem: "comprar um bem",
  aposentadoria: "planejar a aposentadoria",
  educacao: "se educar financeiramente",
  organizar_financas: "organizar as finanças",
  alcancar_objetivos: "alcançar seus objetivos",
  controlar_gastos: "controlar os gastos",
  construir_patrimonio: "construir patrimônio",
};

export interface StrategicPlanItem {
  course: Course;
  trail: Trail;
  score: number;
  reason: string;
}

export interface BuildStrategicPlanInput {
  profile: FinancialProfile | null;
  debts: Debt[];
  assets: Asset[];
  objectives: ApiObjective[];
  progress: ProgressMap;
}

const MAX_ITEMS = 5;
const FALLBACK_TRAIL_ID = "fundamentos";

/**
 * Ranking 100% determinístico de curso -- não é IA, é regra sobre dado real
 * (mesmo princípio do resto do projeto: insights, debtAdvice). Cada curso
 * ganha pontos por sinal real que bate com ele; o motivo mostrado é sempre
 * o sinal que mais pesou naquele curso específico, nunca um texto solto.
 */
export function buildStrategicPlan(input: BuildStrategicPlanInput): StrategicPlanItem[] {
  const { profile, debts, assets, objectives, progress } = input;

  const activeDebts = debts.filter((d) => !d.paidOff);
  const debtsWithRate = activeDebts.filter((d) => d.interestRate !== null);
  const highestInterestDebt =
    debtsWithRate.length > 0
      ? debtsWithRate.reduce((max, d) => (d.interestRate! > max.interestRate! ? d : max))
      : null;
  const hasHighInterestDebt = (highestInterestDebt?.interestRate ?? 0) >= REVOLVING_CARD_RATE_THRESHOLD;

  const hasPatrimonyObjective = objectives.some((o) => o.category === "patrimonio");
  const hasInvestmentAsset = assets.some((a) => a.type === "investimento");
  const overspendsOften = profile?.habits?.overspends === "frequentemente";
  const priorities = new Set(profile?.priorities ?? []);
  const situation = profile?.financialSituation ?? null;
  // Sem experienceLevel definido, trata como iniciante -- mais seguro sugerir a base do que presumir conhecimento que a pessoa não confirmou ter.
  const isBeginner = !profile?.experienceLevel || profile.experienceLevel === "iniciante";

  const items: StrategicPlanItem[] = [];

  for (const trail of TRAILS) {
    for (const course of trail.courses) {
      if (!courseHasContent(course)) continue;

      const total = course.lessons.length;
      const completed = courseCompletedCount(course, progress);
      if (total > 0 && completed >= total) continue; // já concluído -- não compete mais pelo plano

      const relevance = COURSE_RELEVANCE[course.id] ?? {};
      let score = 0;
      const candidates: { weight: number; text: string }[] = [];

      if (hasHighInterestDebt && relevance.priorities?.includes("quitar_dividas")) {
        score += 50;
        candidates.push({
          weight: 50,
          text: `Você tem "${highestInterestDebt!.name}" com juros de ${highestInterestDebt!.interestRate!.toLocaleString("pt-BR")}% ao mês -- esse curso ajuda a sair dela mais rápido.`,
        });
      }

      if (situation && relevance.situations?.includes(situation)) {
        score += 25;
        candidates.push({
          weight: 25,
          text:
            situation === "endividado"
              ? "Você descreveu sua situação financeira atual como endividado -- esse curso é direto ao ponto."
              : "Você contou que sua situação financeira está apertada -- esse curso ajuda a sair desse aperto.",
        });
      }

      const matchedPriorities = (relevance.priorities ?? []).filter((p) => priorities.has(p));
      if (matchedPriorities.length > 0) {
        score += 15 * matchedPriorities.length;
        candidates.push({
          weight: 15 * matchedPriorities.length,
          text: `Está entre as suas prioridades: ${PRIORITY_LABELS[matchedPriorities[0]]}.`,
        });
      }

      if (hasPatrimonyObjective && relevance.priorities?.includes("aposentadoria")) {
        score += 20;
        candidates.push({
          weight: 20,
          text: "Você já tem um objetivo de patrimônio cadastrado -- esse curso aprofunda o assunto.",
        });
      }

      if (hasInvestmentAsset && trail.id === "financas-avancadas") {
        score += 15;
        candidates.push({
          weight: 15,
          text: "Você já tem investimentos reais cadastrados -- hora de ir mais fundo no assunto.",
        });
      }

      if (
        overspendsOften &&
        ["planejamento-mensal", "metodo-50-30-20", "como-montar-um-orcamento", "controle-de-gastos"].includes(
          course.id
        )
      ) {
        score += 20;
        candidates.push({
          weight: 20,
          text: "Você contou que costuma gastar mais do que planeja -- esse curso ataca isso direto.",
        });
      }

      if (isBeginner && relevance.foundational) {
        score += 10;
        candidates.push({ weight: 10, text: "Uma base sólida antes de avançar pros temas mais complexos." });
      }

      if (completed > 0) {
        score += 40;
        candidates.push({
          weight: 40,
          text: `Você já começou esse curso (${completed}/${total} aulas) -- continue de onde parou.`,
        });
      }

      if (score <= 0) continue;

      candidates.sort((a, b) => b.weight - a.weight);
      items.push({ course, trail, score, reason: candidates[0].text });
    }
  }

  items.sort((a, b) => b.score - a.score);

  // Nenhum sinal bateu em nada (perfil zerado, sem dívida/ativo/objetivo) --
  // ainda assim devolve algo coerente, nunca uma tela vazia sem explicação.
  if (items.length === 0) {
    const fallbackTrail = findTrail(FALLBACK_TRAIL_ID);
    if (!fallbackTrail) return [];
    return fallbackTrail.courses
      .filter((c) => courseHasContent(c) && courseCompletedCount(c, progress) < c.lessons.length)
      .slice(0, MAX_ITEMS)
      .map((course) => ({
        course,
        trail: fallbackTrail,
        score: 0,
        reason: "Fundamentos é o ponto de partida ideal enquanto seu perfil ainda está sendo construído.",
      }));
  }

  return items.slice(0, MAX_ITEMS);
}
