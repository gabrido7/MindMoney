/**
 * XP por tipo de evento. O valor nunca vem do cliente -- só o "reason"
 * (validado contra este catálogo) e um "reference_id" de deduplicação;
 * o valor em XP é sempre decidido aqui, no servidor.
 */
export const XP_AMOUNTS = {
  lesson_completed: 20,
  quiz_completed: 15,
  course_completed: 50,
  trail_completed: 200,
  goal_achieved: 100,
  debt_paid_off: 80, // quitar uma dívida de verdade -- peso parecido com bater uma meta
  streak_bonus: 0, // varia por marco, ver STREAK_MILESTONES
  achievement: 25, // bônus fixo por conquista desbloqueada, além do XP do evento que a disparou
} as const;

export type XpReason = keyof typeof XP_AMOUNTS;

/** Dias seguidos de estudo (pelo menos 1 aula concluída no dia) que rendem um bônus extra de XP. */
export const STREAK_MILESTONES: { days: number; xp: number }[] = [
  { days: 3, xp: 30 },
  { days: 7, xp: 70 },
  { days: 14, xp: 150 },
  { days: 30, xp: 300 },
];

/**
 * IDs das aulas de cada curso que hoje tem conteúdo completo (espelha
 * src/features/education/data/*.ts no frontend). Usado só para detectar
 * "curso/trilha 100% concluída" e liberar o bônus de XP e as conquistas
 * correspondentes -- se novo conteúdo for escrito, esses conjuntos
 * precisam ser atualizados junto.
 */
const courseLessonIds = (trailId: string, courseId: string, lessonCount: number): string[] =>
  Array.from({ length: lessonCount }, (_, i) => `${trailId}.${courseId}.aula-${i + 1}`);

const FUNDAMENTOS_COURSE_IDS = [
  "o-que-e-dinheiro",
  "receitas-e-despesas",
  "como-montar-um-orcamento",
  "controle-de-gastos",
  "reserva-emergencia",
];

const ORGANIZACAO_FINANCEIRA_COURSE_IDS = [
  "metas-financeiras",
  "planejamento-mensal",
  "metodo-50-30-20",
  "controle-de-dividas",
  "organizacao-financeira-na-pratica",
  "automatizando-suas-financas",
];

const INVESTIMENTOS_COURSE_IDS = [
  "inflacao",
  "juros-compostos",
  "renda-fixa",
  "tesouro-direto",
  "cdb",
  "fundos-de-investimento",
  "acoes",
  "fiis",
  "diversificacao-de-investimentos",
  "abrindo-conta-em-corretora",
];

const FINANCAS_AVANCADAS_COURSE_IDS = [
  "alocacao-de-ativos",
  "risco-x-retorno",
  "diversificacao-avancada",
  "liquidez",
  "rentabilidade-real",
  "juros-reais",
  "rebalanceamento-de-carteira",
];

const CREDITO_E_DIVIDAS_COURSE_IDS = [
  "como-funciona-o-cartao-de-credito",
  "score-de-credito",
  "como-sair-das-dividas",
  "renegociacao-de-dividas",
  "emprestimos-e-financiamentos",
];

const APOSENTADORIA_COURSE_IDS = [
  "inss-e-aposentadoria-publica",
  "previdencia-privada",
  "independencia-financeira",
  "planejando-a-aposentadoria",
  "sucessao-e-planejamento-patrimonial",
];

export const COURSE_LESSON_SETS: Record<string, string[]> = {
  ...Object.fromEntries(
    FUNDAMENTOS_COURSE_IDS.map((c) => [`fundamentos.${c}`, courseLessonIds("fundamentos", c, 5)])
  ),
  ...Object.fromEntries(
    ORGANIZACAO_FINANCEIRA_COURSE_IDS.map((c) => [
      `organizacao-financeira.${c}`,
      courseLessonIds("organizacao-financeira", c, 5),
    ])
  ),
  ...Object.fromEntries(
    INVESTIMENTOS_COURSE_IDS.map((c) => [`investimentos.${c}`, courseLessonIds("investimentos", c, 5)])
  ),
  ...Object.fromEntries(
    FINANCAS_AVANCADAS_COURSE_IDS.map((c) => [
      `financas-avancadas.${c}`,
      courseLessonIds("financas-avancadas", c, 5),
    ])
  ),
  ...Object.fromEntries(
    CREDITO_E_DIVIDAS_COURSE_IDS.map((c) => [
      `credito-e-dividas.${c}`,
      courseLessonIds("credito-e-dividas", c, 5),
    ])
  ),
  ...Object.fromEntries(
    APOSENTADORIA_COURSE_IDS.map((c) => [
      `aposentadoria-e-independencia.${c}`,
      courseLessonIds("aposentadoria-e-independencia", c, 5),
    ])
  ),
};

