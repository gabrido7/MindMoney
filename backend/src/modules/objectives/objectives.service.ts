import { AppError } from "../../utils/AppError";
import { currentMonth, daysUntilEndOfMonth, monthsBetween } from "../../utils/month";
import { computeMilestone } from "../../utils/milestones";
import { objectivesRepository, type ObjectiveWithCurrentRow } from "./objectives.repository";
import { computeObjectiveStatus } from "./objectiveMath";
import { gamificationService, type GamificationResult } from "../gamification/gamification.service";
import { notificationsService } from "../notifications/notifications.service";
import type { ContributionBodyInput, ObjectiveBodyInput } from "./objectives.validation";

/** "Próxima do prazo" = falta atingir e o prazo está a até 3 meses (ou menos) de distância. */
const NEAR_DEADLINE_MONTHS = 3;

/** Ritmo dentro de +-10% do necessário conta como "no ritmo certo", não atrasado/adiantado. */
const PACE_TOLERANCE = 0.1;

export type PaceStatus = "on_track" | "behind" | "ahead" | "insufficient_data" | null;

/**
 * Ritmo real de economia: a média de quanto o usuário guardou por mês desde
 * que criou o objetivo (aportes reais / meses desde a criação), comparada
 * com o quanto precisaria guardar por mês dali pra frente. Só faz sentido
 * enquanto o objetivo está em andamento (não atingido, não atrasado, e o
 * prazo não é o mês corrente -- esse caso já tem sua própria mensagem).
 */
function computePace(
  row: ObjectiveWithCurrentRow,
  currentAmount: number,
  remainingAmount: number,
  monthsRemaining: number,
  requiredMonthlyAmount: number,
  achieved: boolean,
  overdue: boolean
): {
  monthlyPace: number | null;
  paceStatus: PaceStatus;
  paceMonthlyDifference: number;
  paceMonthsEarlier: number;
} {
  if (achieved || overdue || monthsRemaining <= 0) {
    return { monthlyPace: null, paceStatus: null, paceMonthlyDifference: 0, paceMonthsEarlier: 0 };
  }

  const createdMonth = String(row.created_at).slice(0, 7);
  const monthsElapsed = monthsBetween(createdMonth, currentMonth());

  if (monthsElapsed < 1) {
    return { monthlyPace: null, paceStatus: "insufficient_data", paceMonthlyDifference: 0, paceMonthsEarlier: 0 };
  }

  const monthlyPace = currentAmount / monthsElapsed;
  const lowerBound = requiredMonthlyAmount * (1 - PACE_TOLERANCE);
  const upperBound = requiredMonthlyAmount * (1 + PACE_TOLERANCE);

  if (monthlyPace >= lowerBound && monthlyPace <= upperBound) {
    return { monthlyPace, paceStatus: "on_track", paceMonthlyDifference: 0, paceMonthsEarlier: 0 };
  }

  if (monthlyPace < requiredMonthlyAmount) {
    return {
      monthlyPace,
      paceStatus: "behind",
      paceMonthlyDifference: requiredMonthlyAmount - monthlyPace,
      paceMonthsEarlier: 0,
    };
  }

  const projectedMonths = remainingAmount / monthlyPace;
  const monthsEarlier = Math.round(monthsRemaining - projectedMonths);
  if (monthsEarlier < 1) {
    return { monthlyPace, paceStatus: "on_track", paceMonthlyDifference: 0, paceMonthsEarlier: 0 };
  }

  return { monthlyPace, paceStatus: "ahead", paceMonthlyDifference: 0, paceMonthsEarlier: monthsEarlier };
}

/**
 * Todos os campos "calculados" (faltam, progresso, meses restantes,
 * quanto poupar por mês) são derivados aqui, nunca guardados no banco --
 * mesmo princípio do score e do dashboard: o que dá pra calcular na
 * hora não é dado persistido.
 */
function enrich(row: ObjectiveWithCurrentRow) {
  const currentAmount = Number(row.current_amount);
  const targetAmount = Number(row.target_amount);
  const progressPercent = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;

  const { achieved, overdue, monthsRemaining, remainingAmount, requiredMonthlyAmount } =
    computeObjectiveStatus(row);

  const pace = computePace(
    row,
    currentAmount,
    remainingAmount,
    monthsRemaining,
    requiredMonthlyAmount,
    achieved,
    overdue
  );

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    priority: row.priority,
    targetAmount,
    targetMonth: row.target_month,
    currentAmount,
    remainingAmount,
    progressPercent,
    achieved,
    overdue,
    monthsRemaining,
    requiredMonthlyAmount,
    daysRemaining: daysUntilEndOfMonth(row.target_month),
    createdAt: row.created_at,
    ...pace,
  };
}

export type EnrichedObjective = ReturnType<typeof enrich>;

async function getEnriched(id: number, userId: number): Promise<EnrichedObjective> {
  const row = await objectivesRepository.findByIdAndUser(id, userId);
  if (!row) throw AppError.notFound("Meta não encontrada.");
  const current_amount = await objectivesRepository.currentAmount(id);
  return enrich({ ...row, current_amount });
}

