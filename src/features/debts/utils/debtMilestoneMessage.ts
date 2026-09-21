/** Espelha src/features/objectives/utils/celebrationMessage.ts, com linguagem de dívida em vez de meta. */
export function debtMilestoneMessage(milestone: number, debtName: string): string {
  switch (milestone) {
    case 100:
      return `🎉 Você quitou "${debtName}" por completo!`;
    case 75:
      return `🔥 Reta final! Você já quitou 75% de "${debtName}".`;
    case 50:
      return `🎯 Metade do caminho! Você já quitou 50% de "${debtName}".`;
    case 25:
      return `🚀 Primeiro quarto quitado! 25% de "${debtName}" já pagos.`;
    default:
      return `Você avançou no pagamento de "${debtName}"!`;
  }
}
