import { AppError } from "../../utils/AppError";
import { transactionsRepository } from "../transactions/transactions.repository";
import { goalsRepository } from "../goals/goals.repository";
import { notificationsRepository } from "./notifications.repository";
import { formatMonthLabel } from "../../utils/month";
import { ALERT_PERCENT } from "../../config/rules";

export const notificationsService = {
  async list(userId: number) {
    return notificationsRepository.listByUser(userId);
  },

  async markAsRead(id: number, userId: number) {
    const notification = await notificationsRepository.findByIdAndUser(id, userId);
    if (!notification) throw AppError.notFound("Notificação não encontrada.");

    if (!notification.read_at) {
      await notificationsRepository.markRead(id, userId);
    }
    return notificationsRepository.findByIdAndUser(id, userId);
  },

  /**
   * Reavalia o mês e cria notificações reais quando um evento acontece
   * (limite de gastos estourado / meta atingida). Chamado depois de criar
   * ou editar uma transação e depois de criar/editar uma meta — nunca
   * fabricado à parte, sempre a partir do estado real do banco.
   * Evita duplicar: só cria se não houver outra do mesmo tipo ainda não lida.
   */
  async checkAndNotify(userId: number, month: string): Promise<void> {
    const totals = await transactionsRepository.sumByTypeForMonth(userId, month);

    if (totals.entradas > 0) {
      const gastoPercentual = (totals.saidas / totals.entradas) * 100;
      if (gastoPercentual > ALERT_PERCENT) {
        const alreadyNotified = await notificationsRepository.hasUnreadOfType(userId, "limit_exceeded");
        if (!alreadyNotified) {
          await notificationsRepository.create(
            userId,
            "limit_exceeded",
            "Limite de gastos ultrapassado",
            `Você utilizou ${gastoPercentual.toFixed(1)}% das suas entradas em ${formatMonthLabel(month)}.`
          );
        }
      }
    }

    const goal = await goalsRepository.findByMonth(userId, month);
    if (goal) {
      const saldo = totals.entradas - totals.saidas;
      if (saldo >= goal.target_amount) {
        const alreadyNotified = await notificationsRepository.hasUnreadOfType(userId, "goal_achieved");
        if (!alreadyNotified) {
          await notificationsRepository.create(
            userId,
            "goal_achieved",
            "Meta de economia atingida",
            `Você atingiu sua meta de economia de ${formatMonthLabel(month)}. 🏆`
          );
        }
      }
    }
  },
};