export const objectivesService = {
  async list(userId: number): Promise<EnrichedObjective[]> {
    const rows = await objectivesRepository.listByUser(userId);
    return rows.map(enrich);
  },

  async summary(userId: number) {
    const objectives = await this.list(userId);
    const totalTarget = objectives.reduce((sum, o) => sum + o.targetAmount, 0);
    const totalSaved = objectives.reduce((sum, o) => sum + o.currentAmount, 0);
    const overallProgressPercent = totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

    // "Próxima do prazo" mostra qual meta, não só quantas -- a mais urgente
    // (menos dias restantes) entre as que estão perto do prazo.
    const nearDeadline = objectives
      .filter((o) => !o.achieved && !o.overdue && o.monthsRemaining <= NEAR_DEADLINE_MONTHS)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
    const mostUrgent = nearDeadline[0];

    // Efeito colateral real (mesmo padrão de checkAndNotify): dispara aqui
    // porque é o único lugar que já calcula "objetivo mais urgente" -- não
    // existe um cron job neste projeto, notificação nasce de uma ação real
    // do usuário (aqui, consultar o resumo dos objetivos).
    if (mostUrgent) {
      await notificationsService.checkObjectiveDeadline(userId, {
        name: mostUrgent.name,
        daysRemaining: mostUrgent.daysRemaining,
      });
    }

    return {
      totalTarget,
      totalSaved,
      overallProgressPercent,
      nearDeadlineCount: nearDeadline.length,
      totalObjectives: objectives.length,
      mostUrgentObjective: mostUrgent
        ? {
            id: mostUrgent.id,
            name: mostUrgent.name,
            category: mostUrgent.category,
            daysRemaining: mostUrgent.daysRemaining,
          }
        : null,
    };
  },

  async create(userId: number, input: ObjectiveBodyInput): Promise<EnrichedObjective> {
    const id = await objectivesRepository.create(userId, input);
    return getEnriched(id, userId);
  },

  async update(id: number, userId: number, input: ObjectiveBodyInput): Promise<EnrichedObjective> {
    const existing = await objectivesRepository.findByIdAndUser(id, userId);
    if (!existing) throw AppError.notFound("Meta não encontrada.");

    await objectivesRepository.update(id, userId, input);
    return getEnriched(id, userId);
  },

  async delete(id: number, userId: number): Promise<void> {
    const existing = await objectivesRepository.findByIdAndUser(id, userId);
    if (!existing) throw AppError.notFound("Meta não encontrada.");
    await objectivesRepository.delete(id, userId);
  },

  /**
   * "Total acumulado" real por mês, somando aportes de todos os objetivos --
   * soma cumulativa calculada aqui (nunca guardada), sobre meses reais que
   * tiveram aporte (mesmo padrão de transactionsRepository.monthlyEvolution:
   * sem preencher lacuna de mês sem dado).
   */
  async evolution(userId: number): Promise<{ month: string; totalSaved: number }[]> {
    const rows = await objectivesRepository.monthlyContributionsByUser(userId);
    let cumulative = 0;
    return rows.map(({ month, total }) => {
      cumulative += total;
      return { month, totalSaved: cumulative };
    });
  },

  async listContributions(objectiveId: number, userId: number) {
    const objective = await objectivesRepository.findByIdAndUser(objectiveId, userId);
    if (!objective) throw AppError.notFound("Meta não encontrada.");
    return objectivesRepository.listContributions(objectiveId);
  },

  async addContribution(
    objectiveId: number,
    userId: number,
    input: ContributionBodyInput
  ): Promise<{ objective: EnrichedObjective; milestoneReached: number | null; gamification: GamificationResult | null }> {
    const existing = await objectivesRepository.findByIdAndUser(objectiveId, userId);
    if (!existing) throw AppError.notFound("Meta não encontrada.");

    const previousAmount = await objectivesRepository.currentAmount(objectiveId);
    const targetAmount = Number(existing.target_amount);
    const previousProgressPercent = targetAmount > 0 ? Math.min((previousAmount / targetAmount) * 100, 100) : 0;

    await objectivesRepository.addContribution(objectiveId, input);
    const objective = await getEnriched(objectiveId, userId);

    const milestoneReached = computeMilestone(previousProgressPercent, objective.progressPercent);
    const gamification =
      milestoneReached === 100 ? await gamificationService.processGoalAchieved(userId, objectiveId) : null;

    return { objective, milestoneReached, gamification };
  },

  async removeContribution(
    objectiveId: number,
    contributionId: number,
    userId: number
  ): Promise<EnrichedObjective> {
    const objective = await objectivesRepository.findByIdAndUser(objectiveId, userId);
    if (!objective) throw AppError.notFound("Meta não encontrada.");

    const contribution = await objectivesRepository.findContributionByIdAndObjective(
      contributionId,
      objectiveId
    );
    if (!contribution) throw AppError.notFound("Aporte não encontrado.");

    await objectivesRepository.removeContribution(contributionId, objectiveId);
    return getEnriched(objectiveId, userId);
  },
};
