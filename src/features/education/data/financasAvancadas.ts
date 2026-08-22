import type { Trail } from "../types";

const trailId = "financas-avancadas";
const lid = (courseId: string, n: number) => `${trailId}.${courseId}.aula-${n}`;

export const financasAvancadasTrail: Trail = {
  id: trailId,
  title: "Finanças avançadas",
  description: "Alocação de ativos, risco x retorno e os conceitos que diferenciam um investidor iniciante de um mais maduro.",
  color: "purple",
  courses: [
    // ---------------------------------------------------------------
    // Curso 1 — Alocação de ativos
    // ---------------------------------------------------------------
    {
      id: "alocacao-de-ativos",
      title: "Alocação de ativos",
      description: "Como distribuir seu patrimônio entre diferentes tipos de investimento.",
      icon: "🧭",
      lessons: [
        {
          id: lid("alocacao-de-ativos", 1),
          title: "O que é alocação de ativos",
          content: {
            explanation: [
              "Alocação de ativos é a decisão de quanto do seu patrimônio vai para cada classe de investimento — renda fixa, ações, fundos imobiliários, investimentos no exterior — antes mesmo de escolher qual ativo específico comprar dentro de cada uma.",
              "Estudos clássicos de finanças mostram que a maior parte da variação de retorno entre carteiras ao longo do tempo vem da alocação entre classes, não da seleção de ativos individuais dentro de cada classe — ou seja, decidir \"quanto em renda fixa x quanto em ações\" pesa mais que escolher qual ação específica comprar.",
              "Não existe uma alocação \"certa\" universal: a alocação ideal depende do seu prazo, do seu objetivo e da sua tolerância a oscilações, e por isso é o primeiro passo do planejamento de investimentos, antes de qualquer escolha de produto.",
            ],
            examples: [
              "Uma carteira com 80% em renda fixa e 20% em ações tende a oscilar menos, mas também a crescer mais devagar no longo prazo, que uma carteira com os percentuais invertidos.",
              "Duas pessoas com o mesmo valor investido podem ter resultados bem diferentes em 10 anos só por causa da alocação escolhida no início, mesmo comprando produtos parecidos dentro de cada classe.",
            ],
            diagram: {
              type: "bars",
              caption: "Exemplo de alocação para um investidor mais conservador.",
              bars: [
                { label: "Renda fixa", value: 70, suffix: "%" },
                { label: "Fundos imobiliários", value: 15, suffix: "%" },
                { label: "Ações", value: 15, suffix: "%" },
              ],
            },
            keyConcepts: [
              "Alocação de ativos: quanto do patrimônio vai para cada classe de investimento.",
              "A alocação entre classes pesa mais no retorno de longo prazo do que a escolha de ativos individuais.",
              "Não existe alocação universalmente certa — depende do prazo, objetivo e tolerância a risco de cada pessoa.",
            ],
            quiz: [
              {
                question: "O que mais impacta o retorno de uma carteira no longo prazo, segundo estudos de finanças?",
                options: [
                  "A escolha da corretora usada",
                  "A alocação entre classes de ativos (renda fixa, ações, etc.)",
                  "O horário em que as ordens de compra são feitas",
                  "A cor do aplicativo do banco",
                ],
                correctIndex: 1,
                explanation: "A decisão de quanto colocar em cada classe de ativo explica a maior parte da diferença de retorno entre carteiras ao longo do tempo.",
              },
            ],
            exercise: {
              prompt: "Liste os investimentos que você já possui hoje (ou pretende ter) e estime o percentual de cada classe (renda fixa, ações, fundos imobiliários, outros) no total.",
              placeholder: "Renda fixa: ...%\nAções: ...%\nFundos imobiliários: ...%\nOutros: ...%",
            },
          },
        },
        {
          id: lid("alocacao-de-ativos", 2),
          title: "Perfil de investidor: conservador, moderado, arrojado",
          content: {
            explanation: [
              "O perfil de investidor descreve o quanto de oscilação e risco uma pessoa está disposta (e preparada) a assumir em troca de um retorno potencialmente maior. Os três perfis mais comuns são conservador, moderado e arrojado.",
              "No Brasil, corretoras e bancos são obrigados pela CVM a aplicar um questionário de suitability (adequação) antes de oferecer certos produtos, justamente para verificar se o investimento é compatível com o perfil declarado do cliente.",
              "O perfil não é fixo: ele pode (e costuma) mudar com a idade, com o aumento do conhecimento sobre investimentos, com mudanças de renda ou com a proximidade de um objetivo importante.",
            ],
            examples: [
              "Um investidor conservador tende a priorizar preservação de capital, aceitando retornos menores em troca de menos oscilação.",
              "Um investidor arrojado pode tolerar quedas temporárias relevantes na carteira em troca do potencial de retorno maior no longo prazo.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Conservador", items: ["Prioriza não perder dinheiro", "Baixa tolerância a oscilação", "Maior parte em renda fixa"] },
              right: { label: "Arrojado", items: ["Prioriza potencial de retorno", "Tolera quedas temporárias", "Maior parte em renda variável"] },
            },
            keyConcepts: [
              "Perfil de investidor: o quanto de risco/oscilação a pessoa aceita assumir.",
              "O questionário de suitability é obrigatório e serve pra checar se o produto é adequado ao perfil.",
              "O perfil muda ao longo da vida — não é uma etiqueta permanente.",
            ],
            quiz: [
              {
                question: "Qual é a função do questionário de suitability aplicado por corretoras?",
                options: [
                  "Definir o valor mínimo de investimento",
                  "Verificar se um produto é adequado ao perfil de risco declarado do investidor",
                  "Calcular o imposto de renda do investidor",
                  "Escolher automaticamente os melhores ativos",
                ],
                correctIndex: 1,
                explanation: "O suitability existe para evitar que um investidor conservador, por exemplo, seja exposto a produtos de risco muito acima do que ele tolera.",
              },
            ],
            exercise: {
              prompt: "Reflita: você se considera mais conservador, moderado ou arrojado hoje? O que te faria mudar de perfil nos próximos anos?",
              placeholder: "Meu perfil hoje: ...\nO que pode mudar isso: ...",
            },
          },
        },
        {
          id: lid("alocacao-de-ativos", 3),
          title: "Alocação por objetivo e por prazo",
          content: {
            explanation: [
              "Uma forma prática de alocar investimentos é separar por objetivo: cada meta financeira (reserva de emergência, viagem, aposentadoria) tem seu próprio prazo e sua própria tolerância a risco, e por isso pode ter uma alocação diferente das outras.",
              "Essa abordagem é conhecida como \"alocação por baldes\" (bucket approach): em vez de uma única carteira genérica, você organiza mentalmente (ou até fisicamente, em contas separadas) o dinheiro de cada objetivo.",
              "A regra geral é: quanto mais curto o prazo do objetivo, menor deve ser a tolerância a oscilação (mais liquidez e segurança); quanto mais longo o prazo, mais espaço existe para aceitar volatilidade em troca de potencial de retorno maior.",
            ],
            examples: [
              "Dinheiro para uma viagem em 6 meses deveria estar em algo de liquidez diária e baixo risco, como Tesouro Selic — não em ações, que podem estar em queda justamente na hora de usar o dinheiro.",
              "Dinheiro para a aposentadoria daqui a 25 anos pode tolerar mais oscilação de curto prazo, porque há tempo de sobra para recuperar eventuais quedas.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Liste seus objetivos financeiros e o prazo aproximado de cada um",
                "Para prazos curtos (até 2 anos): priorize liquidez e segurança",
                "Para prazos médios (2 a 5 anos): pode misturar renda fixa e uma parcela de renda variável",
                "Para prazos longos (5+ anos): há mais espaço para renda variável",
              ],
            },
            keyConcepts: [
              "Alocação por objetivo: cada meta financeira pode ter sua própria estratégia de investimento.",
              "Quanto mais curto o prazo, menor deve ser a tolerância a oscilação do dinheiro daquele objetivo.",
              "A mesma pessoa pode ter alocações bem diferentes para objetivos diferentes ao mesmo tempo.",
            ],
            quiz: [
              {
                question: "Por que dinheiro reservado para uma viagem em 6 meses geralmente não deveria estar em ações?",
                options: [
                  "Porque ações são proibidas por lei para esse fim",
                  "Porque o prazo curto não dá tempo de recuperar uma eventual queda antes de precisar usar o dinheiro",
                  "Porque ações não podem ser vendidas rapidamente",
                  "Porque ações só servem para aposentadoria",
                ],
                correctIndex: 1,
                explanation: "Com prazo curto, uma queda temporária pode coincidir exatamente com o momento em que você precisa resgatar o dinheiro, forçando uma venda no prejuízo.",
              },
            ],
            exercise: {
              prompt: "Liste 3 objetivos financeiros seus com prazos diferentes e pense em que tipo de investimento faria sentido para cada um.",
              placeholder: "Objetivo 1 (prazo): ... — investimento sugerido: ...\nObjetivo 2 (prazo): ... — investimento sugerido: ...\nObjetivo 3 (prazo): ... — investimento sugerido: ...",
            },
          },
        },
        {
          id: lid("alocacao-de-ativos", 4),
          title: "Rebalanceando a carteira ao longo do tempo",
          content: {
            explanation: [
              "Com o passar do tempo, os ativos que sobem mais viram uma fatia maior da carteira do que o planejado originalmente, e os que sobem menos (ou caem) viram uma fatia menor — a carteira \"desalinha\" sozinha dos percentuais-alvo definidos na alocação inicial.",
              "Rebalancear significa ajustar a carteira de volta aos percentuais planejados, seja vendendo parte do que subiu e comprando o que ficou para trás, seja direcionando os aportes novos para as classes que estão abaixo do peso-alvo.",
              "Esse é um conceito introdutório — a lógica completa de quando e como rebalancear, incluindo custos e impostos envolvidos, é aprofundada mais adiante nesta trilha.",
            ],
            examples: [
              "Uma carteira que começou com 70% renda fixa e 30% ações pode, depois de um bom ano para ações, virar 60% renda fixa e 40% ações — acima do risco originalmente planejado.",
              "Rebalancear essa carteira de volta para 70/30 reduz a exposição ao risco de volta ao nível planejado, mesmo sem prever o futuro do mercado.",
            ],
            keyConcepts: [
              "A carteira se desalinha da alocação-alvo sozinha, conforme os ativos têm desempenhos diferentes.",
              "Rebalancear é ajustar a carteira de volta aos percentuais planejados.",
              "É possível rebalancear vendendo posições ou apenas direcionando novos aportes.",
            ],
            quiz: [
              {
                question: "Por que uma carteira se desalinha da alocação-alvo com o tempo, mesmo sem o investidor fazer nada?",
                options: [
                  "Porque as corretoras alteram a carteira automaticamente",
                  "Porque ativos diferentes têm desempenhos diferentes, mudando o peso de cada um no total",
                  "Porque a inflação muda os percentuais",
                  "Isso não acontece na prática",
                ],
                correctIndex: 1,
                explanation: "Se uma classe sobe mais que outra, ela naturalmente passa a representar uma fatia maior da carteira, mesmo sem nenhuma movimentação do investidor.",
              },
            ],
            exercise: {
              prompt: "Se você tem investimentos há mais de um ano, compare a alocação atual com a que você pretendia ter originalmente. Ela ainda está alinhada?",
              placeholder: "Alocação planejada: ...\nAlocação atual estimada: ...\nDesalinhamento percebido: ...",
            },
          },
        },
        {
          id: lid("alocacao-de-ativos", 5),
          title: "Erros comuns de alocação",
          content: {
            explanation: [
              "Um dos erros mais comuns é a concentração excessiva: colocar a maior parte do patrimônio num único ativo ou classe, seja por conforto, seja por ter \"dado certo\" no passado — o que elimina o benefício da diversificação.",
              "Outro erro clássico é o viés de recência (recency bias): perseguir o que rendeu bem recentemente, presumindo que vai continuar rendendo, e abandonar classes que estão \"na moda\" de estarem em baixa — comprando caro e vendendo barato, o oposto do ideal.",
              "Também é comum não ter alocação nenhuma de propósito — apenas \"guardar dinheiro\" sem um plano de quanto vai para cada classe — e ignorar a liquidez necessária no curto prazo, deixando dinheiro que será usado em breve em investimentos pouco líquidos ou voláteis.",
            ],
            examples: [
              "Colocar 90% do patrimônio nas ações da empresa em que se trabalha é um erro comum de concentração — se a empresa vai mal, a pessoa perde o emprego e o investimento ao mesmo tempo.",
              "Migrar toda a carteira para uma classe que \"rendeu muito\" no último ano, sem considerar se esse desempenho é sustentável, é um exemplo clássico de recency bias.",
            ],
            keyConcepts: [
              "Concentração excessiva num único ativo elimina o benefício de diversificar.",
              "Recency bias: perseguir o que rendeu bem recentemente tende a levar a comprar caro.",
              "Ignorar a liquidez necessária no curto prazo é um erro tão comum quanto os de concentração.",
            ],
            quiz: [
              {
                question: "O que é o \"recency bias\" na hora de alocar investimentos?",
                options: [
                  "A tendência de sempre investir em ativos recém-lançados",
                  "A tendência de perseguir o que rendeu bem recentemente, presumindo que isso vai continuar",
                  "Um tipo de imposto sobre investimentos recentes",
                  "Um erro de cálculo em planilhas financeiras",
                ],
                correctIndex: 1,
                explanation: "O recency bias leva investidores a comprar depois de uma alta (caro) e vender depois de uma queda (barato), o oposto de uma boa estratégia.",
              },
            ],
            exercise: {
              prompt: "Pense em uma decisão de investimento (sua ou de alguém que você conhece) que pode ter sido influenciada por recency bias ou concentração excessiva. O que poderia ter sido diferente?",
              placeholder: "Situação: ...\nErro identificado: ...\nO que faria diferente: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 2 — Risco x retorno
    // ---------------------------------------------------------------
    {
      id: "risco-x-retorno",
      title: "Risco x retorno",
      description: "A relação fundamental que explica por que nada rende muito sem risco.",
      icon: "⚖️",
      lessons: [
        {
          id: lid("risco-x-retorno", 1),
          title: "Por que risco e retorno andam juntos",
          content: {
            explanation: [
              "Em mercados financeiros, ativos com potencial de retorno maior normalmente exigem que o investidor aceite mais risco — mais incerteza sobre o resultado final. Essa relação é chamada de prêmio de risco: o retorno extra que compensa quem aceita a incerteza.",
              "Se um investimento garantido rendesse tanto quanto um arriscado, ninguém racional escolheria o arriscado — por isso o mercado \"precifica\" o risco extra em forma de potencial de retorno extra.",
              "Isso não significa que todo ativo arriscado vai render mais: significa que, em média e no longo prazo, é assim que o mercado tende a se comportar — no curto prazo, o risco pode simplesmente se materializar como perda, sem nenhuma compensação.",
            ],
            examples: [
              "A poupança e o Tesouro Selic têm risco muito baixo e retorno correspondentemente modesto.",
              "Ações de empresas individuais têm risco bem maior (o preço pode cair 30% ou mais num ano ruim) e, em compensação, potencial de retorno maior no longo prazo.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Baixo risco", items: ["Retorno mais previsível", "Potencial de retorno menor", "Ex.: Tesouro Selic, CDB de banco grande"] },
              right: { label: "Alto risco", items: ["Retorno mais incerto", "Potencial de retorno maior", "Ex.: ações, fundos de small caps"] },
            },
            keyConcepts: [
              "Prêmio de risco: o retorno extra que compensa quem aceita mais incerteza.",
              "Risco maior não garante retorno maior — apenas aumenta o potencial (e a incerteza).",
              "A relação risco x retorno se aplica no longo prazo e em média, não em cada investimento isolado.",
            ],
            quiz: [
              {
                question: "O que significa \"prêmio de risco\" em investimentos?",
                options: [
                  "Um bônus que corretoras dão para clientes de risco",
                  "O retorno extra esperado que compensa o investidor por aceitar mais incerteza",
                  "Uma taxa cobrada sobre investimentos arriscados",
                  "O valor que se perde ao investir em renda variável",
                ],
                correctIndex: 1,
                explanation: "É a compensação, em potencial de retorno, por aceitar carregar mais incerteza sobre o resultado do investimento.",
              },
            ],
            exercise: {
              prompt: "Pense em dois investimentos que você conhece: um de baixo risco e um de alto risco. Compare o retorno esperado de cada um e o que você estaria disposto a aceitar.",
              placeholder: "Investimento de baixo risco: ...\nInvestimento de alto risco: ...\nO que eu toleraria: ...",
            },
          },
        },
        {
          id: lid("risco-x-retorno", 2),
          title: "Tipos de risco (mercado, crédito, liquidez)",
          content: {
            explanation: [
              "Risco de mercado é a possibilidade de o preço de um ativo variar por fatores econômicos gerais — juros, câmbio, cenário político — mesmo sem nada de errado com o ativo específico.",
              "Risco de crédito é a possibilidade de quem emitiu o título (um banco, uma empresa, o governo) não conseguir pagar o combinado — é o risco mais associado a calotes.",
              "Risco de liquidez é a possibilidade de não conseguir vender um investimento quando precisar, ou só conseguir vender com desconto relevante sobre o valor justo, por falta de compradores no momento.",
            ],
            examples: [
              "O preço de uma ação cair porque o Banco Central subiu os juros é risco de mercado, não tem relação direta com a empresa.",
              "Um CDB de uma instituição financeira pequena que quebra e não paga o combinado é um exemplo de risco de crédito se materializando.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Risco de mercado", items: ["Afeta o preço por fatores gerais", "Não depende de um emissor específico"] },
              right: { label: "Risco de crédito", items: ["Emissor pode não pagar", "Mitigado por rating e garantias (como o FGC)"] },
            },
            keyConcepts: [
              "Risco de mercado: variação de preço por fatores econômicos gerais.",
              "Risco de crédito: possibilidade de o emissor não pagar o combinado.",
              "Risco de liquidez: dificuldade de vender sem perda relevante quando necessário.",
            ],
            quiz: [
              {
                question: "Qual tipo de risco está mais associado à possibilidade de um emissor não pagar uma dívida?",
                options: ["Risco de mercado", "Risco de crédito", "Risco de liquidez", "Risco cambial"],
                correctIndex: 1,
                explanation: "Risco de crédito é justamente a possibilidade de quem emitiu o título não honrar o pagamento combinado.",
              },
            ],
            exercise: {
              prompt: "Para um investimento que você tem ou conhece, identifique qual desses três tipos de risco é o mais relevante e por quê.",
              placeholder: "Investimento: ...\nRisco mais relevante: ...\nPor quê: ...",
            },
          },
        },
        {
          id: lid("risco-x-retorno", 3),
          title: "Medindo o risco de um investimento",
          content: {
            explanation: [
              "A volatilidade — normalmente medida pelo desvio padrão dos retornos ao longo do tempo — é a forma mais comum de medir o risco de mercado de um investimento: quanto mais os retornos oscilam de um período para outro, maior a volatilidade.",
              "Outra métrica útil é o drawdown máximo: a maior queda percentual que o investimento já teve, do topo até o fundo, num determinado período — dá uma ideia concreta de \"o quanto já caiu antes\".",
              "Para risco de crédito, a métrica mais usada é o rating, uma nota (dada por agências ou implícita na taxa oferecida) que resume a probabilidade de o emissor não pagar — quanto pior o rating, maior o risco (e normalmente maior a taxa oferecida para compensar).",
            ],
            examples: [
              "Um fundo com volatilidade histórica de 25% ao ano tende a oscilar bem mais, para cima e para baixo, do que um com volatilidade de 5% ao ano.",
              "Um título com rating baixo costuma pagar uma taxa mais alta que um título de rating alto do mesmo prazo — a diferença de taxa é o mercado precificando o risco extra.",
            ],
            diagram: {
              type: "formula",
              formula: "Drawdown = (Valor no fundo ÷ Valor no topo anterior − 1) × 100",
              caption: "A maior queda percentual, do topo ao fundo, ajuda a visualizar o risco na prática.",
            },
            keyConcepts: [
              "Volatilidade (desvio padrão dos retornos) mede a intensidade da oscilação de um investimento.",
              "Drawdown máximo mostra a maior queda histórica, do topo ao fundo.",
              "Rating resume o risco de crédito de um título de forma comparável.",
            ],
            quiz: [
              {
                question: "O que o drawdown máximo de um investimento representa?",
                options: [
                  "A taxa de administração cobrada",
                  "A maior queda percentual histórica, do topo até o fundo, num determinado período",
                  "O valor mínimo para investir",
                  "A quantidade de vezes que o investimento mudou de preço em um dia",
                ],
                correctIndex: 1,
                explanation: "O drawdown máximo dá uma ideia concreta do pior cenário já enfrentado por aquele investimento no passado.",
              },
            ],
            exercise: {
              prompt: "Pesquise a volatilidade histórica (ou o drawdown máximo) de um investimento que você tem ou pretende ter. O resultado te surpreendeu?",
              placeholder: "Investimento: ...\nVolatilidade/drawdown encontrado: ...\nMinha reação: ...",
            },
          },
        },
        {
          id: lid("risco-x-retorno", 4),
          title: "Tolerância x capacidade de assumir risco",
          content: {
            explanation: [
              "Tolerância a risco é a dimensão emocional/psicológica: o quanto de oscilação você consegue aguentar sem entrar em pânico e tomar decisões precipitadas, como vender tudo numa queda.",
              "Capacidade de assumir risco é a dimensão financeira/objetiva: o quanto você pode efetivamente perder, dado seu prazo, sua renda e suas reservas, sem comprometer objetivos importantes — é uma conta mais fria, baseada em números.",
              "Essas duas dimensões podem divergir: alguém pode ter alta capacidade financeira de assumir risco (prazo longo, renda estável) mas baixa tolerância emocional (não dorme bem vendo a carteira cair). Nesses casos, o menor dos dois deve prevalecer na hora de decidir a alocação.",
            ],
            examples: [
              "Uma pessoa jovem com emprego estável e sem dívidas tem alta capacidade financeira de assumir risco, mesmo que sua tolerância emocional seja baixa.",
              "Alguém perto da aposentadoria, mesmo tendo tolerância emocional alta, tem baixa capacidade de assumir risco, porque não tem tempo de recuperar uma perda relevante.",
            ],
            keyConcepts: [
              "Tolerância a risco: dimensão emocional, o quanto você aguenta ver a carteira oscilar.",
              "Capacidade de assumir risco: dimensão financeira, o quanto você pode perder sem comprometer objetivos.",
              "Quando as duas divergem, a mais conservadora das duas deve prevalecer.",
            ],
            quiz: [
              {
                question: "O que acontece quando a tolerância emocional a risco de uma pessoa é menor que sua capacidade financeira de assumir risco?",
                options: [
                  "Isso nunca acontece na prática",
                  "A alocação deveria seguir a dimensão mais conservadora entre as duas",
                  "A pessoa deveria sempre seguir a capacidade financeira, ignorando a emoção",
                  "É preciso trocar de corretora",
                ],
                correctIndex: 1,
                explanation: "Ignorar a tolerância emocional costuma levar a decisões precipitadas em momentos de queda, mesmo que a capacidade financeira permitisse mais risco.",
              },
            ],
            exercise: {
              prompt: "Avalie separadamente: qual sua capacidade financeira de assumir risco hoje (prazo, renda, reservas) e qual sua tolerância emocional (o quanto de queda você aguenta ver sem se desesperar)?",
              placeholder: "Minha capacidade financeira: ...\nMinha tolerância emocional: ...\nO que isso sugere pra minha alocação: ...",
            },
          },
        },
        {
          id: lid("risco-x-retorno", 5),
          title: "Construindo uma carteira com o risco certo pra você",
          content: {
            explanation: [
              "Construir uma carteira adequada é combinar três coisas: seu perfil declarado, seu prazo até precisar do dinheiro e sua capacidade financeira real de assumir perdas — não apenas escolher os ativos que parecem mais atrativos no momento.",
              "Carteiras modelo (conservadora, moderada, arrojada) são um bom ponto de partida, mas devem ser ajustadas à sua situação específica: alguém com o perfil moderado mas prazo muito curto para um objetivo pode precisar de uma alocação mais conservadora só para aquele dinheiro.",
              "O objetivo não é maximizar retorno a qualquer custo, e sim encontrar o nível de risco que você consegue sustentar — inclusive emocionalmente — pelo tempo necessário até atingir seus objetivos.",
            ],
            examples: [
              "Uma carteira moderada típica pode ter uma divisão relativamente equilibrada entre renda fixa e renda variável, ajustada conforme o prazo de cada objetivo.",
              "Duas pessoas com o mesmo perfil moderado podem ter carteiras diferentes se uma tem objetivos de prazo curto e outra só de prazo longo.",
            ],
            diagram: {
              type: "bars",
              caption: "Exemplo ilustrativo de composição de uma carteira moderada.",
              bars: [
                { label: "Renda fixa", value: 50, suffix: "%" },
                { label: "Fundos imobiliários", value: 20, suffix: "%" },
                { label: "Ações/fundos de ações", value: 25, suffix: "%" },
                { label: "Internacional", value: 5, suffix: "%" },
              ],
            },
            keyConcepts: [
              "A carteira ideal combina perfil, prazo e capacidade financeira — não só o retorno esperado.",
              "Carteiras modelo são um ponto de partida, mas devem ser ajustadas à situação individual.",
              "O objetivo é sustentar o risco escolhido pelo tempo necessário, inclusive emocionalmente.",
            ],
            quiz: [
              {
                question: "Por que duas pessoas com o mesmo perfil de investidor podem ter carteiras diferentes?",
                options: [
                  "Isso é um erro, elas deveriam ter carteiras idênticas",
                  "Porque prazo e objetivos específicos também influenciam a alocação ideal, além do perfil",
                  "Porque cada corretora oferece produtos diferentes",
                  "Porque o perfil de investidor não importa de verdade",
                ],
                correctIndex: 1,
                explanation: "O perfil é só uma das variáveis; prazo e capacidade financeira específica de cada pessoa também moldam a alocação ideal.",
              },
            ],
            exercise: {
              prompt: "Com base no que você aprendeu neste curso, esboce uma alocação (em %) que faça sentido pra sua situação atual.",
              placeholder: "Renda fixa: ...%\nFundos imobiliários: ...%\nAções: ...%\nInternacional: ...%\nJustificativa: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 3 — Diversificação (avançada)
    // ---------------------------------------------------------------
    {
      id: "diversificacao-avancada",
      title: "Diversificação",
      description: "Diversificação em nível de carteira: correlação entre ativos, não só quantidade.",
      icon: "🧺",
      lessons: [
        {
          id: lid("diversificacao-avancada", 1),
          title: "Diversificação além do óbvio: correlação entre ativos",
          content: {
            explanation: [
              "Diversificar não é simplesmente ter vários ativos diferentes — é ter ativos que não se movem todos na mesma direção ao mesmo tempo. Essa relação entre os movimentos de dois ativos é chamada de correlação.",
              "Quando dois ativos têm correlação alta, eles tendem a subir e cair juntos — ter os dois na carteira reduz pouco o risco total, mesmo parecendo diversificação na superfície.",
              "Quando a correlação é baixa (ou negativa), os ativos tendem a reagir de formas diferentes aos mesmos eventos — é essa combinação que reduz de fato a oscilação total da carteira.",
            ],
            examples: [
              "Ter ações de dois bancos diferentes parece diversificação, mas como ambas reagem de forma parecida a mudanças na taxa de juros, a correlação entre elas costuma ser alta.",
              "Combinar ações brasileiras com Tesouro IPCA+ pode reduzir mais a oscilação da carteira do que combinar ações de dois setores parecidos, porque a correlação entre os dois primeiros tende a ser mais baixa.",
            ],
            diagram: {
              type: "formula",
              formula: "Correlação varia de −1 (movem-se sempre em direções opostas) a +1 (movem-se sempre juntos)",
              caption: "Quanto mais próxima de zero (ou negativa), maior o potencial de redução de risco ao combinar dois ativos.",
            },
            keyConcepts: [
              "Correlação mede o quanto dois ativos se movem juntos.",
              "Diversificação de verdade combina ativos com correlação baixa, não apenas ativos \"diferentes\" na superfície.",
              "Ter muitos ativos correlacionados entre si diversifica menos do que parece.",
            ],
            quiz: [
              {
                question: "Por que ter ações de vários bancos diferentes pode não ser uma diversificação eficaz?",
                options: [
                  "Porque bancos não pagam dividendos",
                  "Porque essas ações costumam ter correlação alta entre si, reagindo de forma parecida aos mesmos eventos",
                  "Porque bancos são proibidos de estar na mesma carteira",
                  "Porque ações de bancos não sobem nunca",
                ],
                correctIndex: 1,
                explanation: "Ativos com correlação alta tendem a se mover juntos, então combiná-los reduz pouco o risco total da carteira.",
              },
            ],
            exercise: {
              prompt: "Pense em dois investimentos que você tem (ou conhece). Eles costumam subir e cair juntos, ou reagem de formas diferentes aos mesmos eventos econômicos?",
              placeholder: "Investimento 1: ...\nInvestimento 2: ...\nEles parecem correlacionados? ...",
            },
          },
        },
        {
          id: lid("diversificacao-avancada", 2),
          title: "Diversificação geográfica (Brasil x exterior)",
          content: {
            explanation: [
              "Investir apenas no Brasil concentra o chamado \"risco país\": câmbio, política econômica local, uma única economia — se o cenário brasileiro vai mal, toda a carteira sente, mesmo que bem diversificada dentro do país.",
              "Ter parte do patrimônio exposto a ativos internacionais reduz essa concentração, porque outras economias não necessariamente enfrentam os mesmos problemas ao mesmo tempo que o Brasil.",
              "No Brasil, formas comuns de obter exposição internacional incluem BDRs (recibos de ações estrangeiras negociados aqui), ETFs internacionais e fundos cambiais ou multimercado com mandato internacional.",
            ],
            examples: [
              "Uma crise política ou uma forte desvalorização do real afeta principalmente ativos 100% brasileiros — quem tem parte em dólar ou em ativos internacionais sente menos o impacto proporcional.",
              "Um BDR permite comprar, na bolsa brasileira, um recibo que representa ações de empresas estrangeiras, sem precisar abrir conta em corretora no exterior.",
            ],
            keyConcepts: [
              "Risco país: a concentração de estar exposto a uma única economia e um único câmbio.",
              "Diversificação geográfica reduz esse risco ao incluir ativos internacionais na carteira.",
              "BDRs, ETFs internacionais e fundos cambiais são formas acessíveis de obter essa exposição a partir do Brasil.",
            ],
            quiz: [
              {
                question: "O que são BDRs?",
                options: [
                  "Títulos de dívida do governo brasileiro",
                  "Recibos negociados na bolsa brasileira que representam ações de empresas estrangeiras",
                  "Um tipo de poupança em dólar",
                  "Fundos exclusivos para grandes investidores",
                ],
                correctIndex: 1,
                explanation: "BDRs permitem investir indiretamente em empresas estrangeiras através da bolsa brasileira, sem precisar de conta no exterior.",
              },
            ],
            exercise: {
              prompt: "Sua carteira atual (ou planejada) tem alguma exposição internacional? Pesquise uma forma acessível de ter essa exposição a partir do Brasil.",
              placeholder: "Exposição internacional atual: ...\nForma que pesquisei: ...",
            },
          },
        },
        {
          id: lid("diversificacao-avancada", 3),
          title: "Diversificação por setor e por moeda",
          content: {
            explanation: [
              "Dentro da renda variável, diversificar por setor significa não concentrar tudo em um único ramo da economia (só bancos, ou só empresas de commodities) — setores diferentes costumam reagir de forma diferente aos mesmos eventos econômicos.",
              "Diversificar por moeda significa ter parte do patrimônio indexado ou exposto a outras moedas (normalmente o dólar), reduzindo o impacto de uma desvalorização forte do real sobre o patrimônio total.",
              "Essas duas dimensões — setor e moeda — se somam à diversificação entre classes de ativos, formando uma carteira mais robusta contra choques específicos de um único segmento da economia.",
            ],
            examples: [
              "Uma carteira só com ações de bancos e varejo pode sofrer bastante numa recessão que afete consumo e crédito ao mesmo tempo.",
              "Ter uma parcela do patrimônio em ativos dolarizados reduz o impacto de uma forte alta do dólar sobre o poder de compra em situações específicas, como viagens internacionais ou compras importadas.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Pouco diversificado", items: ["Só ações de um setor", "Tudo em reais", "Vulnerável a choques específicos"] },
              right: { label: "Mais diversificado", items: ["Ações de setores diferentes", "Parte em outra moeda", "Mais resiliente a choques localizados"] },
            },
            keyConcepts: [
              "Diversificação por setor reduz a exposição a choques específicos de um ramo da economia.",
              "Diversificação por moeda reduz o impacto de uma desvalorização forte do real sobre o patrimônio.",
              "Essas dimensões se somam à diversificação entre classes de ativos.",
            ],
            quiz: [
              {
                question: "Qual é o principal benefício de diversificar uma carteira de ações entre setores diferentes?",
                options: [
                  "Garantir retorno positivo todo ano",
                  "Reduzir a vulnerabilidade a choques que afetam especificamente um único setor da economia",
                  "Eliminar completamente o risco de mercado",
                  "Reduzir o imposto de renda a pagar",
                ],
                correctIndex: 1,
                explanation: "Setores diferentes reagem de forma diferente aos mesmos eventos, então diversificar entre eles reduz o impacto de um choque localizado.",
              },
            ],
            exercise: {
              prompt: "Se você investe em ações ou fundos de ações, liste os setores presentes na sua carteira. Há alguma concentração relevante em um único setor?",
              placeholder: "Setores na minha carteira: ...\nHá concentração? ...",
            },
          },
        },
        {
          id: lid("diversificacao-avancada", 4),
          title: "Quando ativos 'diferentes' se movem juntos",
          content: {
            explanation: [
              "Em momentos de crise ou forte estresse no mercado, as correlações entre ativos costumam subir — ativos que normalmente se moviam de forma independente passam a cair juntos, porque o medo e a busca por liquidez dominam as decisões de todos os investidores ao mesmo tempo.",
              "Isso significa que a diversificação reduz o risco no dia a dia, mas não elimina o risco sistêmico — o risco que afeta o mercado como um todo, independente de quão diversificada esteja a carteira.",
              "É importante não superestimar a proteção da diversificação em cenários extremos: ela ajuda a suavizar a oscilação normal, mas não é uma garantia contra quedas generalizadas em momentos de crise.",
            ],
            examples: [
              "Em crises financeiras globais, é comum ver ações, fundos imobiliários e até alguns ativos considerados \"seguros\" caírem juntos por um período, antes de se recuperarem de formas diferentes.",
              "Um investidor que contava com a diversificação para \"não perder nada\" numa crise generalizada pode se surpreender ao ver a carteira toda cair, mesmo bem diversificada entre classes.",
            ],
            keyConcepts: [
              "Correlações entre ativos tendem a subir em momentos de crise, reduzindo o benefício da diversificação nesses períodos.",
              "Diversificação reduz o risco do dia a dia, mas não elimina o risco sistêmico.",
              "Não se deve esperar proteção total da diversificação em cenários extremos de mercado.",
            ],
            quiz: [
              {
                question: "O que costuma acontecer com a correlação entre ativos em momentos de forte crise no mercado?",
                options: [
                  "Ela costuma cair, aumentando a proteção da diversificação",
                  "Ela costuma subir, reduzindo o benefício da diversificação justamente quando mais se precisaria dela",
                  "Ela permanece sempre igual",
                  "Correlação não existe em momentos de crise",
                ],
                correctIndex: 1,
                explanation: "Em crises, o medo generalizado tende a fazer diferentes ativos caírem juntos, aumentando a correlação entre eles.",
              },
            ],
            exercise: {
              prompt: "Pesquise (ou lembre-se) de algum período de crise no mercado. O que aconteceu com diferentes tipos de investimento durante esse período?",
              placeholder: "Período pesquisado: ...\nO que percebi sobre a correlação entre os ativos: ...",
            },
          },
        },
        {
          id: lid("diversificacao-avancada", 5),
          title: "Avaliando a diversificação real da sua carteira",
          content: {
            explanation: [
              "Para avaliar se uma carteira está de fato diversificada, não basta contar quantos ativos ela tem — é preciso olhar a concentração por classe de ativo, por setor, por emissor e por país, e verificar se algum desses fatores está desproporcionalmente pesado.",
              "Uma carteira com 20 ativos, mas todos ações brasileiras do mesmo setor, é menos diversificada do que uma carteira com 5 ativos bem distribuídos entre classes, setores e países diferentes.",
              "Revisar essa concentração periodicamente é parte do processo de manter uma carteira saudável, especialmente porque, como visto antes, os pesos mudam sozinhos com o tempo conforme cada ativo tem um desempenho diferente.",
            ],
            examples: [
              "Verificar quanto do patrimônio total está concentrado em um único emissor (uma única empresa, um único banco) é um bom primeiro passo de avaliação.",
              "Comparar a alocação atual, por classe e por setor, com a alocação planejada originalmente ajuda a identificar desvios que pedem atenção.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Liste todos os seus investimentos e o valor de cada um",
                "Agrupe por classe de ativo, setor e país",
                "Calcule o percentual do total em cada grupo",
                "Identifique concentrações acima do que você planejava tolerar",
              ],
            },
            keyConcepts: [
              "Diversificação real se mede pela concentração por classe, setor, emissor e país — não pelo número de ativos.",
              "Uma carteira com poucos ativos bem distribuídos pode ser mais diversificada que uma com muitos ativos parecidos.",
              "Revisar a concentração periodicamente ajuda a manter a diversificação planejada ao longo do tempo.",
            ],
            quiz: [
              {
                question: "Por que o número de ativos, sozinho, não é um bom indicador de diversificação?",
                options: [
                  "Porque quanto mais ativos, sempre pior",
                  "Porque muitos ativos parecidos (mesma classe, mesmo setor) ainda concentram risco, mesmo sendo numerosos",
                  "Porque o número de ativos não afeta o risco de forma alguma",
                  "Porque diversificação só se aplica a fundos, não a carteiras próprias",
                ],
                correctIndex: 1,
                explanation: "O que importa é a distribuição entre classes, setores e emissores diferentes — não simplesmente a quantidade de ativos.",
              },
            ],
            exercise: {
              prompt: "Faça um raio-x rápido da sua carteira (ou de uma carteira hipotética): agrupe por classe, setor e país, e calcule o percentual de cada grupo.",
              placeholder: "Maior concentração encontrada: ...\nEm qual grupo: ...\nIsso está dentro do que eu toleraria? ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 4 — Liquidez
    // ---------------------------------------------------------------
    {
      id: "liquidez",
      title: "Liquidez",
      description: "A velocidade (e o custo) de transformar um investimento em dinheiro na mão.",
      icon: "💧",
      lessons: [
        {
          id: lid("liquidez", 1),
          title: "O que é liquidez, na prática",
          content: {
            explanation: [
              "Liquidez é a facilidade e a velocidade com que um investimento pode ser convertido em dinheiro disponível, sem perda relevante de valor no processo.",
              "Investimentos de alta liquidez, como a poupança ou o Tesouro Selic, permitem resgatar o dinheiro rapidamente e sem grandes surpresas no valor recebido.",
              "Investimentos de baixa liquidez, como um imóvel, podem levar semanas, meses ou até anos para serem convertidos em dinheiro pelo valor justo — e às vezes só é possível vender rápido aceitando um desconto relevante.",
            ],
            examples: [
              "Resgatar o Tesouro Selic costuma cair na conta em até um dia útil, com baixíssima chance de perda de valor.",
              "Vender um imóvel rapidamente, por precisar do dinheiro com urgência, normalmente exige aceitar um preço abaixo do valor de mercado.",
            ],
            keyConcepts: [
              "Liquidez: velocidade e facilidade de converter um investimento em dinheiro sem perda relevante.",
              "Investimentos de alta liquidez permitem resgate rápido e previsível.",
              "Investimentos de baixa liquidez podem exigir desconto para venda rápida.",
            ],
            quiz: [
              {
                question: "O que caracteriza um investimento de baixa liquidez?",
                options: [
                  "Ele rende pouco",
                  "É difícil ou demorado convertê-lo em dinheiro sem perder valor no processo",
                  "Ele não paga impostos",
                  "Ele só pode ser comprado por investidores profissionais",
                ],
                correctIndex: 1,
                explanation: "Baixa liquidez está relacionada à dificuldade de transformar o investimento em dinheiro rapidamente sem perda relevante de valor, não ao rendimento em si.",
              },
            ],
            exercise: {
              prompt: "Liste 3 investimentos (ou tipos de bens) que você conhece e classifique cada um como alta, média ou baixa liquidez.",
              placeholder: "1. ... — liquidez: ...\n2. ... — liquidez: ...\n3. ... — liquidez: ...",
            },
          },
        },
        {
          id: lid("liquidez", 2),
          title: "Liquidez diária x com carência x sem liquidez",
          content: {
            explanation: [
              "Liquidez diária significa que o investimento pode ser resgatado a qualquer momento, normalmente com o dinheiro disponível no mesmo dia útil ou no seguinte (D+0 ou D+1).",
              "Liquidez com carência significa que existe um período mínimo antes de poder resgatar — um CDB pode ter carência de 90 dias, por exemplo, ficando \"travado\" até lá.",
              "Alguns investimentos não têm liquidez alguma antes do vencimento: só é possível receber o valor investido de volta na data combinada, a não ser que exista um mercado secundário disposto a comprar aquele título antes (normalmente com deságio).",
            ],
            examples: [
              "O Tesouro Selic tem liquidez diária: pode ser resgatado (via corretora) a qualquer momento.",
              "Um CDB com liquidez apenas no vencimento de 2 anos não permite resgate antecipado — o dinheiro fica comprometido até lá.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Liquidez diária", items: ["Resgate a qualquer momento", "Ex.: Tesouro Selic, fundos DI"] },
              right: { label: "Sem liquidez até o vencimento", items: ["Dinheiro fica comprometido", "Costuma pagar taxa maior em compensação"] },
            },
            keyConcepts: [
              "Liquidez diária: resgate a qualquer momento, geralmente em D+0 ou D+1.",
              "Liquidez com carência: existe um período mínimo antes de poder resgatar.",
              "Sem liquidez: o dinheiro só é recebido na data de vencimento combinada.",
            ],
            quiz: [
              {
                question: "O que significa um investimento ter \"liquidez com carência\"?",
                options: [
                  "Que ele nunca pode ser resgatado",
                  "Que existe um período mínimo obrigatório antes de ser possível resgatar",
                  "Que ele só pode ser resgatado aos finais de semana",
                  "Que a liquidez é imediata, sem restrições",
                ],
                correctIndex: 1,
                explanation: "Carência é o período mínimo em que o investimento fica \"travado\" antes de permitir resgate.",
              },
            ],
            exercise: {
              prompt: "Verifique (ou pesquise) a liquidez de um investimento que você tem ou pretende ter. Ela é compatível com o prazo em que você pode precisar do dinheiro?",
              placeholder: "Investimento: ...\nLiquidez: ...\nÉ compatível com meu prazo? ...",
            },
          },
        },
        {
          id: lid("liquidez", 3),
          title: "O preço de abrir mão de liquidez (prêmio de iliquidez)",
          content: {
            explanation: [
              "Investimentos menos líquidos costumam oferecer uma taxa maior do que investimentos parecidos, porém mais líquidos — essa diferença é chamada de prêmio de iliquidez, e existe para compensar quem abre mão da flexibilidade de resgatar quando quiser.",
              "É um caso específico da relação risco x retorno: abrir mão de liquidez é uma forma de risco (o risco de precisar do dinheiro antes do previsto), então o mercado paga um retorno extra por isso.",
              "Vale a pena aceitar esse prêmio apenas para o dinheiro que você tem certeza de que não vai precisar antes do prazo combinado — nunca para reservas ou objetivos de curto prazo.",
            ],
            examples: [
              "Um CDB com liquidez diária de um banco pode pagar um percentual do CDI menor do que um CDB do mesmo banco com liquidez apenas no vencimento de 2 anos.",
              "Um título de crédito privado sem liquidez até o vencimento costuma pagar mais que um título público de prazo parecido, em parte por essa diferença de liquidez.",
            ],
            diagram: {
              type: "formula",
              formula: "Prêmio de iliquidez = Taxa do ativo menos líquido − Taxa de um ativo parecido, porém mais líquido",
              caption: "É a compensação recebida por abrir mão da flexibilidade de resgate.",
            },
            keyConcepts: [
              "Prêmio de iliquidez: taxa extra oferecida para compensar a falta de flexibilidade de resgate.",
              "É uma forma específica da relação risco x retorno.",
              "Só vale a pena para dinheiro que certamente não será necessário antes do prazo.",
            ],
            quiz: [
              {
                question: "Por que investimentos menos líquidos costumam pagar uma taxa maior?",
                options: [
                  "Porque são sempre mais arriscados de outras formas também",
                  "Como compensação por o investidor abrir mão da flexibilidade de resgatar quando quiser",
                  "Porque têm taxas de administração menores",
                  "Isso não é uma regra real do mercado",
                ],
                correctIndex: 1,
                explanation: "O prêmio de iliquidez existe justamente para compensar quem aceita não poder resgatar o investimento a qualquer momento.",
              },
            ],
            exercise: {
              prompt: "Compare (ou pesquise) dois investimentos parecidos, um com liquidez diária e outro com liquidez apenas no vencimento. Qual a diferença de taxa entre eles?",
              placeholder: "Investimento líquido: ... — taxa: ...\nInvestimento ilíquido: ... — taxa: ...\nDiferença (prêmio): ...",
            },
          },
        },
        {
          id: lid("liquidez", 4),
          title: "Equilibrando liquidez e rentabilidade na carteira",
          content: {
            explanation: [
              "Nem todo o patrimônio precisa da mesma liquidez: a reserva de emergência precisa de liquidez alta, mesmo rendendo menos, porque sua função é estar disponível exatamente quando um imprevisto acontecer.",
              "Já a parte da carteira destinada a objetivos de longo prazo pode abrir mão de liquidez em troca de rentabilidade maior, desde que esse dinheiro realmente não seja necessário no curto prazo.",
              "O erro comum é tratar toda a carteira da mesma forma: deixar tudo em liquidez diária (perdendo rentabilidade à toa) ou travar tudo em investimentos ilíquidos (ficando vulnerável a um imprevisto).",
            ],
            examples: [
              "Uma reserva de emergência em Tesouro Selic ou CDB de liquidez diária garante acesso rápido ao dinheiro num imprevisto, mesmo rendendo um pouco menos que alternativas travadas.",
              "Uma parte do patrimônio destinada à aposentadoria, daqui a 20 anos, pode estar em investimentos com liquidez menor, priorizando rentabilidade.",
            ],
            keyConcepts: [
              "A reserva de emergência precisa de liquidez alta por definição, independente da rentabilidade.",
              "Dinheiro de objetivos de longo prazo pode abrir mão de liquidez em troca de rentabilidade.",
              "Tratar toda a carteira com a mesma liquidez, para mais ou para menos, é um erro comum.",
            ],
            quiz: [
              {
                question: "Por que a reserva de emergência deve priorizar liquidez alta, mesmo que isso signifique render menos?",
                options: [
                  "Porque investimentos líquidos são sempre mais seguros contra qualquer risco",
                  "Porque a função da reserva é estar disponível rapidamente quando um imprevisto acontecer",
                  "Porque a lei exige que a reserva de emergência tenha liquidez diária",
                  "Não há motivo real, é só uma convenção",
                ],
                correctIndex: 1,
                explanation: "A utilidade da reserva de emergência depende diretamente de conseguir acessá-la rapidamente quando necessário, o que exige liquidez alta.",
              },
            ],
            exercise: {
              prompt: "Revise sua carteira (ou planejamento): a liquidez de cada investimento está alinhada com a função daquele dinheiro (reserva, curto prazo, longo prazo)?",
              placeholder: "Reserva de emergência — liquidez adequada? ...\nObjetivos de longo prazo — liquidez adequada? ...",
            },
          },
        },
        {
          id: lid("liquidez", 5),
          title: "Liquidez e o planejamento de curto, médio e longo prazo",
          content: {
            explanation: [
              "Assim como na alocação por objetivo, é útil mapear a liquidez necessária de acordo com o prazo de cada meta financeira: objetivos de curto prazo exigem liquidez alta, e objetivos de longo prazo têm mais margem para abrir mão dela.",
              "Esse mapeamento evita dois erros opostos: deixar dinheiro de curto prazo travado em investimentos ilíquidos (correndo risco de precisar vender no prejuízo ou não conseguir vender a tempo) e deixar dinheiro de longo prazo parado em liquidez diária (perdendo rentabilidade à toa por excesso de cautela).",
              "Revisar esse mapeamento periodicamente é importante porque os prazos dos objetivos mudam com o tempo — um objetivo de longo prazo vai, aos poucos, se tornando de curto prazo, e a liquidez da parte do patrimônio destinada a ele deveria aumentar de forma correspondente.",
            ],
            examples: [
              "Dinheiro para trocar de carro em 1 ano deve estar em liquidez alta, mesmo que isso signifique abrir mão de um pouco de rentabilidade.",
              "Conforme a aposentadoria se aproxima, faz sentido migrar gradualmente parte do patrimônio para investimentos com liquidez maior, preparando para o momento de começar a usar o dinheiro.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Liste seus objetivos e o prazo aproximado até precisar do dinheiro de cada um",
                "Para prazos curtos, priorize liquidez alta mesmo com rentabilidade menor",
                "Para prazos longos, é possível abrir mão de liquidez em troca de rentabilidade",
                "Revise esse mapeamento periodicamente, conforme os prazos avançam",
              ],
            },
            keyConcepts: [
              "A liquidez necessária deve ser mapeada de acordo com o prazo de cada objetivo financeiro.",
              "Objetivos de longo prazo que se aproximam devem ganhar liquidez gradualmente.",
              "Revisar esse mapeamento periodicamente evita descompassos entre liquidez e necessidade real.",
            ],
            quiz: [
              {
                question: "O que deveria acontecer com a liquidez do dinheiro destinado a um objetivo de longo prazo, conforme o prazo desse objetivo se aproxima?",
                options: [
                  "Nada, a liquidez deve permanecer sempre a mesma",
                  "A liquidez deveria aumentar gradualmente, preparando para o momento de usar o dinheiro",
                  "A liquidez deveria diminuir ainda mais, para maximizar retorno até o fim",
                  "O dinheiro deveria ser todo resgatado de uma vez, um ano antes",
                ],
                correctIndex: 1,
                explanation: "Um objetivo de longo prazo vai se tornando de curto prazo com o tempo, e a liquidez do dinheiro reservado para ele deve acompanhar essa mudança.",
              },
            ],
            exercise: {
              prompt: "Para cada objetivo financeiro que você tem, anote o prazo e a liquidez do investimento correspondente hoje. Existe algum descompasso?",
              placeholder: "Objetivo — prazo — liquidez atual:\n1. ...\n2. ...\n3. ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 5 — Rentabilidade real
    // ---------------------------------------------------------------
    {
      id: "rentabilidade-real",
      title: "Rentabilidade real",
      description: "O retorno que realmente importa: depois de descontar a inflação.",
      icon: "🧾",
      lessons: [
        {
          id: lid("rentabilidade-real", 1),
          title: "Rentabilidade nominal x rentabilidade real",
          content: {
            explanation: [
              "Rentabilidade nominal é o número anunciado por um investimento, sem nenhum ajuste — \"rendeu 10% no ano\". Rentabilidade real é o que sobra depois de descontar a inflação do mesmo período: é o ganho real de poder de compra.",
              "Um investimento pode ter rentabilidade nominal positiva e rentabilidade real negativa, se a inflação do período for maior que o rendimento nominal — nesse caso, o valor em reais cresceu, mas compra menos coisas do que antes.",
              "Ao avaliar se um investimento \"valeu a pena\", a pergunta relevante é sempre sobre a rentabilidade real, não a nominal isolada — é ela que reflete o ganho (ou perda) efetivo de poder de compra.",
            ],
            examples: [
              "Um investimento rendeu 8% nominal no ano, e a inflação do período foi 6%: a rentabilidade real foi positiva, mas bem menor que os 8% anunciados.",
              "Um investimento rendeu 4% nominal, com inflação de 6% no mesmo período: mesmo com o saldo em reais tendo crescido, a rentabilidade real foi negativa.",
            ],
            keyConcepts: [
              "Rentabilidade nominal: o número anunciado, sem nenhum desconto.",
              "Rentabilidade real: o que sobra depois de descontar a inflação do período.",
              "É possível ter rentabilidade nominal positiva e rentabilidade real negativa ao mesmo tempo.",
            ],
            quiz: [
              {
                question: "O que significa um investimento ter rentabilidade nominal positiva, mas rentabilidade real negativa?",
                options: [
                  "Que o investimento é uma fraude",
                  "Que o valor em reais cresceu, mas a inflação do período foi maior, então o poder de compra efetivamente diminuiu",
                  "Que o investimento vai ser resgatado automaticamente",
                  "Isso é impossível de acontecer",
                ],
                correctIndex: 1,
                explanation: "O saldo em reais aumentou (nominal positivo), mas como a inflação consumiu mais que esse aumento, o poder de compra real diminuiu.",
              },
            ],
            exercise: {
              prompt: "Pegue um investimento seu (ou hipotético) com rentabilidade nominal conhecida em um período. Pesquise a inflação do mesmo período e estime a rentabilidade real aproximada.",
              placeholder: "Rentabilidade nominal: ...%\nInflação do período: ...%\nRentabilidade real aproximada: ...%",
            },
          },
        },
        {
          id: lid("rentabilidade-real", 2),
          title: "Calculando a rentabilidade real de um investimento",
          content: {
            explanation: [
              "A forma aproximada e mais simples de calcular é subtrair a inflação do rendimento nominal — funciona razoavelmente bem quando os dois números são pequenos, mas perde precisão quando são maiores.",
              "A forma exata é a chamada fórmula de Fisher, que divide (1 + rendimento nominal) por (1 + inflação) e subtrai 1 — ela captura corretamente o efeito composto entre os dois números, algo que a subtração simples ignora.",
              "Na prática, para rendimentos e inflação moderados, a diferença entre as duas formas de calcular costuma ser pequena — mas vale conhecer a fórmula exata para os casos em que a precisão importa mais, como planejamentos de longo prazo.",
            ],
            examples: [
              "Com rendimento nominal de 10% e inflação de 4%, a aproximação simples dá 6% de rentabilidade real; a fórmula de Fisher dá um valor bem próximo, mas ligeiramente diferente.",
              "Com números maiores (rendimento nominal de 30% e inflação de 15%, por exemplo), a diferença entre a aproximação simples e a fórmula exata fica mais perceptível.",
            ],
            diagram: {
              type: "formula",
              formula: "Rentabilidade real = [(1 + rendimento nominal) ÷ (1 + inflação) − 1] × 100",
              caption: "A fórmula de Fisher, que calcula a rentabilidade real de forma exata.",
            },
            keyConcepts: [
              "A aproximação simples (nominal menos inflação) funciona bem para números pequenos.",
              "A fórmula de Fisher calcula a rentabilidade real de forma exata, considerando o efeito composto.",
              "A diferença entre as duas formas cresce conforme os números envolvidos ficam maiores.",
            ],
            quiz: [
              {
                question: "O que a fórmula de Fisher considera que a aproximação simples (nominal menos inflação) ignora?",
                options: [
                  "O valor investido inicialmente",
                  "O efeito composto entre o rendimento nominal e a inflação",
                  "A taxa de administração do investimento",
                  "O imposto de renda a pagar",
                ],
                correctIndex: 1,
                explanation: "A fórmula de Fisher divide os fatores (1 + taxa) em vez de simplesmente subtrair, capturando o efeito composto entre os dois números.",
              },
            ],
            exercise: {
              prompt: "Usando a fórmula de Fisher, calcule a rentabilidade real de um investimento com rendimento nominal de 12% e inflação de 5% no período.",
              placeholder: "Cálculo: (1 + 0,12) ÷ (1 + 0,05) − 1 = ...\nRentabilidade real: ...%",
            },
          },
        },
        {
          id: lid("rentabilidade-real", 3),
          title: "Por que comparar investimentos só pelo nominal engana",
          content: {
            explanation: [
              "Comparar dois investimentos apenas pelo rendimento nominal pode levar a decisões erradas se eles não forem do mesmo período, ou se um deles estiver sendo comparado sem considerar a inflação daquele momento específico.",
              "Um investimento que rendeu 15% num ano de inflação alta pode ter tido uma rentabilidade real pior do que outro que rendeu 8% num ano de inflação baixa — o número nominal maior não significa necessariamente o resultado melhor.",
              "Esse cuidado é ainda mais importante ao comparar períodos históricos diferentes, já que a inflação varia bastante de um período para outro, tornando comparações puramente nominais entre décadas diferentes pouco úteis.",
            ],
            examples: [
              "Comparar o \"melhor investimento da década de 1990\" com o \"melhor investimento de hoje\" apenas pelo número nominal ignora que a inflação nos dois períodos pode ter sido bem diferente.",
              "Um investidor que escolhe entre duas opções olhando só a taxa nominal anunciada pode acabar escolhendo a opção com pior retorno real, se não considerar a inflação embutida em cada uma.",
            ],
            keyConcepts: [
              "Comparar investimentos apenas pelo nominal pode levar a escolhas piores, especialmente entre períodos diferentes.",
              "A inflação do período de cada investimento precisa entrar na comparação.",
              "Comparações históricas entre décadas diferentes são especialmente enganosas se forem só nominais.",
            ],
            quiz: [
              {
                question: "Por que comparar o retorno de investimentos de décadas diferentes apenas pelo número nominal pode ser enganoso?",
                options: [
                  "Porque números nominais são sempre falsos",
                  "Porque a inflação pode ter sido bem diferente em cada período, distorcendo a comparação real",
                  "Porque investimentos antigos não existem mais",
                  "Isso não é um problema real",
                ],
                correctIndex: 1,
                explanation: "Sem ajustar pela inflação de cada período, a comparação nominal não reflete o ganho real de poder de compra em cada época.",
              },
            ],
            exercise: {
              prompt: "Pense em uma comparação de investimentos (sua ou que você já viu) que considerou só o retorno nominal. Como a conclusão mudaria considerando a rentabilidade real?",
              placeholder: "Comparação original: ...\nComo mudaria considerando o real: ...",
            },
          },
        },
        {
          id: lid("rentabilidade-real", 4),
          title: "Rentabilidade real ao longo de vários anos",
          content: {
            explanation: [
              "Assim como juros compostos, a rentabilidade real também se acumula ao longo de vários períodos — o efeito de anos consecutivos de rentabilidade real baixa (ou negativa) reduz o poder de compra do patrimônio de forma mais intensa do que parece à primeira vista.",
              "Para calcular a rentabilidade real acumulada de vários anos, é preciso compor os fatores de cada ano (multiplicar, não somar), da mesma forma que se faz com juros compostos nominais.",
              "Esse acúmulo é especialmente relevante para objetivos de longo prazo, como aposentadoria: alguns poucos anos de rentabilidade real baixa podem exigir aportes bem maiores no restante do período para compensar.",
            ],
            examples: [
              "Cinco anos seguidos com rentabilidade real de 2% ao ano geram um ganho real acumulado bem maior do que 10% simplesmente somados, por causa do efeito composto.",
              "Um período prolongado de rentabilidade real próxima de zero pode significar que o patrimônio, mesmo crescendo em reais, não ganhou poder de compra real de fato.",
            ],
            diagram: {
              type: "formula",
              formula: "Rentabilidade real acumulada = [(1 + r₁) × (1 + r₂) × ... × (1 + rₙ)] − 1",
              caption: "Onde r₁, r₂... rₙ são as rentabilidades reais de cada período — compostas, não somadas.",
            },
            keyConcepts: [
              "A rentabilidade real se acumula de forma composta ao longo de vários períodos, assim como juros compostos.",
              "Poucos anos de rentabilidade real baixa têm impacto relevante em objetivos de longo prazo.",
              "O cálculo acumulado exige multiplicar os fatores de cada período, não somar as taxas.",
            ],
            quiz: [
              {
                question: "Como se calcula a rentabilidade real acumulada de vários anos seguidos?",
                options: [
                  "Somando as rentabilidades reais de cada ano",
                  "Multiplicando os fatores (1 + rentabilidade real) de cada ano, de forma composta",
                  "Usando apenas a rentabilidade do último ano",
                  "Dividindo a soma das rentabilidades pelo número de anos",
                ],
                correctIndex: 1,
                explanation: "Assim como juros compostos, a rentabilidade real acumulada exige multiplicar os fatores de cada período, não somar as taxas.",
              },
            ],
            exercise: {
              prompt: "Suponha 3 anos seguidos com rentabilidade real de 3%, 1% e 4%. Calcule a rentabilidade real acumulada no período.",
              placeholder: "Cálculo: (1,03) × (1,01) × (1,04) − 1 = ...\nRentabilidade real acumulada: ...%",
            },
          },
        },
        {
          id: lid("rentabilidade-real", 5),
          title: "Avaliando seus próprios investimentos pela rentabilidade real",
          content: {
            explanation: [
              "Uma boa prática é revisar periodicamente o desempenho dos próprios investimentos considerando sempre a rentabilidade real, não apenas o extrato nominal mostrado pela corretora ou banco.",
              "Isso ajuda a identificar se o patrimônio está de fato crescendo em poder de compra, ou apenas crescendo em número de reais sem avanço real — uma diferença importante especialmente em períodos de inflação mais alta.",
              "Essa avaliação também é útil para comparar diferentes investimentos dentro da própria carteira de forma justa, já que todos enfrentaram a mesma inflação no mesmo período.",
            ],
            examples: [
              "Comparar o extrato de rendimento nominal de dois investimentos diferentes na mesma carteira, no mesmo período, é uma comparação justa mesmo sem calcular o real — já que a inflação afetou os dois igualmente.",
              "Calcular a rentabilidade real anual do próprio patrimônio, ano a ano, dá uma visão mais honesta do progresso em direção aos objetivos financeiros de longo prazo.",
            ],
            keyConcepts: [
              "Revisar a rentabilidade real periodicamente dá uma visão mais honesta do progresso financeiro.",
              "O crescimento em reais nem sempre significa crescimento em poder de compra.",
              "Comparações dentro da própria carteira no mesmo período são justas mesmo sem calcular o real, já que a inflação afeta todos igualmente.",
            ],
            quiz: [
              {
                question: "Por que é importante calcular a rentabilidade real do próprio patrimônio, e não só olhar o extrato nominal?",
                options: [
                  "Porque o extrato nominal costuma estar errado",
                  "Porque o crescimento em reais nem sempre significa crescimento real de poder de compra",
                  "Porque a corretora exige esse cálculo",
                  "Isso não faz diferença na prática",
                ],
                correctIndex: 1,
                explanation: "Sem descontar a inflação, um patrimônio pode parecer crescer enquanto na verdade perde poder de compra.",
              },
            ],
            exercise: {
              prompt: "Se possível, calcule a rentabilidade real aproximada do seu patrimônio (ou de um investimento seu) no último ano, usando a inflação do período.",
              placeholder: "Rendimento nominal do período: ...%\nInflação do período: ...%\nRentabilidade real aproximada: ...%",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 6 — Juros reais
    // ---------------------------------------------------------------
    {
      id: "juros-reais",
      title: "Juros reais",
      description: "A taxa de juros que sobra depois de descontar a inflação do período.",
      icon: "📐",
      lessons: [
        {
          id: lid("juros-reais", 1),
          title: "O que são juros reais",
          content: {
            explanation: [
              "Juros reais são a taxa de juros que sobra depois de descontar a inflação — o mesmo conceito de rentabilidade real aplicado especificamente às taxas de juros da economia, como a Selic.",
              "Quando os juros reais são positivos, quem empresta dinheiro (inclusive investidores em renda fixa) ganha poder de compra; quando são negativos, mesmo recebendo juros nominais, o credor perde poder de compra.",
              "Juros reais altos tendem a favorecer quem poupa e investe em renda fixa, e a encarecer o crédito para quem toma empréstimos; juros reais baixos ou negativos fazem o oposto, incentivando consumo e investimento em vez de poupança.",
            ],
            examples: [
              "Se a Selic está em 12% ao ano e a inflação esperada é 5%, o juro real aproximado é de cerca de 7% ao ano.",
              "Se a Selic está em 4% ao ano e a inflação está em 6%, o juro real é negativo — quem investe em algo atrelado à Selic está, na prática, perdendo poder de compra.",
            ],
            keyConcepts: [
              "Juros reais: a taxa de juros que sobra depois de descontar a inflação do período.",
              "Juros reais positivos favorecem quem poupa; juros reais negativos corroem o poder de compra de quem empresta.",
              "É o mesmo conceito de rentabilidade real, aplicado à taxa de juros da economia.",
            ],
            quiz: [
              {
                question: "O que significa a economia estar com juros reais negativos?",
                options: [
                  "Que os bancos estão pagando os clientes para pegar empréstimos",
                  "Que a taxa de juros nominal é menor que a inflação, corroendo o poder de compra de quem empresta dinheiro",
                  "Que não existem mais juros na economia",
                  "Que o Banco Central parou de funcionar",
                ],
                correctIndex: 1,
                explanation: "Juros reais negativos significam que, mesmo recebendo juros nominais, o credor está perdendo poder de compra por causa da inflação.",
              },
            ],
            exercise: {
              prompt: "Pesquise a taxa Selic atual e uma estimativa da inflação esperada para o ano. Calcule aproximadamente o juro real atual.",
              placeholder: "Selic atual: ...%\nInflação esperada: ...%\nJuro real aproximado: ...%",
            },
          },
        },
        {
          id: lid("juros-reais", 2),
          title: "Juros reais x Selic x IPCA",
          content: {
            explanation: [
              "A Selic é a taxa básica de juros da economia brasileira, definida pelo Comitê de Política Monetária (Copom) do Banco Central; o IPCA é o índice oficial de inflação. A relação entre os dois define o juro real da economia.",
              "O Copom usa justamente essa relação para tomar decisões: quando a inflação (medida pelo IPCA) está alta ou acima da meta, o Banco Central tende a subir a Selic para tentar reduzir o consumo e conter a inflação; quando a inflação está controlada, há espaço para reduzir a Selic.",
              "Investimentos atrelados à Selic (como o Tesouro Selic) refletem diretamente essa taxa; para saber a rentabilidade real desses investimentos, basta aplicar o mesmo cálculo de juro real usando a inflação do período correspondente.",
            ],
            examples: [
              "Quando o IPCA acumulado sobe acima da meta de inflação, é comum o mercado esperar que o Copom eleve a Selic nas próximas reuniões.",
              "Um Tesouro Selic rende, aproximadamente, a própria taxa Selic — para saber o quanto isso representa em termos reais, é preciso descontar o IPCA do mesmo período.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Selic", items: ["Taxa básica de juros", "Definida pelo Copom", "Referência de renda fixa pós-fixada"] },
              right: { label: "IPCA", items: ["Índice oficial de inflação", "Referência de meta do Copom", "Usado para calcular o juro real"] },
            },
            keyConcepts: [
              "Selic: taxa básica de juros, definida pelo Copom.",
              "IPCA: índice oficial de inflação, referência da meta de política monetária.",
              "O juro real da economia nasce da relação entre esses dois indicadores.",
            ],
            quiz: [
              {
                question: "O que o Copom tende a fazer quando o IPCA está persistentemente acima da meta de inflação?",
                options: [
                  "Reduzir a Selic para estimular o consumo",
                  "Elevar a Selic, na tentativa de conter a inflação",
                  "Ignorar completamente o IPCA nas decisões",
                  "Extinguir o IPCA como índice",
                ],
                correctIndex: 1,
                explanation: "Subir a Selic encarece o crédito e tende a reduzir o consumo, ajudando a conter a inflação medida pelo IPCA.",
              },
            ],
            exercise: {
              prompt: "Pesquise a meta de inflação atual definida para o Brasil e compare com o IPCA acumulado recente. A inflação está acima, abaixo ou dentro da meta?",
              placeholder: "Meta de inflação: ...%\nIPCA acumulado recente: ...%\nSituação: acima / abaixo / dentro da meta",
            },
          },
        },
        {
          id: lid("juros-reais", 3),
          title: "Por que juros reais orientam decisões de investimento",
          content: {
            explanation: [
              "Quando os juros reais estão altos, investimentos de renda fixa (especialmente atrelados a Selic ou IPCA) tendem a oferecer um retorno real atrativo com risco relativamente baixo, o que pode reduzir o apetite por renda variável em busca de retorno.",
              "Quando os juros reais estão baixos ou negativos, a renda fixa tradicional perde atratividade em termos reais, o que historicamente tende a direcionar mais capital para renda variável e outras classes em busca de retorno real positivo.",
              "Por isso, o nível de juros reais é um dos fatores mais observados por investidores e analistas ao decidir a alocação entre renda fixa e renda variável em um determinado momento — embora nunca seja o único fator relevante.",
            ],
            examples: [
              "Em períodos de juro real elevado, é comum ver mais interesse por títulos de renda fixa pós-fixados ou atrelados à inflação, buscando o retorno real disponível com menos risco.",
              "Em períodos de juro real muito baixo, investidores costumam considerar mais fundos de ações ou fundos imobiliários, em busca de um retorno real que a renda fixa tradicional não está entregando.",
            ],
            keyConcepts: [
              "Juros reais altos tendem a tornar a renda fixa mais atrativa em termos de retorno real.",
              "Juros reais baixos tendem a direcionar mais interesse para renda variável.",
              "O nível de juros reais é um fator relevante, mas nunca o único, na decisão de alocação.",
            ],
            quiz: [
              {
                question: "O que costuma acontecer com a atratividade da renda fixa quando os juros reais estão muito baixos?",
                options: [
                  "Ela se torna ainda mais atrativa",
                  "Ela tende a perder atratividade em termos de retorno real, direcionando mais interesse para outras classes",
                  "Isso não afeta a renda fixa de forma alguma",
                  "A renda fixa deixa de existir",
                ],
                correctIndex: 1,
                explanation: "Com juros reais baixos, o retorno real da renda fixa fica menos atrativo, o que historicamente aumenta o interesse por outras classes de ativos.",
              },
            ],
            exercise: {
              prompt: "Com base no juro real atual que você pesquisou nas aulas anteriores, reflita: isso te faria pender mais para renda fixa ou renda variável hoje? Por quê?",
              placeholder: "Minha reflexão: ...",
            },
          },
        },
        {
          id: lid("juros-reais", 4),
          title: "Juros reais historicamente no Brasil",
          content: {
            explanation: [
              "O Brasil já passou, ao longo de sua história econômica recente, por períodos de juros reais bastante diferentes — houve fases de juros reais elevados, favoráveis a quem investe em renda fixa, e fases de juros reais próximos de zero ou até negativos.",
              "Essas oscilações costumam estar ligadas ao cenário de inflação e às políticas econômicas de cada período: crises de confiança, choques de preços (como em commodities ou câmbio) e mudanças na condução da política monetária afetam diretamente o nível de juros reais praticado.",
              "Entender que o juro real não é uma constante — ele varia bastante ao longo do tempo e entre países — ajuda a interpretar por que a mesma estratégia de investimento pode ter resultados bem diferentes dependendo da década em que foi aplicada.",
            ],
            examples: [
              "Comparar o juro real de diferentes momentos econômicos do Brasil ajuda a entender por que investidores de gerações diferentes podem ter experiências bem distintas com a renda fixa.",
              "Um mesmo investimento atrelado à Selic pode ter sido excelente em termos reais num período e apenas mediano em outro, dependendo do nível de inflação de cada momento.",
            ],
            keyConcepts: [
              "O Brasil já teve períodos de juros reais bem diferentes ao longo de sua história recente.",
              "Essas oscilações estão ligadas ao cenário de inflação e às políticas econômicas de cada época.",
              "O juro real não é uma constante — ele varia com o tempo, o que afeta a atratividade histórica da renda fixa.",
            ],
            quiz: [
              {
                question: "Por que é útil entender que o juro real varia bastante ao longo do tempo?",
                options: [
                  "Porque isso não tem nenhuma aplicação prática",
                  "Porque ajuda a entender por que a mesma estratégia de investimento pode ter resultados diferentes em décadas diferentes",
                  "Porque o juro real é sempre o mesmo, então isso é irrelevante",
                  "Porque juros reais só existem no Brasil",
                ],
                correctIndex: 1,
                explanation: "Como o cenário econômico muda, o juro real de cada período afeta diretamente os resultados de estratégias de investimento aplicadas naquele momento.",
              },
            ],
            exercise: {
              prompt: "Pesquise, de forma geral, como o cenário de juros no Brasil mudou nos últimos anos. O que você percebeu?",
              placeholder: "O que pesquisei: ...\nO que percebi sobre a variação dos juros: ...",
            },
          },
        },
        {
          id: lid("juros-reais", 5),
          title: "Usando juros reais para planejar objetivos de longo prazo",
          content: {
            explanation: [
              "Ao planejar um objetivo de longo prazo, como aposentadoria, faz mais sentido usar uma taxa de juro real esperada nas projeções, em vez de uma taxa nominal — assim, o valor final projetado já reflete o poder de compra futuro, não apenas o número em reais.",
              "Usar uma taxa de juro real conservadora nas projeções (em vez de otimista) ajuda a evitar surpresas desagradáveis, já que juros reais podem variar bastante ao longo de décadas, como visto na aula anterior.",
              "Ferramentas de simulação de aposentadoria ou de metas de longo prazo costumam pedir justamente uma taxa de juro real esperada, e não uma taxa nominal, exatamente por esse motivo.",
            ],
            examples: [
              "Projetar uma aposentadoria usando 4% de juro real ao ano, em vez de uma taxa nominal otimista, dá uma estimativa mais realista do poder de compra futuro do patrimônio acumulado.",
              "Uma simulação que usa juro real conservador tende a sugerir aportes mensais um pouco maiores do que uma simulação otimista — mas com mais chance de o objetivo ser realmente atingido.",
            ],
            keyConcepts: [
              "Projeções de longo prazo devem usar juro real esperado, não taxa nominal, para refletir o poder de compra futuro.",
              "Usar uma taxa real conservadora reduz o risco de projeções otimistas demais.",
              "Ferramentas de simulação de aposentadoria costumam pedir juro real justamente por esse motivo.",
            ],
            quiz: [
              {
                question: "Por que simulações de aposentadoria costumam pedir uma taxa de juro real, em vez de uma taxa nominal?",
                options: [
                  "Porque taxas nominais são proibidas em simulações financeiras",
                  "Porque o juro real reflete melhor o poder de compra futuro do patrimônio, o que realmente importa para o objetivo",
                  "Porque taxas reais são sempre mais altas",
                  "Não há diferença prática entre as duas",
                ],
                correctIndex: 1,
                explanation: "O que importa para o objetivo final é quanto aquele patrimônio vai efetivamente comprar no futuro, e é isso que o juro real capta.",
              },
            ],
            exercise: {
              prompt: "Se você já fez (ou vai fazer) uma projeção de longo prazo, verifique se ela usa uma taxa nominal ou uma taxa real. Ajuste se necessário.",
              placeholder: "Taxa usada na minha projeção: ...\nÉ nominal ou real? ...\nAjuste necessário: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 7 — Rebalanceamento de carteira
    // ---------------------------------------------------------------
    {
      id: "rebalanceamento-de-carteira",
      title: "Rebalanceamento de carteira",
      description: "Manter a carteira alinhada ao plano original, mesmo com o tempo mudando os pesos.",
      icon: "🔄",
      lessons: [
        {
          id: lid("rebalanceamento-de-carteira", 1),
          title: "Por que a carteira 'desalinha' sozinha com o tempo",
          content: {
            explanation: [
              "Cada ativo ou classe da carteira tem um desempenho diferente ao longo do tempo — alguns sobem mais, outros menos, alguns até caem — e isso muda naturalmente o peso de cada um dentro do total, mesmo sem nenhuma movimentação do investidor.",
              "Esse desalinhamento gradual pode levar a carteira a assumir um nível de risco diferente do planejado originalmente: se a parcela de renda variável cresce muito além do previsto, a carteira toda fica mais arriscada do que o investidor havia decidido tolerar.",
              "É esse fenômeno — a carteira se afastando sozinha da alocação-alvo — que justifica a prática do rebalanceamento, tema aprofundado no restante deste curso.",
            ],
            examples: [
              "Uma carteira que começou 70% renda fixa e 30% ações pode, depois de um período de alta nas ações, virar 55% renda fixa e 45% ações, mesmo sem nenhuma nova compra ou venda.",
              "Esse mesmo processo pode acontecer ao contrário: se a renda variável cai bastante, a carteira pode ficar mais conservadora do que o planejado, por puro efeito de desempenho.",
            ],
            keyConcepts: [
              "Ativos diferentes têm desempenhos diferentes, o que muda o peso de cada um na carteira com o tempo.",
              "Esse desalinhamento pode levar a carteira a um nível de risco diferente do planejado, para mais ou para menos.",
              "É esse fenômeno que justifica a prática do rebalanceamento periódico.",
            ],
            quiz: [
              {
                question: "O que faz uma carteira se desalinhar da alocação-alvo com o tempo, mesmo sem nenhuma movimentação do investidor?",
                options: [
                  "Erros do sistema da corretora",
                  "Desempenhos diferentes entre os ativos, que mudam o peso de cada um no total",
                  "A cobrança de taxas de administração",
                  "Isso nunca acontece de fato",
                ],
                correctIndex: 1,
                explanation: "Se um ativo sobe mais que outro, ele passa a representar uma fatia maior da carteira, mesmo sem nenhuma compra ou venda adicional.",
              },
            ],
            exercise: {
              prompt: "Se você tem uma carteira há algum tempo, compare os percentuais atuais com os planejados originalmente. Houve desalinhamento?",
              placeholder: "Alocação planejada: ...\nAlocação atual: ...\nDesalinhamento observado: ...",
            },
          },
        },
        {
          id: lid("rebalanceamento-de-carteira", 2),
          title: "Rebalanceamento por tempo x por desvio de meta",
          content: {
            explanation: [
              "Rebalanceamento por tempo significa revisar e ajustar a carteira em intervalos regulares e predefinidos — por exemplo, a cada 6 ou 12 meses — independentemente de quanto ela se desalinhou até aquele momento.",
              "Rebalanceamento por desvio de meta significa ajustar a carteira sempre que um percentual se afastar demais do planejado (por exemplo, mais de 5 pontos percentuais), independentemente de quanto tempo passou.",
              "Cada abordagem tem vantagens: rebalancear por tempo é mais simples de seguir como rotina, enquanto rebalancear por desvio reage mais rápido a movimentos bruscos de mercado, mas exige acompanhar a carteira com mais frequência.",
            ],
            examples: [
              "Um investidor que rebalanceia por tempo pode revisar a carteira todo mês de janeiro, ajustando de volta aos percentuais-alvo, não importa o quanto ela desviou.",
              "Um investidor que rebalanceia por desvio de meta pode agir em qualquer mês do ano, assim que perceber que a renda variável passou de, por exemplo, 5 pontos percentuais acima do planejado.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Por tempo", items: ["Revisão em intervalos fixos", "Mais simples de seguir como rotina"] },
              right: { label: "Por desvio de meta", items: ["Ajusta quando o desvio ultrapassa um limite", "Reage mais rápido a movimentos bruscos"] },
            },
            keyConcepts: [
              "Rebalanceamento por tempo: revisão em intervalos regulares predefinidos.",
              "Rebalanceamento por desvio de meta: ajuste sempre que um percentual se afastar demais do planejado.",
              "Cada abordagem tem vantagens diferentes de simplicidade e de velocidade de reação.",
            ],
            quiz: [
              {
                question: "Qual é a principal vantagem do rebalanceamento por desvio de meta em relação ao rebalanceamento por tempo?",
                options: [
                  "Ele nunca precisa ser feito",
                  "Ele reage mais rapidamente a movimentos bruscos de mercado, sem esperar uma data fixa",
                  "Ele elimina totalmente o risco da carteira",
                  "Ele é sempre mais barato",
                ],
                correctIndex: 1,
                explanation: "Como o gatilho é o desvio em si, e não uma data fixa, essa abordagem pode agir mais rápido diante de movimentos bruscos de mercado.",
              },
            ],
            exercise: {
              prompt: "Pense em qual abordagem de rebalanceamento (por tempo ou por desvio) faria mais sentido pra sua rotina. Por quê?",
              placeholder: "Abordagem escolhida: ...\nJustificativa: ...",
            },
          },
        },
        {
          id: lid("rebalanceamento-de-carteira", 3),
          title: "Rebalanceando com aportes novos (sem vender nada)",
          content: {
            explanation: [
              "Uma forma de rebalancear sem precisar vender nenhuma posição existente é direcionar os aportes novos (o dinheiro que você adiciona à carteira) preferencialmente para as classes que estão abaixo do peso-alvo, até que a carteira volte a se aproximar do planejado.",
              "Essa abordagem tem uma vantagem relevante: evita gerar eventos de venda que podem ter custos ou impostos associados (tema da próxima aula), já que apenas redireciona o dinheiro novo em vez de mexer no que já está investido.",
              "A limitação dessa abordagem é que ela só funciona bem quando há aportes regulares relevantes em relação ao tamanho total da carteira — para carteiras grandes com poucos aportes novos, pode não ser suficiente para corrigir desvios maiores.",
            ],
            examples: [
              "Se a renda variável está acima do peso-alvo, um investidor pode direcionar 100% do próximo aporte para renda fixa, até que os percentuais voltem a se aproximar do planejado.",
              "Esse método é bastante usado por quem está na fase de acumulação (aportando regularmente), sendo menos eficaz para quem já não aporta mais e vive de uma carteira grande já formada.",
            ],
            keyConcepts: [
              "Rebalancear via aportes novos direciona o dinheiro adicionado para as classes abaixo do peso-alvo.",
              "Essa abordagem evita eventos de venda, reduzindo custos e impostos associados.",
              "Funciona melhor quando os aportes novos são relevantes em relação ao tamanho total da carteira.",
            ],
            quiz: [
              {
                question: "Qual é a principal vantagem de rebalancear direcionando aportes novos, em vez de vender posições existentes?",
                options: [
                  "Garante retorno maior sempre",
                  "Evita gerar eventos de venda, o que reduz custos e impostos associados",
                  "É a única forma legal de rebalancear",
                  "Funciona igualmente bem para qualquer tamanho de carteira",
                ],
                correctIndex: 1,
                explanation: "Ao não vender nada, essa abordagem evita custos de corretagem e possíveis impostos sobre ganho de capital que uma venda geraria.",
              },
            ],
            exercise: {
              prompt: "Se você faz aportes regulares, pense em como poderia direcionar o próximo aporte para reequilibrar sua carteira, sem vender nada.",
              placeholder: "Classe que está acima do peso-alvo: ...\nPara onde direcionaria o próximo aporte: ...",
            },
          },
        },
        {
          id: lid("rebalanceamento-de-carteira", 4),
          title: "Custos e impostos ao rebalancear vendendo posições",
          content: {
            explanation: [
              "Quando o rebalanceamento exige vender posições (não só direcionar aportes novos), é preciso considerar os custos envolvidos: corretagem, eventuais taxas de saída, e principalmente o imposto de renda sobre o ganho de capital gerado pela venda.",
              "Em renda variável, vendas acima de certos limites mensais podem gerar imposto de renda a pagar sobre o lucro da operação; em fundos, existe o come-cotas (antecipação semestral de imposto de renda), que já reduz parte do rendimento antes mesmo do resgate.",
              "Por esses motivos, rebalancear vendendo posições costuma ser menos eficiente do que rebalancear via aportes novos, sendo normalmente reservado para quando o desvio é grande demais para ser corrigido só com dinheiro novo.",
            ],
            examples: [
              "Vender ações com lucro pode gerar imposto de renda a pagar sobre o ganho de capital, dependendo do valor total vendido no mês.",
              "Resgatar um fundo de investimento para rebalancear pode significar realizar o come-cotas antecipadamente, mesmo que esse imposto já fosse devido eventualmente.",
            ],
            keyConcepts: [
              "Vender posições para rebalancear pode gerar corretagem e imposto de renda sobre o ganho de capital.",
              "Em fundos, o come-cotas antecipa parte do imposto de renda mesmo antes do resgate.",
              "Por isso, rebalancear vendendo é normalmente menos eficiente do que rebalancear via aportes novos.",
            ],
            quiz: [
              {
                question: "Por que rebalancear vendendo posições costuma ser menos eficiente do que rebalancear via aportes novos?",
                options: [
                  "Porque vender é sempre proibido por lei",
                  "Porque vendas podem gerar corretagem e imposto de renda sobre o ganho de capital",
                  "Porque vender sempre gera prejuízo",
                  "Não há diferença de eficiência entre os dois métodos",
                ],
                correctIndex: 1,
                explanation: "Custos de corretagem e impostos sobre o ganho de capital reduzem a eficiência de rebalancear vendendo posições, em comparação a direcionar apenas aportes novos.",
              },
            ],
            exercise: {
              prompt: "Pesquise (ou lembre) se algum investimento seu tem come-cotas ou gera imposto de renda na venda. Isso influenciaria sua decisão de como rebalancear?",
              placeholder: "Investimento com come-cotas/IR na venda: ...\nComo isso influenciaria minha decisão: ...",
            },
          },
        },
        {
          id: lid("rebalanceamento-de-carteira", 5),
          title: "Criando sua rotina de rebalanceamento",
          content: {
            explanation: [
              "Ter uma rotina definida de rebalanceamento evita duas armadilhas comuns: nunca rebalancear (deixando a carteira derivar para um risco não planejado) e rebalancear com frequência excessiva (gerando custos desnecessários e reagindo a ruído de curto prazo em vez de tendência real).",
              "Uma rotina simples e eficaz para a maioria dos investidores combina os dois métodos vistos: revisar a carteira em um intervalo fixo (por exemplo, a cada 6 ou 12 meses) e, entre essas revisões, direcionar aportes novos para corrigir desvios pequenos ao longo do caminho.",
              "O mais importante é escolher uma rotina que você realmente vai seguir de forma consistente — uma estratégia sofisticada que nunca é executada vale menos do que uma simples aplicada com disciplina.",
            ],
            examples: [
              "Um investidor pode definir: revisar a carteira toda vez que fizer a declaração anual de imposto de renda, aproveitando que já vai estar olhando a posição de todos os investimentos.",
              "Entre as revisões anuais, esse mesmo investidor pode ir direcionando os aportes mensais para as classes que estiverem abaixo do peso-alvo, sem precisar vender nada no meio do caminho.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Defina um intervalo fixo de revisão completa da carteira (ex.: a cada 6 ou 12 meses)",
                "Entre as revisões, direcione aportes novos para corrigir pequenos desvios",
                "Na revisão completa, avalie se é necessário vender posições para corrigir desvios maiores",
                "Considere os custos e impostos antes de decidir vender",
              ],
            },
            keyConcepts: [
              "Uma rotina evita tanto o excesso quanto a falta de rebalanceamento.",
              "Combinar revisão periódica com direcionamento de aportes novos costuma ser eficaz para a maioria dos investidores.",
              "A melhor rotina é a que você realmente consegue seguir com consistência.",
            ],
            quiz: [
              {
                question: "Por que rebalancear com frequência excessiva pode ser um problema?",
                options: [
                  "Porque é ilegal rebalancear mais de uma vez por ano",
                  "Porque pode gerar custos desnecessários e reagir a oscilações de curto prazo que não representam uma tendência real",
                  "Porque a carteira nunca se desalinha de verdade",
                  "Não há problema nenhum em rebalancear com frequência",
                ],
                correctIndex: 1,
                explanation: "Rebalancear demais pode gerar custos (corretagem, impostos) e reagir a ruído de curto prazo, em vez de esperar um desalinhamento real se formar.",
              },
            ],
            exercise: {
              prompt: "Defina uma rotina de rebalanceamento que você realmente conseguiria seguir: com que frequência, e o que faria entre uma revisão e outra.",
              placeholder: "Frequência de revisão completa: ...\nO que farei entre as revisões: ...",
            },
          },
        },
      ],
    },
  ],
};
