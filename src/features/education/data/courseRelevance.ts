import type { FinancialPriority, FinancialSituation } from "../../../types/api";

/**
 * Metadado de roteamento, não conteúdo -- diz pra quem cada um dos 38 cursos
 * já existentes é relevante, reaproveitando os mesmos enums do perfil
 * financeiro (nenhum vocabulário novo). Usado só por buildStrategicPlan
 * (strategicPlan.ts) pra pontuar o plano individual; não afeta em nada a
 * navegação solta das trilhas, que continua igual.
 */
export interface CourseRelevance {
  priorities?: FinancialPriority[];
  situations?: FinancialSituation[];
  /** Curso-base de "fundamentos" -- sempre vale a pena pra quem está começando, mesmo sem nenhum outro sinal bater. */
  foundational?: boolean;
}

export const COURSE_RELEVANCE: Record<string, CourseRelevance> = {
  // fundamentos
  "o-que-e-dinheiro": { foundational: true },
  "receitas-e-despesas": { foundational: true },
  "como-montar-um-orcamento": { foundational: true, priorities: ["organizar_financas", "controlar_gastos"] },
  "controle-de-gastos": { foundational: true, priorities: ["controlar_gastos"] },
  "reserva-emergencia": { foundational: true, priorities: ["reserva_emergencia"] },

  // organizacao-financeira
  "metas-financeiras": { priorities: ["alcancar_objetivos", "organizar_financas"] },
  "planejamento-mensal": { priorities: ["organizar_financas", "controlar_gastos"] },
  "metodo-50-30-20": { priorities: ["organizar_financas", "controlar_gastos"] },
  "controle-de-dividas": { priorities: ["quitar_dividas"], situations: ["endividado", "vivo_no_limite"] },
  "organizacao-financeira-na-pratica": { priorities: ["organizar_financas"] },
  "automatizando-suas-financas": { priorities: ["organizar_financas"] },

  // investimentos
  inflacao: { priorities: ["investir", "construir_patrimonio"] },
  "juros-compostos": { priorities: ["investir", "construir_patrimonio"] },
  "renda-fixa": { priorities: ["investir"] },
  "tesouro-direto": { priorities: ["investir"] },
  cdb: { priorities: ["investir"] },
  "fundos-de-investimento": { priorities: ["investir"] },
  acoes: { priorities: ["investir", "construir_patrimonio"] },
  fiis: { priorities: ["investir", "construir_patrimonio"] },
  "diversificacao-de-investimentos": { priorities: ["investir", "construir_patrimonio"] },
  "abrindo-conta-em-corretora": { priorities: ["investir"] },

  // financas-avancadas
  "alocacao-de-ativos": { priorities: ["construir_patrimonio", "investir"] },
  "risco-x-retorno": { priorities: ["investir", "construir_patrimonio"] },
  "diversificacao-avancada": { priorities: ["construir_patrimonio"] },
  liquidez: { priorities: ["construir_patrimonio"] },
  "rentabilidade-real": { priorities: ["construir_patrimonio", "investir"] },
  "juros-reais": { priorities: ["construir_patrimonio"] },
  "rebalanceamento-de-carteira": { priorities: ["construir_patrimonio"] },

  // credito-e-dividas
  "como-funciona-o-cartao-de-credito": {
    priorities: ["quitar_dividas"],
    situations: ["endividado", "vivo_no_limite"],
  },
  "score-de-credito": { priorities: ["quitar_dividas", "organizar_financas"] },
  "como-sair-das-dividas": { priorities: ["quitar_dividas"], situations: ["endividado", "vivo_no_limite"] },
  "renegociacao-de-dividas": { priorities: ["quitar_dividas"], situations: ["endividado", "vivo_no_limite"] },
  "emprestimos-e-financiamentos": { priorities: ["quitar_dividas"], situations: ["endividado", "vivo_no_limite"] },

  // aposentadoria-e-independencia
  "inss-e-aposentadoria-publica": { priorities: ["aposentadoria"] },
  "previdencia-privada": { priorities: ["aposentadoria", "construir_patrimonio"] },
  "independencia-financeira": { priorities: ["aposentadoria", "construir_patrimonio"] },
  "planejando-a-aposentadoria": { priorities: ["aposentadoria"] },
  "sucessao-e-planejamento-patrimonial": { priorities: ["aposentadoria", "construir_patrimonio"] },
};
