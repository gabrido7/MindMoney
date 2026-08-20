export function celebrationMessage(milestone: number, objectiveName: string): string {
  switch (milestone) {
    case 100:
      return `🏆 Parabéns! Você alcançou sua meta "${objectiveName}"!`;
    case 75:
      return `🔥 Reta final! Você já passou de 75% da meta "${objectiveName}".`;
    case 50:
      return `🎯 Você chegou à metade da sua meta "${objectiveName}"!`;
    case 25:
      return `🚀 Primeiro quarto concluído! 25% da meta "${objectiveName}" já garantidos.`;
    default:
      return `Você avançou na sua meta "${objectiveName}"!`;
  }
}
