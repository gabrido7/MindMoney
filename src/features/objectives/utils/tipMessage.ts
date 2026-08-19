import { formatCurrency } from "../../../utils/formatters";
import type { ApiObjective } from "../../../types/api";

export function tipMessage(objective: ApiObjective): string {
  if (objective.achieved) return "🎉 Meta atingida! Você já guardou o suficiente para esse objetivo.";
  if (objective.overdue) {
    return `⏰ O prazo dessa meta já passou. Faltam ${formatCurrency(objective.remainingAmount)} — vale revisar o prazo ou reforçar os aportes.`;
  }
  if (objective.monthsRemaining === 0) {
    return `💡 O prazo é este mês: faltam ${formatCurrency(objective.remainingAmount)} para atingir a meta.`;
  }

  switch (objective.paceStatus) {
    case "on_track":
      return "📈 Você está no ritmo certo para atingir sua meta.";
    case "behind":
      return `⚠️ Você está economizando ${formatCurrency(objective.paceMonthlyDifference)}/mês abaixo do necessário.`;
    case "ahead": {
      const months = objective.paceMonthsEarlier;
      return `🟢 Mantendo seu ritmo atual, você atingirá a meta ${months} ${months === 1 ? "mês" : "meses"} antes.`;
    }
    default:
      return `💡 Para atingir essa meta no prazo, você precisa economizar aproximadamente ${formatCurrency(objective.requiredMonthlyAmount)} por mês.`;
  }
}
