import type { Trail } from "../types";

const trailId = "fundamentos";
const lid = (courseId: string, n: number) => `${trailId}.${courseId}.aula-${n}`;

export const fundamentosTrail: Trail = {
  id: trailId,
  title: "Fundamentos",
  description: "A base de tudo: entender dinheiro, receitas, despesas, orçamento e sua primeira reserva.",
  color: "green",
  courses: [
    // ---------------------------------------------------------------
    // Curso 1 — O que é dinheiro?
    // ---------------------------------------------------------------
    {
      id: "o-que-e-dinheiro",
      title: "O que é dinheiro?",
      description: "Antes de organizar suas finanças, vale entender o que o dinheiro realmente representa.",
      icon: "💵",
      lessons: [
        {
          id: lid("o-que-e-dinheiro", 1),
          title: "O que é dinheiro, afinal?",
          content: {
            explanation: [
              "Dinheiro é, antes de tudo, uma ferramenta de troca. Antes dele existir, as pessoas trocavam bens diretamente (escambo) — o que só funcionava se cada lado tivesse exatamente o que o outro queria, na hora certa.",
              "O dinheiro resolve esse problema porque tem três funções: é um meio de troca (todo mundo aceita), uma reserva de valor (guarda poder de compra para o futuro) e uma unidade de conta (permite comparar preços de coisas completamente diferentes).",
              "No fundo, dinheiro não vale nada por si só — um pedaço de papel ou um número na tela do banco. O que dá valor a ele é a confiança coletiva de que ele pode ser trocado por bens e serviços reais depois.",
            ],
            examples: [
              "Você troca uma hora do seu trabalho por um valor em reais, e depois troca esses reais por comida, aluguel ou lazer — sem precisar encontrar alguém que queira exatamente o que você produz.",
              "Comparar o preço de um curso online (R$ 200) com o de um jantar (R$ 200) só é possível porque os dois estão na mesma unidade de conta: reais.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Escambo: troca direta de bens (difícil de combinar interesses)",
                "Dinheiro: meio de troca aceito por todos",
                "Reserva de valor: guarda poder de compra pro futuro",
                "Unidade de conta: permite comparar preços diferentes",
              ],
            },
            keyConcepts: [
              "Meio de troca: o que permite comprar e vender sem escambo.",
              "Reserva de valor: guardar dinheiro hoje para usar depois.",
              "Unidade de conta: a régua comum para comparar preços.",
              "Confiança coletiva: o motivo real do dinheiro funcionar.",
            ],
            quiz: [
              {
                question: "Qual NÃO é uma função clássica do dinheiro?",
                options: ["Meio de troca", "Reserva de valor", "Unidade de conta", "Gerador de renda garantida"],
                correctIndex: 3,
                explanation: "Dinheiro parado não gera renda por si só — isso depende de onde ele é guardado ou investido, não é uma função do dinheiro em si.",
              },
              {
                question: "Por que o escambo é limitado como sistema de troca?",
                options: [
                  "Porque exige que os dois lados queiram exatamente o que o outro oferece, na hora certa",
                  "Porque é ilegal na maioria dos países",
                  "Porque só funciona com produtos agrícolas",
                  "Porque não existe mais desde a Idade Média",
                ],
                correctIndex: 0,
                explanation: "Esse é o problema clássico da 'dupla coincidência de desejos' que o dinheiro resolve.",
              },
            ],
            exercise: {
              prompt: "Pense em uma troca que você fez essa semana usando dinheiro (uma compra, um pagamento, um recebimento). Descreva rapidamente o que aconteceria se você tivesse que fazer essa mesma troca por escambo, sem dinheiro.",
              placeholder: "Ex.: Comprei um lanche por R$ 15. Sem dinheiro, eu precisaria achar alguém que quisesse trocar comida por algo que eu tenho...",
            },
          },
        },
        {
          id: lid("o-que-e-dinheiro", 2),
          title: "Como o dinheiro perde valor: inflação no dia a dia",
          content: {
            explanation: [
              "Inflação é o aumento geral dos preços ao longo do tempo. Na prática, isso significa que a mesma quantia de dinheiro compra menos coisas amanhã do que compra hoje.",
              "No Brasil, o índice de referência mais usado é o IPCA. Quando o governo ou o noticiário fala em 'a inflação foi de 4% no ano', é normalmente esse índice.",
              "Isso tem uma consequência prática importante: dinheiro parado (numa gaveta, ou numa conta que não rende nada) perde poder de compra todo santo ano, mesmo que o número na conta continue igual.",
            ],
            examples: [
              "Se um lanche custava R$ 20 no ano passado e hoje custa R$ 22, isso é uma inflação de 10% nesse item específico.",
              "R$ 1.000 guardados debaixo do colchão por 5 anos, com inflação média de 5% ao ano, compram bem menos coisas no final do que compravam no início — mesmo o número '1.000' não tendo mudado.",
            ],
            diagram: {
              type: "bars",
              caption: "Poder de compra de R$ 1.000 guardados parados, com inflação de 5% ao ano",
              bars: [
                { label: "Hoje", value: 1000, suffix: " (poder de compra real)" },
                { label: "Em 1 ano", value: 952 },
                { label: "Em 3 anos", value: 864 },
                { label: "Em 5 anos", value: 784 },
              ],
            },
            keyConcepts: [
              "Inflação: aumento geral dos preços ao longo do tempo.",
              "IPCA: o índice de inflação de referência no Brasil.",
              "Poder de compra: quanto o seu dinheiro realmente compra.",
              "Dinheiro parado perde valor real mesmo sem 'sumir' nominalmente.",
            ],
            quiz: [
              {
                question: "O que acontece com R$ 1.000 guardados parados (sem render nada) ao longo de anos com inflação positiva?",
                options: [
                  "O valor em reais some da conta",
                  "O poder de compra desse valor diminui, mesmo o número continuando '1.000'",
                  "Nada muda, dinheiro parado nunca perde valor",
                  "O valor cresce automaticamente para acompanhar os preços",
                ],
                correctIndex: 1,
                explanation: "O número nominal não muda, mas compra cada vez menos coisas — essa é a perda de poder de compra causada pela inflação.",
              },
            ],
            exercise: {
              prompt: "Pense em um produto que você compra com frequência (um lanche, um serviço de streaming, uma passagem de ônibus). Se possível, compare o preço dele hoje com o preço de alguns anos atrás e anote o que percebeu.",
              placeholder: "Ex.: O quilo do arroz que eu comprava por R$ 4 há 2 anos hoje custa R$ 6...",
            },
          },
        },
        {
          id: lid("o-que-e-dinheiro", 3),
          title: "Dinheiro físico, digital e PIX",
          content: {
            explanation: [
              "Hoje o dinheiro existe em várias formas: cédulas e moedas (físico), saldo em conta bancária (escritural, um número no sistema do banco) e, no Brasil, o PIX — um sistema de pagamento instantâneo que move esse saldo digital entre contas em segundos.",
              "Na prática, a maior parte do dinheiro que circula não é papel-moeda — é só um registro digital sendo movido entre instituições. Isso não muda o valor do dinheiro, mas muda MUITO a velocidade e o custo de movimentar ele.",
              "Essa facilidade também tem um lado de atenção: pagar com PIX ou cartão 'dói' menos psicologicamente do que pagar em dinheiro vivo, o que pode facilitar gastar sem perceber o tanto que já foi gasto no mês.",
            ],
            examples: [
              "Antes do PIX, uma transferência entre bancos diferentes podia levar até 1 dia útil (TED) ou custar taxa (DOC). Hoje ela é instantânea e geralmente gratuita para pessoa física.",
              "Pagar R$ 150 em espécie costuma gerar mais hesitação do que pagar os mesmos R$ 150 no cartão ou PIX — mesmo sendo exatamente o mesmo valor saindo do bolso.",
            ],
            keyConcepts: [
              "Dinheiro físico: cédulas e moedas.",
              "Dinheiro escritural: saldo registrado digitalmente em conta.",
              "PIX: sistema brasileiro de pagamento instantâneo entre contas.",
              "'Dor de pagar': o desconforto psicológico de ver o dinheiro sair — menor em pagamentos digitais.",
            ],
            quiz: [
              {
                question: "Por que pagamentos digitais (PIX, cartão) podem facilitar gastar mais do que se pretendia?",
                options: [
                  "Porque cobram taxas menores",
                  "Porque a 'dor de pagar' é psicologicamente menor do que entregar dinheiro em espécie",
                  "Porque são mais lentos e dão tempo de repensar",
                  "Porque exigem senha, o que os torna mais seguros",
                ],
                correctIndex: 1,
                explanation: "Estudos de comportamento financeiro mostram que meios de pagamento 'invisíveis' reduzem a percepção do gasto no momento da compra.",
              },
            ],
            exercise: {
              prompt: "Nos últimos 7 dias, quantos dos seus pagamentos foram em dinheiro físico e quantos foram digitais (PIX/cartão)? Anote uma estimativa e se isso mudou sua percepção de quanto você gasta.",
              placeholder: "Ex.: Quase tudo foi PIX ou cartão, só 1 pagamento em dinheiro. Percebi que...",
            },
          },
        },
        {
          id: lid("o-que-e-dinheiro", 4),
          title: "Preço, valor e a ilusão do 'caro' e 'barato'",
          content: {
            explanation: [
              "Preço é o número que você paga. Valor é o quanto aquilo realmente vale para você — a utilidade, a durabilidade, o quanto resolve um problema seu. As duas coisas nem sempre andam juntas.",
              "'Caro' e 'barato' são relativos ao contexto: um item pode ser caro em termos absolutos, mas barato considerando o quanto de uso ou benefício ele entrega ao longo do tempo (e vice-versa).",
              "Uma forma prática de comparar é pensar no custo por uso ou custo por tempo, em vez de olhar só o preço total na etiqueta.",
            ],
            examples: [
              "Um par de tênis de R$ 400 que dura 3 anos pode ser mais barato, no fim das contas, do que um de R$ 150 que dura 4 meses e precisa ser trocado repetidamente.",
              "Uma assinatura de R$ 30/mês parece pequena isoladamente, mas em um ano são R$ 360 — o mesmo preço de um eletrodoméstico.",
            ],
            diagram: {
              type: "formula",
              formula: "Custo por uso = Preço ÷ Número de vezes que será usado (ou tempo de duração)",
              caption: "Uma forma mais justa de comparar 'caro' e 'barato' do que só olhar o preço total.",
            },
            keyConcepts: [
              "Preço: o número pago no momento da compra.",
              "Valor: o benefício real que algo entrega pra você.",
              "Custo por uso: preço dividido pela quantidade de uso/duração.",
              "Gasto recorrente pequeno pode superar um gasto único grande ao longo do tempo.",
            ],
            quiz: [
              {
                question: "Por que 'custo por uso' costuma ser uma comparação mais justa do que o preço total?",
                options: [
                  "Porque itens mais caros são sempre melhores",
                  "Porque leva em conta quanto tempo ou quantas vezes o item será usado, não só o valor pago de uma vez",
                  "Porque ignora completamente o preço",
                  "Porque só se aplica a roupas e calçados",
                ],
                correctIndex: 1,
                explanation: "Dividir o preço pelo uso esperado mostra o custo real por vez/dia, o que muda bastante a percepção de 'caro' vs 'barato'.",
              },
            ],
            exercise: {
              prompt: "Pense em uma compra recente que pareceu 'cara' no momento. Calcule (mesmo que aproximadamente) o custo por uso dela e anote se isso muda como você vê aquela compra.",
              placeholder: "Ex.: Comprei um liquidificador de R$ 300. Uso 3x por semana, deve durar uns 5 anos, então...",
            },
          },
        },
        {
          id: lid("o-que-e-dinheiro", 5),
          title: "Sua relação pessoal com o dinheiro",
          content: {
            explanation: [
              "Antes de qualquer planilha ou orçamento, vale entender como você foi criado(a) para pensar sobre dinheiro. Essas crenças (às vezes nem conscientes) influenciam decisões financeiras muito mais do que a maioria das pessoas percebe.",
              "Algumas crenças comuns: 'dinheiro é a raiz de todo mal', 'falar de dinheiro é deselegante', 'quem tem dinheiro é ganancioso', ou no outro extremo, 'dinheiro resolve tudo'. Nenhuma dessas é totalmente verdadeira nem totalmente falsa — mas todas afetam comportamento.",
              "Reconhecer sua própria relação com o dinheiro (ansiedade, evitação, controle excessivo, gastos por impulso emocional) é o primeiro passo real antes de qualquer método de orçamento funcionar de verdade — método sem autoconhecimento tende a durar pouco.",
            ],
            examples: [
              "Alguém que cresceu ouvindo 'nunca vai ter dinheiro sobrando' pode inconscientemente sabotar reservas que crescem, gastando o extra assim que ele aparece.",
              "Alguém que associa dinheiro a segurança emocional pode ter dificuldade de gastar mesmo quando tem condições, gerando ansiedade desnecessária.",
            ],
            keyConcepts: [
              "Crenças financeiras: ideias (muitas vezes herdadas da infância) sobre o que dinheiro significa.",
              "Gasto emocional: comprar para lidar com sentimentos, não por necessidade real.",
              "Autoconhecimento financeiro: entender seus próprios padrões antes de tentar mudá-los.",
            ],
            quiz: [
              {
                question: "Por que entender a própria relação com o dinheiro é útil antes de adotar um método de orçamento?",
                options: [
                  "Porque não é útil, só a matemática importa",
                  "Porque crenças e hábitos emocionais influenciam se um método vai realmente ser seguido no dia a dia",
                  "Porque todo mundo tem a mesma relação com dinheiro",
                  "Porque isso substitui a necessidade de acompanhar gastos",
                ],
                correctIndex: 1,
                explanation: "Um método tecnicamente correto que ignora padrões de comportamento tende a ser abandonado — por isso autoconhecimento vem antes da planilha.",
              },
            ],
            exercise: {
              prompt: "Complete a frase: 'Para mim, dinheiro representa...' e escreva 2-3 frases sobre de onde você acha que veio essa ideia (família, experiências, cultura).",
              placeholder: "Para mim, dinheiro representa... Acho que isso vem de...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 2 — Receitas e despesas
    // ---------------------------------------------------------------
    {
      id: "receitas-e-despesas",
      title: "Receitas e despesas",
      description: "O par que define sua vida financeira: o que entra e o que sai.",
      icon: "🔁",
      lessons: [
        {
          id: lid("receitas-e-despesas", 1),
          title: "O que são receitas",
          content: {
            explanation: [
              "Receita é todo dinheiro que entra para você: salário, freelas, pró-labore, aluguéis recebidos, rendimentos de investimentos, presentes em dinheiro. Se entrou, é receita.",
              "Vale separar receitas fixas (previsíveis, tipo salário) de receitas variáveis (freelas, comissões, bônus) — elas exigem estratégias diferentes de planejamento, porque uma é confiável mês a mês e a outra não.",
              "Um erro comum é planejar o orçamento com base na receita 'boa' (o mês em que ganhou mais), quando o mais seguro é planejar com base na receita mínima esperada.",
            ],
            examples: [
              "Um salário CLT de R$ 3.000 fixo por mês é receita fixa.",
              "Um designer freelancer que fatura entre R$ 1.500 e R$ 4.000 por mês, dependendo dos projetos, tem receita variável.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Receita fixa", items: ["Salário CLT", "Aposentadoria", "Aluguel recebido com contrato"] },
              right: { label: "Receita variável", items: ["Freelas", "Comissões de vendas", "Bônus e PLR"] },
            },
            keyConcepts: [
              "Receita: todo dinheiro que entra.",
              "Receita fixa: previsível, se repete todo mês.",
              "Receita variável: muda de valor (ou pode não existir) mês a mês.",
              "Planejar pelo pior mês de receita variável, não pelo melhor.",
            ],
            quiz: [
              {
                question: "Por que é mais seguro planejar o orçamento com base na receita MÍNIMA esperada, quando ela é variável?",
                options: [
                  "Porque assim você sempre vai ter dinheiro sobrando nos meses bons",
                  "Porque é ilegal planejar com receita alta",
                  "Porque a receita variável nunca deve ser contada",
                  "Porque bancos exigem isso",
                ],
                correctIndex: 0,
                explanation: "Planejar pelo piso evita compromissos que quebram o orçamento nos meses fracos — e o que sobra nos meses bons vira reserva ou meta.",
              },
            ],
            exercise: {
              prompt: "Liste suas fontes de receita atuais e marque quais são fixas e quais são variáveis.",
              placeholder: "Ex.: Salário CLT (fixa) - R$ ...; Freelas (variável) - média R$ ...",
            },
          },
        },
        {
          id: lid("receitas-e-despesas", 2),
          title: "O que são despesas",
          content: {
            explanation: [
              "Despesa é todo dinheiro que sai: aluguel, contas, alimentação, transporte, lazer, assinaturas. Parece óbvio, mas a maioria das pessoas não sabe o total real das próprias despesas até registrar tudo por um mês inteiro.",
              "Despesas pequenas e recorrentes (cafés, apps, assinaturas) costumam pesar mais no total do que uma única compra grande, exatamente por se repetirem sem serem percebidas.",
              "O objetivo de mapear despesas não é se sentir mal por gastar — é ter clareza para decidir onde vale a pena cortar e onde vale a pena manter.",
            ],
            examples: [
              "Aluguel de R$ 1.200/mês é uma despesa fixa e grande, fácil de perceber.",
              "Três assinaturas de streaming de R$ 25 cada somam R$ 75/mês (R$ 900/ano) — um valor que raramente é percebido como 'um gasto grande'.",
            ],
            keyConcepts: [
              "Despesa: todo dinheiro que sai.",
              "Gastos pequenos e recorrentes somam mais do que parecem isoladamente.",
              "Mapear despesas é sobre clareza, não sobre culpa.",
            ],
            quiz: [
              {
                question: "Por que despesas pequenas e recorrentes costumam ser subestimadas?",
                options: [
                  "Porque não aparecem no extrato bancário",
                  "Porque, isoladas, parecem pequenas demais para chamar atenção — mas se repetem todo mês",
                  "Porque bancos escondem essas informações",
                  "Porque só afetam pessoas de baixa renda",
                ],
                correctIndex: 1,
                explanation: "É o efeito de 'morte por mil cortes': cada gasto pequeno parece insignificante, mas a soma deles pode ser um dos maiores blocos do orçamento.",
              },
            ],
            exercise: {
              prompt: "Liste 3 despesas pequenas e recorrentes que você tem (assinaturas, apps, cafés) e calcule quanto elas somam por mês e por ano.",
              placeholder: "Ex.: Streaming R$ 25 + academia R$ 90 + app de música R$ 20 = R$ 135/mês = R$ 1.620/ano",
            },
          },
        },
        {
          id: lid("receitas-e-despesas", 3),
          title: "Despesas fixas x variáveis",
          content: {
            explanation: [
              "Despesas fixas são aquelas com valor (aproximadamente) igual todo mês: aluguel, financiamento, mensalidade escolar, assinaturas. Elas são mais fáceis de prever, mas também mais difíceis de cortar rapidamente.",
              "Despesas variáveis mudam de valor mês a mês: alimentação, combustível, lazer, compras avulsas. São mais fáceis de ajustar no curto prazo quando o orçamento aperta.",
              "Saber separar as duas ajuda a responder uma pergunta prática: 'se eu precisar cortar gastos este mês, onde eu tenho margem de manobra real?' — normalmente é nas variáveis, não nas fixas.",
            ],
            examples: [
              "Aluguel (R$ 1.200 fixo) x conta de energia (varia entre R$ 80 e R$ 180 dependendo do consumo e da estação).",
              "Mensalidade da academia (fixa) x gastos com delivery (totalmente variável, depende da escolha do mês).",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Despesas fixas", items: ["Aluguel/financiamento", "Mensalidades e assinaturas", "Seguro"] },
              right: { label: "Despesas variáveis", items: ["Alimentação", "Lazer", "Combustível/transporte avulso"] },
            },
            keyConcepts: [
              "Despesa fixa: valor estável mês a mês.",
              "Despesa variável: valor muda conforme o consumo/escolha.",
              "Margem de ajuste rápido normalmente está nas despesas variáveis.",
            ],
            quiz: [
              {
                question: "Em um mês apertado, onde geralmente é mais fácil encontrar margem para cortar gastos rapidamente?",
                options: ["Nas despesas fixas", "Nas despesas variáveis", "Não há diferença", "Só é possível cortar receita"],
                correctIndex: 1,
                explanation: "Despesas variáveis (lazer, delivery, compras avulsas) podem ser reduzidas no mesmo mês; despesas fixas normalmente exigem renegociação ou tempo para mudar.",
              },
            ],
            exercise: {
              prompt: "Separe suas 5 maiores despesas do mês em fixas e variáveis.",
              placeholder: "Fixas: ...\nVariáveis: ...",
            },
          },
        },
        {
          id: lid("receitas-e-despesas", 4),
          title: "Despesas essenciais x supérfluas",
          content: {
            explanation: [
              "Essenciais são despesas necessárias para viver e trabalhar: moradia, alimentação básica, transporte, saúde. Supérfluas são desejos e conforto: lazer, compras não essenciais, upgrades.",
              "Essa linha não é igual pra todo mundo, nem fixa no tempo: internet, por exemplo, é essencial para quem trabalha remoto e pode ser supérflua em outro contexto.",
              "O objetivo de separar essencial de supérfluo não é eliminar tudo que é supérfluo — é decidir CONSCIENTEMENTE quanto espaço no orçamento cada categoria merece, em vez de deixar isso acontecer no automático.",
            ],
            examples: [
              "Alimentação em casa é essencial; jantar fora todo fim de semana é, na maior parte dos casos, supérfluo (ainda que legítimo, se cabe no orçamento).",
              "Um plano de celular básico é essencial para a maioria; o modelo mais caro do mercado, sem necessidade funcional adicional, é supérfluo.",
            ],
            keyConcepts: [
              "Essencial: necessário para viver e trabalhar.",
              "Supérfluo: desejo, conforto, não é estritamente necessário.",
              "A linha entre os dois muda de pessoa para pessoa e de contexto para contexto.",
              "O objetivo é decisão consciente, não eliminação total do supérfluo.",
            ],
            quiz: [
              {
                question: "Por que a linha entre 'essencial' e 'supérfluo' pode variar entre pessoas diferentes?",
                options: [
                  "Porque não existe uma definição real",
                  "Porque depende do contexto de vida e trabalho de cada um (ex.: internet essencial para quem trabalha remoto)",
                  "Porque só existe para pessoas ricas",
                  "Porque é definida pelo governo",
                ],
                correctIndex: 1,
                explanation: "O mesmo item pode ser essencial pra uma pessoa e supérfluo pra outra, dependendo de como ele se encaixa na rotina e no trabalho de cada uma.",
              },
            ],
            exercise: {
              prompt: "Revise suas despesas do último mês e classifique 5 delas como essenciais ou supérfluas. Alguma te surpreendeu?",
              placeholder: "Ex.: Assinatura de streaming — supérflua, mas eu uso bastante e cabe no orçamento, então mantenho...",
            },
          },
        },
        {
          id: lid("receitas-e-despesas", 5),
          title: "Calculando seu saldo real",
          content: {
            explanation: [
              "Saldo é simplesmente receitas menos despesas em um período. Parece óbvio, mas muita gente nunca calculou esse número com precisão — só tem uma sensação vaga de 'sobra' ou 'aperta'.",
              "O saldo real deve considerar TODAS as receitas e TODAS as despesas do período, inclusive as pequenas e recorrentes que passam despercebidas (é aí que mora a maior parte dos erros de cálculo).",
              "Um saldo positivo constante é o que permite construir reserva, atingir metas e eventualmente investir. Um saldo negativo constante é sinal de alerta que precisa de ação — cortar despesa, aumentar receita, ou os dois.",
            ],
            examples: [
              "Receitas de R$ 3.500 e despesas de R$ 3.100 no mês = saldo de R$ 400.",
              "Duas pessoas com a mesma receita podem ter saldos completamente diferentes dependendo de como administram as despesas.",
            ],
            diagram: {
              type: "formula",
              formula: "Saldo = Total de receitas do período − Total de despesas do período",
              caption: "O cálculo mais importante de toda a vida financeira pessoal.",
            },
            keyConcepts: [
              "Saldo: receitas menos despesas em um período.",
              "Saldo positivo constante: base para reserva, metas e investimentos.",
              "Saldo negativo constante: sinal de que algo precisa mudar (despesa, receita, ou ambos).",
            ],
            quiz: [
              {
                question: "Qual é a fórmula do saldo do período?",
                options: [
                  "Receitas × Despesas",
                  "Receitas − Despesas",
                  "Despesas − Receitas",
                  "Receitas ÷ Despesas",
                ],
                correctIndex: 1,
                explanation: "Saldo é sempre o que entrou menos o que saiu no período considerado.",
              },
            ],
            exercise: {
              prompt: "Calcule seu saldo real do mês passado: some todas as receitas, some todas as despesas, e subtraia. Se você já usa o Mind Money, confira esse número no Dashboard e compare com sua estimativa antes de olhar.",
              placeholder: "Total de receitas: R$ ...\nTotal de despesas: R$ ...\nSaldo: R$ ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 3 — Como montar um orçamento
    // ---------------------------------------------------------------
    {
      id: "como-montar-um-orcamento",
      title: "Como montar um orçamento",
      description: "Transformar receitas e despesas em um plano de verdade para o seu dinheiro.",
      icon: "📝",
      lessons: [
        {
          id: lid("como-montar-um-orcamento", 1),
          title: "Por que ter um orçamento",
          content: {
            explanation: [
              "Orçamento é um plano para o seu dinheiro: quanto entra, para onde vai, e quanto sobra. Sem ele, o dinheiro tende a 'sumir' sem uma explicação clara — a sensação de 'não sei pra onde foi meu salário' é o sintoma clássico de não ter um orçamento.",
              "Um orçamento não é uma prisão financeira nem elimina toda a espontaneidade — é o oposto: dá liberdade para gastar com tranquilidade nas categorias planejadas, porque você já sabe que o essencial está coberto.",
              "Pessoas com orçamento não gastam necessariamente menos do que quem não tem — mas gastam com intenção, o que tende a gerar bem mais satisfação e menos culpa ou surpresa desagradável.",
            ],
            examples: [
              "Sem orçamento: 'Não sei como cheguei no fim do mês sem dinheiro de novo.'",
              "Com orçamento: 'Eu sabia que teria R$ 300 pra lazer esse mês, gastei R$ 280 e me senti bem com isso.'",
            ],
            keyConcepts: [
              "Orçamento: plano para receitas e despesas de um período.",
              "Orçamento dá liberdade consciente, não é uma restrição rígida.",
              "O objetivo é gastar com intenção, não necessariamente gastar menos.",
            ],
            quiz: [
              {
                question: "Qual é o principal benefício de ter um orçamento, segundo essa aula?",
                options: [
                  "Gastar sempre o mínimo possível",
                  "Gastar com intenção e clareza, sabendo que o essencial está coberto",
                  "Nunca mais gastar com lazer",
                  "Eliminar a necessidade de acompanhar as finanças",
                ],
                correctIndex: 1,
                explanation: "Orçamento é sobre intencionalidade, não sobre privação — ele permite gastar com tranquilidade dentro do que foi planejado.",
              },
            ],
            exercise: {
              prompt: "Sem consultar nada, tente estimar de cabeça quanto você gastou no mês passado. Depois, anote: você acha que essa estimativa está próxima da realidade ou não?",
              placeholder: "Minha estimativa: R$ ... Acho que está próxima/longe da realidade porque...",
            },
          },
        },
        {
          id: lid("como-montar-um-orcamento", 2),
          title: "O método 50/30/20",
          content: {
            explanation: [
              "O método 50/30/20 é uma forma simples de dividir a renda líquida em três blocos: 50% para necessidades essenciais, 30% para desejos (lazer, estilo de vida) e 20% para poupança e quitação de dívidas.",
              "Não é uma regra rígida ou universal — é um ponto de partida. Quem tem custo de vida muito alto em relação à renda pode precisar de uma divisão diferente (tipo 70/20/10) até reequilibrar a situação.",
              "O valor do método está em dar uma estrutura simples de decidir, sem precisar categorizar cada centavo desde o primeiro dia — dá para refinar depois que o hábito de acompanhar já existe.",
            ],
            examples: [
              "Renda líquida de R$ 4.000: até R$ 2.000 em essenciais, até R$ 1.200 em desejos, pelo menos R$ 800 em poupança/dívidas.",
              "Alguém com aluguel muito alto pode precisar usar 65% em essenciais temporariamente, reduzindo a fatia de desejos até a situação melhorar.",
            ],
            diagram: {
              type: "bars",
              caption: "Divisão do método 50/30/20 sobre uma renda líquida de R$ 4.000",
              bars: [
                { label: "Essenciais (50%)", value: 2000 },
                { label: "Desejos (30%)", value: 1200 },
                { label: "Poupança/dívidas (20%)", value: 800 },
              ],
            },
            keyConcepts: [
              "50% para necessidades essenciais.",
              "30% para desejos e estilo de vida.",
              "20% para poupança e quitação de dívidas.",
              "É um ponto de partida, não uma regra fixa e universal.",
            ],
            quiz: [
              {
                question: "No método 50/30/20, qual fatia é reservada para poupança e dívidas?",
                options: ["50%", "30%", "20%", "10%"],
                correctIndex: 2,
                explanation: "20% da renda líquida é a fatia sugerida para poupança e quitação de dívidas nesse método.",
              },
              {
                question: "Por que o 50/30/20 é considerado um 'ponto de partida' e não uma regra fixa?",
                options: [
                  "Porque é apenas uma sugestão de marketing sem embasamento",
                  "Porque situações com custo de vida muito alto em relação à renda podem precisar de outra proporção",
                  "Porque só funciona para quem ganha acima de R$ 10.000",
                  "Porque ele muda todo mês automaticamente",
                ],
                correctIndex: 1,
                explanation: "A proporção ideal depende da realidade de cada pessoa — o método é um guia simples, ajustável conforme a situação.",
              },
            ],
            exercise: {
              prompt: "Aplique o 50/30/20 na sua renda líquida mensal: calcule os três valores e compare com o que você realmente gasta hoje em cada bloco.",
              placeholder: "Renda líquida: R$ ...\n50% essenciais: R$ ...\n30% desejos: R$ ...\n20% poupança/dívidas: R$ ...",
            },
          },
        },
        {
          id: lid("como-montar-um-orcamento", 3),
          title: "Montando seu orçamento passo a passo",
          content: {
            explanation: [
              "O primeiro passo prático é registrar tudo que entra e sai por pelo menos um mês inteiro, sem tentar mudar comportamento ainda — só observar a realidade como ela é.",
              "Depois, agrupe as despesas em categorias (moradia, alimentação, transporte, lazer, assinaturas...) e some cada uma. Só com esses totais reais é que faz sentido definir limites.",
              "Por fim, defina um limite (meta) para cada categoria com base no que você observou e no que faz sentido pra sua renda — não em números aleatórios ou no que 'deveria' ser.",
            ],
            examples: [
              "Mês 1: só registrar tudo, sem julgar. Mês 2: já com os totais reais em mãos, definir limites por categoria.",
              "Descobrir que 'lazer' consumiu R$ 600 quando a intenção era R$ 300 é informação valiosa — só existe DEPOIS de registrar de verdade.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "1. Registrar tudo por um mês, sem julgar",
                "2. Agrupar despesas em categorias e somar cada uma",
                "3. Definir um limite realista por categoria",
                "4. Acompanhar o mês seguinte comparando com esse limite",
              ],
            },
            keyConcepts: [
              "Primeiro observar a realidade, só depois definir limites.",
              "Categorizar despesas revela padrões escondidos no extrato bruto.",
              "Limites devem ser baseados em dados reais, não em números arbitrários.",
            ],
            quiz: [
              {
                question: "Qual deve ser o primeiro passo prático ao montar um orçamento do zero?",
                options: [
                  "Definir limites rígidos antes de qualquer registro",
                  "Registrar tudo que entra e sai por pelo menos um mês, sem julgar",
                  "Cortar imediatamente todos os gastos com lazer",
                  "Abrir uma conta de investimento",
                ],
                correctIndex: 1,
                explanation: "Sem dados reais de um período de observação, qualquer limite definido de antemão tende a ser irrealista.",
              },
            ],
            exercise: {
              prompt: "Se você ainda não fez isso, use o Mind Money (ou um caderno/planilha) para registrar todas as suas transações do mês corrente. Ao fim do mês, volte aqui e anote qual categoria mais te surpreendeu.",
              placeholder: "A categoria que mais me surpreendeu foi... porque eu esperava gastar R$ ... e gastei R$ ...",
            },
          },
        },
        {
          id: lid("como-montar-um-orcamento", 4),
          title: "Ajustando o orçamento à realidade",
          content: {
            explanation: [
              "É normal que o primeiro orçamento não 'feche' — ou seja, que as despesas planejadas somem mais do que a receita disponível. Isso não é fracasso, é informação: mostra onde o ajuste precisa acontecer.",
              "Existem só dois caminhos para fechar um orçamento que não fecha: reduzir despesas (cortar ou renegociar) ou aumentar receita (novo trabalho, freela, venda de itens parados). Às vezes os dois ao mesmo tempo.",
              "Prioridade prática: ajustar primeiro despesas variáveis (mais fácil e rápido) antes de mexer em despesas fixas (que normalmente exigem mais tempo e negociação, como trocar de plano ou renegociar aluguel).",
            ],
            examples: [
              "Se o orçamento planejado tem R$ 200 de déficit, uma opção é reduzir R$ 200 em lazer/delivery esse mês, sem mexer no aluguel.",
              "Se o corte de despesas variáveis não é suficiente, pode ser hora de olhar despesas fixas: trocar de plano de internet, renegociar seguro, etc.",
            ],
            keyConcepts: [
              "Orçamento que não fecha na primeira tentativa é normal, não é fracasso.",
              "Dois caminhos: reduzir despesa ou aumentar receita.",
              "Ajustar despesas variáveis primeiro, por serem mais rápidas de mudar.",
            ],
            quiz: [
              {
                question: "Quando um orçamento inicial não fecha (despesas > receita), qual costuma ser o ajuste mais rápido?",
                options: [
                  "Trocar de emprego imediatamente",
                  "Reduzir despesas variáveis, que são mais fáceis de ajustar no curto prazo",
                  "Ignorar o problema até o próximo mês",
                  "Aumentar o limite do cartão de crédito",
                ],
                correctIndex: 1,
                explanation: "Despesas variáveis (lazer, delivery, compras avulsas) podem ser cortadas quase imediatamente; despesas fixas exigem mais tempo para renegociar.",
              },
            ],
            exercise: {
              prompt: "Se o seu orçamento atual não fecha, liste 2 despesas variáveis que você poderia reduzir esse mês e o quanto isso liberaria.",
              placeholder: "1. ... — economizaria R$ ...\n2. ... — economizaria R$ ...",
            },
          },
        },
        {
          id: lid("como-montar-um-orcamento", 5),
          title: "Revisando o orçamento todo mês",
          content: {
            explanation: [
              "Orçamento não é feito uma vez e esquecido — é revisado mês a mês, comparando o planejado com o realizado. Vida muda, renda muda, prioridades mudam, e o orçamento precisa acompanhar isso.",
              "A revisão mensal é o momento de perguntar: 'onde eu estourei o limite? Por quê? Foi um imprevisto pontual ou um padrão que vai se repetir?' — essa distinção importa para decidir se ajusta o limite ou o comportamento.",
              "Com o tempo, essa revisão fica rápida (poucos minutos) porque você já conhece seus próprios padrões — o trabalho pesado é só no início, quando tudo ainda é novidade.",
            ],
            examples: [
              "Estourar o limite de 'saúde' porque teve uma consulta médica inesperada é pontual — não precisa mudar o limite permanentemente.",
              "Estourar o limite de 'delivery' três meses seguidos é um padrão — talvez o limite esteja irrealista, ou o comportamento precise mudar.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Fim do mês: comparar planejado x realizado, categoria por categoria",
                "Identificar onde estourou (e se foi pontual ou recorrente)",
                "Ajustar o limite OU o comportamento, conforme o caso",
                "Repetir todo mês — a revisão fica cada vez mais rápida",
              ],
            },
            keyConcepts: [
              "Orçamento é revisado, não é feito uma única vez.",
              "Distinguir estouro pontual de padrão recorrente muda a ação a tomar.",
              "A revisão fica mais rápida com o tempo, à medida que você conhece seus padrões.",
            ],
            quiz: [
              {
                question: "Se uma categoria estoura o limite 3 meses seguidos, o que isso provavelmente indica?",
                options: [
                  "Um imprevisto pontual sem importância",
                  "Um padrão recorrente que pede ajuste no limite ou no comportamento",
                  "Um erro do banco",
                  "Que o orçamento deve ser abandonado",
                ],
                correctIndex: 1,
                explanation: "Um estouro repetido não é acaso — é sinal de que o limite está irrealista ou o comportamento precisa de atenção real.",
              },
            ],
            exercise: {
              prompt: "Escolha um dia fixo do mês (ex.: todo dia 1º) para revisar seu orçamento do mês anterior. Anote aqui qual dia você escolheu e um lembrete de por que esse compromisso importa para você.",
              placeholder: "Vou revisar meu orçamento todo dia... porque...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 4 — Controle de gastos
    // ---------------------------------------------------------------
    {
      id: "controle-de-gastos",
      title: "Controle de gastos",
      description: "Pequenos hábitos de registro e revisão que fazem a maior diferença no longo prazo.",
      icon: "🔍",
      lessons: [
        {
          id: lid("controle-de-gastos", 1),
          title: "Por que perdemos o controle sem perceber",
          content: {
            explanation: [
              "A maior parte dos problemas financeiros não vem de uma única decisão ruim e grande — vem de muitos gastos pequenos e recorrentes que passam despercebidos, um de cada vez.",
              "Isso acontece porque o cérebro humano não é bom em somar mentalmente pequenos valores ao longo do tempo — cada gasto de R$ 15, R$ 30, R$ 50 parece isoladamente insignificante.",
              "Controlar gastos não é sobre nunca gastar — é sobre gastar de forma consciente, sabendo o impacto real de cada decisão no restante do mês.",
            ],
            examples: [
              "Um café de R$ 8 todo dia útil soma R$ 176/mês — um valor que raramente é percebido como 'gasto relevante' isoladamente.",
              "Compras por impulso de R$ 30-50 no app de delivery, algumas vezes por semana, somam mais do que uma compra planejada e maior no fim do mês.",
            ],
            keyConcepts: [
              "Problemas financeiros normalmente vêm de gastos pequenos e recorrentes, não de uma única decisão grande.",
              "O cérebro subestima a soma de pequenos gastos ao longo do tempo.",
              "Controle de gastos é sobre consciência, não sobre privação total.",
            ],
            quiz: [
              {
                question: "Segundo essa aula, de onde normalmente vêm os maiores problemas financeiros?",
                options: [
                  "De uma única compra grande e planejada",
                  "De muitos gastos pequenos e recorrentes que passam despercebidos",
                  "Exclusivamente de dívidas de cartão de crédito",
                  "De impostos altos",
                ],
                correctIndex: 1,
                explanation: "É o efeito cumulativo de pequenos gastos recorrentes — cada um parece insignificante isoladamente, mas juntos formam uma fatia relevante do orçamento.",
              },
            ],
            exercise: {
              prompt: "Identifique um gasto pequeno e recorrente na sua rotina (café, lanche, app). Calcule quanto ele soma em um mês e em um ano.",
              placeholder: "Gasto: ... Valor por vez: R$ ... Frequência: ... Total mensal: R$ ... Total anual: R$ ...",
            },
          },
        },
        {
          id: lid("controle-de-gastos", 2),
          title: "Registrando cada gasto",
          content: {
            explanation: [
              "O hábito mais simples e mais poderoso de controle de gastos é registrar cada transação assim que ela acontece — não confiar na memória para 'lembrar depois'.",
              "Quanto mais tempo passa entre o gasto e o registro, mais fácil é esquecer ou subestimar o valor. O ideal é um registro no mesmo dia, idealmente na hora.",
              "Ferramentas ajudam bastante aqui: um app como o Mind Money, uma planilha simples, ou até um caderno — o importante não é a ferramenta perfeita, é a consistência do registro.",
            ],
            examples: [
              "Registrar uma compra de R$ 45 no supermercado assim que sai do caixa, em vez de tentar lembrar no fim de semana.",
              "Usar a categoria certa no momento do registro (em vez de deixar tudo como 'outros') já economiza trabalho na hora de revisar depois.",
            ],
            keyConcepts: [
              "Registrar no momento (ou no mesmo dia) é mais confiável do que confiar na memória.",
              "A ferramenta importa menos do que a consistência do hábito.",
              "Categorizar no momento do registro facilita a revisão depois.",
            ],
            quiz: [
              {
                question: "Por que é melhor registrar um gasto no mesmo dia em que ele acontece?",
                options: [
                  "Porque é uma exigência legal",
                  "Porque quanto mais tempo passa, mais fácil é esquecer ou subestimar o valor",
                  "Porque os bancos cobram taxa para gastos não registrados",
                  "Porque isso reduz o preço da compra",
                ],
                correctIndex: 1,
                explanation: "A memória de gastos se degrada rápido — registrar perto do momento da compra é o que garante dados confiáveis para a revisão depois.",
              },
            ],
            exercise: {
              prompt: "Pelos próximos 3 dias, registre TODAS as suas transações no mesmo dia em que acontecerem (no Mind Money ou onde preferir). Depois, anote aqui se foi mais fácil ou mais difícil do que esperava.",
              placeholder: "Registrei durante 3 dias e percebi que...",
            },
          },
        },
        {
          id: lid("controle-de-gastos", 3),
          title: "Categorizando despesas",
          content: {
            explanation: [
              "Categorizar despesas (moradia, alimentação, lazer, assinaturas, transporte...) transforma uma lista bruta de transações em informação útil — permite ver PARA ONDE o dinheiro está indo, não só QUANTO saiu.",
              "Muita gente se surpreende ao ver, pela primeira vez, quanto realmente gasta por mês em uma categoria específica (delivery e assinaturas são clássicos) quando finalmente soma tudo.",
              "Categorias muito genéricas demais (tudo em 'outros') ou detalhadas demais (uma categoria para cada loja) atrapalham a análise — o ideal é um meio-termo que faça sentido pra sua vida.",
            ],
            examples: [
              "Ver 'R$ 2.400 gastos no mês' não diz muito. Ver 'R$ 900 em moradia, R$ 600 em alimentação, R$ 400 em transporte, R$ 500 em lazer' já mostra um retrato útil.",
              "Categorizar delivery separado de 'supermercado' revela, por exemplo, que R$ 400 dos R$ 600 de 'alimentação' foram em delivery — informação que passaria despercebida numa categoria só.",
            ],
            keyConcepts: [
              "Categorizar transforma dados brutos em informação útil sobre padrões.",
              "Categorias muito genéricas ou muito detalhadas atrapalham a análise.",
              "O objetivo é enxergar PARA ONDE o dinheiro vai, não só quanto saiu no total.",
            ],
            quiz: [
              {
                question: "Qual é a principal vantagem de categorizar despesas em vez de olhar só o total gasto?",
                options: [
                  "Reduz automaticamente os gastos",
                  "Permite enxergar padrões e para onde o dinheiro está realmente indo",
                  "É uma exigência da Receita Federal",
                  "Torna as transações mais rápidas de registrar",
                ],
                correctIndex: 1,
                explanation: "O total sozinho não revela nada sobre onde estão as maiores oportunidades de ajuste — categorização é o que traz esse detalhe.",
              },
            ],
            exercise: {
              prompt: "Revise as categorias que você usa hoje (no Mind Money ou em outro lugar). Alguma categoria está genérica demais e poderia ser dividida? Anote sua conclusão.",
              placeholder: "Minha categoria '...' está muito genérica porque mistura... Poderia dividir em...",
            },
          },
        },
        {
          id: lid("controle-de-gastos", 4),
          title: "Identificando vazamentos de dinheiro",
          content: {
            explanation: [
              "'Vazamento' é um gasto recorrente que você nem lembra mais que existe: uma assinatura que não usa mais, um serviço duplicado, uma taxa bancária que poderia ser evitada.",
              "Esses vazamentos são particularmente traiçoeiros porque não exigem nenhuma decisão nova — o dinheiro simplesmente continua saindo no automático, mês após mês, sem gerar valor real.",
              "Uma auditoria rápida (revisar assinaturas e cobranças recorrentes do extrato dos últimos 2-3 meses) costuma revelar pelo menos um vazamento na maioria das pessoas.",
            ],
            examples: [
              "Uma assinatura de streaming de um serviço que você não abre há meses, mas continua sendo cobrada todo mês.",
              "Duas assinaturas de apps de música diferentes, uma delas esquecida desde um teste grátis que virou cobrança.",
            ],
            keyConcepts: [
              "Vazamento: gasto recorrente esquecido que não gera valor real.",
              "Vazamentos são traiçoeiros porque não exigem decisão nova — o dinheiro sai no automático.",
              "Auditoria periódica de assinaturas/cobranças recorrentes revela a maioria dos vazamentos.",
            ],
            quiz: [
              {
                question: "O que caracteriza um 'vazamento' financeiro?",
                options: [
                  "Um gasto grande e planejado",
                  "Um gasto recorrente esquecido que continua saindo sem gerar valor real",
                  "Qualquer despesa essencial",
                  "Um investimento com baixo retorno",
                ],
                correctIndex: 1,
                explanation: "O que define o vazamento é ser recorrente, esquecido e sem gerar valor — diferente de uma despesa consciente, mesmo que grande.",
              },
            ],
            exercise: {
              prompt: "Revise seu extrato (ou histórico de transações) dos últimos 2 meses e procure por cobranças recorrentes que você esqueceu que existiam. Anote o que encontrou.",
              placeholder: "Encontrei: ... — vou cancelar/manter porque...",
            },
          },
        },
        {
          id: lid("controle-de-gastos", 5),
          title: "Criando o hábito de revisão mensal",
          content: {
            explanation: [
              "Revisar o mês anterior antes de começar o próximo — olhando o total gasto, comparando com o mês anterior e vendo o que mais cresceu — é o hábito que evita repetir os mesmos excessos indefinidamente.",
              "Essa revisão não precisa ser longa nem complexa: 10-15 minutos, uma vez por mês, olhando os números reais (não a sensação) já é suficiente para captar a maioria dos ajustes necessários.",
              "É exatamente esse o objetivo da comparação mensal e do ranking de gastos no Dashboard do Mind Money: transformar esse hábito, que exigiria cálculo manual, em algo automático e visual.",
            ],
            examples: [
              "Ver que 'lazer' cresceu 40% em relação ao mês anterior é um sinal direto para investigar o motivo antes que vire padrão.",
              "Comparar o ranking de categorias mês a mês mostra rapidamente se uma categoria está consistentemente entre as maiores — informação que orienta onde focar esforço de redução.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "1. No início de cada mês, abrir o Dashboard do mês anterior",
                "2. Comparar o saldo e as categorias com o mês anterior a esse",
                "3. Identificar o que mais cresceu e investigar o motivo",
                "4. Levar esse aprendizado para o orçamento do mês que está começando",
              ],
            },
            keyConcepts: [
              "Revisão mensal: hábito curto e recorrente, não uma auditoria longa e rara.",
              "Comparar com o mês anterior revela tendências, não só números isolados.",
              "Ferramentas automatizam esse hábito, mas a decisão de revisar continua sendo sua.",
            ],
            quiz: [
              {
                question: "Qual é o principal objetivo de revisar o mês anterior antes de começar o próximo?",
                options: [
                  "Sentir culpa pelos gastos do mês passado",
                  "Identificar o que mudou e evitar repetir os mesmos excessos sem perceber",
                  "Preencher uma exigência burocrática",
                  "Calcular o imposto de renda",
                ],
                correctIndex: 1,
                explanation: "A revisão serve para aprender com o padrão do mês anterior e ajustar o comportamento antes que um excesso pontual vire hábito.",
              },
            ],
            exercise: {
              prompt: "Abra o Dashboard do Mind Money agora (ou seu método de controle) e compare o mês atual com o anterior. Qual categoria mais chamou sua atenção, para melhor ou para pior?",
              placeholder: "A categoria que mais chamou minha atenção foi... porque...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 5 — Reserva de emergência (exemplo original do usuário)
    // ---------------------------------------------------------------
    {
      id: "reserva-emergencia",
      title: "Reserva de emergência",
      description: "A base de qualquer planejamento financeiro sólido, antes mesmo de pensar em investir.",
      icon: "🛡️",
      lessons: [
        {
          id: lid("reserva-emergencia", 1),
          title: "O que é uma reserva de emergência?",
          content: {
            explanation: [
              "Reserva de emergência é uma quantia guardada especificamente para cobrir imprevistos — perda de renda, um problema de saúde, um conserto urgente — sem precisar recorrer a dívidas caras como cartão de crédito ou cheque especial.",
              "Ela é diferente de uma meta comum (como juntar para uma viagem): seu propósito não é ser gasta em um objetivo planejado, é existir 'parada', pronta para um imprevisto que ainda não aconteceu.",
              "Ter essa reserva é o que separa um imprevisto de uma crise financeira: com reserva, um imprevisto é só um contratempo; sem ela, o mesmo imprevisto pode gerar uma dívida que leva meses (ou anos) para quitar.",
            ],
            examples: [
              "Perder o emprego e ter 6 meses de custo de vida guardados dá tempo real para procurar uma nova posição sem desespero.",
              "Um conserto de carro urgente de R$ 1.500 é um contratempo administrável com reserva, e pode virar uma dívida no cartão (com juros altos) sem ela.",
            ],
            keyConcepts: [
              "Reserva de emergência: dinheiro guardado especificamente para imprevistos.",
              "Diferente de uma meta comum — o objetivo é existir 'parada', não ser gasta em um plano.",
              "Com reserva, imprevisto vira contratempo; sem ela, pode virar dívida cara.",
            ],
            quiz: [
              {
                question: "Qual é a principal diferença entre a reserva de emergência e uma meta financeira comum (como uma viagem)?",
                options: [
                  "Não existe diferença real",
                  "A reserva tem o propósito de ficar disponível para imprevistos, não de ser gasta em um plano definido",
                  "A reserva sempre rende mais que qualquer investimento",
                  "A meta comum não pode ser guardada em dinheiro",
                ],
                correctIndex: 1,
                explanation: "A reserva existe para estar disponível quando o imprevisto acontecer — sua função não é ser 'gasta' num plano, mas sim estar lá quando for preciso.",
              },
            ],
            exercise: {
              prompt: "Pense em um imprevisto financeiro que você já viveu (ou de alguém próximo). Como uma reserva de emergência teria mudado (ou mudou) a forma de lidar com essa situação?",
              placeholder: "O imprevisto foi... Com/sem reserva, a situação teria sido diferente porque...",
            },
          },
        },
        {
          id: lid("reserva-emergencia", 2),
          title: "Quanto devo guardar?",
          content: {
            explanation: [
              "Uma referência comum é guardar entre 3 e 6 meses do seu custo de vida mensal (não da sua renda — do que você realmente gasta para viver).",
              "Quem tem renda variável ou instável (autônomos, freelancers, comissionados) costuma precisar de uma reserva maior, podendo chegar a 12 meses, porque a previsibilidade de receita é menor.",
              "O valor exato também depende de outros fatores: estabilidade no emprego, número de dependentes, existência de outras fontes de renda na família, e o quanto de risco você tolera emocionalmente.",
            ],
            examples: [
              "Custo de vida mensal de R$ 3.000, emprego CLT estável: reserva-alvo de R$ 9.000 a R$ 18.000 (3 a 6 meses).",
              "Freelancer com receita variável e custo de vida de R$ 3.000: reserva-alvo mais próxima de R$ 36.000 (12 meses), pela menor previsibilidade.",
            ],
            diagram: {
              type: "formula",
              formula: "Reserva-alvo = Custo de vida mensal × (3 a 12, conforme estabilidade de renda)",
              caption: "Quanto menos previsível a renda, mais perto do 12 (não do 3) vale mirar.",
            },
            keyConcepts: [
              "Referência: 3 a 6 meses do custo de vida mensal (não da renda).",
              "Renda variável/instável pede reserva maior — até 12 meses.",
              "Fatores que ajustam o número: estabilidade, dependentes, outras rendas na casa.",
            ],
            quiz: [
              {
                question: "A reserva de emergência deve ser calculada com base em quê?",
                options: [
                  "Na renda mensal bruta",
                  "No custo de vida mensal (o que você realmente gasta para viver)",
                  "No valor do seu maior bem",
                  "Num valor fixo de R$ 10.000 para todo mundo",
                ],
                correctIndex: 1,
                explanation: "O que importa é quanto você precisa para viver por um período, não quanto você ganha — por isso o cálculo usa o custo de vida.",
              },
              {
                question: "Por que alguém com renda variável costuma precisar de uma reserva maior (mais perto de 12 meses)?",
                options: [
                  "Porque a lei exige isso para autônomos",
                  "Porque a menor previsibilidade da receita exige mais colchão de segurança",
                  "Porque renda variável sempre é mais alta",
                  "Porque bancos cobram taxa maior de quem tem renda fixa",
                ],
                correctIndex: 1,
                explanation: "Quanto menos previsível a receita, maior o risco de um mês (ou vários) com receita baixa — por isso o colchão precisa ser maior.",
              },
            ],
            exercise: {
              prompt: "Calcule seu custo de vida mensal (despesas essenciais, não o total geral) e defina sua reserva-alvo usando o múltiplo (3 a 12) mais adequado à sua situação de renda.",
              placeholder: "Meu custo de vida mensal: R$ ...\nMinha situação de renda: (estável / variável)\nMúltiplo escolhido: ... meses\nReserva-alvo: R$ ...",
            },
          },
        },
        {
          id: lid("reserva-emergencia", 3),
          title: "Onde guardar?",
          content: {
            explanation: [
              "O lugar certo para a reserva de emergência não é o mesmo de um investimento de longo prazo: ela precisa ter liquidez imediata (poder ser resgatada a qualquer momento, idealmente no mesmo dia, sem perda) e baixo risco.",
              "Segurança e disponibilidade vêm antes de rentabilidade aqui — mesmo que o rendimento seja modesto, a função da reserva não é 'fazer o dinheiro crescer bastante', é estar lá quando for preciso.",
              "Opções comuns no Brasil: conta que rende (tipo CDB com liquidez diária de um banco confiável) ou Tesouro Selic — ambos combinam baixo risco com resgate rápido, diferente de investimentos de renda variável ou títulos com vencimento longo.",
            ],
            examples: [
              "Guardar a reserva em ações seria um erro: o valor pode cair justamente no momento em que você mais precisa sacar (ex.: numa crise econômica que também te fez perder o emprego).",
              "Um CDB com liquidez diária de 100% do CDI, ou o Tesouro Selic, são exemplos de onde a reserva tem liquidez rápida e baixo risco.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Bom lugar para reserva", items: ["Liquidez imediata (resgate rápido)", "Baixo risco", "Rendimento >= poupança"] },
              right: { label: "Lugar errado para reserva", items: ["Renda variável (ações, cripto)", "Títulos com vencimento longo", "Investimentos com carência para resgate"] },
            },
            keyConcepts: [
              "Liquidez imediata: poder resgatar rapidamente, sem perda, quando precisar.",
              "Baixo risco: o valor não pode oscilar para baixo no momento que você precisar dele.",
              "Rentabilidade é secundária aqui — segurança e disponibilidade vêm primeiro.",
            ],
            quiz: [
              {
                question: "Por que renda variável (ações, por exemplo) NÃO é um bom lugar para guardar a reserva de emergência?",
                options: [
                  "Porque ações são ilegais no Brasil",
                  "Porque o valor pode cair justamente no momento em que você precisa sacar",
                  "Porque ações não podem ser vendidas rapidamente",
                  "Porque rendem menos que a poupança sempre",
                ],
                correctIndex: 1,
                explanation: "O risco de a reserva estar 'em baixa' exatamente quando você mais precisa dela é o motivo central para evitar renda variável nesse caso.",
              },
            ],
            exercise: {
              prompt: "Pesquise (no seu banco ou corretora) uma opção de baixo risco e liquidez diária disponível para você (CDB com liquidez diária, Tesouro Selic, etc.) e anote a que mais fez sentido.",
              placeholder: "A opção que encontrei foi... com rendimento aproximado de... e liquidez de...",
            },
          },
        },
        {
          id: lid("reserva-emergencia", 4),
          title: "O que pode ser considerado emergência?",
          content: {
            explanation: [
              "Nem todo gasto inesperado é uma emergência real. Uma boa régua: é imprevisível, é urgente (não pode esperar) e é necessário (não é desejo)?",
              "Emergências reais: perda de renda, problema de saúde não coberto, conserto urgente que impede trabalhar ou morar (carro que leva ao trabalho, geladeira quebrada), despesa jurídica inesperada e necessária.",
              "NÃO são emergências: uma promoção imperdível, um lançamento de produto, uma viagem de última hora por lazer — mesmo sendo 'urgentes' no sentido de terem prazo curto, não são imprevisíveis nem necessários.",
            ],
            examples: [
              "A geladeira quebrou e a comida vai estragar: emergência real (imprevisível, urgente, necessário).",
              "Uma liquidação relâmpago de uma loja: não é emergência, mesmo com prazo curto — é desejo, não necessidade.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "É imprevisível? (não dava pra saber/planejar antes)",
                "É urgente? (não pode esperar até o próximo mês)",
                "É necessário? (não é desejo ou oportunidade)",
                "Se as 3 respostas forem SIM → é uma emergência real",
              ],
            },
            keyConcepts: [
              "Emergência real: imprevisível + urgente + necessária, ao mesmo tempo.",
              "Promoções e oportunidades urgentes não são emergências — são desejos com prazo.",
              "Usar a reserva para não-emergências esvazia ela justo quando uma emergência real pode aparecer.",
            ],
            quiz: [
              {
                question: "Uma promoção com prazo de 24 horas pode ser considerada motivo para usar a reserva de emergência?",
                options: [
                  "Sim, porque tem prazo urgente",
                  "Não, porque falta o critério de necessidade — é um desejo, não uma emergência real",
                  "Sim, sempre que o desconto for maior que 50%",
                  "Depende apenas do valor da promoção",
                ],
                correctIndex: 1,
                explanation: "Urgência sozinha não caracteriza emergência — falta o critério de necessidade, que é essencial na definição.",
              },
            ],
            exercise: {
              prompt: "Escreva 3 exemplos de situações que você consideraria emergência real (justificando com os 3 critérios) e 1 exemplo de algo que parece urgente mas NÃO seria emergência.",
              placeholder: "Emergências reais: 1) ... 2) ... 3) ...\nParece urgente mas não é: ...",
            },
          },
        },
        {
          id: lid("reserva-emergencia", 5),
          title: "Como construir sua reserva",
          content: {
            explanation: [
              "Construir a reserva do zero não precisa (e geralmente não deve) ser feito de uma vez — é um processo gradual, com aportes regulares, igual a qualquer outra meta financeira.",
              "Um ponto de partida prático: definir um valor mensal fixo (mesmo que pequeno) para transferir automaticamente assim que a receita entra — 'pagar a reserva primeiro', antes de gastar com o resto.",
              "Enquanto a reserva ainda não está completa, ela já tem valor parcial: R$ 2.000 guardados já cobrem imprevistos menores, mesmo que a meta final seja R$ 15.000. O importante é o progresso constante, não a perfeição imediata.",
            ],
            examples: [
              "Transferir R$ 300 todo dia 5 (dia do pagamento) para uma conta separada, antes de qualquer outro gasto do mês.",
              "Direcionar rendas extras (13º salário, restituição de imposto de renda, bônus) diretamente para a reserva até ela estar completa.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "1. Definir o valor-alvo da reserva (custo de vida × 3 a 12 meses)",
                "2. Definir um valor mensal fixo para aportar",
                "3. Automatizar a transferência assim que a receita entra",
                "4. Direcionar rendas extras para acelerar o processo",
                "5. Acompanhar o progresso até atingir a meta",
              ],
            },
            keyConcepts: [
              "Construir a reserva é um processo gradual, com aportes regulares.",
              "'Pagar a reserva primeiro' — separar o valor antes de gastar o resto.",
              "Reserva parcial já tem valor real, mesmo antes de completa.",
            ],
            quiz: [
              {
                question: "O que significa a estratégia de 'pagar a reserva primeiro'?",
                options: [
                  "Só guardar o que sobra no fim do mês, se sobrar",
                  "Separar o valor da reserva assim que a receita entra, antes de gastar com o resto",
                  "Pedir um empréstimo para completar a reserva de uma vez",
                  "Guardar só depois de quitar todas as dívidas",
                ],
                correctIndex: 1,
                explanation: "Tratar o aporte da reserva como a primeira 'conta a pagar' do mês (e não o que sobra) é o que garante consistência no longo prazo.",
              },
            ],
            exercise: {
              prompt: "Se você já tem uma meta de reserva de emergência cadastrada no Mind Money, defina (ou revise) um valor mensal de aporte e o dia do mês em que vai fazer essa transferência. Se ainda não tem, crie a meta agora.",
              placeholder: "Valor mensal de aporte: R$ ...\nDia do mês: ...\nJá criei a meta no Mind Money? (sim/não)",
            },
          },
        },
      ],
    },
  ],
};
