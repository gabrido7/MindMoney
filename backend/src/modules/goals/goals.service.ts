import { AppError } from "../../utils/AppError";
import { goalsRepository } from "./goals.repository";
import { notificationsService } from "../notifications/notifications.service";
import type { GoalBodyInput, GoalUpdateInput } from "./goals.validation";

export const goalsService = {
  async list(userId: number, month?: string) {
    const goals = await goalsRepository.listByUserWithTotals(userId, month);
    return goals.map(({ entradas, saidas, ...goal }) => {
      const saldo = Number(entradas) - Number(saidas);
      return {
        ...goal,
        saldo,
        progressPercent: goal.target_amount > 0 ? (saldo / goal.target_amount) * 100 : 0,
      };
    });
  },

  async create(userId: number, input: GoalBodyInput) {
    const existing = await goalsRepository.findByMonth(userId, input.referenceMonth);
    if (existing) {
      throw AppError.conflict(
        `Já existe uma meta para ${input.referenceMonth}. Use PUT /api/goals/${existing.id} para atualizá-la.`
      );
    }

    const id = await goalsRepository.create(userId, input.referenceMonth, input.targetAmount);
    await notificationsService.checkAndNotify(userId, input.referenceMonth);
    return goalsRepository.findByIdAndUser(id, userId);
  },

  async update(id: number, userId: number, input: GoalUpdateInput) {
    const goal = await goalsRepository.findByIdAndUser(id, userId);
    if (!goal) throw AppError.notFound("Meta não encontrada.");

    await goalsRepository.update(id, userId, input.targetAmount);
    await notificationsService.checkAndNotify(userId, goal.reference_month);
    return goalsRepository.findByIdAndUser(id, userId);
  },

  async delete(id: number, userId: number) {
    const goal = await goalsRepository.findByIdAndUser(id, userId);
    if (!goal) throw AppError.notFound("Meta não encontrada.");
    await goalsRepository.delete(id, userId);
  },
};
