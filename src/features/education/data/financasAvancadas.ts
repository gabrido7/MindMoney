import type { Trail } from "../types";

const trailId = "financas-avancadas";
const lid = (courseId: string, n: number) => `${trailId}.${courseId}.aula-${n}`;
const stub = (courseId: string, titles: string[]) =>
  titles.map((title, i) => ({ id: lid(courseId, i + 1), title }));

export const financasAvancadasTrail: Trail = {
  id: trailId,
  title: "Finanças avançadas",
  description: "Alocação de ativos, risco x retorno e os conceitos que diferenciam um investidor iniciante de um mais maduro.",
  color: "purple",
  courses: [
    {
      id: "alocacao-de-ativos",
      title: "Alocação de ativos",
      description: "Como distribuir seu patrimônio entre diferentes tipos de investimento.",
      icon: "🧭",
      lessons: stub("alocacao-de-ativos", [
        "O que é alocação de ativos",
        "Perfil de investidor: conservador, moderado, arrojado",
        "Alocação por objetivo e por prazo",
        "Rebalanceando a carteira ao longo do tempo",
        "Erros comuns de alocação",
      ]),
    },
    {
      id: "risco-x-retorno",
      title: "Risco x retorno",
      description: "A relação fundamental que explica por que nada rende muito sem risco.",
      icon: "⚖️",
      lessons: stub("risco-x-retorno", [
        "Por que risco e retorno andam juntos",
        "Tipos de risco (mercado, crédito, liquidez)",
        "Medindo o risco de um investimento",
        "Tolerância x capacidade de assumir risco",
        "Construindo uma carteira com o risco certo pra você",
      ]),
    },
    {
      id: "diversificacao-avancada",
      title: "Diversificação",
      description: "Diversificação em nível de carteira: correlação entre ativos, não só quantidade.",
      icon: "🧺",
      lessons: stub("diversificacao-avancada", [
        "Diversificação além do óbvio: correlação entre ativos",
        "Diversificação geográfica (Brasil x exterior)",
        "Diversificação por setor e por moeda",
        "Quando ativos 'diferentes' se movem juntos",
        "Avaliando a diversificação real da sua carteira",
      ]),
    },
    {
      id: "liquidez",
      title: "Liquidez",
      description: "A velocidade (e o custo) de transformar um investimento em dinheiro na mão.",
      icon: "💧",
      lessons: stub("liquidez", [
        "O que é liquidez, na prática",
        "Liquidez diária x com carência x sem liquidez",
        "O preço de abrir mão de liquidez (prêmio de iliquidez)",
        "Equilibrando liquidez e rentabilidade na carteira",
        "Liquidez e o planejamento de curto, médio e longo prazo",
      ]),
    },
    {
      id: "rentabilidade-real",
      title: "Rentabilidade real",
      description: "O retorno que realmente importa: depois de descontar a inflação.",
      icon: "🧾",
      lessons: stub("rentabilidade-real", [
        "Rentabilidade nominal x rentabilidade real",
        "Calculando a rentabilidade real de um investimento",
        "Por que comparar investimentos só pelo nominal engana",
        "Rentabilidade real ao longo de vários anos",
        "Avaliando seus próprios investimentos pela rentabilidade real",
      ]),
    },
    {
      id: "juros-reais",
      title: "Juros reais",
      description: "A taxa de juros que sobra depois de descontar a inflação do período.",
      icon: "📐",
      lessons: stub("juros-reais", [
        "O que são juros reais",
        "Juros reais x Selic x IPCA",
        "Por que juros reais orientam decisões de investimento",
        "Juros reais historicamente no Brasil",
        "Usando juros reais para planejar objetivos de longo prazo",
      ]),
    },
    {
      id: "rebalanceamento-de-carteira",
      title: "Rebalanceamento de carteira",
      description: "Manter a carteira alinhada ao plano original, mesmo com o tempo mudando os pesos.",
      icon: "🔄",
      lessons: stub("rebalanceamento-de-carteira", [
        "Por que a carteira 'desalinha' sozinha com o tempo",
        "Rebalanceamento por tempo x por desvio de meta",
        "Rebalanceando com aportes novos (sem vender nada)",
        "Custos e impostos ao rebalancear vendendo posições",
        "Criando sua rotina de rebalanceamento",
      ]),
    },
  ],
};
