const CATEGORY_TIPS: Record<string, string> = {
  Alimentação: "Considere reduzir gastos com delivery ou refeições fora.",
  Lazer: "Avalie diminuir gastos com entretenimento este mês.",
  Transporte: "Tente otimizar gastos com combustível ou transporte.",
  Investimento: "Você aumentou seus investimentos. Ótimo sinal financeiro!",
};

export const categoryTip = (category: string): string =>
  CATEGORY_TIPS[category] ?? "Revise seus gastos para manter o controle financeiro.";

export const limitSuggestion = (
  status: "over" | "near" | "ok",
  biggestCategory: string | undefined
): string | null => {
  if (status === "over") {
    return biggestCategory
      ? `Sua maior despesa foi em ${biggestCategory}. ${categoryTip(biggestCategory)}`
      : "Revise seus gastos.";
  }
  if (status === "near") {
    return "Atenção: seus gastos estão se aproximando do limite. Evite despesas desnecessárias.";
  }
  return null;
};
