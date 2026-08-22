import type { Tool } from "../types";

export const TOOLS: Tool[] = [
  {
    id: "juros-compostos",
    title: "Juros compostos",
    emoji: "🌱",
    description: "Quanto um investimento inicial + aportes mensais rendem com juros sobre juros.",
  },
  {
    id: "juros-simples",
    title: "Juros simples",
    emoji: "➕",
    description: "Quanto um valor rende quando os juros incidem sempre sobre o valor inicial.",
  },
  {
    id: "aportes-mensais",
    title: "Aportes mensais",
    emoji: "🗓️",
    description: "Quanto investir por mês para atingir um objetivo financeiro num prazo definido.",
  },
  {
    id: "reserva-de-emergencia",
    title: "Reserva de emergência",
    emoji: "🆘",
    description: "O tamanho ideal da sua reserva e em quantos meses você consegue formá-la.",
  },
  {
    id: "aposentadoria",
    title: "Aposentadoria",
    emoji: "🏖️",
    description: "O patrimônio necessário para viver de renda, usando a regra dos 4% (ajustável).",
  },
  {
    id: "inflacao",
    title: "Inflação",
    emoji: "🎈",
    description: "Quanto vai custar no futuro o que hoje custa um determinado valor.",
  },
  {
    id: "poder-de-compra",
    title: "Poder de compra",
    emoji: "🛒",
    description: "Quanto do poder de compra de um valor parado se perde com a inflação ao longo do tempo.",
  },
  {
    id: "rentabilidade-real",
    title: "Rentabilidade real",
    emoji: "🧾",
    description: "O retorno que realmente importa: o rendimento nominal já descontada a inflação.",
  },
  {
    id: "comparacao-de-investimentos",
    title: "Comparação de investimentos",
    emoji: "⚖️",
    description: "Compare lado a lado o resultado final de dois investimentos diferentes.",
  },
  {
    id: "financiamento",
    title: "Financiamento",
    emoji: "🏠",
    description: "Simule as parcelas de um financiamento pelos sistemas Price ou SAC.",
  },
  {
    id: "emprestimo",
    title: "Empréstimo",
    emoji: "🤝",
    description: "A parcela e o custo total de um empréstimo, incluindo tarifas extras.",
  },
];

export function findTool(toolId: string): Tool | undefined {
  return TOOLS.find((t) => t.id === toolId);
}
