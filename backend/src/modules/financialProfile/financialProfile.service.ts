import { financialProfileRepository, type FinancialProfileRow } from "./financialProfile.repository";
import { goalsRepository } from "../goals/goals.repository";
import { objectivesRepository } from "../objectives/objectives.repository";
import { currentMonth } from "../../utils/month";
import type { UpdateFinancialProfileInput, PriorityOption } from "./financialProfile.validation";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionPath: string;
}

function parsePriorities(raw: string | null): PriorityOption[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function enrich(row: FinancialProfileRow | null) {
  return {
    experienceLevel: row?.experience_level ?? null,
    incomeRange: row?.income_range ?? null,
    priorities: parsePriorities(row?.priorities ?? null),
    updatedAt: row?.updated_at ?? null,
  };
}

export type EnrichedFinancialProfile = ReturnType<typeof enrich>;

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
  if (!profile.experienceLevel && profile.priorities.length === 0) return recommendations;

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

  if (profile.priorities.includes("quitar_dividas")) {
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
    return { ...profile, recommendations };
  },

  async update(userId: number, input: UpdateFinancialProfileInput) {
    await financialProfileRepository.upsert(
      userId,
      input.experienceLevel,
      input.incomeRange,
      input.priorities
    );
    return this.get(userId);
  },
};
