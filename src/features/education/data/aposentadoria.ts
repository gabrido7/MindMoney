import type { Trail } from "../types";

const trailId = "aposentadoria-e-independencia";
const lid = (courseId: string, n: number) => `${trailId}.${courseId}.aula-${n}`;
const stub = (courseId: string, titles: string[]) =>
  titles.map((title, i) => ({ id: lid(courseId, i + 1), title }));

export const aposentadoriaTrail: Trail = {
  id: trailId,
  title: "Aposentadoria e independência financeira",
  description: "Planejar o longo prazo de verdade: previdência, independência financeira e sucessão.",
  color: "orange",
  courses: [
    {
      id: "inss-e-aposentadoria-publica",
      title: "INSS e aposentadoria pública",
      description: "Como funciona a aposentadoria pelo INSS no Brasil.",
      icon: "🏛️",
      lessons: stub("inss-e-aposentadoria-publica", [
        "Como funciona o INSS",
        "Regras de aposentadoria após a reforma da previdência",
        "Calculando sua expectativa de benefício",
        "Contribuição como autônomo/MEI",
        "Por que só o INSS raramente é suficiente",
      ]),
    },
    {
      id: "previdencia-privada",
      title: "Previdência privada",
      description: "PGBL x VGBL e quando cada um faz sentido.",
      icon: "📋",
      lessons: stub("previdencia-privada", [
        "O que é previdência privada",
        "PGBL x VGBL: as diferenças que importam",
        "Tabela regressiva x progressiva de tributação",
        "Taxas de administração e de carregamento",
        "Previdência privada faz sentido pra você?",
      ]),
    },
    {
      id: "independencia-financeira",
      title: "Independência financeira e a regra dos 4%",
      description: "Viver de renda: o que isso realmente significa e exige.",
      icon: "🕊️",
      lessons: stub("independencia-financeira", [
        "O que é independência financeira",
        "A regra dos 4% (e suas limitações)",
        "Calculando seu 'número' de independência financeira",
        "Estratégias para acelerar o caminho",
        "Vivendo de renda: ajustando o plano na prática",
      ]),
    },
    {
      id: "planejando-a-aposentadoria",
      title: "Planejando a aposentadoria por conta própria",
      description: "Montar seu próprio plano, sem depender só do INSS ou de terceiros.",
      icon: "🗺️",
      lessons: stub("planejando-a-aposentadoria", [
        "Definindo a renda desejada na aposentadoria",
        "Quanto investir mensalmente para chegar lá",
        "Combinando INSS, previdência privada e investimentos próprios",
        "Ajustando o plano ao longo das décadas",
        "Erros comuns no planejamento de aposentadoria",
      ]),
    },
    {
      id: "sucessao-e-planejamento-patrimonial",
      title: "Sucessão e planejamento patrimonial básico",
      description: "Proteger e organizar o patrimônio pensando também em quem vem depois.",
      icon: "📜",
      lessons: stub("sucessao-e-planejamento-patrimonial", [
        "Por que planejamento sucessório importa, não só para ricos",
        "Testamento, herança e inventário: noções básicas",
        "Seguro de vida como ferramenta de proteção",
        "Doação em vida x herança",
        "Organizando informações financeiras para a família",
      ]),
    },
  ],
};
