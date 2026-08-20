import type { Trail } from "../types";

const trailId = "organizacao-financeira";
const lid = (courseId: string, n: number) => `${trailId}.${courseId}.aula-${n}`;
const stub = (courseId: string, titles: string[]) =>
  titles.map((title, i) => ({ id: lid(courseId, i + 1), title }));

export const organizacaoFinanceiraTrail: Trail = {
  id: trailId,
  title: "Organização financeira",
  description: "Metas, planejamento mensal e o método 50/30/20 para colocar o orçamento em prática de verdade.",
  color: "blue",
  courses: [
    {
      id: "metas-financeiras",
      title: "Metas financeiras",
      description: "Como definir metas que realmente saem do papel, com valor e prazo.",
      icon: "🎯",
      lessons: stub("metas-financeiras", [
        "O que faz uma meta financeira funcionar",
        "Definindo valor e prazo",
        "Metas de curto, médio e longo prazo",
        "Priorizando entre várias metas",
        "Acompanhando o progresso até o fim",
      ]),
    },
    {
      id: "planejamento-mensal",
      title: "Planejamento mensal",
      description: "O ritual mensal que conecta orçamento, metas e reserva em uma rotina.",
      icon: "🗓️",
      lessons: stub("planejamento-mensal", [
        "Por que planejar mês a mês",
        "Montando o planejamento do próximo mês",
        "Lidando com meses atípicos (13º, IPVA, férias)",
        "Ajustando o planejamento ao longo do mês",
        "Fechando o mês e preparando o próximo",
      ]),
    },
    {
      id: "metodo-50-30-20",
      title: "Método 50/30/20",
      description: "Um mergulho mais profundo na regra de divisão de renda mais usada do mundo.",
      icon: "📊",
      lessons: stub("metodo-50-30-20", [
        "De onde vem o método 50/30/20",
        "Adaptando as proporções à sua realidade",
        "O que entra em cada uma das três fatias",
        "Quando o método não se encaixa (e o que fazer)",
        "Colocando o método em prática por 3 meses",
      ]),
    },
    {
      id: "controle-de-dividas",
      title: "Controle de dívidas",
      description: "Mapear, priorizar e sair de dívidas sem entrar em pânico.",
      icon: "📉",
      lessons: stub("controle-de-dividas", [
        "Mapeando todas as suas dívidas",
        "Dívida boa x dívida ruim",
        "Priorizando qual dívida pagar primeiro",
        "Renegociando com credores",
        "Evitando cair em dívida de novo",
      ]),
    },
    {
      id: "organizacao-financeira-na-pratica",
      title: "Organização financeira",
      description: "Juntando orçamento, metas, reserva e controle de dívidas em uma rotina só.",
      icon: "🧩",
      lessons: stub("organizacao-financeira-na-pratica", [
        "Juntando todas as peças do quebra-cabeça",
        "Criando sua rotina financeira pessoal",
        "Organizando documentos e senhas financeiras",
        "Envolvendo a família/parceiro(a) nas finanças",
        "Mantendo o sistema funcionando no longo prazo",
      ]),
    },
    {
      id: "automatizando-suas-financas",
      title: "Automatizando suas finanças",
      description: "Fazer o sistema trabalhar por você, com o mínimo de esforço manual recorrente.",
      icon: "⚙️",
      lessons: stub("automatizando-suas-financas", [
        "Por que automatizar reduz erros e esquecimentos",
        "Automatizando contas fixas e assinaturas",
        "Automatizando aportes para reserva e metas",
        "Alertas e lembretes financeiros",
        "Revisando as automações periodicamente",
      ]),
    },
  ],
};
