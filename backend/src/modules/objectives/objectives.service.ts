import { AppError } from "../../utils/AppError";
import { currentMonth, monthsBetween } from "../../utils/month";
import { objectivesRepository, type ObjectiveWithCurrentRow } from "./objectives.repository";
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
  const achieved = currentAmount >= targetAmount;
  const remainingAmount = Math.max(targetAmount - currentAmount, 0);
  const progressPercent = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;

  const rawMonthsRemaining = monthsBetween(currentMonth(), row.target_month);
  const overdue = !achieved && rawMonthsRemaining < 0;
  const monthsRemaining = Math.max(rawMonthsRemaining, 0);
  const requiredMonthlyAmount = achieved || overdue ? 0 : remainingAmount / Math.max(monthsRemaining, 1);

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
    targetAmount,
    targetMonth: row.target_month,
    currentAmount,
    remainingAmount,
    progressPercent,
    achieved,
    overdue,
    monthsRemaining,
    requiredMonthlyAmount,
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
    const nearDeadlineCount = objectives.filter(
      (o) => !o.achieved && !o.overdue && o.monthsRemaining <= NEAR_DEADLINE_MONTHS
    ).length;

    return {
      totalTarget,
      totalSaved,
      overallProgressPercent,
      nearDeadlineCount,
      totalObjectives: objectives.length,
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

  async listContributions(objectiveId: number, userId: number) {
    const objective = await objectivesRepository.findByIdAndUser(objectiveId, userId);
    if (!objective) throw AppError.notFound("Meta não encontrada.");
    return objectivesRepository.listContributions(objectiveId);
  },

  async addContribution(
    objectiveId: number,
    userId: number,
    input: ContributionBodyInput
  ): Promise<EnrichedObjective> {
    const objective = await objectivesRepository.findByIdAndUser(objectiveId, userId);
    if (!objective) throw AppError.notFound("Meta não encontrada.");

    await objectivesRepository.addContribution(objectiveId, input);
    return getEnriched(objectiveId, userId);
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
