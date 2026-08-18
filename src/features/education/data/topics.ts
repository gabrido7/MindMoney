export type EducationLevel = "Iniciante" | "Intermediário" | "Avançado";

export interface EducationTopic {
  id: string;
  title: string;
  category: string;
  level: EducationLevel;
  summary: string;
  content: string[];
}

export const educationTopics: EducationTopic[] = [
  {
    id: "orcamento",
    title: "Como montar um orçamento",
    category: "Orçamento",
    level: "Iniciante",
    summary: "O ponto de partida de qualquer organização financeira: saber quanto entra e quanto sai.",
    content: [
      "Um orçamento é simplesmente um plano para o seu dinheiro: quanto entra, para onde vai, e quanto sobra. Sem ele, é comum perder o controle sem nem perceber onde o dinheiro foi.",
      "Um método simples e bastante usado é a regra 50-30-20: 50% da renda para necessidades essenciais (moradia, alimentação, transporte), 30% para desejos (lazer, compras), e 20% para poupança e quitação de dívidas. Não é uma regra rígida — o importante é ter alguma proporção definida e revisá-la com o tempo.",
      "O primeiro passo prático é registrar tudo que entra e sai por pelo menos um mês. Só depois de ver os números reais é que faz sentido ajustar categorias e definir limites — é exatamente para isso que servem as categorias e o filtro mensal do Mind Money.",
    ],
  },
  {
    id: "reserva-emergencia",
    title: "Reserva de emergência",
    category: "Reserva de Emergência",
    level: "Iniciante",
    summary: "A base de qualquer planejamento financeiro sólido, antes mesmo de pensar em investir.",
    content: [
      "A reserva de emergência é uma quantia guardada para cobrir imprevistos — perda de renda, um problema de saúde, um conserto urgente — sem precisar recorrer a dívidas caras como cartão de crédito ou cheque especial.",
      "Uma referência comum é guardar entre 3 e 6 meses do seu custo de vida mensal, podendo chegar a 12 meses para quem tem renda variável ou instável. O valor exato depende da sua realidade: estabilidade no emprego, dependentes, outras fontes de renda.",
      "O lugar certo para essa reserva não é o mesmo de um investimento de longo prazo: ela precisa ter liquidez imediata (poder ser resgatada a qualquer momento sem perda) e baixo risco, mesmo que o rendimento seja modesto. Segurança e disponibilidade vêm antes de rentabilidade aqui.",
    ],
  },
  {
    id: "controle-gastos",
    title: "Controle de gastos no dia a dia",
    category: "Controle de Gastos",
    level: "Iniciante",
    summary: "Pequenos hábitos de registro e revisão que fazem a maior diferença no longo prazo.",
    content: [
      "Controlar gastos não é sobre nunca gastar — é sobre gastar de forma consciente, sabendo o impacto de cada decisão no restante do mês. A maior parte dos problemas financeiros vem de gastos pequenos e recorrentes que passam despercebidos, não de uma única compra grande.",
      "Categorizar as despesas (moradia, alimentação, lazer, assinaturas...) ajuda a enxergar padrões que o extrato bruto esconde. Muita gente se surpreende ao ver quanto gasta por mês em delivery ou assinaturas quando finalmente soma tudo por categoria.",
      "Revisar o mês anterior antes de começar o próximo — comparando com o mês anterior, olhando o que mais cresceu — é um hábito simples que evita repetir os mesmos excessos. É exatamente esse o objetivo da comparação mensal e do ranking de gastos no Dashboard.",
    ],
  },
  {
    id: "planejamento-financeiro",
    title: "Planejamento financeiro pessoal",
    category: "Planejamento Financeiro",
    level: "Iniciante",
    summary: "Como conectar orçamento, reserva e metas em uma estratégia de longo prazo.",
    content: [
      "Planejamento financeiro é o processo de organizar suas finanças para alcançar objetivos específicos — não é só 'economizar mais', é decidir para onde esse dinheiro está indo e por quê.",
      "Uma ordem que costuma funcionar bem: primeiro organizar o orçamento e eliminar dívidas caras; depois construir a reserva de emergência; só então direcionar o que sobra para metas de médio prazo e investimentos de longo prazo.",
      "Esse processo não é linear nem definitivo — a vida muda, a renda muda, as prioridades mudam. Por isso o planejamento financeiro é revisado periodicamente, não feito uma única vez.",
    ],
  },
  {
    id: "juros",
    title: "Juros simples e juros compostos",
    category: "Juros",
    level: "Intermediário",
    summary: "A diferença entre os dois é a base para entender tanto dívidas quanto investimentos.",
    content: [
      "Juros simples são calculados sempre sobre o valor original (o principal), crescendo de forma linear. Já os juros compostos são calculados sobre o valor original mais os juros já acumulados — por isso o crescimento acelera com o tempo, o famoso 'juros sobre juros'.",
      "Na prática, quase todo produto financeiro do dia a dia — cartão de crédito, financiamentos, a maioria dos investimentos — usa juros compostos. Isso funciona a seu favor quando você está investindo (o dinheiro cresce cada vez mais rápido) e contra você quando está devendo (a dívida cresce cada vez mais rápido também).",
      "É por isso que dívida de cartão de crédito não paga é particularmente perigosa: os juros compostos sobre uma taxa alta fazem o saldo devedor crescer muito mais rápido do que a maioria das pessoas espera.",
    ],
  },
  {
    id: "metas-financeiras",
    title: "Como definir metas financeiras",
    category: "Metas",
    level: "Iniciante",
    summary: "Metas vagas raramente são alcançadas — metas específicas e mensuráveis funcionam melhor.",
    content: [
      "'Economizar mais' é uma intenção, não uma meta. Uma meta financeira funciona melhor quando tem um valor específico e um prazo definido: 'guardar R$ 6.000 em 12 meses' é algo que dá para acompanhar mês a mês e saber se está no caminho certo.",
      "Dividir a meta pelo número de meses do prazo dá o valor mensal necessário — e comparar esse valor com o que realmente sobra no orçamento mostra rapidamente se a meta é realista ou se precisa de ajuste (no valor, no prazo, ou nos dois).",
      "Acompanhar o progresso regularmente — não só no fim do prazo — é o que permite corrigir o rumo a tempo. Uma meta batida em 60% na metade do prazo é uma informação muito mais útil do que descobrir a mesma coisa no último mês.",
    ],
  },
  {
    id: "inflacao",
    title: "O que é inflação e por que ela importa",
    category: "Inflação",
    level: "Intermediário",
    summary: "Guardar dinheiro parado também tem um custo — a perda de poder de compra ao longo do tempo.",
    content: [
      "Inflação é o aumento geral dos preços ao longo do tempo, o que significa que a mesma quantia de dinheiro compra menos coisas no futuro do que compra hoje. No Brasil, o índice de referência mais comum é o IPCA.",
      "Isso tem uma consequência direta para quem guarda dinheiro: se a reserva ou o investimento rende menos que a inflação do período, o valor guardado está, na prática, perdendo poder de compra — mesmo que o número na conta esteja maior.",
      "Por isso, ao avaliar se um investimento 'vale a pena', a pergunta mais relevante é o rendimento real (rendimento menos inflação do período), não só o rendimento nominal anunciado.",
    ],
  },
  {
    id: "renda-fixa",
    title: "Investimentos de renda fixa",
    category: "Renda Fixa",
    level: "Intermediário",
    summary: "Onde as regras de rentabilidade já são conhecidas (ou previsíveis) no momento da aplicação.",
    content: [
      "Renda fixa é a categoria de investimentos em que a forma de rendimento é definida no momento da aplicação — prefixada (taxa fixa conhecida desde o início), pós-fixada (atrelada a um indicador, como o CDI) ou híbrida (uma parte fixa mais a inflação, por exemplo).",
      "Exemplos comuns no Brasil: Tesouro Direto (títulos públicos), CDBs, LCIs e LCAs. Em geral, é a categoria de menor risco entre os investimentos, mas 'menor risco' não é o mesmo que 'sem risco' — existe risco de crédito (o emissor não pagar) e risco de mercado (perda se vender antes do vencimento em condições desfavoráveis).",
      "Costuma ser o ponto de partida recomendado para quem está começando a investir, especialmente para objetivos de curto e médio prazo, onde previsibilidade importa mais do que potencial de retorno alto.",
    ],
  },
  {
    id: "renda-variavel",
    title: "Investimentos de renda variável",
    category: "Renda Variável",
    level: "Avançado",
    summary: "Maior potencial de retorno vem acompanhado de maior oscilação e risco.",
    content: [
      "Renda variável é a categoria em que o retorno não é conhecido nem previsível no momento da aplicação — ações, fundos imobiliários e criptomoedas são exemplos. O valor pode subir ou cair de forma significativa em curtos períodos.",
      "Historicamente, no longo prazo, a renda variável tende a oferecer retornos maiores que a renda fixa — mas isso não é garantido em nenhum período específico, e exige tolerância a ver o valor investido cair antes de eventualmente se recuperar.",
      "Por causa dessa oscilação, costuma ser mais indicada para objetivos de longo prazo (anos, não meses) e para a parte do dinheiro que não vai fazer falta se precisar ficar investida por mais tempo do que o planejado — nunca para a reserva de emergência.",
    ],
  },
  {
    id: "investimentos",
    title: "Primeiros passos em investimentos",
    category: "Investimentos",
    level: "Avançado",
    summary: "Diversificação e perfil de investidor são mais importantes do que 'achar o investimento certo'.",
    content: [
      "Antes de escolher onde investir, vale entender o próprio perfil de investidor (conservador, moderado ou arrojado) — o quanto de oscilação no valor investido você consegue tolerar sem tomar decisões precipitadas, como vender tudo numa queda.",
      "Diversificação — não colocar todo o dinheiro em um único investimento — reduz o impacto de qualquer decisão individual dar errado. Isso vale tanto entre classes diferentes (renda fixa e variável) quanto dentro de uma mesma classe.",
      "A ordem prática costuma ser: reserva de emergência primeiro, depois metas de curto/médio prazo em renda fixa, e só então uma parcela em renda variável para objetivos de longo prazo — sempre proporcional ao que você pode perder sem comprometer o resto do planejamento.",
    ],
  },
];

export const educationCategories = Array.from(new Set(educationTopics.map((t) => t.category)));
