import type { Trail } from "../types";

const trailId = "investimentos";
const lid = (courseId: string, n: number) => `${trailId}.${courseId}.aula-${n}`;
const stub = (courseId: string, titles: string[]) =>
  titles.map((title, i) => ({ id: lid(courseId, i + 1), title }));

export const investimentosTrail: Trail = {
  id: trailId,
  title: "Investimentos",
  description: "De inflação e juros compostos até renda fixa, fundos, ações e FIIs — o essencial para começar a investir.",
  color: "amber",
  courses: [
    {
      id: "inflacao",
      title: "Inflação",
      description: "Por que guardar dinheiro parado também tem um custo.",
      icon: "📈",
      lessons: stub("inflacao", [
        "O que é inflação e como ela é medida",
        "IPCA e outros índices de inflação no Brasil",
        "Rendimento nominal x rendimento real",
        "Como a inflação corrói o dinheiro parado",
        "Protegendo seu dinheiro da inflação",
      ]),
    },
    {
      id: "juros-compostos",
      title: "Juros compostos",
      description: "O efeito que faz o dinheiro crescer cada vez mais rápido — a seu favor ou contra você.",
      icon: "🧮",
      lessons: stub("juros-compostos", [
        "Juros simples x juros compostos",
        "A fórmula dos juros compostos na prática",
        "O efeito do tempo: por que começar cedo importa tanto",
        "Juros compostos contra você: o perigo das dívidas",
        "Simulando seus próprios investimentos",
      ]),
    },
    {
      id: "renda-fixa",
      title: "Renda fixa",
      description: "Onde as regras de rentabilidade já são conhecidas (ou previsíveis) desde o início.",
      icon: "🏦",
      lessons: stub("renda-fixa", [
        "O que é renda fixa",
        "Prefixado, pós-fixado e híbrido",
        "Risco de crédito e risco de mercado",
        "Principais produtos de renda fixa no Brasil",
        "Escolhendo entre as opções de renda fixa",
      ]),
    },
    {
      id: "tesouro-direto",
      title: "Tesouro Direto",
      description: "Investir em títulos públicos do governo federal.",
      icon: "🏛️",
      lessons: stub("tesouro-direto", [
        "O que é o Tesouro Direto",
        "Tesouro Selic, Prefixado e IPCA+",
        "Como comprar e vender títulos",
        "Taxas e tributação do Tesouro Direto",
        "Escolhendo o título certo para cada objetivo",
      ]),
    },
    {
      id: "cdb",
      title: "CDB",
      description: "Certificado de Depósito Bancário: emprestando dinheiro para um banco.",
      icon: "🧾",
      lessons: stub("cdb", [
        "O que é um CDB",
        "CDB de liquidez diária x com vencimento",
        "O papel do FGC na segurança do CDB",
        "Comparando CDBs de diferentes bancos",
        "Quando um CDB faz sentido pra você",
      ]),
    },
    {
      id: "fundos-de-investimento",
      title: "Fundos de investimento",
      description: "Investir através de um gestor profissional, junto com outros investidores.",
      icon: "🗂️",
      lessons: stub("fundos-de-investimento", [
        "O que é um fundo de investimento",
        "Tipos de fundos (renda fixa, multimercado, ações)",
        "Taxa de administração e taxa de performance",
        "Como avaliar a rentabilidade de um fundo",
        "Fundos x investir diretamente",
      ]),
    },
    {
      id: "acoes",
      title: "Ações",
      description: "Tornar-se sócio de empresas através da bolsa de valores.",
      icon: "📊",
      lessons: stub("acoes", [
        "O que é uma ação",
        "Como funciona a bolsa de valores (B3)",
        "Análise fundamentalista x análise técnica (visão geral)",
        "Dividendos e outros proventos",
        "Riscos e volatilidade do mercado de ações",
      ]),
    },
    {
      id: "fiis",
      title: "FIIs",
      description: "Fundos de Investimento Imobiliário: investir em imóveis sem comprar um imóvel inteiro.",
      icon: "🏢",
      lessons: stub("fiis", [
        "O que é um FII",
        "Tipos de FII (tijolo, papel, híbrido)",
        "Como funcionam os rendimentos mensais",
        "Avaliando um FII antes de investir",
        "Riscos específicos de FIIs",
      ]),
    },
    {
      id: "diversificacao-de-investimentos",
      title: "Diversificação",
      description: "Não colocar todos os ovos na mesma cesta — a primeira camada de proteção do investidor.",
      icon: "🧺",
      lessons: stub("diversificacao-de-investimentos", [
        "Por que diversificar reduz risco",
        "Diversificando entre classes de ativos",
        "Diversificando dentro de uma mesma classe",
        "Diversificação excessiva: existe demais?",
        "Montando sua primeira carteira diversificada",
      ]),
    },
    {
      id: "abrindo-conta-em-corretora",
      title: "Como abrir conta em uma corretora",
      description: "O passo prático antes de fazer seu primeiro investimento.",
      icon: "🖥️",
      lessons: stub("abrindo-conta-em-corretora", [
        "Corretora x banco: qual a diferença",
        "O que avaliar ao escolher uma corretora",
        "Passo a passo para abrir a conta",
        "Transferindo dinheiro para investir (TED/PIX)",
        "Fazendo seu primeiro investimento",
      ]),
    },
  ],
};
