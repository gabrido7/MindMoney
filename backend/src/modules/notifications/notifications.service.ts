import { AppError } from "../../utils/AppError";
import { transactionsRepository } from "../transactions/transactions.repository";
import { goalsRepository } from "../goals/goals.repository";
import { notificationsRepository, type NotificationType } from "./notifications.repository";
import { notificationPreferencesRepository } from "./notificationPreferences.repository";
import { formatMonthLabel } from "../../utils/month";
import { ALERT_PERCENT } from "../../config/rules";

const PREFERENCE_TYPES: NotificationType[] = ["limit_exceeded", "goal_achieved", "objective_deadline"];

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

  /** Ausência de linha = ativado (ver notificationPreferences.repository) -- todo mundo começa recebendo tudo. */
  async getPreferences(userId: number): Promise<Record<NotificationType, boolean>> {
    const saved = await notificationPreferencesRepository.listByUser(userId);
    return Object.fromEntries(
      PREFERENCE_TYPES.map((type) => [type, saved[type] ?? true])
    ) as Record<NotificationType, boolean>;
  },

  async updatePreference(userId: number, type: NotificationType, enabled: boolean): Promise<void> {
    await notificationPreferencesRepository.upsert(userId, type, enabled);
  },

  /**
   * Reavalia o mês e cria notificações reais quando um evento acontece
   * (limite de gastos estourado / meta atingida). Chamado depois de criar
   * ou editar uma transação e depois de criar/editar uma meta — nunca
   * fabricado à parte, sempre a partir do estado real do banco.
   * Evita duplicar: só cria se não houver outra do mesmo tipo ainda não lida.
   * Cada criação respeita a preferência do usuário para aquele tipo.
   */
  async checkAndNotify(userId: number, month: string): Promise<void> {
    const totals = await transactionsRepository.sumByTypeForMonth(userId, month);

    if (totals.entradas > 0) {
      const gastoPercentual = (totals.saidas / totals.entradas) * 100;
      if (gastoPercentual > ALERT_PERCENT) {
        const enabled = await notificationPreferencesRepository.isEnabled(userId, "limit_exceeded");
        const alreadyNotified = enabled && (await notificationsRepository.hasUnreadOfType(userId, "limit_exceeded"));
        if (enabled && !alreadyNotified) {
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
        const enabled = await notificationPreferencesRepository.isEnabled(userId, "goal_achieved");
        const alreadyNotified = enabled && (await notificationsRepository.hasUnreadOfType(userId, "goal_achieved"));
        if (enabled && !alreadyNotified) {
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

  /**
   * Chamado a partir de objectivesService.summary() -- reaproveita o objetivo
   * mais urgente já calculado ali (mesma regra de "próximo do prazo" que a
   * tela de Metas usa), sem recalcular nada aqui. Mesmo padrão de dedupe dos
   * outros tipos: só uma notificação não lida deste tipo por vez.
   */
  async checkObjectiveDeadline(
    userId: number,
    urgentObjective: { name: string; daysRemaining: number } | null
  ): Promise<void> {
    if (!urgentObjective) return;

    const enabled = await notificationPreferencesRepository.isEnabled(userId, "objective_deadline");
    if (!enabled) return;

    const alreadyNotified = await notificationsRepository.hasUnreadOfType(userId, "objective_deadline");
    if (alreadyNotified) return;

    await notificationsRepository.create(
      userId,
      "objective_deadline",
      "Meta próxima do prazo",
      `Sua meta "${urgentObjective.name}" vence em ${urgentObjective.daysRemaining} dia(s).`
    );
  },
};
