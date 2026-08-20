import type { Trail } from "../types";

const trailId = "credito-e-dividas";
const lid = (courseId: string, n: number) => `${trailId}.${courseId}.aula-${n}`;
const stub = (courseId: string, titles: string[]) =>
  titles.map((title, i) => ({ id: lid(courseId, i + 1), title }));

export const creditoEDividasTrail: Trail = {
  id: trailId,
  title: "Crédito e dívidas",
  description: "Entender crédito, score e como sair (e ficar fora) do vermelho.",
  color: "red",
  courses: [
    {
      id: "como-funciona-o-cartao-de-credito",
      title: "Como funciona o cartão de crédito",
      description: "A ferramenta financeira mais usada — e mais mal compreendida — do país.",
      icon: "💳",
      lessons: stub("como-funciona-o-cartao-de-credito", [
        "Como o cartão de crédito funciona por dentro",
        "Fatura, limite e data de fechamento",
        "Os juros do rotativo (e por que evitá-los a todo custo)",
        "Parcelamento: quando faz sentido e quando não faz",
        "Usando o cartão a seu favor, não contra você",
      ]),
    },
    {
      id: "score-de-credito",
      title: "Score de crédito",
      description: "O que é, como é calculado e como melhorar o seu.",
      icon: "📶",
      lessons: stub("score-de-credito", [
        "O que é o score de crédito",
        "Quais fatores influenciam o score",
        "Mitos comuns sobre o score de crédito",
        "Estratégias para melhorar seu score",
        "Consultando e monitorando seu score",
      ]),
    },
    {
      id: "como-sair-das-dividas",
      title: "Como sair das dívidas",
      description: "Um plano prático para sair do vermelho sem desespero.",
      icon: "🪜",
      lessons: stub("como-sair-das-dividas", [
        "Mapeando o tamanho real do problema",
        "Método bola de neve x método avalanche",
        "Cortando gastos temporariamente para acelerar a saída",
        "Buscando renda extra durante o processo",
        "Mantendo-se fora das dívidas depois de sair",
      ]),
    },
    {
      id: "renegociacao-de-dividas",
      title: "Renegociação de dívidas",
      description: "Como negociar com credores de forma informada e vantajosa.",
      icon: "🤝",
      lessons: stub("renegociacao-de-dividas", [
        "Por que credores aceitam renegociar",
        "Preparando-se antes de ligar para negociar",
        "Programas e mutirões de renegociação",
        "Avaliando se vale a pena aceitar uma proposta",
        "Colocando o acordo por escrito e cumprindo",
      ]),
    },
    {
      id: "emprestimos-e-financiamentos",
      title: "Empréstimos e financiamentos",
      description: "Quando pedir dinheiro emprestado faz sentido — e quando é armadilha.",
      icon: "🏗️",
      lessons: stub("emprestimos-e-financiamentos", [
        "Empréstimo x financiamento: qual a diferença",
        "CET: o custo real de um empréstimo",
        "Financiamento de imóvel e de veículo",
        "Consignado: vantagens e cuidados",
        "Quando pedir emprestado é uma decisão racional",
      ]),
    },
  ],
};
