import { AppError } from "../../utils/AppError";
import { currentMonth, monthsBetween } from "../../utils/month";
import { objectivesRepository, type ObjectiveWithCurrentRow } from "./objectives.repository";
import type { ContributionBodyInput, ObjectiveBodyInput } from "./objectives.validation";

/** "Próxima do prazo" = falta atingir e o prazo está a até 3 meses (ou menos) de distância. */
const NEAR_DEADLINE_MONTHS = 3;

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
