import { AppError } from "../../utils/AppError";
import { transactionsRepository } from "../transactions/transactions.repository";
import { goalsRepository } from "../goals/goals.repository";
import { categoryBudgetsService } from "../categoryBudgets/categoryBudgets.service";
import { notificationsRepository, type NotificationType } from "./notifications.repository";
import { notificationPreferencesRepository } from "./notificationPreferences.repository";
import { formatMonthLabel } from "../../utils/month";
import { formatCurrency } from "../../utils/formatCurrency";
import { ALERT_PERCENT } from "../../config/rules";

const PREFERENCE_TYPES: NotificationType[] = [
  "limit_exceeded",
  "goal_achieved",
  "objective_deadline",
  "category_budget_exceeded",
  "onboarding_pending",
  "debt_due_date",
];

/** Rótulos exibidos na notificação de onboarding pendente -- chaves espelham as etapas do wizard no frontend (src/pages/Onboarding.tsx). */
const ONBOARDING_STEP_LABELS: Record<string, string> = {
  motivacao: "Motivação",
  perfil: "Perfil financeiro",
  renda: "Renda",
  despesas: "Despesas fixas",
  dividas: "Dívidas",
  habitos: "Hábitos financeiros",
};

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

    const overBudget = await categoryBudgetsService.findFirstOverBudget(userId, month);
    if (overBudget) {
      const enabled = await notificationPreferencesRepository.isEnabled(userId, "category_budget_exceeded");
      const alreadyNotified =
        enabled && (await notificationsRepository.hasUnreadOfType(userId, "category_budget_exceeded"));
      if (enabled && !alreadyNotified) {
        await notificationsRepository.create(
          userId,
          "category_budget_exceeded",
          "Orçamento de categoria estourado",
          `Você já ultrapassou o orçamento de ${formatCurrency(overBudget.amount)} definido para ${overBudget.categoryName} em ${formatMonthLabel(month)}.`
        );
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

  /**
   * Chamado uma única vez, dentro de usersService.completeOnboarding(), só
   * quando o usuário pulou pelo menos uma etapa do wizard -- não é um
   * checkAndNotify (não depende de mutação de transação), é efeito direto de
   * concluir o onboarding. Mesmo padrão de dedupe dos outros tipos.
   */
  async notifyOnboardingPending(userId: number, skippedSteps: string[]): Promise<void> {
    if (skippedSteps.length === 0) return;

    const enabled = await notificationPreferencesRepository.isEnabled(userId, "onboarding_pending");
    if (!enabled) return;

    const alreadyNotified = await notificationsRepository.hasUnreadOfType(userId, "onboarding_pending");
    if (alreadyNotified) return;

    const labels = skippedSteps.map((step) => ONBOARDING_STEP_LABELS[step] ?? step).join(", ");
    await notificationsRepository.create(
      userId,
      "onboarding_pending",
      "Complete seu perfil financeiro",
      `Você pulou algumas etapas do onboarding (${labels}). Complete quando quiser em Perfil > Financeiro pra receber recomendações mais precisas.`
    );
  },

  /**
   * Chamado a partir de debtsService.checkDueDates() -- uma vez por marco
   * (30/15/7/3/0 dias antes) que já foi confirmado como novo via
   * debtsRepository.recordDueAlert (dedupe por dívida+marco+vencimento,
   * não pelo dedupe genérico de "1 não lida por tipo" -- aqui várias
   * notificações do mesmo tipo podem coexistir, uma por marco/dívida).
   */
  async checkDebtDueSoon(userId: number, urgentDebt: { name: string; daysRemaining: number } | null): Promise<void> {
    if (!urgentDebt) return;

    const enabled = await notificationPreferencesRepository.isEnabled(userId, "debt_due_date");
    if (!enabled) return;

    const when =
      urgentDebt.daysRemaining <= 0
        ? "vence hoje"
        : `vence em ${urgentDebt.daysRemaining} dia${urgentDebt.daysRemaining === 1 ? "" : "s"}`;

    await notificationsRepository.create(
      userId,
      "debt_due_date",
      "Vencimento de dívida próximo",
      `A dívida "${urgentDebt.name}" ${when}.`
    );
  },
};
