import type { Trail } from "../types";

const trailId = "credito-e-dividas";
const lid = (courseId: string, n: number) => `${trailId}.${courseId}.aula-${n}`;

export const creditoEDividasTrail: Trail = {
  id: trailId,
  title: "Crédito e dívidas",
  description: "Entender crédito, score e como sair (e ficar fora) do vermelho.",
  color: "red",
  courses: [
    // ---------------------------------------------------------------
    // Curso 1 — Como funciona o cartão de crédito
    // ---------------------------------------------------------------
    {
      id: "como-funciona-o-cartao-de-credito",
      title: "Como funciona o cartão de crédito",
      description: "A ferramenta financeira mais usada — e mais mal compreendida — do país.",
      icon: "💳",
      lessons: [
        {
          id: lid("como-funciona-o-cartao-de-credito", 1),
          title: "Como o cartão de crédito funciona por dentro",
          content: {
            explanation: [
              "O cartão de crédito é uma linha de crédito rotativa concedida por um banco ou fintech (o emissor): ao comprar algo, você não paga na hora — o emissor paga o lojista, e você paga o emissor depois, na fatura.",
              "Esse acordo tem um teto: o limite de crédito, o valor máximo que você pode dever ao emissor a qualquer momento. Conforme você paga a fatura, o limite usado se libera novamente.",
              "As bandeiras (Visa, Mastercard, Elo, entre outras) são responsáveis por processar a transação entre lojista e emissor, mas quem efetivamente concede o crédito e decide o limite é o emissor — o banco ou fintech que emitiu o cartão.",
            ],
            examples: [
              "Ao comprar um produto de R$ 200 no crédito, o lojista recebe o pagamento do emissor do cartão em poucos dias, e você paga esse valor ao emissor na fatura do mês.",
              "Um cartão com limite de R$ 2.000 permite gastar até esse total somado entre todas as compras não pagas ainda — cada pagamento de fatura libera parte desse limite de novo.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Você compra algo com o cartão",
                "O emissor do cartão paga o lojista",
                "A compra entra na sua fatura do mês (ou de um mês futuro, dependendo da data)",
                "Você paga a fatura ao emissor até o vencimento",
              ],
            },
            keyConcepts: [
              "O emissor do cartão paga o lojista na hora e cobra de você depois, na fatura.",
              "O limite de crédito é o teto do que você pode dever ao emissor a qualquer momento.",
              "A bandeira processa a transação; quem concede o crédito é o emissor (banco ou fintech).",
            ],
            quiz: [
              {
                question: "Quando você compra algo no cartão de crédito, quem paga o lojista na hora?",
                options: [
                  "A bandeira do cartão (Visa, Mastercard, etc.)",
                  "O emissor do cartão (o banco ou fintech que concedeu o crédito)",
                  "O próprio lojista financia a compra",
                  "Ninguém paga até você quitar a fatura",
                ],
                correctIndex: 1,
                explanation: "O emissor adianta o pagamento ao lojista e depois cobra esse valor de você na fatura — é isso que caracteriza o crédito.",
              },
            ],
            exercise: {
              prompt: "Verifique no app do seu banco (ou fatura) qual é o limite total do seu cartão e quanto dele está disponível hoje.",
              placeholder: "Limite total: R$ ...\nLimite disponível hoje: R$ ...",
            },
          },
        },
        {
          id: lid("como-funciona-o-cartao-de-credito", 2),
          title: "Fatura, limite e data de fechamento",
          content: {
            explanation: [
              "A fatura é o resumo mensal de tudo que foi comprado no cartão naquele período, junto com o valor total a pagar e a data de vencimento.",
              "A data de fechamento é o corte: compras feitas antes dela entram na fatura atual; compras feitas depois entram só na fatura seguinte. Escolher bem a data de fechamento (quando o banco permite) pode alongar o prazo entre a compra e o pagamento.",
              "O limite de crédito é diferente da fatura: é o teto total que você pode dever ao emissor a qualquer momento, somando faturas em aberto e parcelas futuras — não apenas o valor da fatura do mês atual.",
            ],
            examples: [
              "Uma compra feita um dia depois do fechamento só aparece na fatura do mês seguinte, dando praticamente um mês a mais de prazo para pagar.",
              "Mesmo pagando a fatura em dia, uma parte do limite pode continuar comprometida por causa de compras parceladas que ainda vão aparecer em faturas futuras.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Data de fechamento", items: ["Corte do que entra na fatura atual", "Compras depois vão para a próxima fatura"] },
              right: { label: "Data de vencimento", items: ["Prazo final para pagar a fatura", "Atraso gera juros e pode gerar negativação"] },
            },
            keyConcepts: [
              "Fatura: resumo mensal das compras e o valor total a pagar.",
              "Data de fechamento: corte entre a fatura atual e a próxima.",
              "Limite de crédito: teto total devido ao emissor, incluindo parcelas futuras — não só a fatura do mês.",
            ],
            quiz: [
              {
                question: "O que acontece com uma compra feita um dia depois da data de fechamento do cartão?",
                options: [
                  "Ela é cancelada automaticamente",
                  "Ela entra na fatura seguinte, não na fatura atual",
                  "Ela é cobrada em dobro",
                  "Ela não afeta o limite disponível",
                ],
                correctIndex: 1,
                explanation: "Compras feitas após o fechamento só aparecem na fatura seguinte, ganhando um prazo maior até o vencimento.",
              },
            ],
            exercise: {
              prompt: "Verifique a data de fechamento e a data de vencimento do seu cartão. Quantos dias de intervalo existem entre elas?",
              placeholder: "Data de fechamento: ...\nData de vencimento: ...\nIntervalo: ... dias",
            },
          },
        },
        {
          id: lid("como-funciona-o-cartao-de-credito", 3),
          title: "Os juros do rotativo (e por que evitá-los a todo custo)",
          content: {
            explanation: [
              "O crédito rotativo é acionado quando você paga menos que o valor total da fatura (mas pelo menos o pagamento mínimo): o restante da dívida passa a ser cobrado com juros — historicamente entre as taxas de juros mais altas oferecidas no mercado de crédito brasileiro.",
              "Por regulação do Banco Central, quem usa o rotativo por mais de um período (normalmente 30 dias) deve receber do emissor uma oferta de parcelamento da dívida com juros menores que os do rotativo — ainda assim, normalmente bem mais caro que outras formas de crédito.",
              "Por isso, a orientação prática é: evitar o rotativo a todo custo. Se a fatura não cabe inteira, é quase sempre mais barato buscar outra forma de crédito (como um empréstimo pessoal) para quitá-la do que deixar entrar no rotativo.",
            ],
            examples: [
              "Pagar apenas o mínimo da fatura por dois ou três meses seguidos pode fazer o saldo devedor crescer rapidamente, mesmo sem novas compras, por causa dos juros do rotativo.",
              "Migrar uma dívida de rotativo para um parcelamento oferecido pelo próprio banco (ou para um empréstimo pessoal com taxa menor) costuma reduzir bastante o custo total da dívida.",
            ],
            keyConcepts: [
              "Rotativo: quando se paga menos que o total da fatura, o restante vira dívida com juros muito altos.",
              "Por lei, o uso prolongado do rotativo deve ser seguido de uma oferta de parcelamento com juros menores.",
              "É quase sempre mais barato buscar outra forma de crédito do que deixar a dívida entrar no rotativo.",
            ],
            quiz: [
              {
                question: "O que ativa o crédito rotativo do cartão?",
                options: [
                  "Usar o cartão em compras internacionais",
                  "Pagar menos que o valor total da fatura",
                  "Ter um limite de crédito muito alto",
                  "Trocar de bandeira do cartão",
                ],
                correctIndex: 1,
                explanation: "O rotativo é acionado justamente quando o pagamento da fatura é parcial, deixando um saldo devedor sujeito a juros muito altos.",
              },
            ],
            exercise: {
              prompt: "Se você já usou o rotativo do cartão alguma vez, lembre o que aconteceu com o valor da dívida no mês seguinte. Se nunca usou, pesquise a taxa de juros do rotativo do seu próprio cartão.",
              placeholder: "Minha experiência ou pesquisa: ...",
            },
          },
        },
        {
          id: lid("como-funciona-o-cartao-de-credito", 4),
          title: "Parcelamento: quando faz sentido e quando não faz",
          content: {
            explanation: [
              "Existem dois tipos bem diferentes de parcelamento no cartão: o parcelamento sem juros oferecido pelo próprio lojista (o valor total é o mesmo, só dividido em parcelas) e o parcelamento da fatura com juros, oferecido pelo banco quando você não consegue pagar o total.",
              "O parcelamento sem juros do lojista pode fazer sentido para compras planejadas, desde que a parcela caiba confortavelmente no orçamento dos meses seguintes, sem comprometer outras contas.",
              "Já parcelar a fatura ou usar o parcelamento com juros do banco é, na prática, contrair uma dívida cara — deveria ser tratado como último recurso, e evitado sempre que houver alternativa mais barata.",
            ],
            examples: [
              "Parcelar uma geladeira em 10x sem juros, com parcelas que cabem confortavelmente no orçamento, é um uso razoável do parcelamento.",
              "Parcelar a fatura do cartão porque ela ficou grande demais para pagar de uma vez é um sinal de alerta sobre o orçamento, não uma solução barata.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Parcelamento sem juros (lojista)", items: ["Valor total não muda", "Pode fazer sentido se a parcela cabe no orçamento"] },
              right: { label: "Parcelamento da fatura (banco)", items: ["Tem juros, aumenta o valor total", "Sinal de que os gastos superaram a capacidade de pagamento"] },
            },
            keyConcepts: [
              "Parcelamento sem juros do lojista não muda o valor total, só divide o pagamento.",
              "Parcelamento da fatura (com juros do banco) aumenta o valor total devido.",
              "O primeiro pode ser razoável se planejado; o segundo deveria ser evitado sempre que possível.",
            ],
            quiz: [
              {
                question: "Qual a principal diferença entre o parcelamento sem juros do lojista e o parcelamento da fatura pelo banco?",
                options: [
                  "Não existe diferença, os dois custam o mesmo",
                  "O parcelamento da fatura pelo banco tem juros e aumenta o valor total devido, diferente do parcelamento sem juros do lojista",
                  "O parcelamento sem juros do lojista é sempre proibido",
                  "O parcelamento da fatura é sempre mais barato",
                ],
                correctIndex: 1,
                explanation: "O parcelamento sem juros do lojista mantém o valor total; o parcelamento da fatura pelo banco adiciona juros, encarecendo a dívida.",
              },
            ],
            exercise: {
              prompt: "Pense numa compra parcelada que você fez (ou pretende fazer). A parcela cabe confortavelmente no seu orçamento dos próximos meses?",
              placeholder: "Compra: ...\nValor da parcela: R$ ...\nCabe no orçamento? ...",
            },
          },
        },
        {
          id: lid("como-funciona-o-cartao-de-credito", 5),
          title: "Usando o cartão a seu favor, não contra você",
          content: {
            explanation: [
              "Usado de forma responsável, o cartão de crédito tem vantagens reais: construção de histórico positivo para o score de crédito, programas de pontos ou milhas, e um prazo grátis entre a compra e o pagamento — desde que a fatura seja paga integralmente todo mês.",
              "A regra de ouro para usar o cartão a seu favor é simples: nunca gastar no crédito o que você não teria em dinheiro disponível para pagar a fatura inteira no vencimento.",
              "Tratar o limite do cartão como se fosse renda extra — e não como o que ele realmente é, uma dívida futura — é o erro mais comum que transforma essa ferramenta útil numa armadilha.",
            ],
            examples: [
              "Usar o cartão para todas as compras do mês, mas guardando o dinheiro correspondente e pagando a fatura integral, aproveita o prazo grátis sem nenhum custo extra.",
              "Gastar no cartão além do que se teria em dinheiro para pagar, contando em 'dar um jeito depois', é o caminho mais comum para acumular dívidas caras.",
            ],
            keyConcepts: [
              "Usado com disciplina, o cartão constrói histórico de crédito e pode gerar prazo grátis e benefícios.",
              "A regra de ouro: só gastar no cartão o que você já teria em dinheiro para pagar a fatura inteira.",
              "Tratar o limite do cartão como renda extra, em vez de dívida futura, é o erro mais comum.",
            ],
            quiz: [
              {
                question: "Qual é a regra prática mais importante para usar o cartão de crédito sem se endividar?",
                options: [
                  "Nunca usar o cartão para nada",
                  "Só gastar no cartão o que você já teria em dinheiro disponível para pagar a fatura inteira",
                  "Sempre usar o limite máximo disponível",
                  "Trocar de cartão a cada seis meses",
                ],
                correctIndex: 1,
                explanation: "Essa regra evita que o cartão vire uma forma de gastar além da própria capacidade de pagamento, prevenindo o endividamento.",
              },
            ],
            exercise: {
              prompt: "Reflita sobre seu uso do cartão de crédito hoje: você costuma pagar a fatura inteira, ou já precisou parcelar/usar o rotativo?",
              placeholder: "Meu padrão de uso: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 2 — Score de crédito
    // ---------------------------------------------------------------
    {
      id: "score-de-credito",
      title: "Score de crédito",
      description: "O que é, como é calculado e como melhorar o seu.",
      icon: "📶",
      lessons: [
        {
          id: lid("score-de-credito", 1),
          title: "O que é o score de crédito",
          content: {
            explanation: [
              "O score de crédito é uma nota, geralmente numa escala de 0 a 1000, calculada por birôs de crédito (como Serasa, Boa Vista e SPC) para estimar a probabilidade de uma pessoa pagar suas contas em dia.",
              "Bancos, financeiras e lojas usam esse número (junto com outras informações) para decidir se concedem crédito a alguém, e a que taxa de juros — quanto maior o score, geralmente melhores as condições oferecidas.",
              "O score não é calculado por um único banco: cada birô tem sua própria metodologia e sua própria nota, então o mesmo consumidor pode ter scores um pouco diferentes em birôs diferentes.",
            ],
            examples: [
              "Duas pessoas pedindo o mesmo empréstimo podem receber taxas de juros diferentes, em parte por causa da diferença entre seus scores de crédito.",
              "Uma pessoa pode ter um score de 750 na Serasa e um número diferente em outro birô, mesmo com o mesmo histórico financeiro.",
            ],
            keyConcepts: [
              "Score de crédito: nota que estima a probabilidade de alguém pagar suas contas em dia.",
              "É calculado por birôs de crédito, usados por bancos e lojas na hora de conceder crédito.",
              "Cada birô tem sua própria metodologia, então os scores podem variar entre eles.",
            ],
            quiz: [
              {
                question: "Para que serve o score de crédito, na prática?",
                options: [
                  "Para calcular o imposto de renda devido",
                  "Para estimar, aos olhos de bancos e lojas, a probabilidade de a pessoa pagar suas contas em dia",
                  "Para definir o salário de uma pessoa",
                  "Para bloquear compras acima de um certo valor",
                ],
                correctIndex: 1,
                explanation: "O score ajuda credores a decidir se concedem crédito e em que condições, com base na probabilidade estimada de pagamento.",
              },
            ],
            exercise: {
              prompt: "Consulte seu score de crédito em algum birô (a consulta ao próprio score costuma ser gratuita). Anote o resultado.",
              placeholder: "Birô consultado: ...\nScore encontrado: ...",
            },
          },
        },
        {
          id: lid("score-de-credito", 2),
          title: "Quais fatores influenciam o score",
          content: {
            explanation: [
              "O fator mais relevante para a maioria dos modelos de score é o histórico de pagamentos: contas pagas em dia pesam positivamente, enquanto atrasos e negativações pesam negativamente.",
              "O tempo de relacionamento com crédito também importa: um histórico mais longo de uso responsável de crédito tende a ser visto de forma mais favorável do que um histórico curto ou inexistente.",
              "Outros fatores incluem o nível atual de endividamento, a diversidade de tipos de crédito utilizados e o número de consultas recentes de crédito feitas em seu nome (muitas solicitações em pouco tempo podem sinalizar necessidade urgente de crédito).",
            ],
            examples: [
              "Uma pessoa que sempre paga as contas em dia, mesmo com um cartão de crédito modesto, tende a construir um score melhor ao longo do tempo do que alguém sem nenhum histórico de crédito.",
              "Solicitar vários cartões ou empréstimos em um curto período pode impactar negativamente o score, mesmo que todos sejam aprovados.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Histórico de pagamentos: pagar em dia pesa a favor, atrasos pesam contra",
                "Tempo de relacionamento com crédito: histórico mais longo tende a ajudar",
                "Nível de endividamento atual",
                "Número de consultas de crédito recentes em seu nome",
              ],
            },
            keyConcepts: [
              "Histórico de pagamentos é geralmente o fator mais relevante do score.",
              "Tempo de relacionamento com crédito e nível de endividamento também influenciam.",
              "Muitas consultas de crédito em pouco tempo podem impactar o score negativamente.",
            ],
            quiz: [
              {
                question: "Qual costuma ser o fator mais relevante para o score de crédito na maioria dos modelos?",
                options: [
                  "A cidade onde a pessoa mora",
                  "O histórico de pagamentos (contas pagas em dia ou atrasadas)",
                  "A quantidade de cartões de crédito que a pessoa possui",
                  "A idade da pessoa",
                ],
                correctIndex: 1,
                explanation: "Pagar (ou não pagar) as contas em dia é, na maioria dos modelos, o sinal mais forte sobre a probabilidade de pagamento futuro.",
              },
            ],
            exercise: {
              prompt: "Pense no seu histórico de pagamentos recente. Há atrasos ou negativações que podem estar afetando seu score hoje?",
              placeholder: "Minha avaliação: ...",
            },
          },
        },
        {
          id: lid("score-de-credito", 3),
          title: "Mitos comuns sobre o score de crédito",
          content: {
            explanation: [
              "Um mito comum é achar que consultar o próprio score o reduz — isso é falso: a autoconsulta não afeta o score de forma negativa, diferente de quando terceiros (como um banco avaliando um pedido de crédito) fazem a consulta.",
              "Outro mito é pensar que não ter dívida nenhuma garante o score máximo. Na prática, ter algum histórico de crédito bem administrado (como um cartão pago em dia) costuma ajudar mais do que a ausência total de qualquer relação com crédito.",
              "Também é um mito achar que um score baixo é definitivo: com hábitos financeiros consistentes ao longo do tempo — pagamentos em dia, redução de dívidas — o score pode melhorar de forma real.",
            ],
            examples: [
              "Alguém que nunca teve cartão de crédito ou fez nenhum tipo de compra a prazo pode ter um score menor do que esperava, justamente por falta de histórico para avaliar.",
              "Uma pessoa que quita uma negativação e passa a pagar tudo em dia costuma ver o score melhorar gradualmente nos meses seguintes.",
            ],
            keyConcepts: [
              "Consultar o próprio score não o reduz — isso é um mito.",
              "Não ter nenhum histórico de crédito não garante o score máximo; algum histórico bem administrado costuma ajudar.",
              "Um score baixo não é definitivo — pode melhorar com hábitos financeiros consistentes.",
            ],
            quiz: [
              {
                question: "Consultar o próprio score de crédito faz ele diminuir?",
                options: [
                  "Sim, sempre que você consulta, o score cai",
                  "Não, a autoconsulta ao próprio score não tem esse efeito negativo",
                  "Só cai se você consultar mais de uma vez por dia",
                  "Depende do banco",
                ],
                correctIndex: 1,
                explanation: "A autoconsulta é diferente de uma consulta feita por um credor avaliando crédito — ela não prejudica o score.",
              },
            ],
            exercise: {
              prompt: "Antes desta aula, você acreditava em algum desses mitos sobre o score? Qual?",
              placeholder: "Mito que eu acreditava (ou não): ...",
            },
          },
        },
        {
          id: lid("score-de-credito", 4),
          title: "Estratégias para melhorar seu score",
          content: {
            explanation: [
              "A estratégia mais eficaz e direta é simples de enunciar, ainda que nem sempre fácil de executar: pagar as contas em dia, de forma consistente ao longo do tempo.",
              "Quitar negativações existentes é outro passo importante — enquanto uma dívida negativada permanece em aberto, ela continua pesando contra o score.",
              "Outras estratégias incluem manter o uso do limite de crédito disponível numa proporção saudável (não usar sempre o limite no máximo), evitar solicitar vários créditos novos em um curto período, e manter contas antigas ativas, já que o tempo de relacionamento com crédito também conta a favor.",
            ],
            examples: [
              "Uma pessoa que quita uma dívida negativada e passa a pagar todas as contas em dia costuma ver uma melhora gradual e consistente do score nos meses seguintes.",
              "Manter um cartão antigo ativo, mesmo usando pouco, pode ajudar a preservar um histórico de relacionamento com crédito mais longo.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Pague as contas em dia, de forma consistente",
                "Quite negativações existentes o quanto antes",
                "Evite usar sempre o limite máximo do crédito disponível",
                "Evite solicitar vários créditos novos em um curto período",
              ],
            },
            keyConcepts: [
              "Pagar em dia de forma consistente é a estratégia mais eficaz para melhorar o score.",
              "Quitar negativações existentes remove um peso relevante contra o score.",
              "Usar o limite de forma moderada e evitar muitas solicitações de crédito recentes também ajuda.",
            ],
            quiz: [
              {
                question: "Qual é considerada a estratégia mais eficaz para melhorar o score de crédito ao longo do tempo?",
                options: [
                  "Trocar de banco frequentemente",
                  "Pagar as contas em dia de forma consistente",
                  "Nunca usar cartão de crédito",
                  "Consultar o score todos os dias",
                ],
                correctIndex: 1,
                explanation: "A consistência em pagar em dia é o fator que mais constrói confiança para os modelos de score ao longo do tempo.",
              },
            ],
            exercise: {
              prompt: "Escolha uma estratégia desta aula para aplicar nos próximos meses e descreva como pretende fazer isso.",
              placeholder: "Estratégia escolhida: ...\nComo vou aplicar: ...",
            },
          },
        },
        {
          id: lid("score-de-credito", 5),
          title: "Consultando e monitorando seu score",
          content: {
            explanation: [
              "A consulta ao próprio score costuma ser gratuita através dos birôs de crédito (como Serasa e Boa Vista) e, em muitos casos, também disponível diretamente nos aplicativos de bancos e fintechs.",
              "Monitorar o score periodicamente ajuda a identificar mudanças relevantes — uma queda inesperada pode ser um sinal de erro no cadastro ou até de fraude em seu nome, valendo a pena investigar.",
              "Caso encontre uma informação incorreta no seu histórico (uma dívida já quitada ainda aparecendo como em aberto, por exemplo), é possível contestar diretamente com o birô de crédito para correção.",
            ],
            examples: [
              "Um app de monitoramento de crédito pode alertar sobre uma nova consulta feita em seu nome, ajudando a identificar rapidamente uma possível tentativa de fraude.",
              "Encontrar uma dívida já paga ainda listada como pendente é motivo para contestar a informação junto ao birô responsável.",
            ],
            keyConcepts: [
              "A consulta ao próprio score costuma ser gratuita, via birôs de crédito ou apps de bancos.",
              "Monitorar o score ajuda a identificar erros ou possíveis fraudes em seu nome.",
              "Informações incorretas no histórico podem (e devem) ser contestadas junto ao birô de crédito.",
            ],
            quiz: [
              {
                question: "Por que vale a pena monitorar o score de crédito periodicamente, não só consultar uma vez?",
                options: [
                  "Porque o score muda de hora em hora",
                  "Porque isso ajuda a identificar mudanças inesperadas, como erros no cadastro ou possíveis fraudes",
                  "Porque monitorar aumenta o score automaticamente",
                  "Não há motivo real para monitorar com frequência",
                ],
                correctIndex: 1,
                explanation: "Uma queda inesperada no score pode ser o primeiro sinal de um erro de cadastro ou de uma fraude em andamento.",
              },
            ],
            exercise: {
              prompt: "Ative (ou verifique se já tem ativo) algum serviço de monitoramento gratuito de score/CPF. O que você encontrou?",
              placeholder: "Serviço usado: ...\nO que encontrei: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 3 — Como sair das dívidas
    // ---------------------------------------------------------------
    {
      id: "como-sair-das-dividas",
      title: "Como sair das dívidas",
      description: "Um plano prático para sair do vermelho sem desespero.",
      icon: "🪜",
      lessons: [
        {
          id: lid("como-sair-das-dividas", 1),
          title: "Mapeando o tamanho real do problema",
          content: {
            explanation: [
              "O primeiro passo real para sair das dívidas é dimensionar o problema por completo: listar todas as dívidas, com credor, valor atual, taxa de juros e valor da parcela mínima de cada uma.",
              "É comum evitar esse mapeamento por ansiedade — muita gente prefere não olhar o total das dívidas com medo do que vai encontrar. Mas sem esse retrato completo, é impossível montar um plano realista de saída.",
              "Depois de mapeado, o total permite comparar as dívidas entre si e decidir a ordem de prioridade de pagamento — tema da próxima aula.",
            ],
            examples: [
              "Uma pessoa pode descobrir, ao mapear tudo, que o total das dívidas em cartão e empréstimos é bem maior do que ela estimava mentalmente.",
              "Listar cada dívida com sua taxa de juros específica revela quais delas estão custando mais caro e merecem atenção prioritária.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Liste todas as dívidas: cartão, empréstimos, financiamentos, parcelamentos",
                "Para cada uma, anote o valor atual, a taxa de juros e a parcela mínima",
                "Some o total devido, mesmo que o número seja desconfortável",
                "Use esse mapeamento como ponto de partida do plano de saída",
              ],
            },
            keyConcepts: [
              "Mapear todas as dívidas (credor, valor, juros, parcela) é o primeiro passo real para sair delas.",
              "Evitar olhar o total é comum, mas impede um plano de saída realista.",
              "O mapeamento completo permite priorizar quais dívidas atacar primeiro.",
            ],
            quiz: [
              {
                question: "Por que mapear todas as dívidas é considerado o primeiro passo real para sair delas?",
                options: [
                  "Porque isso já quita automaticamente parte da dívida",
                  "Porque sem um retrato completo do problema, não é possível montar um plano de saída realista",
                  "Porque bancos exigem esse mapeamento por lei",
                  "Porque isso aumenta o score de crédito na hora",
                ],
                correctIndex: 1,
                explanation: "Um plano de saída de dívidas só é realista quando parte de um retrato completo e honesto da situação.",
              },
            ],
            exercise: {
              prompt: "Liste todas as suas dívidas atuais (se houver), com valor, taxa de juros aproximada e parcela mínima de cada uma.",
              placeholder: "Dívida 1: ... — valor: R$ ... — juros: ...% — parcela mínima: R$ ...\nDívida 2: ...",
            },
          },
        },
        {
          id: lid("como-sair-das-dividas", 2),
          title: "Método bola de neve x método avalanche",
          content: {
            explanation: [
              "O método bola de neve prioriza quitar primeiro a menor dívida, independente da taxa de juros, e depois seguir para a próxima menor — a ideia é gerar vitórias rápidas que mantêm a motivação ao longo do processo.",
              "O método avalanche prioriza quitar primeiro a dívida com a maior taxa de juros, independente do tamanho — matematicamente, essa ordem economiza mais dinheiro no total pago em juros ao longo do processo.",
              "A escolha entre os dois depende menos de matemática e mais de comportamento: quem precisa de motivação visível para manter a disciplina tende a se beneficiar mais da bola de neve; quem consegue manter o foco só olhando os números costuma se sair melhor com a avalanche.",
            ],
            examples: [
              "Alguém com três dívidas pequenas e uma grande pode, pelo método bola de neve, quitar as três pequenas primeiro, ganhando confiança antes de atacar a maior.",
              "Pelo método avalanche, essa mesma pessoa atacaria primeiro a dívida com a maior taxa de juros, mesmo que ela não seja a menor em valor.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Bola de neve", items: ["Prioriza a menor dívida primeiro", "Gera vitórias rápidas e motivação"] },
              right: { label: "Avalanche", items: ["Prioriza a dívida com maior juros primeiro", "Economiza mais dinheiro no total"] },
            },
            keyConcepts: [
              "Bola de neve: quita primeiro a menor dívida, priorizando motivação.",
              "Avalanche: quita primeiro a dívida com maior juros, priorizando economia total.",
              "A escolha entre os dois depende mais do perfil comportamental da pessoa do que de matemática pura.",
            ],
            quiz: [
              {
                question: "Qual é a principal vantagem do método avalanche sobre o método bola de neve?",
                options: [
                  "Ele é mais fácil de seguir emocionalmente",
                  "Ele tende a economizar mais dinheiro no total pago em juros, ao priorizar a dívida mais cara primeiro",
                  "Ele elimina a dívida instantaneamente",
                  "Ele não exige nenhum esforço de pagamento",
                ],
                correctIndex: 1,
                explanation: "Ao atacar primeiro a dívida de maior juros, o método avalanche reduz o total de juros pagos ao longo de todo o processo.",
              },
            ],
            exercise: {
              prompt: "Com base nas dívidas que você mapeou na aula anterior, qual método (bola de neve ou avalanche) faria mais sentido pra você? Por quê?",
              placeholder: "Método escolhido: ...\nJustificativa: ...",
            },
          },
        },
        {
          id: lid("como-sair-das-dividas", 3),
          title: "Cortando gastos temporariamente para acelerar a saída",
          content: {
            explanation: [
              "Durante o período de quitação de dívidas, muitas vezes faz sentido adotar um corte de gastos mais agressivo do que o normal — não como um orçamento permanente, mas como uma fase temporária de esforço concentrado.",
              "A diferença entre esse corte temporário e um orçamento comum é a intensidade e o prazo: é um esforço mais restritivo, sustentado por um período definido, com o objetivo claro de liberar dinheiro extra para acelerar os pagamentos.",
              "Definir previamente até quando esse esforço vai durar (ou até que valor de dívida restante) ajuda a sustentar a disciplina, já que um corte de gastos sem prazo definido tende a ser mais difícil de manter.",
            ],
            examples: [
              "Suspender temporariamente assinaturas de streaming, delivery e outras despesas não essenciais durante alguns meses, direcionando esse valor para o pagamento de dívidas.",
              "Definir a meta de quitar uma dívida específica em 6 meses e manter o corte de gastos até lá, revisando o progresso mês a mês.",
            ],
            keyConcepts: [
              "Um corte de gastos temporário e mais agressivo pode acelerar significativamente a saída das dívidas.",
              "A diferença para um orçamento comum está na intensidade e no prazo definido.",
              "Definir previamente o prazo (ou meta) do esforço ajuda a sustentar a disciplina.",
            ],
            quiz: [
              {
                question: "O que diferencia um corte de gastos temporário (para sair de dívidas) de um orçamento comum?",
                options: [
                  "Não há diferença nenhuma entre os dois",
                  "O corte temporário é mais intenso e tem um prazo definido, voltado especificamente a acelerar a quitação de dívidas",
                  "O corte temporário nunca precisa de planejamento",
                  "Um orçamento comum sempre é mais restritivo",
                ],
                correctIndex: 1,
                explanation: "O corte temporário é uma fase concentrada, com prazo e objetivo específicos, diferente da rotina permanente de um orçamento comum.",
              },
            ],
            exercise: {
              prompt: "Liste 2 ou 3 gastos que você poderia cortar temporariamente para acelerar a quitação de uma dívida (real ou hipotética).",
              placeholder: "Gasto 1: ... — economia estimada: R$ ...\nGasto 2: ... — economia estimada: R$ ...",
            },
          },
        },
        {
          id: lid("como-sair-das-dividas", 4),
          title: "Buscando renda extra durante o processo",
          content: {
            explanation: [
              "Além de cortar gastos, buscar formas de renda extra durante o período de quitação pode acelerar bastante o processo, especialmente quando o corte de gastos sozinho não é suficiente.",
              "Formas comuns incluem trabalhos freelance, venda de itens não usados em casa, e horas extras ou bicos temporários — o importante é que essa renda extra seja direcionada inteiramente (ou quase) para a quitação das dívidas, não absorvida pelo consumo do dia a dia.",
              "Assim como o corte de gastos, a busca por renda extra tende a ser mais sustentável quando tratada como um esforço temporário e concentrado, com um objetivo claro de quitação, e não como uma mudança permanente de rotina.",
            ],
            examples: [
              "Vender roupas, eletrônicos ou móveis não usados pode gerar um valor relevante para abater uma dívida específica.",
              "Direcionar 100% de um trabalho freelance temporário para a quitação de dívidas acelera bastante o processo, comparado a diluir esse valor no orçamento geral.",
            ],
            keyConcepts: [
              "Renda extra pode acelerar significativamente a quitação de dívidas, complementando o corte de gastos.",
              "É importante direcionar essa renda extra especificamente para as dívidas, não para consumo do dia a dia.",
              "Tratar isso como um esforço temporário e concentrado ajuda a sustentar o processo.",
            ],
            quiz: [
              {
                question: "Por que é importante direcionar a renda extra especificamente para a quitação de dívidas, durante esse processo?",
                options: [
                  "Porque a lei exige isso",
                  "Porque, se for absorvida pelo consumo do dia a dia, ela deixa de acelerar a saída das dívidas",
                  "Porque renda extra não pode ser usada para pagar dívidas",
                  "Não faz diferença como a renda extra é usada",
                ],
                correctIndex: 1,
                explanation: "O objetivo da renda extra nesse contexto é acelerar a quitação — se for gasta em consumo, esse objetivo se perde.",
              },
            ],
            exercise: {
              prompt: "Pense em uma forma de renda extra que você poderia buscar temporariamente, e quanto ela poderia render por mês.",
              placeholder: "Forma de renda extra: ...\nEstimativa mensal: R$ ...",
            },
          },
        },
        {
          id: lid("como-sair-das-dividas", 5),
          title: "Mantendo-se fora das dívidas depois de sair",
          content: {
            explanation: [
              "Sair das dívidas é uma conquista importante, mas sem uma mudança de hábito, existe o risco real de reincidência — voltar a recorrer ao cartão ou a empréstimos no próximo imprevisto.",
              "Construir uma reserva de emergência logo após quitar as dívidas é uma das formas mais eficazes de evitar essa reincidência: ela funciona como um amortecedor para imprevistos, no lugar do crédito caro.",
              "Também vale revisar os hábitos que levaram ao endividamento anterior — gastos por impulso, falta de controle sobre o orçamento, uso do cartão sem planejamento — e ajustar essas rotinas antes que a pressão de uma nova dívida apareça.",
            ],
            examples: [
              "Uma pessoa que quitou as dívidas e, em seguida, começou a guardar parte da renda mensal para uma reserva de emergência reduz bastante a chance de precisar do cartão no próximo imprevisto.",
              "Revisar o motivo original do endividamento (por exemplo, gastos por impulso) e criar um controle simples de orçamento ajuda a evitar repetir o mesmo padrão.",
            ],
            keyConcepts: [
              "Construir uma reserva de emergência após quitar dívidas reduz bastante o risco de reincidência.",
              "Revisar os hábitos que levaram ao endividamento é importante para não repetir o padrão.",
              "Sair das dívidas sem mudar hábitos costuma levar a um novo ciclo de endividamento.",
            ],
            quiz: [
              {
                question: "Por que construir uma reserva de emergência logo após sair das dívidas é uma boa prática?",
                options: [
                  "Porque isso aumenta automaticamente o score de crédito",
                  "Porque ela funciona como amortecedor para imprevistos, reduzindo a necessidade de recorrer ao crédito caro de novo",
                  "Porque bancos exigem uma reserva para liberar novos cartões",
                  "Não há benefício real nisso",
                ],
                correctIndex: 1,
                explanation: "Sem uma reserva, o próximo imprevisto tende a ser financiado de novo por crédito caro, reiniciando o ciclo de dívidas.",
              },
            ],
            exercise: {
              prompt: "Se você já saiu (ou está saindo) de uma dívida, qual hábito específico levou a ela, e o que você pode mudar para não repetir?",
              placeholder: "Hábito que levou à dívida: ...\nO que vou mudar: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 4 — Renegociação de dívidas
    // ---------------------------------------------------------------
    {
      id: "renegociacao-de-dividas",
      title: "Renegociação de dívidas",
      description: "Como negociar com credores de forma informada e vantajosa.",
      icon: "🤝",
      lessons: [
        {
          id: lid("renegociacao-de-dividas", 1),
          title: "Por que credores aceitam renegociar",
          content: {
            explanation: [
              "Para um credor, receber uma parte da dívida (com desconto, ou parcelada) normalmente ainda é melhor do que não receber nada — por isso a renegociação costuma ser uma opção real, não um favor excepcional.",
              "Cobrar uma dívida judicialmente tem custo e incerteza para o credor: processos demoram, têm custas, e nem sempre resultam em recebimento efetivo. Isso cria incentivo para negociar uma solução mais rápida e certa.",
              "Entender esse incentivo do lado do credor ajuda o devedor a negociar com mais confiança: você não está pedindo um favor, está propondo uma solução que também é vantajosa para quem está cobrando.",
            ],
            examples: [
              "Um credor pode oferecer um desconto relevante para receber uma dívida antiga à vista, preferindo receber uma parte agora a arriscar não receber nada depois.",
              "Bancos costumam ter equipes e canais dedicados exatamente à renegociação, sinal de que essa é uma prática comum e esperada, não uma exceção.",
            ],
            keyConcepts: [
              "Para o credor, receber parte da dívida costuma ser melhor do que correr o risco de não receber nada.",
              "Cobrança judicial tem custo e incerteza, o que também incentiva o credor a negociar.",
              "Entender esse incentivo ajuda o devedor a negociar com mais confiança.",
            ],
            quiz: [
              {
                question: "Por que credores costumam aceitar renegociar dívidas, mesmo com desconto?",
                options: [
                  "Porque são obrigados por lei a sempre aceitar",
                  "Porque receber parte da dívida costuma ser melhor, para eles, do que correr o risco de não receber nada",
                  "Porque isso não afeta o resultado financeiro do credor",
                  "Renegociação nunca é aceita na prática",
                ],
                correctIndex: 1,
                explanation: "O incentivo econômico do credor favorece receber algo com certeza a arriscar uma cobrança incerta e custosa.",
              },
            ],
            exercise: {
              prompt: "Se você tem alguma dívida em aberto, pesquise se o credor oferece algum canal específico de renegociação (app, telefone, site).",
              placeholder: "Dívida: ...\nCanal de renegociação encontrado: ...",
            },
          },
        },
        {
          id: lid("renegociacao-de-dividas", 2),
          title: "Preparando-se antes de ligar para negociar",
          content: {
            explanation: [
              "Antes de entrar em contato com o credor, é importante saber com clareza o valor máximo que você consegue efetivamente pagar — à vista ou em parcelas — para não aceitar (ou propor) um acordo que não vai conseguir cumprir.",
              "Ter em mãos os dados da dívida (valor original, valor atualizado, credor, data) agiliza a conversa e evita confusão durante a negociação.",
              "Também vale considerar propor, você mesmo, um valor à vista com desconto — muitas vezes o credor tem mais liberdade para aceitar uma proposta do devedor do que para fazer a primeira oferta.",
            ],
            examples: [
              "Antes de ligar, calcular exatamente quanto sobra do orçamento mensal para uma nova parcela evita comprometer-se com um valor que não cabe na realidade financeira atual.",
              "Propor pagar 40% do valor total à vista, em vez de esperar a oferta do credor, pode resultar num desconto melhor do que o que seria oferecido de início.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Calcule o valor máximo que você consegue pagar, à vista ou parcelado",
                "Reúna os dados da dívida: valor original, valor atualizado, credor",
                "Considere propor você mesmo um valor à vista com desconto",
                "Anote tudo o que for combinado durante a conversa",
              ],
            },
            keyConcepts: [
              "Saber o valor máximo que você consegue pagar evita aceitar um acordo impossível de cumprir.",
              "Ter os dados da dívida em mãos agiliza e organiza a negociação.",
              "Propor você mesmo um valor à vista com desconto pode resultar em condições melhores.",
            ],
            quiz: [
              {
                question: "Por que é importante saber o valor máximo que você consegue pagar antes de negociar uma dívida?",
                options: [
                  "Para impressionar o atendente do credor",
                  "Para evitar aceitar um acordo que você não vai conseguir cumprir depois",
                  "Porque isso não tem nenhuma relevância na negociação",
                  "Porque credores exigem esse cálculo por escrito",
                ],
                correctIndex: 1,
                explanation: "Um acordo que não cabe no orçamento real tende a gerar um novo atraso, piorando a situação em vez de resolvê-la.",
              },
            ],
            exercise: {
              prompt: "Se você tem uma dívida para negociar, calcule agora o valor máximo (à vista ou em parcela mensal) que caberia no seu orçamento real.",
              placeholder: "Valor máximo à vista: R$ ...\nValor máximo de parcela mensal: R$ ...",
            },
          },
        },
        {
          id: lid("renegociacao-de-dividas", 3),
          title: "Programas e mutirões de renegociação",
          content: {
            explanation: [
              "Além da negociação direta com o credor, existem períodos específicos — mutirões e feirões de renegociação — promovidos por birôs de crédito ou por grupos de instituições financeiras, com condições especiais de desconto.",
              "Esses programas costumam reunir várias dívidas de diferentes credores num só lugar (site ou plataforma), facilitando a comparação de propostas e a negociação em um único momento.",
              "Além desses mutirões, muitos bancos e credores individuais também têm canais próprios permanentes de renegociação, disponíveis a qualquer momento, não apenas durante períodos promocionais.",
            ],
            examples: [
              "Durante um mutirão de renegociação, uma pessoa pode encontrar, numa única plataforma, ofertas de desconto de vários credores diferentes com quem tem dívidas em aberto.",
              "Mesmo fora de um mutirão, entrar em contato diretamente pelo aplicativo do banco costuma abrir opções de negociação disponíveis o ano todo.",
            ],
            keyConcepts: [
              "Mutirões e feirões de renegociação reúnem condições especiais de vários credores em um só lugar.",
              "Eles costumam ser promovidos por birôs de crédito ou grupos de instituições financeiras.",
              "Canais próprios de renegociação de cada credor também existem de forma permanente, não só em mutirões.",
            ],
            quiz: [
              {
                question: "Qual é a vantagem prática de um mutirão de renegociação de dívidas?",
                options: [
                  "Ele quita automaticamente todas as dívidas sem custo",
                  "Ele reúne condições de vários credores diferentes num só lugar, facilitando comparar e negociar",
                  "Ele só serve para dívidas já pagas",
                  "Ele substitui a necessidade de qualquer negociação",
                ],
                correctIndex: 1,
                explanation: "A centralização de várias dívidas e credores facilita comparar ofertas e agilizar a negociação em um único momento.",
              },
            ],
            exercise: {
              prompt: "Pesquise se há algum mutirão ou programa de renegociação disponível atualmente relacionado a alguma dívida que você (ou alguém que você conhece) tenha.",
              placeholder: "O que encontrei: ...",
            },
          },
        },
        {
          id: lid("renegociacao-de-dividas", 4),
          title: "Avaliando se vale a pena aceitar uma proposta",
          content: {
            explanation: [
              "Ao receber uma proposta de renegociação, o primeiro passo é comparar o valor total a pagar parcelado com o valor à vista (se houver desconto para pagamento à vista) — a diferença pode ser significativa.",
              "É essencial verificar se a parcela oferecida cabe de fato no orçamento real, e não apenas no que parece razoável no momento da conversa — aceitar uma parcela alta demais pode gerar um novo atraso, piorando a situação.",
              "Ler as condições com atenção antes de aceitar — taxas adicionais, prazo de validade da proposta, o que acontece em caso de atraso da própria renegociação — evita surpresas desagradáveis depois.",
            ],
            examples: [
              "Uma proposta de pagamento à vista com 40% de desconto pode ser mais vantajosa financeiramente do que parcelar o valor cheio em 12 vezes, mesmo exigindo um esforço maior no curto prazo.",
              "Aceitar uma parcela que consome uma parte grande demais da renda mensal pode levar a um novo atraso, o que costuma anular os benefícios da renegociação original.",
            ],
            keyConcepts: [
              "Comparar o valor total parcelado com o valor à vista ajuda a identificar a proposta mais vantajosa.",
              "A parcela oferecida precisa caber de fato no orçamento real, não apenas parecer razoável no momento.",
              "Ler as condições com atenção evita surpresas, como taxas adicionais ou penalidades em caso de novo atraso.",
            ],
            quiz: [
              {
                question: "Por que é arriscado aceitar uma parcela de renegociação sem verificar se ela cabe no orçamento real?",
                options: [
                  "Porque não há risco nenhum nisso",
                  "Porque um novo atraso na parcela renegociada pode anular os benefícios do acordo, agravando a situação",
                  "Porque bancos proíbem parcelas altas",
                  "Porque isso reduz automaticamente o score de crédito",
                ],
                correctIndex: 1,
                explanation: "Um acordo que não cabe no orçamento tende a resultar em novo atraso, o que pode inclusive cancelar as condições especiais negociadas.",
              },
            ],
            exercise: {
              prompt: "Se você recebeu (ou receber) uma proposta de renegociação, compare o valor total parcelado com uma eventual opção à vista. Qual é mais vantajosa?",
              placeholder: "Proposta parcelada: R$ ... total\nProposta à vista: R$ ...\nMais vantajosa: ...",
            },
          },
        },
        {
          id: lid("renegociacao-de-dividas", 5),
          title: "Colocando o acordo por escrito e cumprindo",
          content: {
            explanation: [
              "Depois de fechar um acordo de renegociação, é fundamental pedir a confirmação por escrito — e-mail, contrato ou print da tela do aplicativo — detalhando exatamente o que foi combinado: valor, número de parcelas, datas e condições.",
              "Guardar todos os comprovantes de pagamento das parcelas renegociadas é igualmente importante, para ter prova caso surja alguma divergência futura com o credor.",
              "Depois de quitado o acordo por completo, vale verificar se a negativação (se havia uma) foi de fato removida do seu nome nos birôs de crédito — isso nem sempre acontece automaticamente e pode exigir contato adicional.",
            ],
            examples: [
              "Guardar o print da confirmação do acordo de renegociação, com valores e datas, protege o devedor caso o credor cobre algo diferente do combinado depois.",
              "Depois de pagar a última parcela de um acordo, consultar o próprio CPF nos birôs de crédito confirma se a negativação foi realmente removida.",
            ],
            keyConcepts: [
              "Sempre peça confirmação por escrito de tudo o que for combinado num acordo de renegociação.",
              "Guarde os comprovantes de pagamento de cada parcela renegociada.",
              "Verifique, após a quitação, se a negativação foi de fato removida do seu nome.",
            ],
            quiz: [
              {
                question: "Por que é importante guardar a confirmação por escrito de um acordo de renegociação?",
                options: [
                  "Não é importante, um acordo verbal já é suficiente",
                  "Para ter prova do que foi combinado, caso surja alguma divergência com o credor no futuro",
                  "Porque a lei proíbe acordos verbais",
                  "Porque isso aumenta automaticamente o score",
                ],
                correctIndex: 1,
                explanation: "Ter a confirmação por escrito protege o devedor de cobranças ou condições diferentes do que foi originalmente negociado.",
              },
            ],
            exercise: {
              prompt: "Se você já fez alguma renegociação, verifique se guardou o comprovante do acordo e dos pagamentos feitos. Se não guardou, isso é algo para mudar da próxima vez.",
              placeholder: "Minha situação: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 5 — Empréstimos e financiamentos
    // ---------------------------------------------------------------
    {
      id: "emprestimos-e-financiamentos",
      title: "Empréstimos e financiamentos",
      description: "Quando pedir dinheiro emprestado faz sentido — e quando é armadilha.",
      icon: "🏗️",
      lessons: [
        {
          id: lid("emprestimos-e-financiamentos", 1),
          title: "Empréstimo x financiamento: qual a diferença",
          content: {
            explanation: [
              "Um empréstimo é dinheiro liberado de forma livre, sem exigir vínculo a uma finalidade específica — você pode usar o valor recebido para o que precisar.",
              "Um financiamento, por outro lado, está vinculado à compra de um bem específico (como um imóvel ou um veículo), e normalmente esse bem fica em garantia (chamada de alienação fiduciária) até a dívida ser totalmente quitada.",
              "Essa diferença tem consequências práticas: um empréstimo pessoal costuma ter taxas maiores (porque não há um bem específico como garantia), enquanto um financiamento costuma ter taxas menores, mas com o risco de perder o próprio bem em caso de inadimplência prolongada.",
            ],
            examples: [
              "Pedir um empréstimo pessoal para reformar a casa dá liberdade sobre como o dinheiro é usado, mas normalmente com uma taxa de juros maior.",
              "Financiar um carro vincula o pagamento diretamente àquele veículo, que fica em garantia até a quitação total do financiamento.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Empréstimo", items: ["Uso livre do valor", "Sem bem específico em garantia", "Taxas costumam ser maiores"] },
              right: { label: "Financiamento", items: ["Vinculado a um bem específico", "Bem fica em garantia até a quitação", "Taxas costumam ser menores"] },
            },
            keyConcepts: [
              "Empréstimo: dinheiro de uso livre, sem vínculo a uma finalidade específica.",
              "Financiamento: vinculado à compra de um bem específico, que fica em garantia até a quitação.",
              "Essa diferença geralmente afeta as taxas de juros de cada modalidade.",
            ],
            quiz: [
              {
                question: "Qual é a principal diferença entre um empréstimo e um financiamento?",
                options: [
                  "Não há diferença real entre os dois termos",
                  "O financiamento está vinculado à compra de um bem específico, que fica em garantia; o empréstimo tem uso livre",
                  "Empréstimos só existem para pessoas jurídicas",
                  "Financiamentos nunca têm garantia envolvida",
                ],
                correctIndex: 1,
                explanation: "O vínculo com um bem específico em garantia é o que caracteriza um financiamento, diferenciando-o de um empréstimo de uso livre.",
              },
            ],
            exercise: {
              prompt: "Se você já contratou (ou pretende contratar) um empréstimo ou financiamento, identifique qual dos dois é e por quê.",
              placeholder: "Modalidade: ...\nÉ empréstimo ou financiamento? ...\nPor quê: ...",
            },
          },
        },
        {
          id: lid("emprestimos-e-financiamentos", 2),
          title: "CET: o custo real de um empréstimo",
          content: {
            explanation: [
              "O CET (Custo Efetivo Total) é o indicador que reúne todos os custos de um empréstimo ou financiamento — juros, tarifas, seguros obrigatórios — expresso como uma taxa percentual, geralmente ao ano.",
              "Comparar propostas de crédito apenas pela taxa de juros anunciada pode ser enganoso, já que tarifas e seguros adicionais podem tornar uma proposta com juros aparentemente menores mais cara no total do que outra.",
              "Por lei, instituições financeiras no Brasil são obrigadas a informar o CET antes da contratação — é esse número, não apenas a taxa de juros isolada, que deveria orientar a comparação entre diferentes propostas de crédito.",
            ],
            examples: [
              "Duas propostas de empréstimo com a mesma taxa de juros anunciada podem ter CETs diferentes, se uma delas incluir tarifas ou seguros que a outra não tem.",
              "Comparar apenas os juros de duas propostas de financiamento, sem olhar o CET completo, pode levar à escolha da opção mais cara no total.",
            ],
            diagram: {
              type: "formula",
              formula: "CET = juros + tarifas + seguros obrigatórios (expresso como taxa % ao ano)",
              caption: "O número que realmente reflete o custo total de um crédito, além dos juros isolados.",
            },
            keyConcepts: [
              "CET: indicador que reúne juros, tarifas e seguros de um crédito, expresso como taxa percentual.",
              "Comparar propostas só pelos juros anunciados pode ser enganoso.",
              "Instituições financeiras são obrigadas por lei a informar o CET antes da contratação.",
            ],
            quiz: [
              {
                question: "Por que comparar duas propostas de crédito apenas pela taxa de juros anunciada pode ser enganoso?",
                options: [
                  "Porque a taxa de juros nunca é verdadeira",
                  "Porque tarifas e seguros adicionais, refletidos no CET, podem tornar uma proposta mais cara no total, mesmo com juros menores",
                  "Porque taxas de juros são sempre iguais entre instituições",
                  "Não há nenhum problema em comparar só pelos juros",
                ],
                correctIndex: 1,
                explanation: "O CET captura o custo total, incluindo tarifas e seguros que a taxa de juros isolada não mostra.",
              },
            ],
            exercise: {
              prompt: "Se você já viu (ou pesquisar) uma proposta de empréstimo ou financiamento, verifique o CET informado e compare com a taxa de juros anunciada isoladamente.",
              placeholder: "Taxa de juros anunciada: ...% ao ano\nCET informado: ...% ao ano\nDiferença: ...",
            },
          },
        },
        {
          id: lid("emprestimos-e-financiamentos", 3),
          title: "Financiamento de imóvel e de veículo",
          content: {
            explanation: [
              "O financiamento de imóvel costuma ter prazos bem longos, podendo se estender por décadas, enquanto o financiamento de veículo costuma ter prazos mais curtos, geralmente alguns anos.",
              "Em ambos os casos, o bem financiado (o imóvel ou o veículo) normalmente fica em garantia até a quitação total — é a chamada alienação fiduciária, que dá ao credor o direito sobre o bem em caso de inadimplência prolongada.",
              "As consequências de um atraso prolongado diferem entre os dois: no financiamento de veículo, o risco é a busca e apreensão do bem; no financiamento de imóvel, o risco é a execução da garantia, podendo levar à perda do imóvel.",
            ],
            examples: [
              "Um financiamento de veículo em atraso prolongado pode resultar na apreensão do carro pelo credor, mesmo que várias parcelas já tenham sido pagas.",
              "Um financiamento de imóvel com inadimplência grave e prolongada pode, em último caso, levar à perda do imóvel financiado.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Financiamento de veículo", items: ["Prazos mais curtos", "Risco: busca e apreensão do veículo"] },
              right: { label: "Financiamento de imóvel", items: ["Prazos bem mais longos", "Risco: execução da garantia sobre o imóvel"] },
            },
            keyConcepts: [
              "Financiamento de imóvel costuma ter prazos bem mais longos que o de veículo.",
              "Em ambos, o bem financiado normalmente fica em garantia até a quitação (alienação fiduciária).",
              "Inadimplência prolongada pode levar à apreensão do veículo ou à execução da garantia sobre o imóvel.",
            ],
            quiz: [
              {
                question: "O que é a alienação fiduciária num financiamento de imóvel ou veículo?",
                options: [
                  "Um tipo de seguro obrigatório contra roubo",
                  "A garantia dada ao credor sobre o próprio bem financiado, até a quitação total da dívida",
                  "Um desconto aplicado ao pagamento à vista",
                  "Uma taxa cobrada apenas em financiamentos de veículo",
                ],
                correctIndex: 1,
                explanation: "A alienação fiduciária dá ao credor o direito sobre o bem financiado em caso de inadimplência, até que a dívida seja completamente quitada.",
              },
            ],
            exercise: {
              prompt: "Se você tem (ou pretende ter) um financiamento de imóvel ou veículo, verifique o prazo total e o que acontece em caso de atraso prolongado, segundo o contrato.",
              placeholder: "Tipo de financiamento: ...\nPrazo total: ...\nConsequência de atraso prolongado: ...",
            },
          },
        },
        {
          id: lid("emprestimos-e-financiamentos", 4),
          title: "Consignado: vantagens e cuidados",
          content: {
            explanation: [
              "O empréstimo consignado tem o pagamento descontado diretamente da folha de pagamento ou do benefício do tomador (salário, aposentadoria), o que reduz o risco de calote para o credor — e, em troca, costuma vir com taxas de juros menores que outras modalidades de crédito.",
              "Apesar da taxa menor, é preciso ter cuidado: o desconto automático compromete uma parte relevante da renda mensal de forma praticamente garantida, reduzindo a margem disponível para outros gastos e imprevistos durante todo o prazo do contrato.",
              "Por isso, antes de contratar um consignado, vale simular com cuidado se o valor restante da renda, depois do desconto, ainda é suficiente para cobrir as demais despesas e manter alguma margem de segurança.",
            ],
            examples: [
              "Um aposentado que contrata um consignado com desconto direto no benefício tende a conseguir taxas de juros menores do que num empréstimo pessoal comum.",
              "Comprometer uma parcela grande da renda mensal com um consignado pode deixar pouca margem para lidar com um imprevisto, já que o desconto é automático e não pode ser adiado.",
            ],
            keyConcepts: [
              "Consignado: desconto direto na folha de pagamento ou benefício, o que costuma resultar em taxas menores.",
              "O desconto automático compromete uma parte relevante e praticamente garantida da renda mensal.",
              "É importante simular se a renda restante, após o desconto, ainda cobre as demais despesas com margem de segurança.",
            ],
            quiz: [
              {
                question: "Por que o empréstimo consignado costuma ter taxas de juros menores que outras modalidades?",
                options: [
                  "Porque é subsidiado pelo governo em todos os casos",
                  "Porque o desconto direto na folha ou no benefício reduz o risco de calote para o credor",
                  "Porque consignados nunca têm juros",
                  "Porque só pessoas com renda alta podem contratar",
                ],
                correctIndex: 1,
                explanation: "O menor risco de inadimplência, garantido pelo desconto automático, permite ao credor oferecer taxas menores.",
              },
            ],
            exercise: {
              prompt: "Se você tem (ou pretende ter) um consignado, calcule quanto sobra da sua renda mensal depois do desconto da parcela. Essa margem é suficiente?",
              placeholder: "Renda mensal: R$ ...\nParcela do consignado: R$ ...\nRenda restante: R$ ...\nÉ suficiente? ...",
            },
          },
        },
        {
          id: lid("emprestimos-e-financiamentos", 5),
          title: "Quando pedir emprestado é uma decisão racional",
          content: {
            explanation: [
              "Pedir dinheiro emprestado pode ser uma decisão racional quando o retorno esperado do uso desse dinheiro supera o custo do empréstimo — por exemplo, um curso ou capacitação que aumenta a renda futura em um valor maior do que os juros pagos.",
              "Também pode fazer sentido buscar um empréstimo para evitar um custo ainda maior, como quitar uma dívida no rotativo do cartão (com juros muito altos) usando um empréstimo pessoal com taxa menor.",
              "Por outro lado, pedir emprestado para consumo não essencial, sem uma necessidade real ou um retorno claro esperado, tende a ser uma decisão que aumenta o custo total de vida sem um benefício proporcional — e deveria ser evitado.",
            ],
            examples: [
              "Financiar um curso que abre caminho para um aumento de renda relevante pode compensar o custo dos juros pagos ao longo do tempo.",
              "Usar um empréstimo pessoal com taxa menor para quitar uma dívida travada no rotativo do cartão reduz o custo total da dívida, mesmo sendo, na essência, outra forma de crédito.",
            ],
            keyConcepts: [
              "Pedir emprestado pode ser racional quando o retorno esperado do uso do dinheiro supera o custo do empréstimo.",
              "Também pode fazer sentido para evitar um custo ainda maior, como o rotativo do cartão.",
              "Pedir emprestado para consumo não essencial, sem retorno ou necessidade real, tende a ser uma decisão custosa.",
            ],
            quiz: [
              {
                question: "Em qual situação pedir dinheiro emprestado tende a ser uma decisão racional?",
                options: [
                  "Sempre que há uma promoção de crédito disponível",
                  "Quando o retorno esperado do uso do dinheiro supera o custo do empréstimo, ou quando evita um custo ainda maior",
                  "Sempre que o limite de crédito está disponível",
                  "Nunca é racional pedir dinheiro emprestado",
                ],
                correctIndex: 1,
                explanation: "A racionalidade de um empréstimo depende de comparar seu custo com o benefício ou a economia que ele proporciona.",
              },
            ],
            exercise: {
              prompt: "Pense numa situação (real ou hipotética) em que pedir emprestado faria sentido para você, e calcule se o benefício esperado supera o custo do empréstimo.",
              placeholder: "Situação: ...\nBenefício esperado: ...\nCusto estimado do empréstimo: ...\nVale a pena? ...",
            },
          },
        },
      ],
    },
  ],
};