export const TRAIL_LESSON_SETS: Record<string, string[]> = {
  fundamentos: FUNDAMENTOS_COURSE_IDS.flatMap((c) => courseLessonIds("fundamentos", c, 5)),
  "organizacao-financeira": ORGANIZACAO_FINANCEIRA_COURSE_IDS.flatMap((c) =>
    courseLessonIds("organizacao-financeira", c, 5)
  ),
  investimentos: INVESTIMENTOS_COURSE_IDS.flatMap((c) => courseLessonIds("investimentos", c, 5)),
  "financas-avancadas": FINANCAS_AVANCADAS_COURSE_IDS.flatMap((c) => courseLessonIds("financas-avancadas", c, 5)),
  "credito-e-dividas": CREDITO_E_DIVIDAS_COURSE_IDS.flatMap((c) => courseLessonIds("credito-e-dividas", c, 5)),
  "aposentadoria-e-independencia": APOSENTADORIA_COURSE_IDS.flatMap((c) =>
    courseLessonIds("aposentadoria-e-independencia", c, 5)
  ),
};

export interface Achievement {
  id: string;
  title: string;
  emoji: string;
  description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "primeira-aula", title: "Primeira aula", emoji: "🏆", description: "Complete sua primeira aula." },
  { id: "primeiro-quiz", title: "Primeiro quiz", emoji: "🧠", description: "Responda seu primeiro quiz." },
  { id: "cinco-aulas", title: "5 aulas concluídas", emoji: "📚", description: "Complete 5 aulas, em qualquer trilha." },
  { id: "vinte-aulas", title: "20 aulas concluídas", emoji: "📖", description: "Complete 20 aulas, em qualquer trilha." },
  {
    id: "mestre-orcamento",
    title: "Mestre do orçamento",
    emoji: "💰",
    description: 'Complete todas as aulas do curso "Como montar um orçamento".',
  },
  {
    id: "trilha-fundamentos",
    title: "Trilha Fundamentos completa",
    emoji: "🌱",
    description: "Complete todas as aulas da trilha Fundamentos.",
  },
  {
    id: "trilha-organizacao",
    title: "Trilha Organização financeira completa",
    emoji: "📘",
    description: "Complete todas as aulas da trilha Organização financeira.",
  },
  { id: "primeira-meta", title: "Primeira meta atingida", emoji: "🎯", description: "Atinja sua primeira meta financeira." },
  {
    id: "investidor-consciente",
    title: "Investidor consciente",
    emoji: "📈",
    description: "Complete a primeira aula da trilha de Investimentos.",
  },
  {
    id: "trilha-investimentos",
    title: "Trilha Investimentos completa",
    emoji: "💹",
    description: "Complete todas as aulas da trilha Investimentos.",
  },
  {
    id: "trilha-financas-avancadas",
    title: "Trilha Finanças avançadas completa",
    emoji: "🧭",
    description: "Complete todas as aulas da trilha Finanças avançadas.",
  },
  {
    id: "trilha-credito-e-dividas",
    title: "Trilha Crédito e dívidas completa",
    emoji: "🪜",
    description: "Complete todas as aulas da trilha Crédito e dívidas.",
  },
  {
    id: "trilha-aposentadoria",
    title: "Trilha Aposentadoria e independência financeira completa",
    emoji: "🕊️",
    description: "Complete todas as aulas da trilha Aposentadoria e independência financeira.",
  },
  { id: "sequencia-3-dias", title: "Sequência de 3 dias", emoji: "🔥", description: "Estude 3 dias seguidos." },
  {
    id: "primeira-divida-quitada",
    title: "Primeira dívida quitada",
    emoji: "🎉",
    description: "Quite uma dívida por completo.",
  },
  {
    id: "patrimonio-no-azul",
    title: "Patrimônio no azul",
    emoji: "💎",
    description: "Faça seu patrimônio líquido (ativos menos dívidas) ficar positivo.",
  },
];

/**
 * XP necessário para completar cada nível (não cumulativo do zero -- é
 * "quanto esse nível específico exige"). Cresce de forma linear e
 * moderada: nível 1 pede 100 XP, nível 2 pede 150, e assim por diante.
 */
export const xpForLevel = (level: number): number => 100 + (level - 1) * 50;

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  totalXp: number;
}

export function levelInfo(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level += 1;
  }
  return { level, xpIntoLevel: remaining, xpForNextLevel: xpForLevel(level), totalXp };
}
