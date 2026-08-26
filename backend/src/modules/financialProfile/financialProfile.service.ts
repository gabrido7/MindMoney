import { financialProfileRepository, type FinancialProfileRow } from "./financialProfile.repository";
import { goalsRepository } from "../goals/goals.repository";
import { objectivesRepository } from "../objectives/objectives.repository";
import { currentMonth } from "../../utils/month";
import type { UpdateFinancialProfileInput, PriorityOption, HabitsInput } from "./financialProfile.validation";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionPath: string;
}

export interface BehaviorProfile {
  label: string;
  description: string;
}

function parseJsonArray<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseHabits(raw: string | null): HabitsInput | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as HabitsInput;
  } catch {
    return null;
  }
}

function enrich(row: FinancialProfileRow | null) {
  return {
    experienceLevel: row?.experience_level ?? null,
    financialSituation: row?.financial_situation ?? null,
    incomeRange: row?.income_range ?? null,
    incomeVariable: Boolean(row?.income_variable),
    incomeMin: row?.income_min !== undefined && row?.income_min !== null ? Number(row.income_min) : null,
    incomeMax: row?.income_max !== undefined && row?.income_max !== null ? Number(row.income_max) : null,
    incomeSources: parseJsonArray<string>(row?.income_sources ?? null),
    priorities: parseJsonArray<PriorityOption>(row?.priorities ?? null),
    habits: parseHabits(row?.habits ?? null),
    updatedAt: row?.updated_at ?? null,
  };
}

export type EnrichedFinancialProfile = ReturnType<typeof enrich>;

/**
 * Perfil comportamental 100% determinístico a partir das 4 respostas de
 * hábito (sem IA, mesmo princípio de computeRecommendations) -- nunca
 * persistido, sempre recalculado na leitura (mesmo raciocínio do score:
 * nunca guardar o que dá pra derivar).
 */
export function computeBehaviorProfile(habits: HabitsInput | null): BehaviorProfile | null {
  if (!habits) return null;

  const score =
    { sim: 2, as_vezes: 1, nao: 0 }[habits.tracksSpending] +
    { nunca: 2, as_vezes: 1, frequentemente: 0 }[habits.overspends] +
    { nao: 2, pouco: 1, frequentemente: 0 }[habits.creditCardUsage] +
    { regularmente: 2, as_vezes: 1, nunca: 0 }[habits.investsRegularly];

  if (score >= 7) {
    return {
      label: "Consciente",
      description: "Você já tem ótimos hábitos financeiros -- acompanha os gastos, evita se endividar e investe com regularidade. Continue assim.",
    };
  }
  if (score >= 4) {
    return {
      label: "Em construção",
      description: "Você está no caminho certo, mas ainda dá pra evoluir em alguns hábitos -- pequenos ajustes tendem a fazer bastante diferença.",
    };
  }
  return {
    label: "Hora de agir",
    description: "Seus hábitos financeiros atuais pedem atenção -- comece pelo que for mais simples de mudar, um hábito de cada vez.",
  };
}

/**
 * Recomendações 100% baseadas em regra (mesmo princípio de insights.service:
 * sem IA, sem inventar texto -- cada recomendação só aparece quando a
 * combinação de resposta do perfil + dado real do usuário no banco justifica
 * ela). Perfil vazio (usuário ainda não preencheu nada) gera lista vazia, não
 * um "recomendamos que você preencha seu perfil" genérico -- isso já é
 * comunicado pela própria tela, não precisa de uma "recomendação" falsa.
 */
async function computeRecommendations(userId: number, profile: EnrichedFinancialProfile): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = [];
  if (!profile.experienceLevel && profile.priorities.length === 0 && !profile.financialSituation && !profile.habits) {
    return recommendations;
  }

  const [objectives, currentGoal] = await Promise.all([
    objectivesRepository.listByUser(userId),
    goalsRepository.findByMonth(userId, currentMonth()),
  ]);
  const objectiveCategories = new Set(objectives.map((o) => o.category));

  if (profile.experienceLevel === "iniciante") {
    recommendations.push({
      id: "trilha-fundamentos",
      title: "Comece pela trilha Fundamentos",
      description: "Como você se descreveu iniciante, essa trilha cobre o básico antes das outras ficarem mais fáceis de aproveitar.",
      actionLabel: "Ver trilha",
      actionPath: "/educacao-financeira/fundamentos",
    });
  }

  if (profile.priorities.includes("reserva_emergencia") && !objectiveCategories.has("reserva")) {
    recommendations.push({
      id: "criar-reserva",
      title: "Você ainda não tem uma meta de reserva de emergência",
      description: "Simule o tamanho ideal da sua reserva e crie um objetivo pra acompanhar o progresso.",
      actionLabel: "Simular reserva",
      actionPath: "/ferramentas/reserva-emergencia",
    });
  }

  if (
    (profile.priorities.includes("quitar_dividas") || profile.financialSituation === "endividado") &&
    !recommendations.some((r) => r.id === "simular-dividas")
  ) {
    recommendations.push({
      id: "simular-dividas",
      title: "Entenda o custo real das suas dívidas",
      description: "As calculadoras de empréstimo e financiamento mostram quanto cada uma custa de verdade, parcela a parcela.",
      actionLabel: "Simular empréstimo",
      actionPath: "/ferramentas/emprestimo",
    });
  }

  if (profile.priorities.includes("investir")) {
    recommendations.push({
      id: "trilha-investimentos",
      title: "Aprofunde em investimentos",
      description: "A trilha de Investimentos cobre o que você precisa saber antes de comparar onde colocar seu dinheiro.",
      actionLabel: "Ver trilha",
      actionPath: "/educacao-financeira/investimentos",
    });
  }

  if (profile.priorities.includes("aposentadoria") && !objectiveCategories.has("patrimonio")) {
    recommendations.push({
      id: "simular-aposentadoria",
      title: "Simule sua aposentadoria",
      description: "Descubra o patrimônio necessário pra viver de renda e transforme isso numa meta de longo prazo.",
      actionLabel: "Simular aposentadoria",
      actionPath: "/ferramentas/aposentadoria",
    });
  }

  if (profile.habits?.overspends === "frequentemente") {
    recommendations.push({
      id: "orcamento-por-categoria",
      title: "Defina um orçamento por categoria",
      description: "Categorias com orçamento definido avisam antes de estourar o limite -- um jeito direto de conter gasto que passa do planejado.",
      actionLabel: "Ver dashboard",
      actionPath: "/dashboard",
    });
  }

  if (!currentGoal) {
    recommendations.push({
      id: "definir-meta-mensal",
      title: "Você ainda não definiu uma meta de economia este mês",
      description: "Uma meta mensal é o jeito mais direto de o score financeiro medir sua capacidade de economia.",
      actionLabel: "Definir meta",
      actionPath: "/metas",
    });
  }

  return recommendations;
}

export const financialProfileService = {
  async get(userId: number) {
    const row = await financialProfileRepository.findByUser(userId);
    const profile = enrich(row);
    const recommendations = await computeRecommendations(userId, profile);
    const behaviorProfile = computeBehaviorProfile(profile.habits);
    return { ...profile, recommendations, behaviorProfile };
  },

  async update(userId: number, input: UpdateFinancialProfileInput) {
    await financialProfileRepository.patch(userId, input);
    return this.get(userId);
  },
};
