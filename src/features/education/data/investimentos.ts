import type { Trail } from "../types";

const trailId = "investimentos";
const lid = (courseId: string, n: number) => `${trailId}.${courseId}.aula-${n}`;

export const investimentosTrail: Trail = {
  id: trailId,
  title: "Investimentos",
  description: "De inflação e juros compostos até renda fixa, fundos, ações e FIIs — o essencial para começar a investir.",
  color: "amber",
  courses: [
    // ---------------------------------------------------------------
    // Curso 1 — Inflação
    // ---------------------------------------------------------------
    {
      id: "inflacao",
      title: "Inflação",
      description: "Por que guardar dinheiro parado também tem um custo.",
      icon: "📈",
      lessons: [
        {
          id: lid("inflacao", 1),
          title: "O que é inflação e como ela é medida",
          content: {
            explanation: [
              "Inflação é o aumento generalizado dos preços de bens e serviços ao longo do tempo, medido por índices que acompanham uma \"cesta\" representativa de produtos consumidos pela população.",
              "Ela não afeta todos os preços igualmente: alimentos podem subir mais que aluguel num período, e o contrário no seguinte — o índice mede uma média ponderada, não o efeito exato sobre o seu consumo pessoal.",
              "No Brasil, o órgão responsável pela pesquisa de preços que compõe os principais índices de inflação é o IBGE, que coleta preços reais em diversas cidades todo mês.",
            ],
            examples: [
              "Se a cesta de referência custava R$ 500 em janeiro e passa a custar R$ 520 em fevereiro, a inflação do período foi de 4%.",
              "Combustíveis e alimentos costumam ser os itens mais voláteis dentro do índice, puxando a inflação para cima ou para baixo com mais intensidade que outros itens.",
            ],
            diagram: {
              type: "formula",
              formula: "Inflação do período = (Preço da cesta hoje ÷ Preço da cesta no período anterior − 1) × 100",
              caption: "O cálculo básico por trás de qualquer índice de inflação.",
            },
            keyConcepts: [
              "Inflação: aumento generalizado (não item a item) dos preços ao longo do tempo.",
              "Medida por índices baseados numa cesta representativa de consumo.",
              "No Brasil, o IBGE coleta os preços que alimentam os principais índices.",
            ],
            quiz: [
              {
                question: "Um índice de inflação mede o quê, exatamente?",
                options: [
                  "O preço de um único produto específico",
                  "O aumento médio e generalizado dos preços de uma cesta representativa de bens e serviços",
                  "Apenas o preço dos combustíveis",
                  "A taxa de juros do país",
                ],
                correctIndex: 1,
                explanation: "É uma média ponderada de vários itens, não o comportamento de um produto isolado.",
              },
            ],
            exercise: {
              prompt: "Escolha um produto que você compra com frequência e pesquise como o preço dele mudou nos últimos 12 meses. Compare com a inflação geral do período, se conseguir encontrar essa informação.",
              placeholder: "Produto: ...\nPreço há 12 meses: R$ ...\nPreço hoje: R$ ...\nVariação: ...%",
            },
          },
        },
        {
          id: lid("inflacao", 2),
          title: "IPCA e outros índices de inflação no Brasil",
          content: {
            explanation: [
              "O IPCA (Índice de Preços ao Consumidor Amplo) é o índice oficial usado pelo governo para medir a inflação e definir a meta de política monetária — é a referência mais citada no noticiário econômico.",
              "Existem outros índices com propósitos diferentes: o IGP-M, usado frequentemente em contratos de aluguel, tem metodologia diferente e pode divergir bastante do IPCA em determinados períodos.",
              "Saber qual índice está sendo usado importa na prática: um contrato reajustado pelo IGP-M pode subir muito mais (ou menos) que a inflação \"oficial\" do IPCA no mesmo período.",
            ],
            examples: [
              "Um contrato de aluguel reajustado anualmente pelo IGP-M pode ter um reajuste de 10% num ano em que o IPCA subiu só 5%.",
              "O COPOM (Comitê de Política Monetária) usa o IPCA como referência para decidir a taxa Selic.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "IPCA", items: ["Índice oficial de inflação", "Usado para meta de política monetária", "Referência do Tesouro IPCA+"] },
              right: { label: "IGP-M", items: ["Muito usado em aluguéis", "Metodologia diferente (inclui preços no atacado)", "Pode divergir bastante do IPCA"] },
            },
            keyConcepts: [
              "IPCA: índice oficial de inflação no Brasil.",
              "IGP-M: outro índice, comum em contratos de aluguel, com metodologia diferente.",
              "Índices diferentes podem divergir bastante no mesmo período.",
            ],
            quiz: [
              {
                question: "Por que é importante saber qual índice de inflação está sendo usado num contrato (como um aluguel)?",
                options: [
                  "Não importa, todos os índices são iguais",
                  "Porque índices diferentes (como IPCA e IGP-M) podem ter variações bem diferentes no mesmo período, mudando o valor do reajuste",
                  "Porque só o IPCA é legal",
                  "Porque índices mudam de nome todo ano",
                ],
                correctIndex: 1,
                explanation: "Escolher (ou identificar) o índice certo evita surpresas, já que a mesma inflação 'sentida' pode ser medida de formas bem diferentes.",
              },
            ],
            exercise: {
              prompt: "Se você tem algum contrato reajustado por inflação (aluguel, plano de saúde), identifique qual índice é usado e pesquise o valor acumulado dele no último ano.",
              placeholder: "Contrato: ...\nÍndice usado: ...\nVariação no último ano: ...%",
            },
          },
        },
        {
          id: lid("inflacao", 3),
          title: "Rendimento nominal x rendimento real",
          content: {
            explanation: [
              "Rendimento nominal é o número anunciado por um investimento (\"rendeu 10% no ano\"); rendimento real é o que sobra depois de descontar a inflação do mesmo período — é o que realmente importa para o seu poder de compra.",
              "Um investimento pode ter rendimento nominal positivo e rendimento real negativo, se a inflação do período for maior que o rendimento nominal — nesse caso, você tem mais dinheiro, mas ele compra menos coisas.",
              "Ao comparar investimentos ou avaliar se \"valeu a pena\", a pergunta certa é sempre sobre o rendimento real, não o nominal isolado.",
            ],
            examples: [
              "Investimento rendeu 8% no ano (nominal), inflação foi 6% no mesmo período: rendimento real aproximado de 2%.",
              "Investimento rendeu 4% no ano (nominal), inflação foi 6%: rendimento real negativo, mesmo com o número absoluto tendo crescido.",
            ],
            diagram: {
              type: "formula",
              formula: "Rendimento real ≈ Rendimento nominal − Inflação do período",
              caption: "Uma aproximação simples e útil (o cálculo exato usa uma fórmula composta, mas essa aproximação já orienta bem as decisões).",
            },
            keyConcepts: [
              "Rendimento nominal: o número anunciado, sem descontar a inflação.",
              "Rendimento real: o que sobra de poder de compra, depois de descontar a inflação.",
              "Rendimento nominal positivo pode significar rendimento real negativo.",
            ],
            quiz: [
              {
                question: "Um investimento rendeu 5% no ano, mas a inflação do período foi 7%. O que aconteceu com o poder de compra desse dinheiro?",
                options: [
                  "Aumentou, porque o rendimento foi positivo",
                  "Diminuiu, porque o rendimento real foi negativo (5% - 7% = -2%)",
                  "Ficou igual",
                  "Não é possível saber sem mais informações",
                ],
                correctIndex: 1,
                explanation: "Mesmo com rendimento nominal positivo, o poder de compra caiu porque a inflação superou o rendimento.",
              },
            ],
            exercise: {
              prompt: "Pegue um investimento que você tem (ou a poupança) e calcule o rendimento real aproximado dele no último ano, usando a inflação do período.",
              placeholder: "Investimento: ...\nRendimento nominal: ...%\nInflação do período: ...%\nRendimento real aproximado: ...%",
            },
          },
        },
        {
          id: lid("inflacao", 4),
          title: "Como a inflação corrói o dinheiro parado",
          content: {
            explanation: [
              "Dinheiro parado — numa conta corrente sem rendimento, ou guardado literalmente em espécie — perde poder de compra todo mês em que há inflação positiva, mesmo que o valor em reais continue exatamente igual.",
              "Esse efeito é silencioso: o número na conta não muda, então é fácil não perceber a perda, diferente de uma queda visível num investimento de renda variável.",
              "Ao longo de vários anos, esse efeito se acumula de forma significativa — dinheiro parado por uma década pode perder uma fração relevante do seu poder de compra original.",
            ],
            examples: [
              "R$ 10.000 parados por 5 anos, com inflação média de 5% ao ano, compram bem menos coisas ao final do período do que compravam no início.",
              "Comparar o preço de um mesmo produto hoje com o preço de 5 anos atrás costuma revelar esse efeito de forma concreta.",
            ],
            diagram: {
              type: "bars",
              caption: "Poder de compra de R$ 10.000 parados, com inflação de 5% ao ano",
              bars: [
                { label: "Hoje", value: 10000 },
                { label: "Em 2 anos", value: 9070 },
                { label: "Em 5 anos", value: 7835 },
                { label: "Em 10 anos", value: 6139 },
              ],
            },
            keyConcepts: [
              "Dinheiro parado perde poder de compra todo mês com inflação positiva.",
              "É um efeito silencioso — o número em reais não muda visivelmente.",
              "O efeito se acumula de forma significativa ao longo de vários anos.",
            ],
            quiz: [
              {
                question: "Por que a perda de poder de compra do dinheiro parado é considerada um efeito 'silencioso'?",
                options: [
                  "Porque acontece rápido demais para perceber",
                  "Porque o número na conta continua igual, mesmo o dinheiro comprando cada vez menos coisas",
                  "Porque só afeta contas de investimento",
                  "Porque bancos escondem essa informação",
                ],
                correctIndex: 1,
                explanation: "Diferente de uma queda visível de preço num investimento, a perda por inflação não altera o número na tela — só o que ele compra.",
              },
            ],
            exercise: {
              prompt: "Se você tem dinheiro parado numa conta sem rendimento, calcule quanto ele perderia de poder de compra em 5 anos, usando uma inflação média de 5% ao ano.",
              placeholder: "Valor parado: R$ ...\nPoder de compra em 5 anos (aproximado): R$ ...",
            },
          },
        },
        {
          id: lid("inflacao", 5),
          title: "Protegendo seu dinheiro da inflação",
          content: {
            explanation: [
              "A proteção mais básica contra a inflação é simplesmente não deixar dinheiro parado sem render — mesmo uma conta com rendimento modesto (como a poupança) já é melhor que uma conta corrente sem nenhum rendimento.",
              "Investimentos atrelados à inflação (como o Tesouro IPCA+) garantem um rendimento real definido, pagando a inflação do período mais uma taxa fixa — uma proteção direta e previsível.",
              "Para objetivos de longo prazo, historicamente a renda variável tende a superar a inflação por margens maiores que a renda fixa, mas com mais oscilação no caminho — a escolha depende do prazo e da tolerância a risco.",
            ],
            examples: [
              "Um Tesouro IPCA+ 2035 com taxa de 6% garante inflação do período + 6% ao ano até o vencimento, se mantido até lá.",
              "Migrar de uma conta corrente sem rendimento para um CDB de liquidez diária já é uma proteção simples contra a corrosão da inflação no dia a dia.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "1. Não deixar dinheiro parado sem nenhum rendimento",
                "2. Priorizar investimentos com rendimento pelo menos próximo à inflação",
                "3. Considerar títulos atrelados à inflação (Tesouro IPCA+) para proteção direta",
                "4. Para longo prazo, avaliar uma parcela em renda variável, conforme o perfil",
              ],
            },
            keyConcepts: [
              "Não deixar dinheiro parado sem render é a proteção mais básica.",
              "Tesouro IPCA+ garante rendimento real definido (inflação + taxa fixa).",
              "Renda variável tende a superar a inflação mais no longo prazo, com mais oscilação.",
            ],
            quiz: [
              {
                question: "O que um título como o Tesouro IPCA+ garante ao investidor que o mantém até o vencimento?",
                options: [
                  "Um rendimento fixo em reais, sem relação com a inflação",
                  "Um rendimento real definido: a inflação do período mais uma taxa fixa acordada",
                  "Proteção total contra qualquer perda",
                  "Isenção de impostos",
                ],
                correctIndex: 1,
                explanation: "A composição 'inflação + taxa fixa' é o que garante que o poder de compra não seja corroído, com um ganho real conhecido.",
              },
            ],
            exercise: {
              prompt: "Revise onde está o seu dinheiro hoje (contas, investimentos) e identifique se alguma parte está \"parada\" sem proteção contra a inflação. O que você poderia mudar?",
              placeholder: "Dinheiro parado identificado: R$ ...\nO que vou mudar: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 2 — Juros compostos
    // ---------------------------------------------------------------
    {
      id: "juros-compostos",
      title: "Juros compostos",
      description: "O efeito que faz o dinheiro crescer cada vez mais rápido — a seu favor ou contra você.",
      icon: "🧮",
      lessons: [
        {
          id: lid("juros-compostos", 1),
          title: "Juros simples x juros compostos",
          content: {
            explanation: [
              "Juros simples são calculados sempre sobre o valor original (o principal), crescendo de forma linear e previsível ao longo do tempo.",
              "Juros compostos são calculados sobre o valor original MAIS os juros já acumulados — o famoso \"juros sobre juros\" — o que faz o crescimento acelerar progressivamente, não ficar constante.",
              "Quase todo produto financeiro do dia a dia (investimentos, cartão de crédito, financiamentos) usa juros compostos — entender essa diferença é a base para tudo que vem depois em investimentos.",
            ],
            examples: [
              "R$ 1.000 a 10% ao ano em juros simples: R$ 100 de juros todo ano, sempre o mesmo valor.",
              "R$ 1.000 a 10% ao ano em juros compostos: R$ 100 no primeiro ano, mas R$ 110 no segundo (10% sobre R$ 1.100), R$ 121 no terceiro, e assim por diante.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Juros simples", items: ["Sempre sobre o valor original", "Crescimento linear", "Valor de juros constante por período"] },
              right: { label: "Juros compostos", items: ["Sobre o valor original + juros acumulados", "Crescimento acelerado", "Valor de juros cresce a cada período"] },
            },
            keyConcepts: [
              "Juros simples: sempre sobre o principal, crescimento linear.",
              "Juros compostos: sobre o principal + juros acumulados, crescimento acelerado.",
              "Quase todo produto financeiro do dia a dia usa juros compostos.",
            ],
            quiz: [
              {
                question: "Qual a principal diferença entre juros simples e juros compostos?",
                options: [
                  "Juros compostos são sempre menores",
                  "Juros compostos incidem sobre o valor original mais os juros já acumulados, fazendo o crescimento acelerar",
                  "Não existe diferença prática",
                  "Juros simples só existem em investimentos",
                ],
                correctIndex: 1,
                explanation: "É esse 'juros sobre juros' que faz os juros compostos crescerem cada vez mais rápido, diferente do crescimento constante dos juros simples.",
              },
            ],
            exercise: {
              prompt: "Calcule quanto R$ 1.000 renderiam em 3 anos a 10% ao ano, tanto em juros simples quanto em juros compostos. Compare os dois resultados.",
              placeholder: "Juros simples após 3 anos: R$ ...\nJuros compostos após 3 anos: R$ ...\nDiferença: R$ ...",
            },
          },
        },
        {
          id: lid("juros-compostos", 2),
          title: "A fórmula dos juros compostos na prática",
          content: {
            explanation: [
              "A fórmula dos juros compostos calcula o valor final a partir do valor inicial, da taxa de juros por período e do número de períodos — é a base de qualquer simulação de investimento ou financiamento.",
              "Pequenas mudanças na taxa ou no prazo têm um impacto desproporcional no resultado final, exatamente por causa do efeito acumulativo — por isso vale simular antes de assumir que \"1% de diferença não importa\".",
              "Ferramentas de simulação (calculadoras online, planilhas, o próprio simulador de metas do Mind Money) fazem essa conta automaticamente — não é necessário calcular manualmente no dia a dia.",
            ],
            examples: [
              "R$ 5.000 a 8% ao ano por 10 anos: aproximadamente R$ 10.795 — mais que o dobro do valor inicial.",
              "O mesmo R$ 5.000 a 10% ao ano (só 2 pontos percentuais a mais) por 10 anos: aproximadamente R$ 12.969 — uma diferença bem maior que 2%.",
            ],
            diagram: {
              type: "formula",
              formula: "Valor final = Valor inicial × (1 + taxa)ⁿ, onde n é o número de períodos",
              caption: "A fórmula clássica dos juros compostos.",
            },
            keyConcepts: [
              "Fórmula: valor inicial × (1 + taxa) elevado ao número de períodos.",
              "Pequenas diferenças de taxa ou prazo têm impacto desproporcional no resultado.",
              "Simuladores fazem essa conta automaticamente — não é preciso calcular na mão.",
            ],
            quiz: [
              {
                question: "Por que uma diferença de apenas 2 pontos percentuais na taxa de juros pode gerar uma diferença bem maior que 2% no valor final após vários anos?",
                options: [
                  "Isso não acontece, a diferença é sempre proporcional",
                  "Porque o efeito composto (juros sobre juros) amplifica pequenas diferenças de taxa ao longo do tempo",
                  "Porque os bancos cobram taxas escondidas",
                  "Porque a inflação sempre aumenta a diferença",
                ],
                correctIndex: 1,
                explanation: "O crescimento exponencial dos juros compostos faz com que pequenas diferenças de taxa se acumulem de forma desproporcional ao longo dos anos.",
              },
            ],
            exercise: {
              prompt: "Use uma calculadora de juros compostos (ou o simulador de metas do Mind Money) para comparar o resultado de um investimento com duas taxas diferentes (ex.: 8% e 10% ao ano) pelo mesmo prazo.",
              placeholder: "Valor inicial: R$ ...\nPrazo: ... anos\nResultado a 8%: R$ ...\nResultado a 10%: R$ ...",
            },
          },
        },
        {
          id: lid("juros-compostos", 3),
          title: "O efeito do tempo: por que começar cedo importa tanto",
          content: {
            explanation: [
              "No efeito composto, o TEMPO é tão importante quanto (às vezes mais importante que) o valor investido — quanto mais cedo o dinheiro começa a render, mais tempo ele tem para o efeito \"juros sobre juros\" se acumular.",
              "Isso significa que duas pessoas investindo o mesmo valor total podem terminar com resultados bem diferentes, dependendo de QUANDO cada uma começou — quem começa mais cedo, mesmo com aportes menores, pode terminar à frente.",
              "Essa é a razão prática pela qual \"comece agora, mesmo com pouco\" é um conselho melhor do que \"espere ter mais dinheiro para começar\" quando o objetivo é longo prazo.",
            ],
            examples: [
              "Alguém que investe R$ 200/mês dos 25 aos 65 anos (40 anos) tende a acumular mais do que alguém que investe R$ 400/mês dos 35 aos 65 (30 anos), mesmo aportando a metade por mês.",
              "Os primeiros anos de um investimento de longo prazo rendem proporcionalmente menos que os últimos anos — é nos últimos anos que o efeito composto realmente \"explode\".",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Começa aos 25 anos", items: ["R$ 200/mês por 40 anos", "Total investido: R$ 96.000", "Mais tempo para o efeito composto"] },
              right: { label: "Começa aos 35 anos", items: ["R$ 400/mês por 30 anos", "Total investido: R$ 144.000", "Menos tempo, apesar de investir mais"] },
            },
            keyConcepts: [
              "No efeito composto, tempo é tão ou mais importante que o valor investido.",
              "Começar cedo, mesmo com pouco, pode superar começar tarde com mais.",
              "O efeito composto 'acelera' nos últimos anos do período de investimento.",
            ],
            quiz: [
              {
                question: "Por que 'começar a investir cedo, mesmo com pouco' costuma ser um conselho melhor do que 'esperar ter mais dinheiro para começar'?",
                options: [
                  "Porque investir cedo é obrigatório por lei",
                  "Porque o tempo extra permite que o efeito composto se acumule por mais períodos, o que pode superar aportes maiores começados mais tarde",
                  "Porque o valor do dinheiro nunca muda com o tempo",
                  "Porque não há vantagem real, é só uma questão de disciplina",
                ],
                correctIndex: 1,
                explanation: "O tempo extra de acumulação do efeito composto costuma ter um impacto maior no resultado final do que o valor absoluto aportado.",
              },
            ],
            exercise: {
              prompt: "Simule dois cenários: investir R$ 200/mês começando hoje, e o mesmo valor começando 10 anos depois, ambos rendendo 8% ao ano até os 60 anos. Compare os resultados finais.",
              placeholder: "Resultado começando hoje: R$ ...\nResultado começando 10 anos depois: R$ ...\nDiferença: R$ ...",
            },
          },
        },
        {
          id: lid("juros-compostos", 4),
          title: "Juros compostos contra você: o perigo das dívidas",
          content: {
            explanation: [
              "O mesmo efeito que faz investimentos crescerem cada vez mais rápido funciona exatamente igual contra quem está devendo — uma dívida não paga cresce com juros sobre juros, acelerando com o tempo.",
              "É por isso que dívida de cartão de crédito não paga é particularmente perigosa: taxas de juros mensais altas, compostas mês a mês, podem fazer o saldo devedor crescer muito mais rápido do que a maioria das pessoas espera.",
              "A mesma lógica de \"tempo importa\" que ajuda no investimento prejudica na dívida: quanto mais tempo uma dívida cara fica sem ser paga, maior o estrago do efeito composto.",
            ],
            examples: [
              "Uma dívida de R$ 2.000 no rotativo do cartão a 15% ao mês, sem nenhum pagamento, pode praticamente dobrar em menos de 5 meses.",
              "Atrasar o pagamento de uma dívida cara \"só mais um mês\" parece pequeno isoladamente, mas o efeito composto faz cada mês de atraso pesar mais que o anterior.",
            ],
            diagram: {
              type: "formula",
              formula: "Mesma fórmula, direção oposta: Dívida final = Dívida inicial × (1 + taxa)ⁿ",
              caption: "O efeito composto não escolhe lado — ele acelera o crescimento tanto de investimentos quanto de dívidas.",
            },
            keyConcepts: [
              "O efeito composto funciona igual contra dívidas não pagas.",
              "Dívidas com juros altos (cartão, cheque especial) crescem de forma acelerada.",
              "Quanto mais tempo uma dívida cara fica sem pagamento, maior o estrago.",
            ],
            quiz: [
              {
                question: "Por que uma dívida de cartão de crédito não paga cresce tão rápido?",
                options: [
                  "Porque os bancos aumentam a taxa a cada mês",
                  "Porque o efeito dos juros compostos incide sobre o saldo já acrescido de juros dos meses anteriores, acelerando o crescimento",
                  "Porque o valor da dívida dobra automaticamente todo mês",
                  "Porque é ilegal não pagar o cartão",
                ],
                correctIndex: 1,
                explanation: "É exatamente o mesmo mecanismo de 'juros sobre juros' que beneficia investimentos, só que trabalhando contra quem está devendo.",
              },
            ],
            exercise: {
              prompt: "Se você tem (ou já teve) uma dívida com juros altos, calcule quanto ela cresceria em 6 meses sem nenhum pagamento, usando a taxa de juros real dela.",
              placeholder: "Dívida: R$ ...\nTaxa mensal: ...%\nValor projetado em 6 meses sem pagamento: R$ ...",
            },
          },
        },
        {
          id: lid("juros-compostos", 5),
          title: "Simulando seus próprios investimentos",
          content: {
            explanation: [
              "Simular antes de investir ajuda a ter expectativas realistas: quanto um valor inicial mais aportes mensais podem se tornar em um determinado prazo, a uma taxa de rendimento assumida.",
              "É importante simular com taxas realistas (baseadas no tipo de investimento) e considerar tanto o cenário conservador quanto o otimista, em vez de confiar só na projeção mais favorável.",
              "Revisar a simulação periodicamente, à medida que a taxa real observada e os aportes reais se confirmam (ou não), mantém as expectativas alinhadas com a realidade.",
            ],
            examples: [
              "Simular R$ 300/mês por 10 anos a 8% ao ano dá uma projeção de referência — mas vale simular também a 6% e a 10% para ver a faixa de resultados possíveis.",
              "Revisar a simulação a cada ano, comparando o valor acumulado real com o projetado, ajuda a identificar cedo se os aportes ou a taxa esperada precisam de ajuste.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Definir valor inicial, aporte mensal e prazo",
                "Escolher uma taxa de rendimento realista para o tipo de investimento",
                "Simular cenários conservador, esperado e otimista",
                "Revisar periodicamente com os valores reais observados",
              ],
            },
            keyConcepts: [
              "Simular ajuda a ter expectativas realistas antes de investir.",
              "Usar taxas realistas e considerar múltiplos cenários (não só o otimista).",
              "Revisar a simulação periodicamente mantém as expectativas alinhadas com a realidade.",
            ],
            quiz: [
              {
                question: "Por que é recomendável simular mais de um cenário de taxa de rendimento (não só o mais otimista)?",
                options: [
                  "Porque simuladores exigem isso",
                  "Porque dá uma visão realista da faixa de resultados possíveis, evitando expectativas baseadas só no melhor caso",
                  "Porque taxas de rendimento nunca variam",
                  "Porque é uma exigência da CVM",
                ],
                correctIndex: 1,
                explanation: "Considerar cenários conservador e otimista evita decisões baseadas em expectativas irreais, só do melhor cenário possível.",
              },
            ],
            exercise: {
              prompt: "Simule um investimento com um valor inicial e aporte mensal que fazem sentido pra você, em 3 cenários de taxa (conservador, esperado, otimista), pelo prazo do seu objetivo.",
              placeholder: "Valor inicial: R$ ...\nAporte mensal: R$ ...\nPrazo: ... anos\nConservador (...%'): R$ ...\nEsperado (...%'): R$ ...\nOtimista (...%'): R$ ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 3 — Renda fixa
    // ---------------------------------------------------------------
    {
      id: "renda-fixa",
      title: "Renda fixa",
      description: "Onde as regras de rentabilidade já são conhecidas (ou previsíveis) desde o início.",
      icon: "🏦",
      lessons: [
        {
          id: lid("renda-fixa", 1),
          title: "O que é renda fixa",
          content: {
            explanation: [
              "Renda fixa é a categoria de investimentos em que a forma de rendimento é definida no momento da aplicação — você sabe, desde o início, a regra pela qual o dinheiro vai render, mesmo que o valor exato final dependa de indicadores futuros.",
              "Na prática, investir em renda fixa costuma significar \"emprestar\" dinheiro para alguém (governo, banco, empresa) em troca do pagamento de juros — o investidor é o credor, não o dono de uma parte do negócio.",
              "É, em geral, a categoria de menor risco entre os investimentos, mas \"menor risco\" não significa \"sem risco\" — existem riscos específicos que valem entender antes de investir.",
            ],
            examples: [
              "Comprar um título do Tesouro Direto é, na prática, emprestar dinheiro para o governo federal, que devolve com juros.",
              "Investir num CDB é emprestar dinheiro para um banco, que também devolve com juros combinados.",
            ],
            keyConcepts: [
              "Renda fixa: a forma de rendimento é definida no momento da aplicação.",
              "Investir em renda fixa costuma significar 'emprestar' dinheiro em troca de juros.",
              "Menor risco não é o mesmo que sem risco.",
            ],
            quiz: [
              {
                question: "O que caracteriza um investimento de renda fixa?",
                options: [
                  "O valor final é sempre exatamente igual ao valor inicial",
                  "A forma de rendimento (a regra de como o dinheiro vai render) é definida no momento da aplicação",
                  "Só pode ser feito através de bancos",
                  "É garantido pelo governo em qualquer situação",
                ],
                correctIndex: 1,
                explanation: "O que define renda fixa é a regra de rendimento conhecida desde o início, não a ausência total de risco ou variação.",
              },
            ],
            exercise: {
              prompt: "Pesquise um investimento de renda fixa que você já tenha ouvido falar (Tesouro Direto, CDB, poupança) e escreva, com suas palavras, para quem o dinheiro está sendo 'emprestado'.",
              placeholder: "Investimento: ...\nPara quem o dinheiro é emprestado: ...",
            },
          },
        },
        {
          id: lid("renda-fixa", 2),
          title: "Prefixado, pós-fixado e híbrido",
          content: {
            explanation: [
              "Prefixado: a taxa de rendimento é fixada no momento da aplicação e não muda até o vencimento — você sabe exatamente quanto vai receber, em reais, se mantiver até o final.",
              "Pós-fixado: o rendimento está atrelado a um indicador que varia (como o CDI ou a Selic) — o valor final só é conhecido no vencimento, mas a REGRA (por exemplo, \"100% do CDI\") é conhecida desde o início.",
              "Híbrido: combina uma parte fixa com uma parte atrelada a um índice (geralmente a inflação) — o Tesouro IPCA+ é o exemplo mais comum, garantindo inflação mais uma taxa fixa.",
            ],
            examples: [
              "Prefixado a 12% ao ano: se você aplicar R$ 1.000 e mantiver até o vencimento, sabe exatamente quanto vai receber, calculado com essa taxa.",
              "Pós-fixado a 100% do CDI: se o CDI cair, o rendimento cai também — a regra é fixa, o resultado em reais não é.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Prefixado", items: ["Taxa fixa, conhecida desde o início", "Valor final conhecido de antemão", "Risco: se os juros subirem depois, você 'perde' a taxa melhor"] },
              right: { label: "Pós-fixado", items: ["Atrelado a um indicador (CDI, Selic)", "Valor final só conhecido no vencimento", "Acompanha as mudanças nos juros do mercado"] },
            },
            keyConcepts: [
              "Prefixado: taxa fixa conhecida desde o início.",
              "Pós-fixado: atrelado a um indicador que varia (CDI, Selic).",
              "Híbrido: parte fixa + parte atrelada a um índice (geralmente inflação).",
            ],
            quiz: [
              {
                question: "O que diferencia um título pós-fixado de um prefixado?",
                options: [
                  "O pós-fixado nunca rende nada",
                  "No pós-fixado, o rendimento está atrelado a um indicador que varia (como o CDI), então o valor final só é conhecido no vencimento",
                  "O prefixado é sempre mais arriscado",
                  "Não existe diferença real",
                ],
                correctIndex: 1,
                explanation: "A regra do pós-fixado é conhecida (ex.: 100% do CDI), mas o resultado em reais depende de como esse indicador se comporta até o vencimento.",
              },
            ],
            exercise: {
              prompt: "Pesquise um exemplo real de investimento prefixado, um pós-fixado e um híbrido disponíveis hoje (no seu banco ou corretora) e anote as taxas oferecidas.",
              placeholder: "Prefixado: ... — taxa: ...\nPós-fixado: ... — taxa: ...\nHíbrido: ... — taxa: ...",
            },
          },
        },
        {
          id: lid("renda-fixa", 3),
          title: "Risco de crédito e risco de mercado",
          content: {
            explanation: [
              "Risco de crédito é o risco de quem emitiu o título (governo, banco, empresa) não conseguir pagar o que deve — quanto menos sólida a instituição, maior esse risco, geralmente compensado com uma taxa de juros maior.",
              "Risco de mercado é o risco de perder dinheiro ao vender um título ANTES do vencimento, num momento em que as condições de mercado (juros) tornam o preço de venda desfavorável.",
              "Manter um título até o vencimento elimina o risco de mercado na prática (você recebe exatamente o combinado), mas o risco de crédito continua existindo durante todo o período.",
            ],
            examples: [
              "Um CDB de um banco pequeno pode pagar uma taxa maior que um CDB de um banco grande — a diferença compensa o risco de crédito maior.",
              "Vender um título prefixado antes do vencimento, num momento em que os juros do mercado subiram, pode gerar perda — mesmo que o título \"pague\" a taxa combinada se mantido até o fim.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Risco de crédito", items: ["O emissor não pagar o que deve", "Maior em instituições menos sólidas", "Existe durante todo o período do investimento"] },
              right: { label: "Risco de mercado", items: ["Perder dinheiro ao vender antes do vencimento", "Depende das condições de juros no momento da venda", "Eliminado na prática se mantido até o vencimento"] },
            },
            keyConcepts: [
              "Risco de crédito: o emissor não conseguir pagar.",
              "Risco de mercado: perda ao vender antes do vencimento em condições desfavoráveis.",
              "Manter até o vencimento elimina o risco de mercado, mas não o de crédito.",
            ],
            quiz: [
              {
                question: "Vender um título de renda fixa antes do vencimento, num momento desfavorável do mercado, expõe o investidor a qual tipo de risco?",
                options: ["Risco de crédito", "Risco de mercado", "Nenhum risco, renda fixa é sempre segura", "Risco cambial"],
                correctIndex: 1,
                explanation: "É justamente esse o risco de mercado: o preço de venda antecipada pode ser desfavorável dependendo das condições do momento.",
              },
            ],
            exercise: {
              prompt: "Para um investimento de renda fixa que você tem (ou pretende ter), identifique o risco de crédito (quem é o emissor?) e pense se você pretende manter até o vencimento ou pode precisar resgatar antes.",
              placeholder: "Investimento: ...\nEmissor: ...\nPretendo manter até o vencimento? ...",
            },
          },
        },
        {
          id: lid("renda-fixa", 4),
          title: "Principais produtos de renda fixa no Brasil",
          content: {
            explanation: [
              "Os produtos mais comuns de renda fixa no Brasil incluem Tesouro Direto (títulos públicos), CDB (crédito para bancos), LCI e LCA (crédito para os setores imobiliário e do agronegócio, isentos de Imposto de Renda para pessoa física), e debêntures (crédito para empresas).",
              "Cada produto tem características diferentes de risco, liquidez, tributação e valor mínimo de investimento — não existe um \"melhor\" universal, depende do objetivo e do prazo.",
              "LCI e LCA costumam ter isenção de Imposto de Renda, o que pode compensar uma taxa nominal um pouco menor comparada a um CDB equivalente tributado.",
            ],
            examples: [
              "Tesouro Direto: acessível a partir de valores baixos, garantido pelo governo federal.",
              "LCI/LCA: isentos de IR para pessoa física, mas costumam ter prazos de carência (período mínimo sem poder resgatar).",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Tributados (IR sobre o rendimento)", items: ["Tesouro Direto", "CDB", "Debêntures comuns"] },
              right: { label: "Isentos de IR para pessoa física", items: ["LCI (crédito imobiliário)", "LCA (crédito do agronegócio)", "Debêntures incentivadas (setor específico)"] },
            },
            keyConcepts: [
              "Principais produtos: Tesouro Direto, CDB, LCI, LCA, debêntures.",
              "Cada um tem risco, liquidez e tributação diferentes.",
              "LCI e LCA costumam ser isentas de IR para pessoa física.",
            ],
            quiz: [
              {
                question: "Qual a principal vantagem de LCI e LCA em relação a um CDB equivalente?",
                options: [
                  "Elas nunca têm carência",
                  "Costumam ser isentas de Imposto de Renda para pessoa física, o que pode compensar uma taxa nominal menor",
                  "São garantidas pelo governo federal diretamente",
                  "Rendem sempre mais que qualquer CDB"
                ],
                correctIndex: 1,
                explanation: "A isenção de IR é a característica que mais diferencia LCI/LCA de produtos tributados equivalentes — o rendimento líquido pode compensar uma taxa nominal aparentemente menor.",
              },
            ],
            exercise: {
              prompt: "Pesquise, no seu banco ou corretora, as opções disponíveis de Tesouro Direto, CDB, LCI e LCA. Compare a taxa e a tributação de cada uma.",
              placeholder: "Tesouro Direto: taxa ... — tributado\nCDB: taxa ... — tributado\nLCI: taxa ... — isento\nLCA: taxa ... — isento",
            },
          },
        },
        {
          id: lid("renda-fixa", 5),
          title: "Escolhendo entre as opções de renda fixa",
          content: {
            explanation: [
              "A escolha entre os produtos de renda fixa deve considerar principalmente três fatores: o prazo do objetivo (quando o dinheiro vai ser precisado), a necessidade de liquidez (poder resgatar antes do prazo) e a comparação de rentabilidade líquida (após impostos, quando aplicável).",
              "Para a reserva de emergência, liquidez diária e baixo risco pesam mais que a rentabilidade máxima possível — um CDB de liquidez diária ou o Tesouro Selic costumam ser as escolhas mais adequadas.",
              "Para objetivos de médio/longo prazo, vale comparar a rentabilidade líquida entre diferentes produtos, considerando também o risco de crédito de cada emissor.",
            ],
            examples: [
              "Reserva de emergência: Tesouro Selic ou CDB com liquidez diária de 100%+ do CDI, priorizando disponibilidade imediata.",
              "Meta de 3 anos: pode fazer sentido um CDB ou LCI/LCA com vencimento alinhado ao prazo da meta, buscando uma taxa melhor em troca de um pouco menos de flexibilidade.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "1. Qual o prazo do objetivo?",
                "2. Preciso de liquidez imediata ou posso esperar até o vencimento?",
                "3. Comparar rentabilidade líquida (após impostos) entre as opções disponíveis",
                "4. Considerar o risco de crédito do emissor",
              ],
            },
            keyConcepts: [
              "Escolher pelo prazo do objetivo e pela necessidade de liquidez.",
              "Reserva de emergência prioriza liquidez e baixo risco sobre rentabilidade máxima.",
              "Comparar sempre a rentabilidade líquida (após impostos), não só a taxa anunciada.",
            ],
            quiz: [
              {
                question: "Para a reserva de emergência, qual característica deve pesar mais na escolha do investimento?",
                options: [
                  "A maior rentabilidade possível, mesmo com carência longa",
                  "Liquidez imediata e baixo risco, mesmo que o rendimento seja um pouco menor",
                  "O prazo mais longo disponível",
                  "O produto mais divulgado pelo banco",
                ],
                correctIndex: 1,
                explanation: "A função da reserva é estar disponível quando precisar — por isso liquidez e segurança vêm antes de rentabilidade máxima nesse caso específico.",
              },
            ],
            exercise: {
              prompt: "Para cada um dos seus objetivos financeiros atuais, identifique qual produto de renda fixa seria mais adequado, considerando prazo e necessidade de liquidez.",
              placeholder: "Objetivo 1: ... — produto adequado: ...\nObjetivo 2: ... — produto adequado: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 4 — Tesouro Direto
    // ---------------------------------------------------------------
    {
      id: "tesouro-direto",
      title: "Tesouro Direto",
      description: "Investir em títulos públicos do governo federal.",
      icon: "🏛️",
      lessons: [
        {
          id: lid("tesouro-direto", 1),
          title: "O que é o Tesouro Direto",
          content: {
            explanation: [
              "Tesouro Direto é um programa do governo federal que permite a qualquer pessoa comprar títulos públicos diretamente, com valores mínimos acessíveis — é considerado um dos investimentos de menor risco de crédito do país, já que é garantido pelo próprio governo.",
              "Ao comprar um título do Tesouro, você está emprestando dinheiro para o governo financiar suas atividades, recebendo de volta o valor investido mais juros, conforme as condições do título escolhido.",
              "A compra e venda são feitas através de uma corretora ou banco habilitado, de forma totalmente digital, com valores mínimos que costumam começar em torno de R$ 30-40.",
            ],
            examples: [
              "Comprar uma fração de um Tesouro Selic com R$ 100 já é possível, tornando o investimento acessível mesmo para quem está começando com pouco.",
              "O governo usa o dinheiro captado via Tesouro Direto para financiar despesas públicas, pagando juros aos investidores em troca.",
            ],
            keyConcepts: [
              "Tesouro Direto: programa do governo federal para venda de títulos públicos a pessoas físicas.",
              "Considerado um dos investimentos de menor risco de crédito do país.",
              "Compra e venda feitas digitalmente, com valores mínimos acessíveis.",
            ],
            quiz: [
              {
                question: "Por que o Tesouro Direto é considerado um investimento de baixo risco de crédito?",
                options: [
                  "Porque nunca perde valor",
                  "Porque é garantido pelo próprio governo federal, considerado o emissor mais sólido do país",
                  "Porque tem liquidez diária garantida em qualquer condição",
                  "Porque não sofre nenhuma tributação",
                ],
                correctIndex: 1,
                explanation: "O risco de crédito está ligado à capacidade do emissor de pagar — e o governo federal é normalmente visto como o emissor mais sólido dentro do país.",
              },
            ],
            exercise: {
              prompt: "Se você ainda não tem conta em uma corretora, pesquise o processo para começar a investir no Tesouro Direto e anote os passos principais.",
              placeholder: "Corretora escolhida: ...\nPassos identificados: ...",
            },
          },
        },
        {
          id: lid("tesouro-direto", 2),
          title: "Tesouro Selic, Prefixado e IPCA+",
          content: {
            explanation: [
              "Tesouro Selic: título pós-fixado atrelado à taxa Selic, com baixíssima oscilação de preço mesmo antes do vencimento — o mais indicado para reserva de emergência dentro do Tesouro Direto.",
              "Tesouro Prefixado: taxa fixa definida na compra, ideal para quem quer saber exatamente o valor final, mas com mais oscilação de preço se vendido antes do vencimento.",
              "Tesouro IPCA+: título híbrido, paga inflação (IPCA) mais uma taxa fixa — protege o poder de compra e garante um ganho real conhecido, indicado especialmente para objetivos de longo prazo.",
            ],
            examples: [
              "Tesouro Selic: ideal para reserva de emergência, pela baixa oscilação e liquidez diária.",
              "Tesouro IPCA+ 2035: adequado para uma meta de aposentadoria ou outro objetivo de longuíssimo prazo, garantindo ganho real até o vencimento.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Tesouro Selic", items: ["Pós-fixado (Selic)", "Baixa oscilação de preço", "Ideal para reserva de emergência"] },
              right: { label: "Tesouro IPCA+", items: ["Híbrido (inflação + taxa fixa)", "Protege o poder de compra", "Ideal para objetivos de longo prazo"] },
            },
            keyConcepts: [
              "Tesouro Selic: baixa oscilação, ideal para reserva de emergência.",
              "Tesouro Prefixado: taxa fixa conhecida, mais oscilação se vendido antes do prazo.",
              "Tesouro IPCA+: protege o poder de compra, ideal para longo prazo.",
            ],
            quiz: [
              {
                question: "Qual título do Tesouro Direto costuma ser o mais indicado para a reserva de emergência?",
                options: ["Tesouro Prefixado", "Tesouro IPCA+", "Tesouro Selic, pela baixa oscilação de preço e liquidez diária", "Não é possível usar o Tesouro para reserva de emergência"],
                correctIndex: 2,
                explanation: "A baixa oscilação de preço do Tesouro Selic, mesmo antes do vencimento, o torna adequado para dinheiro que pode precisar ser resgatado a qualquer momento.",
              },
            ],
            exercise: {
              prompt: "Pesquise as taxas atuais do Tesouro Selic, Prefixado e IPCA+ disponíveis, e identifique qual você usaria para sua reserva de emergência e qual para um objetivo de longo prazo.",
              placeholder: "Tesouro Selic (taxa atual): ...\nTesouro IPCA+ (taxa atual): ...\nMinha escolha para reserva: ...\nMinha escolha para longo prazo: ...",
            },
          },
        },
        {
          id: lid("tesouro-direto", 3),
          title: "Como comprar e vender títulos",
          content: {
            explanation: [
              "A compra é feita através do site ou aplicativo da corretora onde você tem conta, escolhendo o título, o valor a investir (ou a fração do título) e confirmando a operação — o processo costuma levar poucos minutos.",
              "A venda antecipada (antes do vencimento) também é possível a qualquer momento em dias úteis, mas o preço de venda reflete as condições de mercado do momento, podendo ser maior ou menor que o valor \"esperado\" pela taxa contratada.",
              "Manter o título até o vencimento garante receber exatamente a rentabilidade combinada no momento da compra, sem depender das condições de mercado da venda antecipada.",
            ],
            examples: [
              "Comprar R$ 500 em Tesouro Selic pelo aplicativo da corretora, com o valor sendo debitado da conta e o título aparecendo na carteira em poucos dias.",
              "Vender um Tesouro Prefixado antes do vencimento pode gerar lucro ou prejuízo, dependendo se os juros de mercado caíram ou subiram desde a compra.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Escolher o título no site/app da corretora",
                "Definir o valor (ou fração) a investir",
                "Confirmar a operação",
                "Acompanhar o título na carteira até o vencimento (ou decidir vender antes, se necessário)",
              ],
            },
            keyConcepts: [
              "Compra e venda feitas digitalmente pela corretora, em poucos minutos.",
              "Venda antecipada reflete as condições de mercado do momento.",
              "Manter até o vencimento garante a rentabilidade combinada na compra.",
            ],
            quiz: [
              {
                question: "O que acontece com o preço de um título vendido ANTES do vencimento?",
                options: [
                  "É sempre igual ao valor investido, sem variação",
                  "Reflete as condições de mercado do momento da venda, podendo ser maior ou menor que o esperado pela taxa original",
                  "É sempre menor que o valor investido",
                  "Não é possível vender antes do vencimento"
                ],
                correctIndex: 1,
                explanation: "O preço de venda antecipada varia conforme as condições de mercado (principalmente os juros vigentes), diferente do valor garantido ao manter até o vencimento.",
              },
            ],
            exercise: {
              prompt: "Se você já tem (ou pretende ter) conta numa corretora, simule (sem comprar de verdade, se preferir) o processo de compra de um título do Tesouro Direto e anote os passos que você percorreu.",
              placeholder: "Passos percorridos: ...",
            },
          },
        },
        {
          id: lid("tesouro-direto", 4),
          title: "Taxas e tributação do Tesouro Direto",
          content: {
            explanation: [
              "O Tesouro Direto cobra uma taxa de custódia (paga à B3, a bolsa brasileira) sobre o valor investido, e a corretora pode ou não cobrar uma taxa de administração adicional — muitas corretoras hoje oferecem taxa zero de administração.",
              "O rendimento do Tesouro Direto é tributado pelo Imposto de Renda, seguindo uma tabela regressiva: quanto mais tempo o dinheiro fica investido, menor a alíquota de imposto sobre o rendimento.",
              "Investimentos resgatados em até 180 dias pagam a maior alíquota (22,5%); acima de 720 dias, a menor (15%) — outro incentivo para pensar no Tesouro Direto com uma visão de médio/longo prazo.",
            ],
            examples: [
              "Resgate em 100 dias: alíquota de 22,5% sobre o rendimento (não sobre o valor total investido).",
              "Resgate após 800 dias: alíquota de 15% sobre o rendimento — menor imposto proporcional pago.",
            ],
            diagram: {
              type: "bars",
              caption: "Alíquota de IR sobre o rendimento, pela tabela regressiva",
              bars: [
                { label: "Até 180 dias", value: 22.5, suffix: "%" },
                { label: "181 a 360 dias", value: 20, suffix: "%" },
                { label: "361 a 720 dias", value: 17.5, suffix: "%" },
                { label: "Acima de 720 dias", value: 15, suffix: "%" },
              ],
            },
            keyConcepts: [
              "Taxa de custódia paga à B3; taxa de administração da corretora (muitas cobram zero).",
              "Tributação por tabela regressiva: quanto mais tempo, menor a alíquota.",
              "O imposto incide sobre o rendimento, não sobre o valor total investido.",
            ],
            quiz: [
              {
                question: "Como funciona a tributação regressiva do Tesouro Direto?",
                options: [
                  "A alíquota é sempre a mesma, independente do prazo",
                  "Quanto mais tempo o dinheiro fica investido, menor a alíquota de Imposto de Renda sobre o rendimento",
                  "Quanto mais tempo investido, maior a alíquota",
                  "Só existe imposto se o valor resgatado for muito alto",
                ],
                correctIndex: 1,
                explanation: "A tabela regressiva incentiva prazos mais longos, reduzindo a alíquota de 22,5% (até 180 dias) até 15% (acima de 720 dias).",
              },
            ],
            exercise: {
              prompt: "Calcule quanto de imposto incidiria sobre um rendimento de R$ 500 se resgatado em 100 dias, e quanto incidiria se resgatado após 800 dias.",
              placeholder: "IR em 100 dias (22,5%): R$ ...\nIR após 800 dias (15%): R$ ...",
            },
          },
        },
        {
          id: lid("tesouro-direto", 5),
          title: "Escolhendo o título certo para cada objetivo",
          content: {
            explanation: [
              "A escolha do título certo começa pelo prazo do objetivo: idealmente, o vencimento do título deve estar próximo à data em que o dinheiro será necessário, reduzindo a chance de precisar vender antes em condições desfavoráveis.",
              "Para objetivos de curto prazo ou reserva, o Tesouro Selic é geralmente a escolha mais segura, pela baixa oscilação. Para longo prazo, o Tesouro IPCA+ costuma ser mais adequado, pela proteção contra a inflação.",
              "Não é necessário escolher só um título — combinar diferentes tipos, alinhados a diferentes objetivos e prazos, é uma prática comum e recomendada.",
            ],
            examples: [
              "Reserva de emergência: Tesouro Selic. Meta de 5 anos para dar entrada num imóvel: Tesouro Prefixado ou IPCA+ com vencimento próximo a essa data. Aposentadoria: Tesouro IPCA+ de longuíssimo prazo.",
              "Combinar 3 títulos diferentes, cada um alinhado a um objetivo específico, é mais eficiente do que escolher um único título para tudo.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Identificar o prazo de cada objetivo",
                "Escolher o tipo de título (Selic, Prefixado, IPCA+) alinhado ao prazo e à necessidade de liquidez",
                "Escolher a data de vencimento mais próxima do prazo do objetivo",
                "Repetir para cada objetivo diferente, combinando títulos conforme necessário",
              ],
            },
            keyConcepts: [
              "Alinhar o vencimento do título ao prazo do objetivo reduz o risco de mercado.",
              "Curto prazo/reserva: Tesouro Selic. Longo prazo: Tesouro IPCA+.",
              "Não é preciso escolher um único título — combinar títulos para objetivos diferentes é comum.",
            ],
            quiz: [
              {
                question: "Por que alinhar o vencimento do título ao prazo do objetivo é uma boa prática?",
                options: [
                  "Não faz diferença real",
                  "Reduz a chance de precisar vender o título antes do vencimento em condições de mercado desfavoráveis",
                  "É uma exigência do Tesouro Direto",
                  "Garante rendimento maior automaticamente"
                ],
                correctIndex: 1,
                explanation: "Se o vencimento coincide com quando o dinheiro será necessário, você recebe exatamente o combinado, sem depender do preço de venda antecipada.",
              },
            ],
            exercise: {
              prompt: "Para cada um dos seus objetivos financeiros, identifique qual título do Tesouro Direto (Selic, Prefixado ou IPCA+) e qual vencimento seriam mais adequados.",
              placeholder: "Objetivo 1: ... — título: ... — vencimento: ...\nObjetivo 2: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 5 — CDB
    // ---------------------------------------------------------------
    {
      id: "cdb",
      title: "CDB",
      description: "Certificado de Depósito Bancário: emprestando dinheiro para um banco.",
      icon: "🧾",
      lessons: [
        {
          id: lid("cdb", 1),
          title: "O que é um CDB",
          content: {
            explanation: [
              "CDB (Certificado de Depósito Bancário) é um título emitido por bancos para captar dinheiro — ao investir num CDB, você está emprestando dinheiro para o banco, que usa esse recurso para suas operações e devolve com juros.",
              "É um dos investimentos de renda fixa mais populares no Brasil, com ampla variedade de prazos, taxas e condições de liquidez oferecidas por diferentes instituições.",
              "Bancos menores costumam oferecer taxas mais altas que bancos grandes, para compensar um risco de crédito percebido como maior — mas dentro do limite garantido pelo FGC, esse risco extra é bastante reduzido.",
            ],
            examples: [
              "Um CDB de um banco médio pagando 110% do CDI costuma ser mais atrativo, em taxa, do que um CDB de um banco grande pagando 100% do CDI.",
              "Investir R$ 1.000 num CDB significa, na prática, emprestar esse valor ao banco emissor por um determinado período.",
            ],
            keyConcepts: [
              "CDB: título emitido por bancos para captar recursos, com juros pagos ao investidor.",
              "Um dos investimentos de renda fixa mais populares do Brasil.",
              "Bancos menores costumam pagar taxas maiores, compensando um risco de crédito percebido como maior.",
            ],
            quiz: [
              {
                question: "O que acontece, na prática, quando alguém investe num CDB?",
                options: [
                  "A pessoa se torna sócia do banco",
                  "A pessoa empresta dinheiro ao banco, que devolve o valor com juros no prazo combinado",
                  "O dinheiro é doado ao banco",
                  "O CDB é um tipo de conta corrente",
                ],
                correctIndex: 1,
                explanation: "O CDB é essencialmente um empréstimo do investidor para o banco, remunerado por juros.",
              },
            ],
            exercise: {
              prompt: "Pesquise as taxas de CDB oferecidas pelo seu banco e por pelo menos uma corretora. Compare os percentuais do CDI oferecidos.",
              placeholder: "CDB do meu banco: ...% do CDI\nCDB na corretora: ...% do CDI",
            },
          },
        },
        {
          id: lid("cdb", 2),
          title: "CDB de liquidez diária x com vencimento",
          content: {
            explanation: [
              "CDB de liquidez diária permite resgatar o dinheiro a qualquer momento, geralmente no mesmo dia útil — costuma pagar taxas menores em troca dessa flexibilidade.",
              "CDB com vencimento (sem liquidez diária) exige manter o dinheiro investido até uma data específica, mas em compensação costuma pagar taxas mais altas, já que o banco tem previsibilidade sobre o prazo de uso do recurso.",
              "A escolha entre os dois depende do objetivo: liquidez diária para reserva de emergência ou dinheiro que pode ser precisado a qualquer momento; com vencimento para objetivos com prazo definido, buscando uma taxa melhor.",
            ],
            examples: [
              "CDB de liquidez diária a 100% do CDI: ideal para reserva de emergência.",
              "CDB com vencimento em 2 anos a 115% do CDI: mais adequado para uma meta com prazo definido, aproveitando a taxa melhor.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Liquidez diária", items: ["Resgate a qualquer momento", "Taxas geralmente menores", "Ideal para reserva de emergência"] },
              right: { label: "Com vencimento", items: ["Só resgata na data (ou com perda)", "Taxas geralmente maiores", "Ideal para objetivos com prazo definido"] },
            },
            keyConcepts: [
              "Liquidez diária: resgate a qualquer momento, taxas geralmente menores.",
              "Com vencimento: taxa melhor, mas sem flexibilidade de resgate antecipado sem perdas.",
              "A escolha depende do objetivo: reserva (liquidez) x meta com prazo (vencimento).",
            ],
            quiz: [
              {
                question: "Por que um CDB com vencimento costuma pagar uma taxa maior que um CDB de liquidez diária?",
                options: [
                  "Porque é sempre mais arriscado",
                  "Porque o banco tem previsibilidade sobre o prazo de uso do recurso, o que permite oferecer uma taxa melhor em troca da falta de flexibilidade",
                  "Porque cobra taxas extras escondidas",
                  "Não existe diferença de taxa entre os dois"
                ],
                correctIndex: 1,
                explanation: "A previsibilidade do prazo para o banco costuma se traduzir em uma taxa melhor oferecida ao investidor, em troca de menos flexibilidade.",
              },
            ],
            exercise: {
              prompt: "Compare um CDB de liquidez diária e um CDB com vencimento (2-3 anos) disponíveis para você. Qual a diferença de taxa entre eles?",
              placeholder: "CDB liquidez diária: ...% do CDI\nCDB com vencimento: ...% do CDI\nDiferença: ...",
            },
          },
        },
        {
          id: lid("cdb", 3),
          title: "O papel do FGC na segurança do CDB",
          content: {
            explanation: [
              "O FGC (Fundo Garantidor de Créditos) é uma entidade privada, sem fins lucrativos, que garante determinados investimentos (incluindo CDBs) até o limite de R$ 250 mil por CPF e por instituição financeira, em caso de o banco emissor quebrar.",
              "Essa garantia é o que torna o CDB de bancos menores (com taxas mais altas) relativamente seguro, mesmo com um risco de crédito nominal maior — dentro do limite garantido.",
              "É importante saber que o limite é por instituição: ter R$ 300 mil num único CDB de um banco ultrapassa a garantia; dividir entre duas instituições diferentes mantém o valor total protegido.",
            ],
            examples: [
              "R$ 200 mil num CDB de um banco: totalmente coberto pelo FGC, mesmo se o banco quebrar.",
              "R$ 300 mil no mesmo banco: R$ 250 mil garantidos, R$ 50 mil sem essa proteção — dividir em dois bancos resolveria isso.",
            ],
            diagram: {
              type: "formula",
              formula: "Garantia do FGC = até R$ 250 mil por CPF, por instituição financeira",
              caption: "Diversificar entre instituições diferentes mantém valores maiores dentro da garantia.",
            },
            keyConcepts: [
              "FGC garante até R$ 250 mil por CPF, por instituição, em caso de quebra do banco.",
              "É o que torna CDBs de bancos menores relativamente seguros.",
              "O limite é por instituição — diversificar entre bancos protege valores maiores.",
            ],
            quiz: [
              {
                question: "Se alguém tem R$ 400 mil investidos num único CDB de um banco, quanto estaria protegido pelo FGC em caso de quebra do banco?",
                options: ["R$ 400 mil (o valor total)", "R$ 250 mil (o limite por CPF e por instituição)", "Nada, o FGC não cobre CDB", "R$ 100 mil"],
                correctIndex: 1,
                explanation: "O limite de garantia do FGC é R$ 250 mil por CPF e por instituição — o valor excedente não teria essa proteção específica.",
              },
            ],
            exercise: {
              prompt: "Se você tem (ou planeja ter) investimentos cobertos pelo FGC, verifique se o valor em cada instituição está dentro do limite de R$ 250 mil.",
              placeholder: "Instituição 1: R$ ... — dentro do limite? ...\nInstituição 2: R$ ...",
            },
          },
        },
        {
          id: lid("cdb", 4),
          title: "Comparando CDBs de diferentes bancos",
          content: {
            explanation: [
              "Ao comparar CDBs, os principais fatores são: percentual do CDI (ou taxa prefixada), prazo de vencimento, liquidez, e o quanto o valor investido está dentro do limite de garantia do FGC.",
              "Um CDB de 100% do CDI e outro de 110% do CDI, sob as mesmas condições de prazo e liquidez, entregam resultados diferentes — vale sempre calcular a diferença em reais para o valor que você pretende investir.",
              "Comparar apenas a taxa nominal sem considerar prazo e liquidez pode levar a uma escolha inadequada para o objetivo — a melhor taxa nem sempre é a melhor escolha, se não combinar com o prazo necessário.",
            ],
            examples: [
              "CDB A: 100% do CDI, liquidez diária. CDB B: 115% do CDI, vencimento em 3 anos — a escolha depende de quando o dinheiro será necessário.",
              "Para R$ 10.000, a diferença entre 100% e 110% do CDI ao longo de alguns anos pode representar centenas de reais a mais ou a menos.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Comparar o percentual do CDI (ou taxa prefixada) de cada CDB",
                "Verificar prazo de vencimento e condições de liquidez",
                "Confirmar que o valor está dentro do limite do FGC",
                "Calcular a diferença em reais para o valor real que pretende investir",
              ],
            },
            keyConcepts: [
              "Comparar percentual do CDI, prazo, liquidez e cobertura do FGC.",
              "A melhor taxa nem sempre é a melhor escolha, se não combinar com o prazo necessário.",
              "Calcular a diferença em reais ajuda a visualizar o impacto real da comparação.",
            ],
            quiz: [
              {
                question: "Por que comparar apenas a taxa nominal (percentual do CDI) entre CDBs pode ser insuficiente?",
                options: [
                  "Porque a taxa nominal nunca importa",
                  "Porque prazo e liquidez também precisam combinar com o objetivo do investimento, não só a taxa mais alta",
                  "Porque todos os CDBs têm a mesma taxa",
                  "Porque CDBs não podem ser comparados entre si"
                ],
                correctIndex: 1,
                explanation: "Um CDB com taxa maior mas sem liquidez adequada pode não servir para um objetivo que precisa de flexibilidade, mesmo sendo 'melhor' em taxa isoladamente.",
              },
            ],
            exercise: {
              prompt: "Compare 3 CDBs disponíveis para você (taxa, prazo, liquidez) e decida qual seria mais adequado para um objetivo específico seu.",
              placeholder: "CDB 1: ...\nCDB 2: ...\nCDB 3: ...\nEscolha para meu objetivo: ...",
            },
          },
        },
        {
          id: lid("cdb", 5),
          title: "Quando um CDB faz sentido pra você",
          content: {
            explanation: [
              "CDB faz sentido quando você quer uma alternativa de renda fixa privada, com possibilidade de taxas melhores que o Tesouro Direto em alguns casos, mantendo a segurança da garantia do FGC dentro do limite.",
              "Para reserva de emergência, um CDB de liquidez diária de um banco sólido, pagando próximo a 100% do CDI ou mais, é uma opção tão válida quanto o Tesouro Selic.",
              "Para objetivos de médio prazo, comparar CDBs com vencimento (que costumam pagar mais) com outras opções de renda fixa ajuda a encontrar o melhor equilíbrio entre taxa, prazo e segurança.",
            ],
            examples: [
              "Reserva de emergência num CDB de liquidez diária a 100%+ do CDI, de um banco com boa reputação.",
              "Meta de 2 anos num CDB com vencimento, buscando uma taxa acima de 110% do CDI, dentro do limite do FGC.",
            ],
            keyConcepts: [
              "CDB é uma alternativa válida de renda fixa privada, com garantia do FGC.",
              "Para reserva de emergência: CDB de liquidez diária de um banco sólido.",
              "Para médio prazo: comparar CDBs com vencimento com outras opções de renda fixa.",
            ],
            quiz: [
              {
                question: "Em que situação um CDB de liquidez diária pode ser tão adequado quanto o Tesouro Selic?",
                options: [
                  "Nunca, o Tesouro Selic é sempre melhor",
                  "Para a reserva de emergência, se o CDB for de um banco sólido e pagar uma taxa competitiva próxima ou acima de 100% do CDI",
                  "Só se o valor for muito alto",
                  "Só se o CDB não tiver cobertura do FGC"
                ],
                correctIndex: 1,
                explanation: "Combinando liquidez diária, segurança (FGC) e uma taxa competitiva, o CDB pode ser uma alternativa tão válida quanto o Tesouro Selic para a reserva de emergência.",
              },
            ],
            exercise: {
              prompt: "Avalie se um CDB faz sentido para algum dos seus objetivos atuais, comparando com as opções de Tesouro Direto que você já conhece.",
              placeholder: "Objetivo: ...\nCDB comparado com Tesouro: ...\nMinha decisão: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 6 — Fundos de investimento
    // ---------------------------------------------------------------
    {
      id: "fundos-de-investimento",
      title: "Fundos de investimento",
      description: "Investir através de um gestor profissional, junto com outros investidores.",
      icon: "🗂️",
      lessons: [
        {
          id: lid("fundos-de-investimento", 1),
          title: "O que é um fundo de investimento",
          content: {
            explanation: [
              "Um fundo de investimento reúne o dinheiro de vários investidores num único \"bolo\", administrado por um gestor profissional que toma as decisões de compra e venda de acordo com a estratégia do fundo.",
              "Ao investir num fundo, você compra \"cotas\" — pequenas frações do patrimônio total do fundo — e o valor dessas cotas varia conforme o desempenho dos investimentos que o gestor faz.",
              "A vantagem principal é o acesso à gestão profissional e à diversificação, mesmo com valores relativamente baixos — algo mais difícil de replicar investindo diretamente e sozinho.",
            ],
            examples: [
              "Um fundo multimercado pode investir em renda fixa, ações e câmbio ao mesmo tempo, buscando o melhor retorno dentro da estratégia definida.",
              "Comprar 100 cotas de um fundo a R$ 50 cada representa R$ 5.000 investidos, com o valor de cada cota variando conforme o desempenho do fundo.",
            ],
            keyConcepts: [
              "Fundo: reúne dinheiro de vários investidores, administrado por um gestor profissional.",
              "Investir num fundo significa comprar cotas, cujo valor varia com o desempenho.",
              "Vantagem: acesso a gestão profissional e diversificação, mesmo com valores baixos.",
            ],
            quiz: [
              {
                question: "O que o investidor recebe ao investir num fundo de investimento?",
                options: [
                  "Uma parte da empresa gestora",
                  "Cotas, que representam uma fração do patrimônio total do fundo",
                  "Um empréstimo garantido",
                  "Ações diretas de todas as empresas do fundo",
                ],
                correctIndex: 1,
                explanation: "As cotas representam a fração do patrimônio do fundo que pertence a cada investidor, e seu valor varia conforme o desempenho do fundo.",
              },
            ],
            exercise: {
              prompt: "Pesquise um fundo de investimento disponível na sua corretora e identifique sua estratégia (em que tipo de ativo ele investe).",
              placeholder: "Fundo pesquisado: ...\nEstratégia: ...",
            },
          },
        },
        {
          id: lid("fundos-de-investimento", 2),
          title: "Tipos de fundos (renda fixa, multimercado, ações)",
          content: {
            explanation: [
              "Fundos de renda fixa investem majoritariamente em títulos de renda fixa, buscando um perfil de risco mais conservador, mas ainda sujeitos a variações de preço e à taxa de administração cobrada.",
              "Fundos multimercado combinam diferentes classes de ativos (renda fixa, ações, câmbio, derivativos) buscando retorno em diferentes cenários de mercado — o perfil de risco varia bastante entre fundos multimercado diferentes.",
              "Fundos de ações investem majoritariamente em ações, com maior potencial de retorno no longo prazo, mas também maior oscilação no curto prazo.",
            ],
            examples: [
              "Um fundo de renda fixa DI busca acompanhar de perto o CDI, com baixo risco.",
              "Um fundo de ações focado em empresas de tecnologia terá desempenho fortemente ligado a esse setor específico.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Renda fixa e multimercado", items: ["Perfil geralmente mais conservador a moderado", "Diversificação entre classes de ativos", "Menor oscilação (varia por fundo)"] },
              right: { label: "Ações", items: ["Maior potencial de retorno no longo prazo", "Maior oscilação no curto prazo", "Concentrado em renda variável"] },
            },
            keyConcepts: [
              "Renda fixa: perfil mais conservador, ainda sujeito a variações.",
              "Multimercado: combina classes diferentes, perfil de risco variável entre fundos.",
              "Ações: maior potencial de retorno de longo prazo, maior oscilação no curto prazo.",
            ],
            quiz: [
              {
                question: "O que caracteriza um fundo multimercado?",
                options: [
                  "Investe só em imóveis",
                  "Combina diferentes classes de ativos (renda fixa, ações, câmbio) buscando retorno em diferentes cenários",
                  "É sempre o mais arriscado de todos",
                  "Só pode ser acessado por investidores institucionais",
                ],
                correctIndex: 1,
                explanation: "A flexibilidade de combinar diferentes classes de ativos é a característica central de um fundo multimercado.",
              },
            ],
            exercise: {
              prompt: "Compare um fundo de renda fixa, um multimercado e um de ações disponíveis na sua corretora. Anote a estratégia e o risco declarado de cada um.",
              placeholder: "Renda fixa: ...\nMultimercado: ...\nAções: ...",
            },
          },
        },
        {
          id: lid("fundos-de-investimento", 3),
          title: "Taxa de administração e taxa de performance",
          content: {
            explanation: [
              "Taxa de administração é cobrada anualmente sobre o patrimônio investido no fundo, independente do resultado — mesmo que o fundo tenha prejuízo, a taxa continua sendo cobrada.",
              "Taxa de performance é cobrada apenas quando o fundo supera um determinado referencial (benchmark), como um percentual do que exceder o CDI, por exemplo — alinha o interesse do gestor com o do investidor.",
              "Taxas mais altas não significam necessariamente melhor gestão — vale comparar o resultado líquido (depois de todas as taxas) entre fundos parecidos antes de decidir.",
            ],
            examples: [
              "Um fundo com taxa de administração de 2% ao ano cobra esse percentual sobre o patrimônio investido, todo ano, independente do desempenho.",
              "Um fundo com taxa de performance de 20% sobre o que exceder o CDI só cobra essa taxa extra se o fundo realmente superar o CDI no período.",
            ],
            diagram: {
              type: "formula",
              formula: "Retorno líquido = Retorno bruto do fundo − Taxa de administração − Taxa de performance (se houver)",
              caption: "O que realmente importa para o investidor é o retorno líquido, depois de todas as taxas.",
            },
            keyConcepts: [
              "Taxa de administração: cobrada sempre, independente do resultado.",
              "Taxa de performance: cobrada só quando o fundo supera um benchmark.",
              "O que importa é o retorno líquido, não o retorno bruto anunciado.",
            ],
            quiz: [
              {
                question: "Qual a diferença fundamental entre taxa de administração e taxa de performance?",
                options: [
                  "Não há diferença, são a mesma coisa",
                  "A taxa de administração é cobrada sempre; a de performance só quando o fundo supera um referencial definido",
                  "A taxa de performance é sempre maior",
                  "Só fundos de ações cobram taxa de performance",
                ],
                correctIndex: 1,
                explanation: "Essa diferença é o que faz a taxa de performance, em teoria, alinhar o interesse do gestor com o do investidor — ela só existe se houver resultado acima do esperado.",
              },
            ],
            exercise: {
              prompt: "Pesquise as taxas de administração e performance de 2 fundos disponíveis para você e calcule o impacto aproximado no retorno líquido de cada um.",
              placeholder: "Fundo 1: taxa de administração ...% — taxa de performance ...%\nFundo 2: ...",
            },
          },
        },
        {
          id: lid("fundos-de-investimento", 4),
          title: "Como avaliar a rentabilidade de um fundo",
          content: {
            explanation: [
              "Avaliar um fundo não deve ser feito olhando só a rentabilidade de um único período (um mês ou até um ano) — o histórico de vários anos, incluindo períodos ruins, dá uma visão mais completa da consistência do gestor.",
              "Comparar a rentabilidade do fundo com um referencial adequado (benchmark) — como o CDI para fundos de renda fixa, ou o Ibovespa para fundos de ações — mostra se o fundo realmente está entregando valor acima do \"básico\".",
              "Rentabilidade passada não garante rentabilidade futura — é uma informação relevante, mas não uma promessa, especialmente em fundos de renda variável.",
            ],
            examples: [
              "Um fundo que rendeu bem num único mês, mas tem histórico irregular em vários anos, é menos confiável do que um com consistência ao longo do tempo.",
              "Comparar um fundo de ações com o Ibovespa do mesmo período mostra se o gestor está \"batendo o mercado\" ou só acompanhando ele, ainda cobrando taxas mais altas.",
            ],
            keyConcepts: [
              "Avaliar o histórico de vários anos, não só um período isolado.",
              "Comparar com um benchmark adequado à estratégia do fundo.",
              "Rentabilidade passada não garante rentabilidade futura.",
            ],
            quiz: [
              {
                question: "Por que comparar a rentabilidade de um fundo com um benchmark (como CDI ou Ibovespa) é importante?",
                options: [
                  "Não é importante, o número absoluto já basta",
                  "Porque mostra se o fundo realmente entrega valor acima da referência básica, justificando as taxas cobradas",
                  "Porque é uma exigência legal",
                  "Porque o benchmark sempre supera qualquer fundo",
                ],
                correctIndex: 1,
                explanation: "Um fundo pode ter rendimento positivo mas ainda assim ficar abaixo do seu benchmark, o que sugere que a gestão ativa não está agregando valor suficiente para justificar as taxas.",
              },
            ],
            exercise: {
              prompt: "Escolha um fundo e compare a rentabilidade dele nos últimos 3-5 anos com o benchmark adequado (CDI, Ibovespa, etc.).",
              placeholder: "Fundo: ...\nRentabilidade do fundo (últimos anos): ...\nRentabilidade do benchmark: ...",
            },
          },
        },
        {
          id: lid("fundos-de-investimento", 5),
          title: "Fundos x investir diretamente",
          content: {
            explanation: [
              "Investir através de fundos oferece gestão profissional e diversificação automática, mas com o custo das taxas de administração (e possivelmente performance) — que reduzem o retorno líquido ao longo do tempo.",
              "Investir diretamente (comprando ações ou títulos individualmente, por exemplo) elimina essas taxas de gestão, mas exige mais tempo, conhecimento e disciplina do próprio investidor para tomar as decisões.",
              "Muitos investidores combinam as duas abordagens: parte da carteira em fundos (para diversificação e categorias mais complexas) e parte investida diretamente (onde têm mais confiança e conhecimento).",
            ],
            examples: [
              "Investir diretamente em Tesouro Direto elimina taxas de administração de fundos de renda fixa DI, para quem se sente confortável fazendo a escolha sozinho.",
              "Um fundo multimercado pode fazer sentido para quem quer exposição a estratégias mais sofisticadas, sem precisar entender profundamente cada uma delas.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Investir via fundos", items: ["Gestão profissional", "Diversificação automática", "Taxas de administração/performance"] },
              right: { label: "Investir diretamente", items: ["Sem taxas de gestão", "Exige mais tempo e conhecimento", "Controle total das decisões"] },
            },
            keyConcepts: [
              "Fundos: gestão profissional e diversificação, com custo de taxas.",
              "Direto: sem taxas de gestão, mas exige mais tempo e conhecimento do investidor.",
              "Muitos investidores combinam as duas abordagens na mesma carteira.",
            ],
            quiz: [
              {
                question: "Qual a principal desvantagem de investir através de fundos, comparado a investir diretamente?",
                options: [
                  "Fundos nunca diversificam",
                  "As taxas de administração (e possivelmente performance) reduzem o retorno líquido ao longo do tempo",
                  "Fundos são ilegais no Brasil",
                  "Fundos exigem mais tempo do investidor que investir diretamente",
                ],
                correctIndex: 1,
                explanation: "O custo das taxas é o principal trade-off de ter a conveniência da gestão profissional — elas corroem parte do retorno ao longo do tempo.",
              },
            ],
            exercise: {
              prompt: "Reflita sobre sua própria carteira (ou planos de investimento): você prefere investir mais via fundos, diretamente, ou uma combinação dos dois? Por quê?",
              placeholder: "Minha preferência: ...\nPor quê: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 7 — Ações
    // ---------------------------------------------------------------
    {
      id: "acoes",
      title: "Ações",
      description: "Tornar-se sócio de empresas através da bolsa de valores.",
      icon: "📊",
      lessons: [
        {
          id: lid("acoes", 1),
          title: "O que é uma ação",
          content: {
            explanation: [
              "Ação é uma pequena fração do capital social de uma empresa — ao comprar uma ação, você se torna sócio (acionista) dessa empresa, com direito a uma parte proporcional dos lucros e, em alguns casos, a voto em decisões.",
              "O valor de uma ação varia conforme a expectativa do mercado sobre o desempenho futuro da empresa — bons resultados, boas perspectivas de crescimento e boa gestão tendem a valorizar a ação; o oposto tende a desvalorizar.",
              "Diferente da renda fixa, não existe uma \"promessa\" de rendimento — o retorno vem da valorização da ação e/ou da distribuição de lucros (dividendos), ambos incertos e variáveis.",
            ],
            examples: [
              "Comprar 100 ações de uma empresa a R$ 20 cada representa R$ 2.000 investidos, e você passa a ser sócio dessa empresa nessa proporção.",
              "Se a empresa vai bem e o mercado reage positivamente, o preço da ação pode subir; más notícias ou resultados fracos podem derrubar o preço.",
            ],
            keyConcepts: [
              "Ação: fração do capital social de uma empresa, comprada na bolsa de valores.",
              "Comprar uma ação torna você sócio (acionista) da empresa.",
              "Não há promessa de rendimento — o retorno vem da valorização e/ou dividendos, ambos incertos.",
            ],
            quiz: [
              {
                question: "O que significa comprar uma ação de uma empresa?",
                options: [
                  "Emprestar dinheiro para a empresa, com juros garantidos",
                  "Se tornar sócio (acionista) de uma pequena fração dessa empresa",
                  "Comprar um produto dessa empresa",
                  "Garantir um emprego nessa empresa",
                ],
                correctIndex: 1,
                explanation: "Ao contrário da renda fixa (empréstimo), a ação representa uma participação societária real na empresa.",
              },
            ],
            exercise: {
              prompt: "Escolha uma empresa listada na bolsa que você conhece bem (como consumidor) e pesquise brevemente como o preço da ação dela se comportou no último ano.",
              placeholder: "Empresa: ...\nComportamento do preço no último ano: ...",
            },
          },
        },
        {
          id: lid("acoes", 2),
          title: "Como funciona a bolsa de valores (B3)",
          content: {
            explanation: [
              "A B3 (Brasil, Bolsa, Balcão) é a bolsa de valores brasileira, onde ações e outros ativos são comprados e vendidos entre investidores, através de corretoras habilitadas.",
              "O preço de uma ação na bolsa é determinado pelo encontro entre oferta e demanda em tempo real — quando mais gente quer comprar do que vender, o preço tende a subir, e vice-versa.",
              "Para comprar ações, é necessário ter conta numa corretora habilitada, que serve como intermediária entre o investidor e a bolsa.",
            ],
            examples: [
              "Uma notícia positiva sobre uma empresa pode aumentar a demanda pelas ações dela, empurrando o preço para cima no mesmo dia.",
              "As ordens de compra e venda são registradas e executadas eletronicamente pela B3, com liquidação em poucos dias úteis.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Investidor abre conta numa corretora",
                "Corretora dá acesso à B3 (bolsa de valores)",
                "Investidor envia ordens de compra/venda pela plataforma da corretora",
                "B3 executa as ordens conforme oferta e demanda em tempo real",
              ],
            },
            keyConcepts: [
              "B3: a bolsa de valores brasileira, onde ações são negociadas.",
              "O preço é determinado pelo encontro entre oferta e demanda em tempo real.",
              "É necessário ter conta numa corretora para acessar a bolsa.",
            ],
            quiz: [
              {
                question: "O que determina o preço de uma ação na bolsa de valores, minuto a minuto?",
                options: [
                  "Um valor fixo definido pela empresa",
                  "O encontro entre oferta e demanda entre os investidores em tempo real",
                  "Uma decisão do governo",
                  "O valor do CDI"
                ],
                correctIndex: 1,
                explanation: "O mercado de ações funciona por leilão contínuo: o preço reflete o equilíbrio entre quem quer comprar e quem quer vender a cada momento.",
              },
            ],
            exercise: {
              prompt: "Se você já tem conta numa corretora, explore a plataforma dela e identifique como visualizar o preço em tempo real de uma ação.",
              placeholder: "O que encontrei na plataforma: ...",
            },
          },
        },
        {
          id: lid("acoes", 3),
          title: "Análise fundamentalista x análise técnica (visão geral)",
          content: {
            explanation: [
              "Análise fundamentalista avalia o valor de uma empresa com base em seus fundamentos: resultados financeiros, dívida, perspectivas de crescimento, qualidade da gestão — busca entender se o preço da ação reflete o valor real do negócio.",
              "Análise técnica (ou gráfica) estuda o comportamento histórico do preço e do volume negociado, buscando identificar padrões que possam indicar tendências futuras, sem necessariamente considerar os fundamentos da empresa.",
              "As duas abordagens não são mutuamente exclusivas — alguns investidores usam fundamentos para decidir O QUE comprar, e análise técnica para decidir QUANDO comprar ou vender.",
            ],
            examples: [
              "Um investidor fundamentalista pode analisar o lucro, a dívida e o crescimento de uma empresa antes de decidir investir nela.",
              "Um investidor técnico pode observar um padrão gráfico de repetição histórica de preço para decidir o momento de entrada ou saída.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Análise fundamentalista", items: ["Foca nos números e na saúde do negócio", "Busca o valor real da empresa", "Horizonte geralmente mais longo"] },
              right: { label: "Análise técnica", items: ["Foca no comportamento histórico do preço", "Busca padrões e tendências", "Horizonte pode ser mais curto"] },
            },
            keyConcepts: [
              "Fundamentalista: avalia a saúde financeira e as perspectivas da empresa.",
              "Técnica: estuda o comportamento histórico do preço, buscando padrões.",
              "As duas abordagens podem ser combinadas, não são mutuamente exclusivas.",
            ],
            quiz: [
              {
                question: "Qual é o foco principal da análise fundamentalista?",
                options: [
                  "Padrões gráficos de preço",
                  "A saúde financeira e as perspectivas de crescimento da empresa por trás da ação",
                  "O volume negociado no último dia",
                  "As notícias do dia sobre a bolsa"
                ],
                correctIndex: 1,
                explanation: "A análise fundamentalista busca entender o negócio em si, avaliando se o preço da ação reflete adequadamente o valor real da empresa.",
              },
            ],
            exercise: {
              prompt: "Escolha uma empresa e pesquise um dado fundamentalista dela (como lucro recente ou nível de dívida). Anote o que encontrou.",
              placeholder: "Empresa: ...\nDado fundamentalista encontrado: ...",
            },
          },
        },
        {
          id: lid("acoes", 4),
          title: "Dividendos e outros proventos",
          content: {
            explanation: [
              "Dividendos são a distribuição de parte do lucro de uma empresa aos seus acionistas, geralmente paga em dinheiro, proporcional à quantidade de ações que cada um possui.",
              "Além dos dividendos, existem outros tipos de proventos, como juros sobre capital próprio (JCP) — uma forma de distribuição de lucro com tratamento tributário diferente para a empresa e para o investidor.",
              "Empresas não são obrigadas a distribuir todo o lucro como dividendos — parte pode ser reinvestida no próprio negócio, o que também pode beneficiar o acionista através da valorização futura da ação.",
            ],
            examples: [
              "Uma empresa que distribui R$ 2 de dividendo por ação, para quem tem 100 ações, resulta em R$ 200 recebidos.",
              "Empresas de setores mais maduros (como energia e bancos) costumam ter histórico de distribuição de dividendos mais consistente que empresas em fase de forte crescimento.",
            ],
            keyConcepts: [
              "Dividendos: distribuição de parte do lucro aos acionistas, proporcional à quantidade de ações.",
              "JCP: outra forma de provento, com tratamento tributário diferente.",
              "Nem todo lucro é distribuído — parte pode ser reinvestida no negócio.",
            ],
            quiz: [
              {
                question: "O que são dividendos?",
                options: [
                  "Um tipo de imposto cobrado sobre ações",
                  "A distribuição de parte do lucro da empresa aos acionistas, proporcional à quantidade de ações",
                  "O preço de compra de uma ação",
                  "Uma taxa cobrada pela corretora",
                ],
                correctIndex: 1,
                explanation: "Dividendos são como o acionista participa dos resultados financeiros da empresa da qual é sócio.",
              },
            ],
            exercise: {
              prompt: "Pesquise uma empresa que paga dividendos regularmente e anote o histórico aproximado de distribuição dos últimos anos.",
              placeholder: "Empresa: ...\nHistórico de dividendos: ...",
            },
          },
        },
        {
          id: lid("acoes", 5),
          title: "Riscos e volatilidade do mercado de ações",
          content: {
            explanation: [
              "O preço das ações pode oscilar significativamente em curtos períodos, refletindo tanto fatores específicos da empresa quanto fatores macroeconômicos e políticos que afetam o mercado como um todo.",
              "Essa volatilidade é maior no curto prazo — historicamente, no longo prazo, o mercado de ações tende a se recuperar de quedas, mas isso não é garantido para nenhuma ação ou período específico.",
              "Investir em ações exige tolerância a ver o valor investido cair antes de eventualmente (não garantidamente) se recuperar — por isso costuma ser mais indicado para objetivos de longo prazo, com dinheiro que não vai fazer falta no curto prazo.",
            ],
            examples: [
              "Uma crise econômica pode derrubar o preço de praticamente todas as ações de uma vez, mesmo de empresas individualmente saudáveis.",
              "Historicamente, o Ibovespa (principal índice da bolsa brasileira) teve períodos de queda superiores a 30% seguidos, eventualmente, de recuperação — mas o tempo de recuperação não é previsível.",
            ],
            keyConcepts: [
              "Ações podem oscilar significativamente em curtos períodos.",
              "Volatilidade tende a ser menor no longo prazo, mas isso não é garantido.",
              "Exige tolerância a quedas — mais indicado para dinheiro que não fará falta no curto prazo.",
            ],
            quiz: [
              {
                question: "Por que investimentos em ações costumam ser mais indicados para objetivos de longo prazo?",
                options: [
                  "Porque ações são proibidas para objetivos de curto prazo",
                  "Porque a volatilidade de curto prazo é alta, e o tempo extra dá mais chance de recuperação de eventuais quedas",
                  "Porque rendem menos no curto prazo sempre",
                  "Porque exigem um valor mínimo muito alto"
                ],
                correctIndex: 1,
                explanation: "Sem tempo de sobra para recuperar de uma queda, o risco de precisar vender numa baixa é alto demais para objetivos de curto prazo.",
              },
            ],
            exercise: {
              prompt: "Pesquise a maior queda (em %) que o Ibovespa já teve num período de crise recente, e quanto tempo levou até se recuperar (se já se recuperou).",
              placeholder: "Período pesquisado: ...\nQueda: ...%\nTempo de recuperação: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 8 — FIIs
    // ---------------------------------------------------------------
    {
      id: "fiis",
      title: "FIIs",
      description: "Fundos de Investimento Imobiliário: investir em imóveis sem comprar um imóvel inteiro.",
      icon: "🏢",
      lessons: [
        {
          id: lid("fiis", 1),
          title: "O que é um FII",
          content: {
            explanation: [
              "FII (Fundo de Investimento Imobiliário) reúne o dinheiro de vários investidores para aplicar em ativos ligados ao setor imobiliário — imóveis físicos (galpões, shoppings, escritórios) ou papéis ligados a esse setor.",
              "Diferente de comprar um imóvel diretamente, investir num FII permite acesso ao mercado imobiliário com valores baixos, liquidez em bolsa e sem as dores de cabeça de administrar um imóvel fisicamente.",
              "As cotas de FIIs são negociadas na bolsa de valores (B3), assim como ações, com preço variando conforme oferta e demanda dos investidores.",
            ],
            examples: [
              "Comprar cotas de um FII que possui um shopping center dá direito a uma fração proporcional dos aluguéis recebidos, sem precisar administrar o shopping.",
              "Uma cota de FII custando R$ 100 permite acesso ao mercado imobiliário com uma fração do valor de comprar um imóvel inteiro.",
            ],
            keyConcepts: [
              "FII: fundo que reúne dinheiro de investidores para aplicar no setor imobiliário.",
              "Acesso ao mercado imobiliário com valores baixos e liquidez em bolsa.",
              "Cotas negociadas na B3, como ações.",
            ],
            quiz: [
              {
                question: "Qual a principal vantagem de investir num FII em vez de comprar um imóvel diretamente?",
                options: [
                  "FIIs nunca perdem valor",
                  "Acesso ao mercado imobiliário com valores baixos, liquidez em bolsa e sem administrar o imóvel diretamente",
                  "FIIs garantem rendimento fixo mensal",
                  "FIIs são isentos de qualquer risco"
                ],
                correctIndex: 1,
                explanation: "A acessibilidade, a liquidez e a ausência de gestão direta do imóvel são as principais vantagens práticas dos FIIs sobre a compra direta.",
              },
            ],
            exercise: {
              prompt: "Pesquise um FII disponível na bolsa e identifique que tipo de imóvel (ou papel) ele possui em sua carteira.",
              placeholder: "FII pesquisado: ...\nTipo de imóvel/papel: ...",
            },
          },
        },
        {
          id: lid("fiis", 2),
          title: "Tipos de FII (tijolo, papel, híbrido)",
          content: {
            explanation: [
              "FIIs de tijolo investem diretamente em imóveis físicos — shoppings, galpões logísticos, escritórios, agências bancárias — e a renda vem dos aluguéis desses imóveis.",
              "FIIs de papel investem em títulos ligados ao setor imobiliário, como CRIs (Certificados de Recebíveis Imobiliários) — a renda vem dos juros desses papéis, com comportamento mais parecido com renda fixa.",
              "FIIs híbridos combinam as duas estratégias, buscando diversificação entre imóveis físicos e papéis dentro do próprio fundo.",
            ],
            examples: [
              "Um FII de tijolo focado em galpões logísticos recebe aluguel de empresas de e-commerce que usam esses espaços.",
              "Um FII de papel investe em CRIs que financiam a construção ou aquisição de imóveis, recebendo os juros desses financiamentos.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "FII de tijolo", items: ["Investe em imóveis físicos", "Renda vem de aluguéis", "Mais sensível ao mercado imobiliário físico"] },
              right: { label: "FII de papel", items: ["Investe em títulos (CRIs)", "Renda vem de juros", "Comportamento mais parecido com renda fixa"] },
            },
            keyConcepts: [
              "Tijolo: imóveis físicos, renda de aluguéis.",
              "Papel: títulos como CRIs, renda de juros.",
              "Híbrido: combina as duas estratégias.",
            ],
            quiz: [
              {
                question: "De onde vem a renda de um FII de 'papel'?",
                options: [
                  "De aluguéis de imóveis físicos",
                  "Dos juros de títulos ligados ao setor imobiliário, como CRIs",
                  "Da venda de imóveis",
                  "De dividendos de empresas de construção"
                ],
                correctIndex: 1,
                explanation: "FIIs de papel investem em títulos de crédito imobiliário, e a renda vem dos juros pagos por esses papéis, não de aluguéis diretos.",
              },
            ],
            exercise: {
              prompt: "Encontre um exemplo de FII de tijolo e um de papel disponíveis na bolsa. Compare o tipo de renda de cada um.",
              placeholder: "FII de tijolo: ...\nFII de papel: ...",
            },
          },
        },
        {
          id: lid("fiis", 3),
          title: "Como funcionam os rendimentos mensais",
          content: {
            explanation: [
              "FIIs costumam distribuir rendimentos mensalmente aos cotistas, proporcional à quantidade de cotas que cada investidor possui — essa distribuição regular é um dos atrativos mais citados dessa categoria.",
              "Os rendimentos distribuídos por FIIs são isentos de Imposto de Renda para pessoa física, desde que atendidos certos requisitos (como o fundo ter no mínimo 50 cotistas e as cotas serem negociadas em bolsa).",
              "O valor do rendimento mensal pode variar conforme o desempenho dos ativos do fundo — não é uma garantia fixa, mesmo sendo distribuído regularmente.",
            ],
            examples: [
              "Um FII que distribui R$ 0,80 por cota, para quem tem 200 cotas, resulta em R$ 160 recebidos naquele mês.",
              "Em meses de vacância maior (imóveis sem inquilino) num FII de tijolo, o rendimento distribuído pode ser menor que em meses anteriores.",
            ],
            diagram: {
              type: "formula",
              formula: "Rendimento mensal recebido = Rendimento por cota × Quantidade de cotas possuídas",
              caption: "Isento de Imposto de Renda para pessoa física, dentro dos requisitos legais.",
            },
            keyConcepts: [
              "FIIs costumam distribuir rendimentos mensalmente.",
              "Rendimentos distribuídos são isentos de IR para pessoa física, dentro dos requisitos.",
              "O valor do rendimento pode variar — não é uma garantia fixa.",
            ],
            quiz: [
              {
                question: "Os rendimentos mensais distribuídos por FIIs para pessoa física têm qual tratamento tributário, dentro dos requisitos legais?",
                options: ["Tributados a 22,5%", "Isentos de Imposto de Renda", "Tributados a 15% fixo", "Tributados só se acima de R$ 1.000"],
                correctIndex: 1,
                explanation: "A isenção de IR sobre os rendimentos distribuídos é um dos principais atrativos dos FIIs para pessoa física, dentro dos requisitos exigidos por lei.",
              },
            ],
            exercise: {
              prompt: "Pesquise o histórico de rendimentos mensais de um FII nos últimos 6 meses e observe se houve variação significativa.",
              placeholder: "FII: ...\nRendimentos dos últimos 6 meses: ...",
            },
          },
        },
        {
          id: lid("fiis", 4),
          title: "Avaliando um FII antes de investir",
          content: {
            explanation: [
              "Antes de investir num FII, vale avaliar a qualidade dos imóveis ou papéis que ele possui, a taxa de vacância (para FIIs de tijolo), a diversificação de inquilinos/devedores, e o histórico de distribuição de rendimentos.",
              "O \"dividend yield\" (rendimento distribuído dividido pelo preço da cota) é uma métrica comum de comparação, mas não deve ser usada isoladamente — um yield muito alto pode indicar risco elevado, não necessariamente uma boa oportunidade.",
              "Comparar o preço da cota com o valor patrimonial do fundo (P/VP) ajuda a avaliar se a cota está sendo negociada acima ou abaixo do valor dos ativos que o fundo possui.",
            ],
            examples: [
              "Um FII de tijolo com vacância baixa e inquilinos diversificados tende a ter renda mais estável do que um concentrado num único inquilino.",
              "Um P/VP de 0,90 sugere que a cota está sendo negociada abaixo do valor patrimonial dos imóveis que o fundo possui — vale investigar o motivo antes de assumir que é uma \"pechincha\".",
            ],
            keyConcepts: [
              "Avaliar qualidade dos ativos, vacância e diversificação de inquilinos/devedores.",
              "Dividend yield é útil, mas um yield muito alto pode sinalizar risco elevado.",
              "P/VP compara o preço da cota com o valor patrimonial dos ativos do fundo.",
            ],
            quiz: [
              {
                question: "Por que um dividend yield muito alto num FII não deve ser interpretado automaticamente como uma boa oportunidade?",
                options: [
                  "Porque yields altos são sempre falsos",
                  "Porque um yield muito alto pode indicar risco elevado no fundo, não necessariamente uma vantagem",
                  "Porque FIIs nunca têm yield alto",
                  "Porque yield não tem relação com risco"
                ],
                correctIndex: 1,
                explanation: "Um yield muito acima da média do mercado costuma refletir um risco maior percebido pelo mercado, que precisa ser investigado antes de investir.",
              },
            ],
            exercise: {
              prompt: "Escolha um FII e pesquise seu dividend yield, taxa de vacância (se aplicável) e P/VP. O que esses números sugerem sobre o fundo?",
              placeholder: "FII: ...\nDividend yield: ...%\nVacância: ...%\nP/VP: ...",
            },
          },
        },
        {
          id: lid("fiis", 5),
          title: "Riscos específicos de FIIs",
          content: {
            explanation: [
              "Risco de vacância: imóveis sem inquilinos não geram aluguel, reduzindo a renda distribuída pelo fundo — mais relevante em FIIs de tijolo concentrados em poucos imóveis ou inquilinos.",
              "Risco de crédito: em FIIs de papel, existe o risco de o emissor dos títulos (CRIs) não conseguir pagar o que deve.",
              "Risco de liquidez: mesmo sendo negociados em bolsa, alguns FIIs menores podem ter baixo volume de negociação, dificultando a venda rápida sem afetar o preço.",
            ],
            examples: [
              "Um FII concentrado em um único grande inquilino que decide sair do imóvel pode sofrer uma queda significativa na distribuição de rendimentos.",
              "Um FII de papel exposto a um único CRI que entra em default pode sofrer perdas relevantes.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Risco de vacância: imóveis sem inquilinos reduzem a renda",
                "Risco de crédito: emissores de papéis podem não pagar (FIIs de papel)",
                "Risco de liquidez: alguns FIIs têm baixo volume de negociação",
                "Avaliar diversificação e volume de negociação antes de investir",
              ],
            },
            keyConcepts: [
              "Risco de vacância: imóveis sem inquilinos reduzem a renda distribuída.",
              "Risco de crédito: relevante em FIIs de papel, se o emissor não pagar.",
              "Risco de liquidez: alguns FIIs têm baixo volume de negociação em bolsa.",
            ],
            quiz: [
              {
                question: "O que é 'risco de vacância' num FII de tijolo?",
                options: [
                  "O risco de o fundo ser fechado pela CVM",
                  "O risco de imóveis ficarem sem inquilinos, reduzindo a renda de aluguel distribuída",
                  "O risco cambial do fundo",
                  "O risco de o fundo nunca distribuir rendimentos"
                ],
                correctIndex: 1,
                explanation: "Vacância é o período em que um imóvel fica sem inquilino — durante esse tempo, ele não gera aluguel, afetando a renda distribuída pelo fundo.",
              },
            ],
            exercise: {
              prompt: "Para um FII que você pesquisou anteriormente, identifique o principal risco específico dele (vacância, crédito ou liquidez) e avalie se isso muda sua percepção sobre o investimento.",
              placeholder: "FII: ...\nPrincipal risco identificado: ...\nMinha percepção mudou? ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 9 — Diversificação
    // ---------------------------------------------------------------
    {
      id: "diversificacao-de-investimentos",
      title: "Diversificação",
      description: "Não colocar todos os ovos na mesma cesta — a primeira camada de proteção do investidor.",
      icon: "🧺",
      lessons: [
        {
          id: lid("diversificacao-de-investimentos", 1),
          title: "Por que diversificar reduz risco",
          content: {
            explanation: [
              "Diversificar significa distribuir os investimentos entre diferentes ativos, em vez de concentrar tudo num único — assim, o desempenho ruim de um investimento específico não compromete toda a carteira.",
              "O princípio por trás da diversificação é que diferentes ativos reagem de formas diferentes aos mesmos eventos — quando um vai mal, outro pode ir bem, suavizando o resultado geral da carteira.",
              "Diversificar não elimina o risco completamente (existe um risco \"de mercado\" que afeta praticamente tudo em crises amplas), mas reduz significativamente o risco específico de cada investimento individual.",
            ],
            examples: [
              "Ter todo o dinheiro investido numa única ação expõe o investidor totalmente ao desempenho (e aos problemas específicos) daquela empresa.",
              "Distribuir entre 10 ações de setores diferentes reduz o impacto de um problema específico em uma delas sobre o total investido.",
            ],
            diagram: {
              type: "formula",
              formula: "Risco da carteira diversificada < Soma dos riscos individuais dos ativos (quando não perfeitamente correlacionados)",
              caption: "A diversificação reduz o risco total, mesmo sem reduzir o retorno esperado proporcionalmente.",
            },
            keyConcepts: [
              "Diversificar: distribuir investimentos entre diferentes ativos.",
              "Diferentes ativos reagem de formas diferentes aos mesmos eventos.",
              "Reduz o risco específico, mas não elimina o risco de mercado amplo.",
            ],
            quiz: [
              {
                question: "Por que ter todo o dinheiro investido num único ativo é mais arriscado do que diversificar?",
                options: [
                  "Não é mais arriscado, dá no mesmo",
                  "Porque um problema específico daquele ativo afeta 100% do capital investido, em vez de apenas uma fração",
                  "Porque um único ativo nunca rende bem",
                  "Porque diversificar é uma exigência legal"
                ],
                correctIndex: 1,
                explanation: "A concentração amplifica o impacto de qualquer problema específico daquele único investimento sobre o total da carteira.",
              },
            ],
            exercise: {
              prompt: "Avalie sua carteira de investimentos atual (ou planejada): ela está concentrada em poucos ativos ou já é diversificada? O que poderia mudar?",
              placeholder: "Situação atual: ...\nO que poderia mudar: ...",
            },
          },
        },
        {
          id: lid("diversificacao-de-investimentos", 2),
          title: "Diversificando entre classes de ativos",
          content: {
            explanation: [
              "Classes de ativos são categorias amplas de investimento com características diferentes: renda fixa, ações, fundos imobiliários, moeda estrangeira — cada uma reage de forma distinta a diferentes cenários econômicos.",
              "Diversificar entre classes é a camada mais ampla de diversificação: combinar renda fixa (mais estável) com renda variável (mais potencial de crescimento, mais oscilação) equilibra a carteira conforme o perfil e o objetivo do investidor.",
              "A proporção entre classes de ativos (a \"alocação\") costuma ser mais determinante para o resultado de longo prazo da carteira do que a escolha de ativos individuais dentro de cada classe.",
            ],
            examples: [
              "Uma carteira com 70% em renda fixa e 30% em ações tem um perfil de risco diferente de uma com 30% em renda fixa e 70% em ações, mesmo usando os mesmos produtos dentro de cada classe.",
              "Em momentos de crise na bolsa, a parcela em renda fixa de uma carteira diversificada ajuda a suavizar o impacto total.",
            ],
            keyConcepts: [
              "Classes de ativos: categorias amplas com características diferentes.",
              "Diversificar entre classes equilibra estabilidade e potencial de crescimento.",
              "A alocação entre classes costuma pesar mais no resultado do que a escolha de ativos individuais.",
            ],
            quiz: [
              {
                question: "O que costuma ter mais impacto no resultado de longo prazo de uma carteira: a proporção entre classes de ativos, ou a escolha de ativos individuais dentro de cada classe?",
                options: [
                  "A escolha de ativos individuais, sempre",
                  "A proporção entre classes de ativos (a alocação) costuma ser mais determinante",
                  "Não há diferença de impacto",
                  "Depende só da sorte"
                ],
                correctIndex: 1,
                explanation: "Estudos e a prática do mercado mostram que a alocação entre classes de ativos costuma explicar a maior parte da variação de resultados de longo prazo entre carteiras diferentes.",
              },
            ],
            exercise: {
              prompt: "Calcule a proporção atual da sua carteira (ou planos de investimento) entre renda fixa e renda variável.",
              placeholder: "Renda fixa: ...%\nRenda variável: ...%",
            },
          },
        },
        {
          id: lid("diversificacao-de-investimentos", 3),
          title: "Diversificando dentro de uma mesma classe",
          content: {
            explanation: [
              "Além de diversificar entre classes, também vale diversificar DENTRO de cada classe — em ações, por exemplo, distribuir entre diferentes setores e empresas reduz o risco específico de qualquer uma delas.",
              "Em renda fixa, diversificar entre diferentes emissores (bancos, o governo) reduz a concentração de risco de crédito num único emissor, mesmo dentro dos limites de garantia do FGC.",
              "Em FIIs, diversificar entre diferentes tipos de imóveis (galpões, shoppings, escritórios) e diferentes gestores reduz a exposição a problemas específicos de um único segmento ou administração.",
            ],
            examples: [
              "Uma carteira de ações com posições em tecnologia, energia, bancos e consumo está mais diversificada do que uma concentrada só em tecnologia.",
              "Ter CDBs em 3 bancos diferentes reduz a concentração de risco de crédito comparado a ter tudo num único banco.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Concentrado", items: ["Uma única ação/setor", "Um único emissor de renda fixa", "Um único tipo de FII"] },
              right: { label: "Diversificado dentro da classe", items: ["Várias ações, setores diferentes", "Vários emissores de renda fixa", "Vários tipos de FII e gestores"] },
            },
            keyConcepts: [
              "Diversificar dentro da classe reduz o risco específico de um único ativo.",
              "Em ações: diferentes setores e empresas.",
              "Em renda fixa: diferentes emissores. Em FIIs: diferentes tipos e gestores.",
            ],
            quiz: [
              {
                question: "Por que diversificar entre diferentes emissores de renda fixa (não só entre classes de ativos) também é importante?",
                options: [
                  "Não é importante, o FGC cobre qualquer valor",
                  "Reduz a concentração de risco de crédito num único emissor, mesmo dentro dos limites do FGC",
                  "Porque bancos diferentes sempre pagam a mesma taxa",
                  "Porque é obrigatório por lei"
                ],
                correctIndex: 1,
                explanation: "Mesmo com a proteção do FGC até certo limite, concentrar tudo num único emissor aumenta a exposição a esse emissor específico.",
              },
            ],
            exercise: {
              prompt: "Se você tem investimentos de renda fixa, verifique se estão concentrados num único emissor ou diversificados entre vários.",
              placeholder: "Emissores atuais: ...\nEstá diversificado? ...",
            },
          },
        },
        {
          id: lid("diversificacao-de-investimentos", 4),
          title: "Diversificação excessiva: existe demais?",
          content: {
            explanation: [
              "É possível diversificar demais: ter dezenas de ativos muito parecidos entre si, ou posições tão pequenas que se tornam difíceis de acompanhar, pode não trazer benefício real adicional de redução de risco.",
              "A partir de um certo número de ativos bem escolhidos e não muito correlacionados entre si, adicionar mais posições tem retorno decrescente em termos de redução de risco, mas ainda aumenta a complexidade de gestão.",
              "O objetivo da diversificação é reduzir risco específico de forma eficiente, não maximizar o número de ativos possuídos — qualidade e complementaridade importam mais que quantidade.",
            ],
            examples: [
              "Ter 50 ações de empresas muito parecidas do mesmo setor não diversifica tanto quanto ter 15 ações bem distribuídas entre setores diferentes.",
              "Uma carteira com posições tão pequenas que ficam \"perdidas\" entre dezenas de ativos pode ser difícil de acompanhar sem trazer benefício proporcional.",
            ],
            keyConcepts: [
              "É possível diversificar demais, sem ganho real adicional de redução de risco.",
              "A partir de certo ponto, mais ativos aumentam a complexidade sem reduzir muito mais o risco.",
              "O objetivo é qualidade e complementaridade, não quantidade máxima de ativos.",
            ],
            quiz: [
              {
                question: "Por que diversificar demais (dezenas de ativos muito parecidos) pode não trazer benefício real adicional?",
                options: [
                  "Porque diversificação nunca funciona",
                  "Porque, a partir de certo ponto, ativos muito correlacionados entre si não reduzem muito mais o risco, só aumentam a complexidade de gestão",
                  "Porque é proibido ter muitos ativos",
                  "Porque mais ativos sempre reduzem o retorno"
                ],
                correctIndex: 1,
                explanation: "O ganho de diversificação tem retorno decrescente: depois de um certo ponto, mais ativos parecidos entre si não reduzem significativamente mais o risco.",
              },
            ],
            exercise: {
              prompt: "Avalie sua carteira (ou planos): existem posições muito parecidas entre si que poderiam ser simplificadas sem perder diversificação real?",
              placeholder: "Posições avaliadas: ...\nSimplificação possível: ...",
            },
          },
        },
        {
          id: lid("diversificacao-de-investimentos", 5),
          title: "Montando sua primeira carteira diversificada",
          content: {
            explanation: [
              "Montar uma primeira carteira diversificada começa pela definição da alocação entre classes de ativos, alinhada ao seu perfil de risco e aos prazos dos seus objetivos — essa decisão vem antes de escolher ativos específicos.",
              "Dentro de cada classe, escolher um número razoável de ativos complementares (não necessariamente muitos) já traz a maior parte do benefício de diversificação disponível.",
              "A carteira não precisa (e não deve) ser montada de uma vez só — ir construindo aos poucos, com aportes regulares distribuídos entre as classes e ativos escolhidos, é uma abordagem prática e sustentável.",
            ],
            examples: [
              "Uma primeira carteira simples pode ter: reserva de emergência em Tesouro Selic/CDB, uma parte em Tesouro IPCA+ para médio/longo prazo, e uma pequena parcela em um fundo de ações diversificado, conforme o perfil.",
              "Ir aumentando gradualmente a diversificação (mais ativos, mais classes) à medida que o patrimônio cresce e o conhecimento aumenta, em vez de tentar montar tudo perfeito desde o primeiro aporte.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "1. Definir a alocação entre classes de ativos (conforme perfil e objetivos)",
                "2. Escolher um número razoável de ativos complementares dentro de cada classe",
                "3. Construir a carteira aos poucos, com aportes regulares",
                "4. Revisar e ajustar a diversificação à medida que o patrimônio e o conhecimento crescem",
              ],
            },
            keyConcepts: [
              "A alocação entre classes vem antes da escolha de ativos específicos.",
              "Um número razoável de ativos complementares já traz a maior parte do benefício.",
              "A carteira pode (e deve) ser construída aos poucos, não de uma vez.",
            ],
            quiz: [
              {
                question: "Qual deve ser a primeira decisão ao montar uma carteira diversificada?",
                options: [
                  "Escolher a ação mais popular do momento",
                  "Definir a alocação entre classes de ativos, alinhada ao perfil de risco e aos objetivos",
                  "Investir tudo de uma vez no primeiro ativo disponível",
                  "Esperar ter um valor muito alto para começar"
                ],
                correctIndex: 1,
                explanation: "A alocação entre classes é a decisão estrutural mais importante, e deve vir antes da escolha de ativos específicos dentro de cada classe.",
              },
            ],
            exercise: {
              prompt: "Esboce uma primeira alocação de carteira para você: que porcentagem em renda fixa, ações e FIIs faria sentido, considerando seu perfil e objetivos atuais?",
              placeholder: "Renda fixa: ...%\nAções: ...%\nFIIs: ...%\nOutros: ...%",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 10 — Como abrir conta em uma corretora
    // ---------------------------------------------------------------
    {
      id: "abrindo-conta-em-corretora",
      title: "Como abrir conta em uma corretora",
      description: "O passo prático antes de fazer seu primeiro investimento.",
      icon: "🖥️",
      lessons: [
        {
          id: lid("abrindo-conta-em-corretora", 1),
          title: "Corretora x banco: qual a diferença",
          content: {
            explanation: [
              "Bancos tradicionais costumam oferecer uma gama limitada de investimentos próprios, muitas vezes com taxas menos competitivas; corretoras de valores são especializadas em oferecer acesso a uma variedade maior de produtos de diferentes instituições.",
              "Investir através de uma corretora não significa abrir mão da segurança — o dinheiro e os ativos investidos ficam registrados em seu nome (CPF), não no nome da corretora, protegidos mesmo em caso de problemas com a instituição.",
              "Muitas corretoras oferecem taxa zero para diversos produtos (como Tesouro Direto e ações), tornando o acesso a uma carteira diversificada mais barato do que através de um banco tradicional.",
            ],
            examples: [
              "Um banco pode oferecer só os próprios CDBs, enquanto uma corretora dá acesso a CDBs de dezenas de bancos diferentes, além de Tesouro Direto, ações e fundos.",
              "Os ativos comprados através de uma corretora ficam custodiados na B3, registrados no CPF do investidor — não \"dentro\" da corretora.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Banco tradicional", items: ["Produtos próprios, geralmente limitados", "Taxas às vezes menos competitivas", "Conveniência de já ter conta lá"] },
              right: { label: "Corretora de valores", items: ["Acesso a produtos de várias instituições", "Muitas com taxa zero em diversos produtos", "Especializada em investimentos"] },
            },
            keyConcepts: [
              "Corretoras oferecem acesso a mais produtos e instituições que um banco tradicional.",
              "Ativos ficam registrados no CPF do investidor, protegidos mesmo em problemas com a corretora.",
              "Muitas corretoras oferecem taxa zero para diversos produtos.",
            ],
            quiz: [
              {
                question: "Se uma corretora enfrentasse problemas financeiros, o que aconteceria com os ativos que um investidor comprou através dela?",
                options: [
                  "Seriam perdidos junto com a corretora",
                  "Continuariam registrados no CPF do investidor, protegidos, já que a custódia é feita na B3",
                  "Seriam automaticamente transferidos para o governo",
                  "Só ações seriam protegidas, não outros ativos"
                ],
                correctIndex: 1,
                explanation: "A custódia dos ativos na B3, em nome do investidor (não da corretora), é justamente o que protege o patrimônio mesmo em problemas com a instituição intermediária.",
              },
            ],
            exercise: {
              prompt: "Compare os produtos de investimento oferecidos pelo seu banco atual com os de uma corretora de valores. Qual oferece mais opções?",
              placeholder: "Banco: produtos disponíveis: ...\nCorretora: produtos disponíveis: ...",
            },
          },
        },
        {
          id: lid("abrindo-conta-em-corretora", 2),
          title: "O que avaliar ao escolher uma corretora",
          content: {
            explanation: [
              "Ao escolher uma corretora, vale avaliar: as taxas cobradas (corretagem, custódia), a variedade de produtos disponíveis, a qualidade da plataforma (site/app) e a reputação da instituição.",
              "Muitas corretoras hoje oferecem corretagem zero para ações e taxa zero de custódia — mas vale confirmar isso especificamente para os produtos que você pretende usar, já que as condições podem variar.",
              "A segurança regulatória (a corretora precisa ser autorizada pela CVM e pelo Banco Central) é um requisito básico — verificar isso é rápido e evita cair em instituições não autorizadas.",
            ],
            examples: [
              "Duas corretoras podem oferecer taxa zero para ações, mas taxas diferentes para outros produtos — vale comparar especificamente o que você pretende usar mais.",
              "Verificar se a corretora está registrada na CVM é um passo simples de segurança antes de abrir conta.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Verificar se a corretora é autorizada pela CVM e Banco Central",
                "Comparar taxas dos produtos que você pretende usar",
                "Avaliar a variedade de produtos disponíveis",
                "Testar a plataforma (muitas permitem simular antes de decidir)",
              ],
            },
            keyConcepts: [
              "Avaliar taxas, variedade de produtos, plataforma e reputação.",
              "Confirmar taxa zero especificamente para os produtos que pretende usar.",
              "Verificar autorização da CVM e do Banco Central é um requisito básico de segurança.",
            ],
            quiz: [
              {
                question: "Qual verificação básica de segurança deve ser feita antes de abrir conta numa corretora?",
                options: [
                  "Nenhuma, todas as corretoras são iguais",
                  "Confirmar se ela é autorizada pela CVM e pelo Banco Central",
                  "Verificar se ela tem propaganda na TV",
                  "Confirmar se ela é a maior do país"
                ],
                correctIndex: 1,
                explanation: "A autorização regulatória é o requisito básico que garante que a instituição opera dentro das regras do mercado financeiro brasileiro.",
              },
            ],
            exercise: {
              prompt: "Pesquise 2-3 corretoras e compare as taxas e produtos oferecidos por cada uma, considerando o que você pretende investir.",
              placeholder: "Corretora 1: ...\nCorretora 2: ...\nMinha escolha provável: ...",
            },
          },
        },
        {
          id: lid("abrindo-conta-em-corretora", 3),
          title: "Passo a passo para abrir a conta",
          content: {
            explanation: [
              "O processo de abertura de conta numa corretora é feito totalmente online: cadastro com dados pessoais, envio de documentos (RG/CNH e comprovante de residência) e, em muitos casos, uma selfie para validação de identidade.",
              "Após o envio, a análise costuma levar de algumas horas a poucos dias úteis, dependendo da corretora — algumas aprovam contas quase instantaneamente.",
              "Com a conta aprovada, é necessário transferir dinheiro da conta bancária para a conta da corretora antes de poder comprar qualquer investimento.",
            ],
            examples: [
              "Preencher o cadastro com CPF, endereço e dados de renda, enviar foto do documento e aguardar a aprovação, tudo pelo aplicativo da corretora.",
              "Algumas corretoras aprovam a conta em minutos; outras podem levar 1-2 dias úteis para análise mais detalhada.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "1. Cadastro com dados pessoais (CPF, endereço, dados de renda)",
                "2. Envio de documentos (RG/CNH, comprovante de residência)",
                "3. Validação de identidade (selfie, em muitos casos)",
                "4. Aprovação da conta (horas a poucos dias úteis)",
                "5. Transferência de dinheiro para começar a investir",
              ],
            },
            keyConcepts: [
              "Processo totalmente online: cadastro, documentos, validação de identidade.",
              "Aprovação costuma levar de horas a poucos dias úteis.",
              "É necessário transferir dinheiro para a conta da corretora antes de investir.",
            ],
            quiz: [
              {
                question: "Quais documentos costumam ser exigidos para abrir conta numa corretora?",
                options: [
                  "Nenhum, o cadastro é só com nome",
                  "Documento de identidade (RG/CNH) e comprovante de residência, além de validação de identidade em muitos casos",
                  "Só o número do CPF",
                  "Certidão de nascimento apenas"
                ],
                correctIndex: 1,
                explanation: "Esses documentos são exigidos por regras de identificação de clientes (KYC) do mercado financeiro, para prevenir fraudes.",
              },
            ],
            exercise: {
              prompt: "Se você ainda não tem conta em corretora, inicie o processo de abertura numa corretora de sua escolha e anote em que etapa você está.",
              placeholder: "Corretora escolhida: ...\nEtapa atual do processo: ...",
            },
          },
        },
        {
          id: lid("abrindo-conta-em-corretora", 4),
          title: "Transferindo dinheiro para investir (TED/PIX)",
          content: {
            explanation: [
              "Para investir, é necessário transferir dinheiro da sua conta bancária para a conta da corretora — hoje, isso é feito majoritariamente via PIX, de forma instantânea e geralmente sem custo.",
              "O dinheiro transferido para a corretora fica disponível como \"saldo\" até que você decida em que investir — ele não rende nada parado nessa conta, então não vale deixá-lo lá por muito tempo sem aplicar.",
              "Para resgatar (trazer o dinheiro de volta para a conta bancária), o processo é o inverso: vender/resgatar o investimento na corretora e solicitar a transferência de volta, que também costuma ser rápida via PIX.",
            ],
            examples: [
              "Transferir R$ 500 via PIX da conta do banco para a corretora, disponível para investir em poucos minutos.",
              "Resgatar um Tesouro Selic e solicitar a transferência de volta para a conta bancária, recebendo o valor em até 1 dia útil, tipicamente.",
            ],
            keyConcepts: [
              "Transferência para a corretora, hoje, é feita majoritariamente via PIX, instantânea.",
              "Dinheiro parado como 'saldo' na corretora não rende nada — não vale deixar lá sem aplicar.",
              "Resgates costumam ser rápidos, geralmente em até 1 dia útil.",
            ],
            quiz: [
              {
                question: "O que acontece com o dinheiro transferido para a corretora que ainda não foi investido em nenhum produto específico?",
                options: [
                  "Rende automaticamente 100% do CDI",
                  "Fica como saldo disponível, sem render nada, até que seja efetivamente investido em algum produto",
                  "É investido automaticamente no Tesouro Selic",
                  "É devolvido automaticamente após 24 horas"
                ],
                correctIndex: 1,
                explanation: "É importante lembrar de efetivamente aplicar o dinheiro depois de transferido — ele não rende nada só \"parado\" na conta da corretora.",
              },
            ],
            exercise: {
              prompt: "Se você já tem conta numa corretora, verifique o processo de transferência (PIX/TED) e o prazo de resgate informado pela plataforma.",
              placeholder: "Processo de transferência: ...\nPrazo de resgate informado: ...",
            },
          },
        },
        {
          id: lid("abrindo-conta-em-corretora", 5),
          title: "Fazendo seu primeiro investimento",
          content: {
            explanation: [
              "Com a conta aberta e o dinheiro transferido, o primeiro investimento pode ser feito diretamente pela plataforma: escolher o produto (por exemplo, Tesouro Selic), definir o valor e confirmar a operação.",
              "Para um primeiro investimento, começar com um produto simples e de baixo risco (como Tesouro Selic ou um CDB de liquidez diária) ajuda a se familiarizar com o processo antes de partir para produtos mais complexos.",
              "Depois do primeiro investimento, acompanhar a posição na plataforma (sem necessidade de checar todos os dias) e seguir aportando regularmente é o que constrói o hábito de investir no longo prazo.",
            ],
            examples: [
              "Primeiro investimento: R$ 100 em Tesouro Selic, para se familiarizar com o processo de compra, acompanhamento e, eventualmente, resgate.",
              "Depois de se sentir confortável com o processo, expandir gradualmente para outros produtos, conforme os objetivos e o conhecimento crescem.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "1. Escolher um produto simples para começar (ex.: Tesouro Selic)",
                "2. Definir o valor a investir",
                "3. Confirmar a operação na plataforma",
                "4. Acompanhar a posição e seguir aportando regularmente",
              ],
            },
            keyConcepts: [
              "Começar com um produto simples e de baixo risco facilita a familiarização com o processo.",
              "Acompanhar a posição regularmente, sem necessidade de checar todos os dias.",
              "Aportar regularmente é o que constrói o hábito de investir no longo prazo.",
            ],
            quiz: [
              {
                question: "Por que começar com um produto simples e de baixo risco (como o Tesouro Selic) costuma ser uma boa estratégia para o primeiro investimento?",
                options: [
                  "Porque é o único produto disponível para iniciantes",
                  "Porque ajuda a se familiarizar com o processo de compra, acompanhamento e resgate, antes de partir para produtos mais complexos",
                  "Porque rende mais que qualquer outro produto",
                  "Porque é obrigatório por lei começar assim"
                ],
                correctIndex: 1,
                explanation: "Ganhar confiança no processo com um produto simples reduz a ansiedade e os erros antes de avançar para investimentos mais complexos.",
              },
            ],
            exercise: {
              prompt: "Se você ainda não fez seu primeiro investimento, defina um valor pequeno e um produto simples para começar essa semana. Se já investe, defina o próximo passo para expandir sua carteira.",
              placeholder: "Meu primeiro investimento (ou próximo passo): produto ... — valor R$ ...",
            },
          },
        },
      ],
    },
  ],
};
