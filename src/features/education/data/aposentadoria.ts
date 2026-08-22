import type { Trail } from "../types";

const trailId = "aposentadoria-e-independencia";
const lid = (courseId: string, n: number) => `${trailId}.${courseId}.aula-${n}`;

export const aposentadoriaTrail: Trail = {
  id: trailId,
  title: "Aposentadoria e independência financeira",
  description: "Planejar o longo prazo de verdade: previdência, independência financeira e sucessão.",
  color: "orange",
  courses: [
    // ---------------------------------------------------------------
    // Curso 1 — INSS e aposentadoria pública
    // ---------------------------------------------------------------
    {
      id: "inss-e-aposentadoria-publica",
      title: "INSS e aposentadoria pública",
      description: "Como funciona a aposentadoria pelo INSS no Brasil.",
      icon: "🏛️",
      lessons: [
        {
          id: lid("inss-e-aposentadoria-publica", 1),
          title: "Como funciona o INSS",
          content: {
            explanation: [
              "O INSS (Instituto Nacional do Seguro Social) é o sistema público de previdência do Brasil, responsável por pagar aposentadorias, pensões e outros benefícios a trabalhadores que contribuíram ao longo da vida.",
              "Ele funciona em regime de repartição: as contribuições de quem trabalha hoje financiam os benefícios de quem já está aposentado, não é uma poupança individual guardada em nome de cada contribuinte específico.",
              "Para empregados com carteira assinada (CLT), a contribuição é obrigatória e descontada diretamente da folha de pagamento; autônomos, MEIs e outras categorias têm regras próprias de contribuição, tema aprofundado mais adiante neste curso.",
            ],
            examples: [
              "Um empregado CLT vê o desconto do INSS diretamente no holerite, sem precisar fazer nada manualmente.",
              "Um autônomo precisa escolher e pagar mensalmente sua guia de contribuição (GPS) para manter o vínculo com o INSS em dia.",
            ],
            keyConcepts: [
              "INSS: sistema público de previdência, que paga aposentadorias e outros benefícios.",
              "Funciona em regime de repartição — contribuintes de hoje financiam benefícios de hoje.",
              "Empregados CLT contribuem automaticamente; autônomos e MEIs têm regras próprias.",
            ],
            quiz: [
              {
                question: "O que significa o INSS funcionar em \"regime de repartição\"?",
                options: [
                  "Cada pessoa tem uma conta individual guardando exatamente o que ela contribuiu",
                  "As contribuições de quem trabalha hoje financiam os benefícios de quem já está aposentado",
                  "O dinheiro é investido na bolsa de valores para cada contribuinte",
                  "Só empregados CLT podem se beneficiar do sistema",
                ],
                correctIndex: 1,
                explanation: "Diferente de uma poupança individual, o regime de repartição usa as contribuições atuais para pagar os benefícios atuais.",
              },
            ],
            exercise: {
              prompt: "Verifique sua situação de contribuição ao INSS (pelo aplicativo ou site Meu INSS, se tiver acesso). Você está contribuindo hoje, e de que forma?",
              placeholder: "Minha situação de contribuição: ...",
            },
          },
        },
        {
          id: lid("inss-e-aposentadoria-publica", 2),
          title: "Regras de aposentadoria após a reforma da previdência",
          content: {
            explanation: [
              "A reforma da previdência de 2019 mudou de forma relevante as regras de aposentadoria no Brasil, substituindo o modelo antigo (baseado principalmente em tempo de contribuição) por regras que combinam idade mínima com tempo de contribuição.",
              "Quem já contribuía antes da reforma entrar em vigor tem acesso a regras de transição específicas, criadas justamente para não mudar as regras do dia para a noite para quem já estava no meio do caminho.",
              "Como as regras exatas (idades mínimas, tempo de contribuição exigido, regras de transição) são detalhadas e podem ser atualizadas, o caminho mais confiável é sempre simular a própria situação diretamente no aplicativo ou site oficial Meu INSS, em vez de confiar apenas em números genéricos.",
            ],
            examples: [
              "Duas pessoas que começaram a trabalhar em épocas diferentes podem estar sujeitas a regras de transição diferentes, mesmo com a mesma idade hoje.",
              "O aplicativo Meu INSS permite simular, com os dados reais de contribuição da pessoa, uma estimativa de quando e como ela poderá se aposentar.",
            ],
            keyConcepts: [
              "A reforma de 2019 combinou idade mínima com tempo de contribuição, substituindo o modelo antigo.",
              "Quem já contribuía antes da reforma pode ter acesso a regras de transição específicas.",
              "As regras exatas mudam e variam por situação — o caminho mais seguro é simular no Meu INSS.",
            ],
            quiz: [
              {
                question: "Por que é recomendável simular sua situação diretamente no Meu INSS, em vez de confiar em números genéricos sobre idade de aposentadoria?",
                options: [
                  "Porque números genéricos são sempre mentirosos",
                  "Porque as regras variam por categoria e situação individual (incluindo regras de transição), e podem ser atualizadas",
                  "Porque o Meu INSS é o único app financeiro que existe",
                  "Não há necessidade real de simular nada",
                ],
                correctIndex: 1,
                explanation: "As regras de aposentadoria dependem de fatores individuais (categoria, tempo de contribuição, data de início) que só uma simulação com dados reais capta corretamente.",
              },
            ],
            exercise: {
              prompt: "Se possível, acesse o app ou site Meu INSS e veja se há uma simulação de aposentadoria disponível para sua situação. O que você descobriu?",
              placeholder: "O que encontrei na simulação: ...",
            },
          },
        },
        {
          id: lid("inss-e-aposentadoria-publica", 3),
          title: "Calculando sua expectativa de benefício",
          content: {
            explanation: [
              "Desde a reforma de 2019, o valor do benefício do INSS passou a ser calculado com base na média de todas as contribuições feitas ao longo da vida contributiva, e não apenas das contribuições mais recentes ou mais altas, como em regras anteriores.",
              "Sobre essa média, aplica-se um percentual que aumenta conforme o tempo de contribuição, respeitando limites mínimos e máximos estabelecidos por lei para o valor do benefício.",
              "Assim como as regras de elegibilidade, o valor estimado do benefício pode (e deveria) ser consultado diretamente no Meu INSS, que já calcula essa estimativa com base no histórico real de contribuições da pessoa.",
            ],
            examples: [
              "Uma pessoa com contribuições mais altas e constantes ao longo de toda a vida tende a ter uma média de cálculo maior do que alguém com contribuições baixas ou irregulares.",
              "Duas pessoas com o mesmo tempo de contribuição podem ter benefícios diferentes, se a média das contribuições ao longo da vida de cada uma for diferente.",
            ],
            keyConcepts: [
              "O valor do benefício considera a média de toda a vida contributiva, não só as contribuições mais recentes.",
              "Um percentual, que cresce com o tempo de contribuição, é aplicado sobre essa média.",
              "O Meu INSS oferece uma estimativa personalizada com base no histórico real da pessoa.",
            ],
            quiz: [
              {
                question: "Como é calculada a média usada para o valor do benefício do INSS, desde a reforma de 2019?",
                options: [
                  "Apenas com base nas últimas contribuições antes da aposentadoria",
                  "Com base na média de todas as contribuições feitas ao longo de toda a vida contributiva",
                  "Com base apenas na maior contribuição já feita",
                  "O valor do benefício é sempre fixo, independente das contribuições",
                ],
                correctIndex: 1,
                explanation: "A regra atual usa a média de toda a vida contributiva, o que torna contribuições consistentes ao longo do tempo mais relevantes do que picos isolados.",
              },
            ],
            exercise: {
              prompt: "Reflita: suas contribuições ao INSS (ou de alguém próximo) foram consistentes ao longo do tempo, ou tiveram períodos de interrupção? Como isso pode afetar o benefício futuro?",
              placeholder: "Minha reflexão: ...",
            },
          },
        },
        {
          id: lid("inss-e-aposentadoria-publica", 4),
          title: "Contribuição como autônomo/MEI",
          content: {
            explanation: [
              "O MEI (Microempreendedor Individual) contribui para o INSS com uma alíquota reduzida, calculada sobre o salário mínimo — essa contribuição garante o direito à aposentadoria e a outros benefícios, mas normalmente no valor mínimo, a menos que o MEI complemente a contribuição voluntariamente.",
              "Um autônomo que não é MEI pode contribuir como \"contribuinte individual\", com alíquotas diferentes dependendo da base de cálculo escolhida — contribuir sobre uma base maior aumenta o valor futuro do benefício, mas também custa mais a cada mês.",
              "Diferente do empregado CLT, autônomos e MEIs precisam se organizar ativamente para manter a contribuição em dia todo mês, já que não há desconto automático em folha de pagamento.",
            ],
            examples: [
              "Um MEI que só paga a contribuição reduzida padrão tende a ter direito, no futuro, a um benefício próximo do valor mínimo, a menos que complemente a contribuição.",
              "Um autônomo que escolhe contribuir sobre uma base de cálculo maior paga uma guia mensal mais alta, mas constrói direito a um benefício futuro potencialmente maior.",
            ],
            keyConcepts: [
              "MEI contribui com alíquota reduzida sobre o salário mínimo, geralmente garantindo benefício no valor mínimo.",
              "Autônomos (contribuintes individuais) podem escolher uma base de cálculo maior para aumentar o benefício futuro.",
              "Autônomos e MEIs precisam se organizar ativamente para manter a contribuição em dia, sem desconto automático.",
            ],
            quiz: [
              {
                question: "O que acontece se um MEI só paga a contribuição reduzida padrão, sem complementar?",
                options: [
                  "Ele perde o direito a qualquer aposentadoria",
                  "Ele tende a ter direito, no futuro, a um benefício próximo do valor mínimo",
                  "Ele automaticamente recebe o benefício máximo",
                  "A contribuição reduzida não conta para nada",
                ],
                correctIndex: 1,
                explanation: "A alíquota reduzida do MEI garante direito ao benefício, mas normalmente no valor mínimo, a menos que haja complementação voluntária.",
              },
            ],
            exercise: {
              prompt: "Se você é (ou pretende ser) MEI ou autônomo, pesquise a base de cálculo atual da sua contribuição ao INSS e o que ela garante de benefício futuro.",
              placeholder: "Minha situação de contribuição: ...",
            },
          },
        },
        {
          id: lid("inss-e-aposentadoria-publica", 5),
          title: "Por que só o INSS raramente é suficiente",
          content: {
            explanation: [
              "O INSS tem um teto de benefício — um valor máximo que pode ser pago, independentemente de quanto a pessoa ganhava durante a vida ativa. Para quem tem renda mais alta, isso costuma significar uma queda proporcional relevante de renda na aposentadoria.",
              "Mesmo para quem ganha dentro do teto, o valor do benefício raramente reproduz 100% da última renda ativa, já que depende da média de toda a vida contributiva e de percentuais que crescem com o tempo de contribuição.",
              "Por esses motivos, é comum — e recomendado — complementar o planejamento de aposentadoria com previdência privada e investimentos próprios, temas dos próximos cursos desta trilha, especialmente para quem deseja manter um padrão de vida parecido com o da fase ativa.",
            ],
            examples: [
              "Alguém que ganha bem acima do teto do INSS durante a vida ativa pode ver uma queda de renda proporcionalmente grande ao se aposentar apenas pelo benefício público.",
              "Complementar o INSS com investimentos próprios, começados ainda cedo na vida profissional, ajuda a preencher essa diferença ao longo do tempo.",
            ],
            keyConcepts: [
              "O INSS tem um teto de benefício, independente de quanto a pessoa ganhava na vida ativa.",
              "O valor do benefício raramente reproduz 100% da última renda ativa.",
              "Complementar com previdência privada e investimentos próprios é comum para manter o padrão de vida.",
            ],
            quiz: [
              {
                question: "Por que o INSS, sozinho, costuma ser insuficiente para manter o padrão de vida de quem ganha bem acima da média?",
                options: [
                  "Porque o INSS não existe mais",
                  "Porque existe um teto de benefício, gerando uma queda proporcional de renda para quem ganhava mais na vida ativa",
                  "Porque o INSS só paga benefícios a cada dois anos",
                  "Porque só autônomos recebem benefício do INSS",
                ],
                correctIndex: 1,
                explanation: "O teto de benefício limita o valor máximo pago, o que afeta proporcionalmente mais quem tinha renda mais alta durante a vida ativa.",
              },
            ],
            exercise: {
              prompt: "Estime, de forma aproximada, qual seria a diferença entre sua renda atual e um possível benefício do INSS no futuro. Essa diferença te preocupa?",
              placeholder: "Minha estimativa: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 2 — Previdência privada
    // ---------------------------------------------------------------
    {
      id: "previdencia-privada",
      title: "Previdência privada",
      description: "PGBL x VGBL e quando cada um faz sentido.",
      icon: "📋",
      lessons: [
        {
          id: lid("previdencia-privada", 1),
          title: "O que é previdência privada",
          content: {
            explanation: [
              "Previdência privada é um investimento de longo prazo, oferecido por seguradoras e bancos, criado para complementar a aposentadoria pública (INSS) — não substitui o INSS, funciona junto com ele.",
              "Diferente de outros investimentos, a previdência privada tem regras próprias de tributação e de resgate, pensadas especificamente para incentivar a permanência do dinheiro por prazos longos.",
              "Os dois tipos mais comuns no Brasil são o PGBL e o VGBL, cujas diferenças (e para quem cada um faz mais sentido) são o tema da próxima aula.",
            ],
            examples: [
              "Uma pessoa pode contribuir mensalmente para um plano de previdência privada, além de contribuir para o INSS, formando duas fontes de renda na aposentadoria.",
              "Diferente de um fundo de investimento comum, a previdência privada tem regras específicas de tributação que recompensam permanecer investido por mais tempo.",
            ],
            keyConcepts: [
              "Previdência privada: investimento de longo prazo, complementar ao INSS, não um substituto.",
              "Tem regras próprias de tributação e resgate, pensadas para incentivar permanência de longo prazo.",
              "PGBL e VGBL são os dois tipos mais comuns no Brasil.",
            ],
            quiz: [
              {
                question: "A previdência privada substitui o INSS?",
                options: [
                  "Sim, quem tem previdência privada não precisa mais contribuir ao INSS",
                  "Não, ela é um complemento ao INSS, funcionando junto com ele",
                  "Sim, mas só para autônomos",
                  "Previdência privada e INSS são exatamente a mesma coisa",
                ],
                correctIndex: 1,
                explanation: "A previdência privada é pensada para complementar a renda do INSS, não para substituí-lo.",
              },
            ],
            exercise: {
              prompt: "Você já tem (ou já pesquisou) algum plano de previdência privada? O que sabe sobre ele até agora?",
              placeholder: "Minha situação/conhecimento atual: ...",
            },
          },
        },
        {
          id: lid("previdencia-privada", 2),
          title: "PGBL x VGBL: as diferenças que importam",
          content: {
            explanation: [
              "No PGBL, as contribuições podem ser deduzidas do Imposto de Renda até um limite, mas somente por quem declara pelo modelo completo — em troca, no resgate, o imposto incide sobre o valor total (contribuições mais rendimento), não só sobre o rendimento.",
              "No VGBL, as contribuições não são dedutíveis do Imposto de Renda, mas em compensação o imposto no resgate incide apenas sobre o rendimento, não sobre o valor total investido.",
              "A escolha entre os dois depende principalmente de dois fatores: se a pessoa declara Imposto de Renda pelo modelo completo (o que favorece o PGBL) e se ela contribui para o INSS ou regime próprio de previdência (condição normalmente exigida para aproveitar a dedução do PGBL).",
            ],
            examples: [
              "Alguém que declara IR completo e contribui para o INSS pode se beneficiar da dedução das contribuições ao PGBL, reduzindo o imposto a pagar todo ano.",
              "Alguém que declara IR simplificado, ou não tem direito à dedução, tende a se beneficiar mais do VGBL, já que não perderia a dedução que não teria de qualquer forma.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "PGBL", items: ["Contribuições dedutíveis do IR (até um limite)", "Imposto no resgate incide sobre o valor total", "Exige declaração completa e contribuição ao INSS/regime próprio"] },
              right: { label: "VGBL", items: ["Contribuições não são dedutíveis do IR", "Imposto no resgate incide só sobre o rendimento", "Não exige declaração completa"] },
            },
            keyConcepts: [
              "PGBL: contribuições dedutíveis do IR, mas imposto no resgate sobre o valor total.",
              "VGBL: sem dedução na contribuição, mas imposto no resgate só sobre o rendimento.",
              "A escolha depende do modelo de declaração de IR e da contribuição ao INSS ou regime próprio.",
            ],
            quiz: [
              {
                question: "Qual é a principal vantagem do PGBL para quem declara Imposto de Renda pelo modelo completo?",
                options: [
                  "O resgate é sempre isento de imposto",
                  "As contribuições podem ser deduzidas do IR devido, até um limite",
                  "Não existe limite de aporte",
                  "O PGBL garante rentabilidade fixa",
                ],
                correctIndex: 1,
                explanation: "A possibilidade de deduzir as contribuições do IR devido é a principal vantagem do PGBL, disponível apenas para quem declara pelo modelo completo.",
              },
            ],
            exercise: {
              prompt: "Considerando como você declara (ou pretende declarar) o Imposto de Renda, qual dos dois — PGBL ou VGBL — faria mais sentido pra você?",
              placeholder: "Minha escolha e justificativa: ...",
            },
          },
        },
        {
          id: lid("previdencia-privada", 3),
          title: "Tabela regressiva x progressiva de tributação",
          content: {
            explanation: [
              "Na tabela regressiva, a alíquota de imposto sobre o resgate diminui quanto mais tempo o dinheiro permanece investido — é vantajosa para quem pretende deixar o dinheiro aplicado por muitos anos, como é típico de um plano de aposentadoria de longo prazo.",
              "Na tabela progressiva, a tributação segue a mesma lógica da tabela do Imposto de Renda normal sobre salários, o que pode ser mais vantajoso para quem pretende resgatar em prazos mais curtos, ou espera ter uma renda tributável baixa no momento do resgate.",
              "A escolha entre as duas tabelas é feita no momento da contratação do plano e, na prática, costuma ser definitiva — por isso vale entender bem as duas opções e o horizonte de tempo pretendido antes de decidir.",
            ],
            examples: [
              "Alguém que pretende deixar o dinheiro investido por 15 ou 20 anos antes de resgatar tende a se beneficiar da tabela regressiva, com alíquota bem menor nesse horizonte.",
              "Alguém que pode precisar resgatar em poucos anos, ou espera ter renda tributável baixa na aposentadoria, pode preferir a tabela progressiva.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Regressiva", items: ["Alíquota cai quanto mais tempo o dinheiro fica investido", "Vantajosa para horizonte de longo prazo"] },
              right: { label: "Progressiva", items: ["Segue a tabela normal do Imposto de Renda", "Pode ser melhor para prazos curtos ou renda baixa no resgate"] },
            },
            keyConcepts: [
              "Tabela regressiva: alíquota cai com o tempo, favorece quem mantém o dinheiro investido por muitos anos.",
              "Tabela progressiva: segue a tabela normal do IR, pode ser melhor para prazos curtos.",
              "A escolha é feita na contratação e costuma ser definitiva.",
            ],
            quiz: [
              {
                question: "Para quem pretende manter o dinheiro investido por muitos anos, qual tabela de tributação costuma ser mais vantajosa?",
                options: ["Progressiva", "Regressiva", "Nenhuma, o valor é sempre igual", "Depende apenas do valor investido"],
                correctIndex: 1,
                explanation: "A tabela regressiva reduz a alíquota conforme o tempo de permanência aumenta, favorecendo horizontes de longo prazo.",
              },
            ],
            exercise: {
              prompt: "Pensando no seu horizonte de tempo até a aposentadoria, qual tabela de tributação (regressiva ou progressiva) faria mais sentido pra você?",
              placeholder: "Minha escolha e justificativa: ...",
            },
          },
        },
        {
          id: lid("previdencia-privada", 4),
          title: "Taxas de administração e de carregamento",
          content: {
            explanation: [
              "A taxa de administração é cobrada anualmente sobre o saldo total investido no plano, de forma parecida com a taxa de administração de um fundo de investimento comum — quanto maior essa taxa, maior o impacto sobre a rentabilidade ao longo de décadas.",
              "A taxa de carregamento é cobrada sobre cada aporte (entrada) ou, em alguns planos, sobre cada resgate (saída) — ela reduz diretamente o valor efetivamente investido a cada contribuição.",
              "Planos mais modernos costumam ter taxa de carregamento zero, mas ela ainda existe em alguns produtos mais antigos — por isso vale sempre comparar essas duas taxas entre diferentes planos antes de contratar, já que ambas corroem a rentabilidade final de forma silenciosa ao longo do tempo.",
            ],
            examples: [
              "Uma taxa de administração de alguns pontos percentuais ao ano, aplicada por décadas, pode reduzir de forma relevante o valor final acumulado, mesmo parecendo pequena mês a mês.",
              "Uma taxa de carregamento na entrada reduz imediatamente o valor de cada aporte que efetivamente é investido, antes mesmo de qualquer rendimento.",
            ],
            keyConcepts: [
              "Taxa de administração: cobrada anualmente sobre o saldo total investido.",
              "Taxa de carregamento: cobrada sobre cada aporte ou resgate, cada vez mais rara em planos modernos.",
              "Ambas corroem a rentabilidade final e devem ser comparadas entre planos antes de contratar.",
            ],
            quiz: [
              {
                question: "Qual é a diferença entre taxa de administração e taxa de carregamento num plano de previdência privada?",
                options: [
                  "São a mesma coisa com nomes diferentes",
                  "A de administração incide sobre o saldo total anualmente; a de carregamento incide sobre cada aporte ou resgate",
                  "A taxa de carregamento é sempre maior que a de administração",
                  "Nenhuma das duas afeta a rentabilidade final",
                ],
                correctIndex: 1,
                explanation: "São cobradas de formas diferentes: uma sobre o saldo acumulado ao longo do tempo, outra sobre cada movimentação específica de entrada ou saída.",
              },
            ],
            exercise: {
              prompt: "Se você tem (ou pesquisar) um plano de previdência privada, verifique as taxas de administração e de carregamento cobradas.",
              placeholder: "Taxa de administração: ...% ao ano\nTaxa de carregamento: ...",
            },
          },
        },
        {
          id: lid("previdencia-privada", 5),
          title: "Previdência privada faz sentido pra você?",
          content: {
            explanation: [
              "A previdência privada tende a fazer mais sentido para quem declara Imposto de Renda completo e pode aproveitar a dedução do PGBL, para quem valoriza a disciplina de um investimento de longuíssimo prazo com resgate menos acessível no curto prazo, ou para quem tem objetivos específicos de planejamento sucessório.",
              "Uma vantagem pouco conhecida da previdência privada é que, em muitos casos, ela não entra no processo de inventário, permitindo que os valores cheguem aos beneficiários indicados de forma mais rápida do que outros tipos de patrimônio.",
              "Por outro lado, para quem tem disciplina de investir por conta própria e busca custos mais baixos, investir diretamente em outros produtos de longo prazo pode ser mais vantajoso do que um plano de previdência privada com taxas elevadas.",
            ],
            examples: [
              "Alguém que declara IR completo, contribui para o INSS e quer disciplina de longo prazo tem um perfil favorável para considerar o PGBL.",
              "Alguém com disciplina de investir por conta própria, e que já otimiza a própria carteira, pode preferir investimentos diretos de longo prazo com custos menores do que os de um plano de previdência com taxas altas.",
            ],
            keyConcepts: [
              "A previdência privada tende a fazer mais sentido para quem se beneficia da dedução do PGBL ou valoriza a disciplina de longuíssimo prazo.",
              "Em muitos casos, não entra em inventário, agilizando a chegada dos valores aos beneficiários.",
              "Para quem tem disciplina própria e busca custos menores, investir diretamente pode ser mais vantajoso.",
            ],
            quiz: [
              {
                question: "Qual vantagem, pouco conhecida, a previdência privada costuma ter no planejamento sucessório?",
                options: [
                  "Ela garante isenção total de qualquer imposto",
                  "Em muitos casos, não entra no processo de inventário, agilizando o repasse aos beneficiários",
                  "Ela transfere automaticamente o patrimônio para o governo",
                  "Ela substitui a necessidade de um seguro de vida",
                ],
                correctIndex: 1,
                explanation: "Por não entrar no inventário em muitos casos, a previdência privada permite que os beneficiários indicados recebam os valores de forma mais ágil.",
              },
            ],
            exercise: {
              prompt: "Com base no que você aprendeu neste curso, a previdência privada faz sentido pra sua situação atual? Por quê?",
              placeholder: "Minha conclusão: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 3 — Independência financeira e a regra dos 4%
    // ---------------------------------------------------------------
    {
      id: "independencia-financeira",
      title: "Independência financeira e a regra dos 4%",
      description: "Viver de renda: o que isso realmente significa e exige.",
      icon: "🕊️",
      lessons: [
        {
          id: lid("independencia-financeira", 1),
          title: "O que é independência financeira",
          content: {
            explanation: [
              "Independência financeira é o ponto em que a renda gerada pelo patrimônio investido de uma pessoa é suficiente para cobrir suas despesas, sem depender de continuar trabalhando ativamente para se sustentar.",
              "Ela é diferente do conceito tradicional de aposentadoria: pode acontecer em qualquer idade, e não está necessariamente ligada a parar de trabalhar — algumas pessoas independentes financeiramente continuam trabalhando por escolha, não por necessidade.",
              "Atingir a independência financeira exige, em essência, acumular patrimônio suficiente para que o rendimento desse patrimônio sustente o padrão de vida desejado — tema aprofundado nas próximas aulas, a partir da chamada regra dos 4%.",
            ],
            examples: [
              "Uma pessoa que atinge patrimônio suficiente aos 45 anos para viver da renda desse patrimônio é financeiramente independente, mesmo sem estar na idade tradicional de aposentadoria.",
              "Alguém financeiramente independente pode optar por continuar trabalhando, mas agora por satisfação pessoal, não por necessidade financeira.",
            ],
            keyConcepts: [
              "Independência financeira: quando a renda do patrimônio cobre as despesas, sem depender de trabalho ativo.",
              "É diferente da aposentadoria tradicional e pode acontecer em qualquer idade.",
              "Exige acumular patrimônio suficiente para sustentar o padrão de vida desejado com o rendimento gerado.",
            ],
            quiz: [
              {
                question: "Independência financeira é a mesma coisa que aposentadoria tradicional?",
                options: [
                  "Sim, os dois termos significam exatamente a mesma coisa",
                  "Não, independência financeira pode acontecer em qualquer idade e não exige parar de trabalhar",
                  "Não, independência financeira só existe para quem é milionário",
                  "Sim, mas só se a pessoa tiver mais de 65 anos",
                ],
                correctIndex: 1,
                explanation: "Independência financeira é sobre a renda do patrimônio cobrir as despesas, o que pode acontecer em qualquer idade e não implica necessariamente parar de trabalhar.",
              },
            ],
            exercise: {
              prompt: "O que independência financeira significaria pra você, na prática? Você continuaria trabalhando, ou mudaria completamente de rotina?",
              placeholder: "Minha reflexão: ...",
            },
          },
        },
        {
          id: lid("independencia-financeira", 2),
          title: "A regra dos 4% (e suas limitações)",
          content: {
            explanation: [
              "A regra dos 4% é uma heurística (regra prática) que sugere ser possível sacar cerca de 4% do patrimônio investido no primeiro ano de independência financeira, ajustando esse valor pela inflação nos anos seguintes, com baixa probabilidade histórica de o dinheiro acabar num horizonte de cerca de 30 anos.",
              "Essa regra tem origem em estudos históricos (o mais conhecido é o chamado Trinity Study) baseados no comportamento do mercado americano em décadas passadas — o que significa que ela é uma referência prática, não uma garantia matemática para o futuro.",
              "Entre as limitações da regra: ela foi construída com dados de outro país e outro período histórico, é sensível à composição da carteira (ações x renda fixa) e ao chamado \"risco de sequência de retornos\" — começar a sacar justamente num período de quedas de mercado pode ser bem mais arriscado do que a média histórica sugere.",
            ],
            examples: [
              "Uma pessoa com patrimônio de R$ 1.000.000 poderia, pela regra dos 4%, considerar um saque inicial de cerca de R$ 40.000 no primeiro ano, ajustando esse valor pela inflação depois.",
              "Duas pessoas com o mesmo patrimônio, mas que começam a sacar em momentos diferentes do mercado, podem ter resultados bem diferentes ao longo de 30 anos, por causa do risco de sequência de retornos.",
            ],
            diagram: {
              type: "formula",
              formula: "Patrimônio necessário ≈ Gasto anual desejado ÷ 0,04 (ou Gasto anual × 25)",
              caption: "A forma mais comum de estimar o patrimônio-alvo usando a regra dos 4%.",
            },
            keyConcepts: [
              "A regra dos 4% sugere um saque inicial de cerca de 4% do patrimônio, ajustado pela inflação nos anos seguintes.",
              "Ela é baseada em estudos históricos de outro país e período, não é uma garantia matemática.",
              "O risco de sequência de retornos é uma das principais limitações a considerar.",
            ],
            quiz: [
              {
                question: "O que é o \"risco de sequência de retornos\", uma das limitações da regra dos 4%?",
                options: [
                  "O risco de a inflação nunca mudar",
                  "O risco de começar a sacar justamente num período de quedas de mercado, o que pode ser mais prejudicial do que sugere a média histórica",
                  "O risco de o patrimônio crescer rápido demais",
                  "Um tipo de imposto cobrado sobre saques",
                ],
                correctIndex: 1,
                explanation: "Começar os saques logo após (ou durante) uma queda de mercado consome uma parcela maior do patrimônio, prejudicando a sustentabilidade dos saques futuros.",
              },
            ],
            exercise: {
              prompt: "Usando a fórmula da regra dos 4%, estime o patrimônio necessário para sustentar um gasto anual hipotético de R$ 60.000.",
              placeholder: "Cálculo: R$ 60.000 ÷ 0,04 = ...\nPatrimônio estimado: R$ ...",
            },
          },
        },
        {
          id: lid("independencia-financeira", 3),
          title: "Calculando seu 'número' de independência financeira",
          content: {
            explanation: [
              "O \"número\" de independência financeira de uma pessoa é o valor de patrimônio que, aplicando a regra dos 4% (ou uma taxa mais conservadora), sustentaria o gasto anual desejado dela de forma indefinida.",
              "Calcular esse número exige, antes de tudo, ter uma boa estimativa do gasto anual desejado na independência financeira — que pode ser diferente do gasto atual, para mais ou para menos, dependendo do estilo de vida planejado.",
              "Usar uma taxa de saque mais conservadora do que 4% (por exemplo, 3,5%) é uma forma de dar mais margem de segurança ao plano, em troca de precisar acumular um patrimônio-alvo maior.",
            ],
            examples: [
              "Alguém que estima gastar R$ 5.000 por mês (R$ 60.000 por ano) na independência financeira, usando a regra dos 4%, teria um número-alvo de R$ 1.500.000.",
              "Usando uma taxa mais conservadora de 3,5% para o mesmo gasto anual, o número-alvo sobe para algo em torno de R$ 1.714.000 — mais segurança, mais tempo de acumulação.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Estime seu gasto anual desejado na independência financeira",
                "Escolha uma taxa de saque (4% é a referência clássica; taxas menores dão mais margem de segurança)",
                "Divida o gasto anual pela taxa escolhida (ou multiplique por 25, se usar 4%)",
                "Esse é o seu \"número\" — o patrimônio-alvo da independência financeira",
              ],
            },
            keyConcepts: [
              "O \"número\" de independência financeira é o patrimônio-alvo que sustentaria o gasto anual desejado.",
              "Depende diretamente de uma boa estimativa do gasto anual planejado, não do gasto atual necessariamente.",
              "Usar uma taxa mais conservadora que 4% aumenta a margem de segurança, mas exige mais patrimônio.",
            ],
            quiz: [
              {
                question: "O que determina diretamente o \"número\" de independência financeira de uma pessoa, além da taxa de saque escolhida?",
                options: [
                  "A idade atual da pessoa",
                  "O gasto anual desejado na independência financeira",
                  "O salário mínimo vigente",
                  "O valor do aluguel de qualquer cidade",
                ],
                correctIndex: 1,
                explanation: "O patrimônio-alvo é calculado diretamente a partir do gasto anual desejado, dividido pela taxa de saque escolhida.",
              },
            ],
            exercise: {
              prompt: "Estime seu próprio gasto anual desejado numa eventual independência financeira, e calcule seu \"número\" usando a regra dos 4%.",
              placeholder: "Gasto anual desejado: R$ ...\nMeu número (÷ 0,04): R$ ...",
            },
          },
        },
        {
          id: lid("independencia-financeira", 4),
          title: "Estratégias para acelerar o caminho",
          content: {
            explanation: [
              "Entre os fatores que influenciam a velocidade de chegar à independência financeira, a taxa de poupança — o percentual da renda que é economizado e investido — costuma ter um impacto maior no prazo total do que tentar obter retornos de investimento acima da média do mercado.",
              "Aumentar a renda (por meio de qualificação, mudança de carreira, ou uma renda extra) e reduzir despesas de forma sustentável são as duas alavancas diretas para aumentar a taxa de poupança, já que ela depende da diferença entre o que se ganha e o que se gasta.",
              "Buscar retornos consistentes com risco controlado, em vez de tentar \"acertar\" apostas de alto risco, também contribui — mas de forma geralmente menos decisiva do que a taxa de poupança ao longo do processo de acumulação.",
            ],
            examples: [
              "Aumentar a taxa de poupança de 10% para 30% da renda reduz de forma significativa o tempo necessário para acumular o patrimônio-alvo, mesmo sem mudar a taxa de retorno dos investimentos.",
              "Buscar uma renda extra e direcioná-la inteiramente para investimentos acelera o caminho de forma mais previsível do que tentar prever qual ativo vai ter o melhor desempenho.",
            ],
            keyConcepts: [
              "A taxa de poupança costuma ter impacto maior no prazo de independência financeira do que tentar bater o mercado.",
              "Aumentar renda e reduzir despesas de forma sustentável são as duas alavancas diretas da taxa de poupança.",
              "Buscar retornos consistentes com risco controlado ajuda, mas de forma geralmente menos decisiva.",
            ],
            quiz: [
              {
                question: "O que costuma ter mais impacto no prazo para atingir a independência financeira: a taxa de poupança ou tentar obter retornos acima da média do mercado?",
                options: [
                  "Tentar obter retornos acima da média do mercado",
                  "A taxa de poupança (o percentual da renda economizado e investido)",
                  "Nenhum dos dois faz diferença real",
                  "Apenas a sorte determina o resultado",
                ],
                correctIndex: 1,
                explanation: "Aumentar a taxa de poupança é um fator mais controlável e, historicamente, mais decisivo do que tentar superar consistentemente o retorno médio do mercado.",
              },
            ],
            exercise: {
              prompt: "Qual é sua taxa de poupança aproximada hoje (percentual da renda que você consegue investir)? O que poderia fazer pra aumentá-la?",
              placeholder: "Minha taxa de poupança atual: ...%\nO que poderia mudar: ...",
            },
          },
        },
        {
          id: lid("independencia-financeira", 5),
          title: "Vivendo de renda: ajustando o plano na prática",
          content: {
            explanation: [
              "Na prática, viver de renda do patrimônio raramente segue uma regra fixa de forma rígida — é comum ajustar os saques conforme o desempenho real da carteira, gastando um pouco menos em anos ruins de mercado e um pouco mais em anos bons.",
              "Estratégias de saque flexíveis (em vez de uma taxa fixa todo ano, independente do desempenho) costumam reduzir o risco de o patrimônio se esgotar antes do esperado, especialmente em cenários de mercado mais adversos logo no início do período de saques.",
              "Manter uma reserva de segurança maior do que a reserva de emergência tradicional — o suficiente para cobrir alguns anos de despesas sem precisar vender ativos em queda — também ajuda a atravessar períodos ruins de mercado sem comprometer o plano de longo prazo.",
            ],
            examples: [
              "Alguém vivendo de renda pode optar por reduzir os gastos discricionários (viagens, lazer) num ano de forte queda do mercado, preservando o patrimônio principal para os anos seguintes.",
              "Manter uma reserva equivalente a alguns anos de despesas em investimentos de baixo risco permite evitar vender ações justamente durante uma queda, esperando a recuperação antes de precisar mexer nessa parte da carteira.",
            ],
            keyConcepts: [
              "Ajustar os saques conforme o desempenho real da carteira reduz o risco de esgotar o patrimônio antes do esperado.",
              "Estratégias de saque flexíveis tendem a ser mais seguras do que uma taxa fixa rígida.",
              "Uma reserva de segurança maior ajuda a atravessar períodos ruins de mercado sem comprometer o plano.",
            ],
            quiz: [
              {
                question: "Por que ajustar os saques conforme o desempenho da carteira (em vez de uma taxa fixa rígida) tende a ser mais seguro?",
                options: [
                  "Porque isso garante que o patrimônio nunca vai variar",
                  "Porque reduz o risco de esgotar o patrimônio mais rápido em cenários de mercado adversos",
                  "Porque taxas fixas são proibidas por lei",
                  "Não há diferença real entre as duas abordagens",
                ],
                correctIndex: 1,
                explanation: "Reduzir os saques em anos ruins ajuda a preservar o patrimônio, aumentando a chance de o plano durar pelo tempo necessário.",
              },
            ],
            exercise: {
              prompt: "Imagine que você já vive de renda do seu patrimônio e o mercado tem uma queda forte num determinado ano. O que você ajustaria no seu plano de gastos?",
              placeholder: "Meus ajustes: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 4 — Planejando a aposentadoria por conta própria
    // ---------------------------------------------------------------
    {
      id: "planejando-a-aposentadoria",
      title: "Planejando a aposentadoria por conta própria",
      description: "Montar seu próprio plano, sem depender só do INSS ou de terceiros.",
      icon: "🗺️",
      lessons: [
        {
          id: lid("planejando-a-aposentadoria", 1),
          title: "Definindo a renda desejada na aposentadoria",
          content: {
            explanation: [
              "O ponto de partida de qualquer plano de aposentadoria é estimar quanto dinheiro será necessário por mês no futuro — e essa renda desejada não precisa (nem costuma) ser igual à renda atual.",
              "Algumas despesas tendem a diminuir na aposentadoria (como gastos ligados ao trabalho, ou financiamentos já quitados), enquanto outras podem aumentar, especialmente despesas com saúde, que tendem a crescer com a idade.",
              "Definir essa renda desejada de forma realista, considerando o estilo de vida esperado, é a base para todos os cálculos das próximas aulas — quanto investir mensalmente e como combinar as diferentes fontes de renda futura.",
            ],
            examples: [
              "Alguém que planeja quitar o financiamento do imóvel antes da aposentadoria pode estimar uma renda desejada menor do que a renda atual, já que essa despesa vai desaparecer.",
              "Alguém que planeja viajar bastante na aposentadoria pode precisar de uma renda maior do que a atual para sustentar esse estilo de vida.",
            ],
            keyConcepts: [
              "A renda desejada na aposentadoria não precisa ser igual à renda atual.",
              "Algumas despesas tendem a diminuir (trabalho, financiamentos), outras a aumentar (saúde).",
              "Essa estimativa é a base para todos os cálculos do plano de aposentadoria.",
            ],
            quiz: [
              {
                question: "Por que a renda desejada na aposentadoria não precisa ser igual à renda atual da pessoa?",
                options: [
                  "Porque isso é proibido por lei",
                  "Porque algumas despesas tendem a diminuir e outras a aumentar, mudando o total necessário",
                  "Porque a renda na aposentadoria é sempre menor obrigatoriamente",
                  "Porque a inflação torna esse cálculo impossível",
                ],
                correctIndex: 1,
                explanation: "O padrão de despesas muda ao longo da vida, então a renda necessária na aposentadoria pode ser maior, menor ou similar à renda atual, dependendo de cada situação.",
              },
            ],
            exercise: {
              prompt: "Estime sua renda mensal desejada na aposentadoria, considerando quais despesas atuais você espera que diminuam ou aumentem.",
              placeholder: "Renda desejada estimada: R$ ...\nDespesas que devem diminuir: ...\nDespesas que devem aumentar: ...",
            },
          },
        },
        {
          id: lid("planejando-a-aposentadoria", 2),
          title: "Quanto investir mensalmente para chegar lá",
          content: {
            explanation: [
              "Depois de definir a renda desejada e calcular o patrimônio-alvo (usando, por exemplo, a regra dos 4% vista no curso anterior), o próximo passo é calcular quanto investir mensalmente para chegar a esse patrimônio no prazo desejado.",
              "Esse cálculo usa a lógica de juros compostos aplicada a uma série de aportes mensais, considerando uma taxa de retorno esperada realista para o tipo de carteira planejada — quanto maior o prazo disponível, menor o aporte mensal necessário para chegar ao mesmo patrimônio-alvo.",
              "Ferramentas de simulação (calculadoras financeiras, planilhas ou simuladores online) facilitam esse cálculo, permitindo testar diferentes cenários de prazo, aporte e taxa de retorno esperada.",
            ],
            examples: [
              "Alguém com 30 anos até a aposentadoria pretendida precisa investir um valor mensal menor para chegar ao mesmo patrimônio-alvo do que alguém com apenas 15 anos disponíveis.",
              "Aumentar a taxa de retorno esperada da carteira (assumindo mais risco) reduz o aporte mensal necessário para o mesmo patrimônio-alvo — mas também aumenta a incerteza sobre atingir esse retorno.",
            ],
            diagram: {
              type: "formula",
              formula: "Valor futuro de aportes mensais = Aporte × [((1 + taxa)^meses − 1) ÷ taxa]",
              caption: "A fórmula de juros compostos aplicada a uma série de aportes mensais constantes — a base para calcular quanto investir todo mês.",
            },
            keyConcepts: [
              "O aporte mensal necessário depende do patrimônio-alvo, do prazo disponível e da taxa de retorno esperada.",
              "Quanto maior o prazo disponível, menor o aporte mensal necessário para o mesmo patrimônio-alvo.",
              "Simuladores financeiros ajudam a testar diferentes cenários antes de definir o plano.",
            ],
            quiz: [
              {
                question: "O que acontece com o aporte mensal necessário quando o prazo até a aposentadoria pretendida é maior?",
                options: [
                  "O aporte mensal necessário aumenta",
                  "O aporte mensal necessário diminui, para o mesmo patrimônio-alvo",
                  "O prazo não influencia o aporte necessário",
                  "É preciso investir tudo de uma vez, independente do prazo",
                ],
                correctIndex: 1,
                explanation: "Com mais tempo, o efeito dos juros compostos faz mais do trabalho, reduzindo o valor mensal necessário para atingir o mesmo patrimônio-alvo.",
              },
            ],
            exercise: {
              prompt: "Usando um simulador de juros compostos (ou uma estimativa própria), calcule quanto você precisaria investir por mês para atingir seu patrimônio-alvo no prazo que você tem disponível.",
              placeholder: "Patrimônio-alvo: R$ ...\nPrazo disponível: ... anos\nAporte mensal estimado: R$ ...",
            },
          },
        },
        {
          id: lid("planejando-a-aposentadoria", 3),
          title: "Combinando INSS, previdência privada e investimentos próprios",
          content: {
            explanation: [
              "Um plano completo de aposentadoria normalmente combina três fontes diferentes, cada uma com um papel específico: o INSS como um piso de renda garantido (mesmo que limitado pelo teto), a previdência privada como um complemento com benefícios fiscais e sucessórios específicos, e os investimentos próprios como a parte mais flexível e potencialmente mais rentável do plano.",
              "Diversificar entre essas três fontes reduz a dependência de uma única delas — se uma fonte render menos que o esperado (por exemplo, uma mudança nas regras do INSS), as outras ajudam a sustentar o plano.",
              "O peso de cada fonte no plano final varia de pessoa para pessoa, dependendo da renda, do perfil de investidor e dos objetivos específicos de cada um — não existe uma proporção única correta para todo mundo.",
            ],
            examples: [
              "Uma pessoa pode planejar que o INSS cubra as despesas básicas, a previdência privada complemente parte do restante, e os investimentos próprios cubram o padrão de vida desejado além disso.",
              "Alguém que não confia tanto nas regras futuras do INSS pode optar por dar mais peso aos investimentos próprios e à previdência privada no seu plano.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "INSS: piso de renda garantido, mesmo que limitado pelo teto",
                "Previdência privada: complemento com benefícios fiscais e sucessórios",
                "Investimentos próprios: a parte mais flexível e potencialmente mais rentável",
                "Combine as três de acordo com sua renda, perfil e objetivos específicos",
              ],
            },
            keyConcepts: [
              "Um plano completo combina INSS, previdência privada e investimentos próprios, cada um com um papel específico.",
              "Diversificar entre as três fontes reduz a dependência de uma única delas.",
              "O peso ideal de cada fonte varia de pessoa para pessoa — não existe uma proporção universal.",
            ],
            quiz: [
              {
                question: "Qual é a principal vantagem de combinar INSS, previdência privada e investimentos próprios no planejamento de aposentadoria?",
                options: [
                  "Isso é exigido por lei",
                  "Reduz a dependência de uma única fonte de renda, dando mais segurança ao plano como um todo",
                  "Isso elimina completamente qualquer risco",
                  "Só é possível se aposentar combinando as três fontes",
                ],
                correctIndex: 1,
                explanation: "Diversificar as fontes de renda na aposentadoria reduz o impacto de qualquer mudança ou surpresa negativa em uma única fonte específica.",
              },
            ],
            exercise: {
              prompt: "Pense em como você combinaria (ou já combina) INSS, previdência privada e investimentos próprios no seu plano de aposentadoria.",
              placeholder: "Meu plano combinado: ...",
            },
          },
        },
        {
          id: lid("planejando-a-aposentadoria", 4),
          title: "Ajustando o plano ao longo das décadas",
          content: {
            explanation: [
              "Um plano de aposentadoria não deveria ser definido uma única vez e esquecido — ele merece revisões periódicas, a cada poucos anos, conforme mudanças de renda, objetivos pessoais e o cenário econômico.",
              "Conforme a aposentadoria se aproxima, é comum migrar gradualmente para uma alocação mais conservadora — reduzindo a exposição a renda variável e aumentando a de renda fixa — um processo conhecido como \"glide path\", para reduzir o risco de uma queda forte de mercado justamente perto do momento de começar a usar o patrimônio.",
              "Revisar o plano também envolve reavaliar as próprias premissas usadas nos cálculos — taxa de retorno esperada, inflação projetada, renda desejada — que podem mudar ao longo de décadas de planejamento.",
            ],
            examples: [
              "Uma pessoa aos 30 anos de idade pode ter uma carteira com maior proporção de renda variável, migrando gradualmente para mais renda fixa conforme se aproxima dos 60 anos.",
              "Revisar o plano a cada 5 anos permite ajustar o aporte mensal ou o prazo, caso a renda ou os objetivos tenham mudado desde a última revisão.",
            ],
            keyConcepts: [
              "O plano de aposentadoria deve ser revisado periodicamente, não definido uma única vez.",
              "Migrar gradualmente para uma alocação mais conservadora (glide path) reduz o risco perto da aposentadoria.",
              "As premissas do plano (retorno esperado, inflação, renda desejada) também devem ser revisadas ao longo do tempo.",
            ],
            quiz: [
              {
                question: "O que é o \"glide path\" no planejamento de aposentadoria?",
                options: [
                  "Um tipo específico de previdência privada",
                  "A migração gradual para uma alocação mais conservadora conforme a aposentadoria se aproxima",
                  "Uma taxa de juros específica do Tesouro Direto",
                  "Um imposto cobrado sobre aposentadorias",
                ],
                correctIndex: 1,
                explanation: "O glide path reduz gradualmente a exposição a risco conforme o momento de usar o patrimônio se aproxima, protegendo contra quedas de mercado em um momento crítico.",
              },
            ],
            exercise: {
              prompt: "Se você já tem um plano de aposentadoria em andamento, quando foi a última vez que revisou as premissas dele? O que mudou desde então?",
              placeholder: "Última revisão: ...\nO que mudou: ...",
            },
          },
        },
        {
          id: lid("planejando-a-aposentadoria", 5),
          title: "Erros comuns no planejamento de aposentadoria",
          content: {
            explanation: [
              "Um dos erros mais comuns é começar tarde demais: como os juros compostos dependem fortemente do tempo, adiar o início do plano por muitos anos exige aportes mensais bem maiores depois para compensar o tempo perdido.",
              "Outro erro é não considerar a inflação nas projeções, superestimando o poder de compra futuro do patrimônio acumulado — um erro já discutido em detalhe na trilha sobre finanças avançadas desta plataforma.",
              "Depender só do INSS sem nenhum planejamento complementar, e resgatar a reserva de longo prazo para cobrir emergências de curto prazo por falta de uma reserva de emergência separada, são outros dois erros comuns que comprometem o plano de aposentadoria ao longo do caminho.",
            ],
            examples: [
              "Duas pessoas com o mesmo patrimônio-alvo, mas que começam a investir com 10 anos de diferença, podem precisar de aportes mensais bem diferentes para chegar ao mesmo lugar no mesmo prazo final.",
              "Alguém sem reserva de emergência separada pode precisar resgatar parte do patrimônio de aposentadoria para cobrir um imprevisto, atrasando o plano de longo prazo.",
            ],
            keyConcepts: [
              "Começar tarde demais exige aportes mensais bem maiores para compensar o tempo perdido.",
              "Não considerar a inflação nas projeções superestima o poder de compra futuro do patrimônio.",
              "Depender só do INSS e não ter reserva de emergência separada são outros erros comuns.",
            ],
            quiz: [
              {
                question: "Por que começar o planejamento de aposentadoria tarde demais é considerado um erro comum e custoso?",
                options: [
                  "Porque depois de uma certa idade não é mais possível investir",
                  "Porque o tempo é um fator central nos juros compostos, e começar tarde exige aportes mensais bem maiores para compensar",
                  "Porque planos de aposentadoria só valem para quem começa antes dos 20 anos",
                  "Não faz diferença real quando o plano começa",
                ],
                correctIndex: 1,
                explanation: "Como os juros compostos dependem fortemente do tempo, cada ano de atraso aumenta significativamente o esforço mensal necessário depois.",
              },
            ],
            exercise: {
              prompt: "Dos erros listados nesta aula, qual você identifica no seu próprio planejamento (ou falta dele) hoje? O que pode fazer para corrigir?",
              placeholder: "Erro identificado: ...\nO que vou fazer: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 5 — Sucessão e planejamento patrimonial básico
    // ---------------------------------------------------------------
    {
      id: "sucessao-e-planejamento-patrimonial",
      title: "Sucessão e planejamento patrimonial básico",
      description: "Proteger e organizar o patrimônio pensando também em quem vem depois.",
      icon: "📜",
      lessons: [
        {
          id: lid("sucessao-e-planejamento-patrimonial", 1),
          title: "Por que planejamento sucessório importa, não só para ricos",
          content: {
            explanation: [
              "Planejamento sucessório costuma ser associado a grandes fortunas, mas qualquer pessoa com algum patrimônio (mesmo modesto, como um imóvel ou uma conta poupança) ou com dependentes se beneficia de organizar como esse patrimônio será transferido no futuro.",
              "Sem nenhum planejamento, a transferência de bens após o falecimento costuma passar por um processo de inventário mais longo e custoso, o que pode gerar dificuldades financeiras justamente num momento emocionalmente difícil para a família.",
              "Planejamento sucessório não é sobre esperar ou desejar a morte — é sobre cuidado prático com quem fica, reduzindo burocracia, custo e incerteza num momento que já é naturalmente difícil.",
            ],
            examples: [
              "Uma família sem nenhum planejamento pode enfrentar meses (ou anos) de inventário judicial antes de conseguir acessar contas e bens do falecido.",
              "Um seguro de vida simples, mesmo de valor modesto, pode garantir liquidez imediata à família enquanto o inventário formal ainda está em andamento.",
            ],
            keyConcepts: [
              "Planejamento sucessório beneficia qualquer pessoa com algum patrimônio ou dependentes, não só grandes fortunas.",
              "Sem planejamento, a transferência de bens costuma ser mais longa e custosa (via inventário).",
              "É um ato de cuidado prático com quem fica, não uma questão apenas para os muito ricos.",
            ],
            quiz: [
              {
                question: "Por que o planejamento sucessório é relevante mesmo para quem não tem uma grande fortuna?",
                options: [
                  "Porque a lei exige planejamento sucessório para qualquer patrimônio",
                  "Porque qualquer pessoa com algum patrimônio ou dependentes se beneficia de reduzir a burocracia e o custo da transferência de bens",
                  "Porque só milionários têm herdeiros",
                  "Não há relevância real para quem tem pouco patrimônio",
                ],
                correctIndex: 1,
                explanation: "Mesmo um patrimônio modesto passa por processos de transferência que podem ser simplificados e agilizados com algum planejamento prévio.",
              },
            ],
            exercise: {
              prompt: "Reflita: você (ou sua família) já pensou em como o patrimônio de vocês seria transferido em caso de necessidade? O que já está organizado, e o que não está?",
              placeholder: "Minha reflexão: ...",
            },
          },
        },
        {
          id: lid("sucessao-e-planejamento-patrimonial", 2),
          title: "Testamento, herança e inventário: noções básicas",
          content: {
            explanation: [
              "O testamento é um documento em que uma pessoa expressa sua vontade sobre a destinação de parte do seu patrimônio após o falecimento — no Brasil, ele precisa respeitar a chamada \"legítima\", a parcela do patrimônio reservada por lei aos herdeiros necessários (como filhos e cônjuge).",
              "Herança é o conjunto de bens, direitos e dívidas deixados por uma pessoa após o falecimento, que serão transmitidos aos herdeiros conforme a lei e (se houver) o testamento.",
              "Inventário é o processo, judicial ou extrajudicial (em cartório, quando não há testamento nem conflito entre os herdeiros), que formaliza legalmente a partilha desses bens entre os herdeiros.",
            ],
            examples: [
              "Uma pessoa pode fazer um testamento para destinar a parte disponível do seu patrimônio (além da legítima) a alguém que não seria herdeiro por lei, como um amigo próximo.",
              "Quando não há testamento e os herdeiros estão de acordo, o inventário pode ser feito de forma mais simples e rápida, diretamente em cartório (extrajudicial).",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Falecimento da pessoa",
                "Levantamento dos bens, direitos e dívidas (a herança)",
                "Verificação de testamento, se houver",
                "Inventário (judicial ou extrajudicial) formaliza a partilha entre os herdeiros",
              ],
            },
            keyConcepts: [
              "Testamento: expressa a vontade da pessoa sobre parte do patrimônio, respeitando a legítima dos herdeiros necessários.",
              "Herança: o conjunto de bens, direitos e dívidas deixados após o falecimento.",
              "Inventário: processo que formaliza legalmente a partilha da herança entre os herdeiros.",
            ],
            quiz: [
              {
                question: "O que é a \"legítima\", no contexto de um testamento no Brasil?",
                options: [
                  "Um tipo de imposto sobre heranças",
                  "A parcela do patrimônio reservada por lei aos herdeiros necessários, que o testamento não pode desrespeitar",
                  "O nome do processo de inventário extrajudicial",
                  "Um documento que substitui o testamento",
                ],
                correctIndex: 1,
                explanation: "A legítima garante, por lei, uma parcela mínima do patrimônio aos herdeiros necessários, limitando o que pode ser livremente destinado por testamento.",
              },
            ],
            exercise: {
              prompt: "Pesquise (de forma geral) se um testamento é algo que faria sentido no seu planejamento pessoal ou familiar hoje. Por quê?",
              placeholder: "Minha reflexão: ...",
            },
          },
        },
        {
          id: lid("sucessao-e-planejamento-patrimonial", 3),
          title: "Seguro de vida como ferramenta de proteção",
          content: {
            explanation: [
              "O seguro de vida paga um valor determinado aos beneficiários indicados pelo segurado, em caso de falecimento — esse valor é definido em contrato e normalmente não depende do tamanho do patrimônio deixado.",
              "Uma das principais vantagens práticas do seguro de vida é a liquidez imediata: diferente de outros bens, que podem ficar retidos durante o processo de inventário, o valor do seguro costuma ser pago aos beneficiários de forma bem mais rápida.",
              "Essa liquidez imediata é especialmente útil para cobrir despesas urgentes da família (funeral, contas do dia a dia, dívidas) sem depender da conclusão do inventário, que pode levar meses ou até anos.",
            ],
            examples: [
              "Uma família pode usar o valor recebido de um seguro de vida para manter as despesas do dia a dia enquanto o inventário dos demais bens ainda está em andamento.",
              "Um seguro de vida pode ser dimensionado especificamente para cobrir dívidas em aberto (como um financiamento), evitando que a família precise arcar com elas sozinha.",
            ],
            keyConcepts: [
              "Seguro de vida paga um valor definido em contrato aos beneficiários, em caso de falecimento.",
              "Costuma ter liquidez bem mais rápida do que outros bens, que ficam retidos no inventário.",
              "É útil para cobrir despesas urgentes e dívidas da família sem depender da conclusão do inventário.",
            ],
            quiz: [
              {
                question: "Qual é a principal vantagem prática do seguro de vida em relação a outros bens deixados após o falecimento?",
                options: [
                  "Ele elimina a necessidade de qualquer inventário",
                  "Ele costuma ter liquidez mais rápida, chegando aos beneficiários sem depender da conclusão do inventário",
                  "Ele é sempre mais valioso que qualquer outro bem",
                  "Ele substitui automaticamente o testamento",
                ],
                correctIndex: 1,
                explanation: "A rapidez no pagamento do seguro de vida é especialmente valiosa para cobrir despesas urgentes da família, diferente de bens retidos durante o inventário.",
              },
            ],
            exercise: {
              prompt: "Você (ou seus dependentes) teria alguma dificuldade financeira urgente em caso de um imprevisto grave? Um seguro de vida faria sentido pra essa situação?",
              placeholder: "Minha reflexão: ...",
            },
          },
        },
        {
          id: lid("sucessao-e-planejamento-patrimonial", 4),
          title: "Doação em vida x herança",
          content: {
            explanation: [
              "A doação em vida transfere parte do patrimônio para os beneficiários antes do falecimento do doador, podendo, em alguns casos, incluir uma reserva de usufruto — o doador transfere a propriedade, mas mantém o direito de uso e dos rendimentos do bem enquanto viver.",
              "A herança, por outro lado, transfere o patrimônio somente após o falecimento, através do processo de inventário.",
              "A escolha entre doar em vida ou deixar como herança envolve considerações tributárias (como o ITCMD, imposto estadual sobre transmissão de bens) e familiares específicas de cada situação, e geralmente é recomendável buscar orientação profissional especializada antes de decidir.",
            ],
            examples: [
              "Um pai pode doar um imóvel para os filhos ainda em vida, mantendo o usufruto (o direito de morar ou alugar o imóvel) até o próprio falecimento.",
              "Uma família pode optar por não fazer doações em vida e deixar todo o patrimônio para ser transferido via herança, dependendo do planejamento tributário e familiar específico.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Doação em vida", items: ["Transferência acontece antes do falecimento", "Pode incluir reserva de usufruto", "Envolve considerações tributárias específicas (ITCMD)"] },
              right: { label: "Herança", items: ["Transferência acontece após o falecimento", "Passa pelo processo de inventário", "Segue as regras legais de sucessão"] },
            },
            keyConcepts: [
              "Doação em vida transfere o patrimônio antes do falecimento, podendo incluir reserva de usufruto.",
              "Herança transfere o patrimônio após o falecimento, via inventário.",
              "A escolha entre as duas envolve considerações tributárias e familiares específicas, recomendando orientação profissional.",
            ],
            quiz: [
              {
                question: "O que é a \"reserva de usufruto\" numa doação em vida?",
                options: [
                  "Um tipo de seguro obrigatório na doação",
                  "O direito do doador de continuar usando e usufruindo do bem, mesmo após transferir a propriedade",
                  "Um imposto cobrado sobre a doação",
                  "A parte do patrimônio que não pode ser doada",
                ],
                correctIndex: 1,
                explanation: "A reserva de usufruto permite ao doador transferir a propriedade, mas manter o uso e os rendimentos do bem enquanto viver.",
              },
            ],
            exercise: {
              prompt: "Se você tem algum patrimônio relevante, reflita: faria mais sentido, no futuro, doar em vida ou deixar como herança? Por quê?",
              placeholder: "Minha reflexão: ...",
            },
          },
        },
        {
          id: lid("sucessao-e-planejamento-patrimonial", 5),
          title: "Organizando informações financeiras para a família",
          content: {
            explanation: [
              "Manter uma lista organizada e acessível de contas bancárias, investimentos, seguros e outras informações financeiras essenciais reduz bastante o estresse e a dificuldade da família em momentos difíceis, como um falecimento ou uma incapacidade repentina.",
              "Essa organização deve incluir onde encontrar as informações (não necessariamente as senhas em si, por questões de segurança), contatos de instituições financeiras, apólices de seguro e eventuais dívidas em aberto.",
              "Compartilhar essa organização com uma pessoa de confiança, ou deixá-la em um local seguro e conhecido pela família, é um ato de cuidado prático — muitas vezes mais útil no dia a dia do que planejamentos sucessórios mais complexos, especialmente para famílias com patrimônio mais simples.",
            ],
            examples: [
              "Uma lista simples com o nome dos bancos, corretoras e seguradoras onde a pessoa tem contas ou apólices já facilita bastante o trabalho da família num momento difícil.",
              "Informar a existência (sem necessariamente compartilhar a senha) de um gerenciador de senhas usado pela pessoa pode evitar que contas e informações importantes fiquem inacessíveis para a família.",
            ],
            keyConcepts: [
              "Organizar informações financeiras essenciais reduz o estresse da família em momentos difíceis.",
              "A organização deve incluir onde encontrar as informações, não necessariamente as senhas em si.",
              "Compartilhar essa organização com uma pessoa de confiança é um ato de cuidado prático e acessível a qualquer família.",
            ],
            quiz: [
              {
                question: "Por que organizar informações financeiras para a família é considerado um ato de cuidado prático?",
                options: [
                  "Porque é exigido por lei",
                  "Porque reduz bastante o estresse e a dificuldade da família em momentos difíceis, como um falecimento ou incapacidade repentina",
                  "Porque isso substitui completamente a necessidade de um testamento",
                  "Porque só faz diferença para famílias muito ricas",
                ],
                correctIndex: 1,
                explanation: "Ter as informações organizadas evita que a família enfrente dificuldades adicionais para localizar contas, seguros e outros recursos justamente num momento já difícil.",
              },
            ],
            exercise: {
              prompt: "Comece (ou revise) uma lista simples com suas contas, investimentos e seguros — e onde encontrar essas informações, caso alguém da sua família precise um dia.",
              placeholder: "Minha lista (banco/investimento/seguro — onde encontrar a informação):\n1. ...\n2. ...\n3. ...",
            },
          },
        },
      ],
    },
  ],
};
