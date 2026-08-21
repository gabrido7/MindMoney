import type { Trail } from "../types";

const trailId = "organizacao-financeira";
const lid = (courseId: string, n: number) => `${trailId}.${courseId}.aula-${n}`;

export const organizacaoFinanceiraTrail: Trail = {
  id: trailId,
  title: "Organização financeira",
  description: "Metas, planejamento mensal e o método 50/30/20 para colocar o orçamento em prática de verdade.",
  color: "blue",
  courses: [
    // ---------------------------------------------------------------
    // Curso 1 — Metas financeiras
    // ---------------------------------------------------------------
    {
      id: "metas-financeiras",
      title: "Metas financeiras",
      description: "Como definir metas que realmente saem do papel, com valor e prazo.",
      icon: "🎯",
      lessons: [
        {
          id: lid("metas-financeiras", 1),
          title: "O que faz uma meta financeira funcionar",
          content: {
            explanation: [
              "\"Economizar mais\" é uma intenção vaga; uma meta funciona quando é específica, mensurável e tem prazo — \"guardar R$ 6.000 em 12 meses\" dá pra acompanhar, \"guardar mais\" não.",
              "Metas vagas falham não por falta de vontade, mas porque não dá pra saber se você está indo bem ou mal no meio do caminho — sem um número e um prazo, qualquer progresso parece \"razoável\".",
              "Uma meta bem formulada tem três partes: o quê (o objetivo em si), quanto (valor) e quando (prazo) — faltando qualquer uma delas, a meta perde força.",
            ],
            examples: [
              "\"Quero guardar dinheiro\" vs. \"Quero guardar R$ 6.000 para trocar de carro em 12 meses\" — a segunda permite calcular quanto guardar por mês e acompanhar.",
              "\"Viajar mais\" vs. \"Juntar R$ 4.000 para uma viagem em 8 meses\" — no Mind Money, a segunda vira uma meta rastreável de verdade.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "O quê: o objetivo específico",
                "Quanto: valor em reais",
                "Quando: prazo definido",
                "Como: valor mensal necessário (calculado a partir dos três acima)",
              ],
            },
            keyConcepts: [
              "Meta vaga: sem valor nem prazo, impossível de acompanhar.",
              "Meta específica: tem o quê, quanto e quando.",
              "O valor mensal necessário é calculado, não estimado no chute.",
            ],
            quiz: [
              {
                question: "O que diferencia uma meta financeira 'de verdade' de uma intenção vaga?",
                options: ["Ter um valor específico e um prazo definido", "Ser sobre dinheiro", "Ser escrita num papel", "Ser aprovada por um banco"],
                correctIndex: 0,
                explanation: "Sem valor e prazo, não dá pra saber se você está no caminho certo — a meta vira só um desejo.",
              },
            ],
            exercise: {
              prompt: "Pegue uma intenção vaga que você tem hoje ('economizar mais', 'viajar', 'trocar de carro') e reescreva como uma meta específica, com valor e prazo.",
              placeholder: "Minha intenção vaga: ...\nMinha meta específica: Juntar R$ ... em ... meses para ...",
            },
          },
        },
        {
          id: lid("metas-financeiras", 2),
          title: "Definindo valor e prazo",
          content: {
            explanation: [
              "Definir o valor de uma meta começa pela pesquisa real: quanto custa de fato o que você quer (a viagem, o carro, a entrada do imóvel) — não um número chutado de cabeça.",
              "O prazo precisa ser realista em relação à sua capacidade de guardar: dividir o valor pelo prazo dá o valor mensal necessário, e comparar esse valor com o que sobra de verdade no orçamento mostra se a meta é viável.",
              "Quando o valor mensal necessário não cabe no orçamento, há duas saídas: aumentar o prazo ou reduzir o valor da meta — as duas são ajustes válidos, não fracasso.",
            ],
            examples: [
              "Meta de R$ 12.000 em 12 meses = R$ 1.000/mês; se sobra só R$ 600/mês, o prazo real é mais perto de 20 meses, não 12.",
              "Pesquisar o preço real de passagens e hospedagem antes de definir o valor de uma meta de viagem evita uma \"meta chutada\" que nunca fecha.",
            ],
            diagram: {
              type: "formula",
              formula: "Valor mensal necessário = Valor da meta ÷ Prazo em meses",
              caption: "Se esse valor não cabe no que sobra no orçamento, ajuste o prazo ou o valor — não ignore a conta.",
            },
            keyConcepts: [
              "Pesquisar o valor real, não chutar.",
              "Valor mensal necessário = valor ÷ prazo.",
              "Se não cabe no orçamento, ajustar prazo ou valor — não abandonar a meta.",
            ],
            quiz: [
              {
                question: "Se uma meta de R$ 12.000 precisa de R$ 1.000/mês mas você só tem R$ 600/mês disponíveis, qual o ajuste mais direto?",
                options: ["Desistir da meta", "Aumentar o prazo para caber no que sobra por mês", "Ignorar o cálculo e tentar mesmo assim", "Pedir um empréstimo para completar"],
                correctIndex: 1,
                explanation: "Aumentar o prazo reduz o valor mensal necessário para um patamar realista, sem exigir mais do que o orçamento permite.",
              },
            ],
            exercise: {
              prompt: "Escolha uma meta que você tem em mente, pesquise o valor real dela, e calcule o valor mensal necessário para 3 prazos diferentes (por exemplo, 6, 12 e 24 meses).",
              placeholder: "Meta: ...\nValor real pesquisado: R$ ...\n6 meses: R$ .../mês\n12 meses: R$ .../mês\n24 meses: R$ .../mês",
            },
          },
        },
        {
          id: lid("metas-financeiras", 3),
          title: "Metas de curto, médio e longo prazo",
          content: {
            explanation: [
              "Metas de curto prazo (até 1 ano) pedem segurança e liquidez — o dinheiro precisa estar disponível quando o prazo chegar, sem risco de estar \"em baixa\" na hora de usar.",
              "Metas de médio prazo (1 a 5 anos) já podem tolerar um pouco mais de oscilação, dependendo da meta, mas ainda priorizam previsibilidade sobre potencial de retorno alto.",
              "Metas de longo prazo (5+ anos) são as que mais se beneficiam de investimentos com potencial de crescimento maior, porque há tempo de sobra para recuperar de eventuais quedas ao longo do caminho.",
            ],
            examples: [
              "Reserva para uma viagem em 8 meses: curto prazo, guardar em algo com liquidez diária e baixo risco.",
              "Aposentadoria daqui a 25 anos: longo prazo, pode tolerar mais oscilação em busca de crescimento maior ao longo do tempo.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Curto prazo (até 1 ano)", items: ["Prioridade: segurança e liquidez", "Baixa tolerância a oscilação", "Ex.: viagem, reserva de emergência"] },
              right: { label: "Longo prazo (5+ anos)", items: ["Prioridade: crescimento no tempo", "Mais tolerância a oscilação", "Ex.: aposentadoria, patrimônio"] },
            },
            keyConcepts: [
              "Prazo da meta define o tipo de investimento adequado.",
              "Curto prazo: segurança antes de rentabilidade.",
              "Longo prazo: tempo permite tolerar mais oscilação em busca de crescimento.",
            ],
            quiz: [
              {
                question: "Por que uma meta de curto prazo (como uma viagem em 8 meses) deve priorizar segurança sobre potencial de retorno alto?",
                options: ["Porque metas de curto prazo não valem a pena", "Porque não há tempo de sobra para recuperar de uma eventual queda antes do prazo chegar", "Porque o governo exige isso", "Porque metas de curto prazo sempre rendem menos"],
                correctIndex: 1,
                explanation: "Sem tempo para se recuperar de uma oscilação negativa, o risco de precisar do dinheiro justo numa baixa é alto demais para valer a pena.",
              },
            ],
            exercise: {
              prompt: "Liste 3 metas que você tem (ou gostaria de ter) e classifique cada uma como curto, médio ou longo prazo.",
              placeholder: "1. ... — prazo: ...\n2. ... — prazo: ...\n3. ... — prazo: ...",
            },
          },
        },
        {
          id: lid("metas-financeiras", 4),
          title: "Priorizando entre várias metas",
          content: {
            explanation: [
              "É raro ter dinheiro sobrando para todas as metas ao mesmo tempo — por isso priorizar é parte do processo, não uma falha de planejamento.",
              "Uma forma prática de priorizar é considerar urgência (o que precisa acontecer primeiro), impacto (o que muda mais a sua vida) e o custo de adiar (o que fica mais caro ou mais difícil quanto mais você espera).",
              "A reserva de emergência quase sempre vem antes das demais metas, porque ela protege todas as outras — sem ela, qualquer imprevisto pode zerar o progresso de todas as metas ao mesmo tempo.",
            ],
            examples: [
              "Reserva de emergência incompleta + meta de viagem: a reserva geralmente vem primeiro, porque protege contra o risco de ter que cancelar a viagem (ou pior) num imprevisto.",
              "Quitar uma dívida com juros altos costuma vir antes de começar a investir, porque o \"retorno\" de quitar a dívida (deixar de pagar juros) é maior que o retorno esperado do investimento.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "1. Reserva de emergência (protege todas as outras metas)",
                "2. Dívidas com juros altos (o custo de adiar cresce rápido)",
                "3. Metas de curto/médio prazo, por ordem de urgência e impacto",
                "4. Metas de longo prazo e investimentos",
              ],
            },
            keyConcepts: [
              "Priorizar metas é normal, não é fracasso de planejamento.",
              "Critérios: urgência, impacto, custo de adiar.",
              "Reserva de emergência e dívidas caras costumam vir antes das demais.",
            ],
            quiz: [
              {
                question: "Por que a reserva de emergência costuma vir antes de outras metas na ordem de prioridade?",
                options: ["Porque é a meta mais barata de completar", "Porque ela protege o progresso de todas as outras metas contra imprevistos", "Porque é exigida por lei", "Porque rende mais que qualquer outra meta"],
                correctIndex: 1,
                explanation: "Sem reserva, um imprevisto pode forçar o cancelamento ou o esvaziamento de qualquer outra meta em andamento.",
              },
            ],
            exercise: {
              prompt: "Liste suas metas atuais e ordene-as por prioridade, explicando em uma frase o motivo de cada posição.",
              placeholder: "1. ... — porque ...\n2. ... — porque ...\n3. ... — porque ...",
            },
          },
        },
        {
          id: lid("metas-financeiras", 5),
          title: "Acompanhando o progresso até o fim",
          content: {
            explanation: [
              "Definir uma meta é só o começo — o que garante que ela seja atingida é o acompanhamento regular, não a definição inicial.",
              "Acompanhar não significa só olhar \"quanto falta\", mas comparar o ritmo real com o ritmo necessário: guardar 40% da meta na metade do prazo é diferente de guardar 40% faltando um mês para o fim.",
              "Metas que não têm nenhum acompanhamento até o prazo final costumam ser descobertas tarde demais para corrigir o rumo — o valor do acompanhamento está em dar tempo de reagir.",
            ],
            examples: [
              "Verificar mensalmente se o ritmo de aportes está alinhado com o necessário evita a surpresa de, faltando 1 mês, perceber que falta 50% do valor.",
              "No Mind Money, o simulador \"E se...?\" de cada meta mostra exatamente isso: se o ritmo atual leva a bater o prazo, adiantar ou atrasar.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Definir a meta (valor + prazo)",
                "Guardar regularmente",
                "Revisar o ritmo periodicamente (não só no fim)",
                "Ajustar cedo se o ritmo estiver fora do necessário",
              ],
            },
            keyConcepts: [
              "Definir a meta é o começo, não o fim do processo.",
              "Comparar ritmo real com ritmo necessário, não só 'quanto falta'.",
              "Acompanhamento regular dá tempo de corrigir o rumo antes que seja tarde.",
            ],
            quiz: [
              {
                question: "Qual é a diferença entre 'acompanhar quanto falta' e 'acompanhar o ritmo' de uma meta?",
                options: ["Não há diferença", "Acompanhar o ritmo compara o progresso real com o necessário para o prazo, revelando se está adiantado ou atrasado", "Acompanhar o ritmo é mais difícil e não vale a pena", "Só é possível acompanhar o ritmo com investimentos"],
                correctIndex: 1,
                explanation: "Saber 'quanto falta' não diz se você está no caminho certo para o prazo — para isso, é preciso comparar com o ritmo necessário.",
              },
            ],
            exercise: {
              prompt: "Se você tem uma meta ativa no Mind Money, abra o simulador 'E se...?' dela e veja se o ritmo atual bate com o prazo. Anote o que descobriu.",
              placeholder: "Minha meta: ...\nNo ritmo atual, eu bato o prazo? ...\nVou ajustar: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 2 — Planejamento mensal
    // ---------------------------------------------------------------
    {
      id: "planejamento-mensal",
      title: "Planejamento mensal",
      description: "O ritual mensal que conecta orçamento, metas e reserva em uma rotina.",
      icon: "🗓️",
      lessons: [
        {
          id: lid("planejamento-mensal", 1),
          title: "Por que planejar mês a mês",
          content: {
            explanation: [
              "Um orçamento anual é útil como visão geral, mas é no mês a mês que o dinheiro realmente é decidido e gasto — por isso o planejamento mensal é o nível mais prático de controle financeiro.",
              "Cada mês tem particularidades: dias úteis diferentes, contas que vencem em datas específicas, eventos pontuais — planejar mês a mês captura essas variações que uma média anual esconde.",
              "Planejar antes do mês começar (não durante) é o que faz a diferença: decidir os limites de cada categoria com antecedência evita decisões no impulso no meio do mês.",
            ],
            examples: [
              "Um mês com 5 sextas-feiras tende a ter mais gastos de lazer do que um mês com 4 — o planejamento mensal capta isso, uma média anual não.",
              "Planejar o mês de dezembro (com festas de fim de ano) de forma diferente de um mês comum evita que os gastos extras \"surpreendam\" o orçamento.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Planejamento anual", items: ["Visão geral e médias", "Não captura variações mensais", "Bom para metas de longo prazo"] },
              right: { label: "Planejamento mensal", items: ["Nível prático de decisão", "Captura particularidades de cada mês", "Feito ANTES do mês começar"] },
            },
            keyConcepts: [
              "O mês a mês é onde o dinheiro é decidido de verdade.",
              "Planejar antes do mês começar evita decisões por impulso.",
              "Cada mês tem particularidades que uma média anual não capta.",
            ],
            quiz: [
              {
                question: "Qual a vantagem de planejar ANTES do mês começar, em vez de ir decidindo ao longo do mês?",
                options: ["Não tem vantagem real", "Evita decisões por impulso, porque os limites já foram pensados com calma antes", "É uma exigência bancária", "Só funciona pra quem ganha muito"],
                correctIndex: 1,
                explanation: "Decidir com calma antes do mês começar tira a pressão do momento e reduz decisões por impulso.",
              },
            ],
            exercise: {
              prompt: "Antes do próximo mês começar, reserve 15 minutos para planejar: liste as contas fixas que vencem e um limite para as categorias variáveis.",
              placeholder: "Contas fixas do próximo mês: ...\nLimite para lazer: R$ ...\nLimite para alimentação fora de casa: R$ ...",
            },
          },
        },
        {
          id: lid("planejamento-mensal", 2),
          title: "Montando o planejamento do próximo mês",
          content: {
            explanation: [
              "Montar o planejamento do mês começa pela receita esperada (o piso, não o teto — especialmente se parte dela é variável) e pelas despesas fixas já conhecidas (aluguel, contas, assinaturas).",
              "Depois de descontar as despesas fixas da receita, o que sobra é dividido entre categorias variáveis (alimentação, lazer, transporte) e metas (reserva, objetivos) — com limites definidos para cada uma.",
              "Um planejamento realista usa o histórico dos meses anteriores como referência, não um valor \"desejado\" que não bate com o padrão real de gasto.",
            ],
            examples: [
              "Receita esperada R$ 4.000, despesas fixas R$ 1.800, sobra R$ 2.200 para dividir entre variáveis e metas.",
              "Olhar o histórico de \"alimentação\" dos últimos 3 meses (R$ 700, R$ 650, R$ 720) para definir um limite realista de R$ 700, em vez de um valor otimista de R$ 400.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "1. Receita esperada (o piso)",
                "2. Menos despesas fixas conhecidas",
                "3. O que sobra: dividir entre variáveis e metas",
                "4. Definir um limite por categoria, baseado no histórico real",
              ],
            },
            keyConcepts: [
              "Começar pela receita esperada (piso) e despesas fixas conhecidas.",
              "O que sobra é dividido entre variáveis e metas.",
              "Usar o histórico real como referência, não um valor desejado.",
            ],
            quiz: [
              {
                question: "Por que usar o histórico dos últimos meses é melhor do que definir um limite 'desejado' para uma categoria?",
                options: ["Porque o histórico é sempre menor", "Porque um limite desejado, sem base na realidade, tende a ser irrealista e não ser cumprido", "Porque é uma exigência do Mind Money", "Porque o histórico nunca muda"],
                correctIndex: 1,
                explanation: "Um limite desconectado do padrão real de gasto tende a estourar todo mês, gerando frustração em vez de controle.",
              },
            ],
            exercise: {
              prompt: "Monte o planejamento do próximo mês: receita esperada, despesas fixas, e limites para as 3 categorias variáveis que mais pesam no seu orçamento.",
              placeholder: "Receita esperada: R$ ...\nDespesas fixas: R$ ...\nLimite categoria 1: R$ ...\nLimite categoria 2: R$ ...\nLimite categoria 3: R$ ...",
            },
          },
        },
        {
          id: lid("planejamento-mensal", 3),
          title: "Lidando com meses atípicos (13º, IPVA, férias)",
          content: {
            explanation: [
              "Alguns meses têm despesas ou receitas que não se repetem todo mês: 13º salário, IPVA, IPTU, matrícula escolar, férias — tratá-los como \"extras imprevistos\" quando na verdade são previsíveis é um erro comum.",
              "A melhor forma de lidar com eles é prever com antecedência: se o IPVA vence em janeiro, guardar uma fração dele todo mês ao longo do ano evita que janeiro vire um mês de rombo no orçamento.",
              "Receitas extras (como o 13º) merecem o mesmo cuidado: definir com antecedência para onde vão (reserva, dívidas, metas) evita que sumam em gastos não planejados.",
            ],
            examples: [
              "IPVA de R$ 1.200 em janeiro: guardar R$ 100/mês de fevereiro a dezembro do ano anterior evita sentir o golpe de uma vez.",
              "13º salário de R$ 3.000: definir com antecedência que 50% vai para a reserva e 50% para uma meta específica, em vez de decidir na hora.",
            ],
            diagram: {
              type: "formula",
              formula: "Valor a guardar por mês = Despesa atípica prevista ÷ Meses até ela vencer",
              caption: "Transforma uma despesa 'surpresa' anual em uma parcela mensal previsível.",
            },
            keyConcepts: [
              "Despesas atípicas (IPVA, 13º, matrícula) são previsíveis, não imprevistos.",
              "Guardar uma fração mensal evita o rombo no mês em que a despesa vence.",
              "Receitas extras também merecem um destino definido com antecedência.",
            ],
            quiz: [
              {
                question: "Por que despesas como IPVA e matrícula escolar não deveriam ser tratadas como 'imprevistos'?",
                options: ["Porque são pequenas demais para importar", "Porque elas são previsíveis com antecedência, o que permite guardar uma fração todo mês antes de vencerem", "Porque só afetam quem tem carro ou filhos", "Porque não existe forma de se planejar para elas"],
                correctIndex: 1,
                explanation: "Diferente de uma emergência de verdade, essas despesas têm data e valor conhecidos com meses de antecedência — dá pra se planejar.",
              },
            ],
            exercise: {
              prompt: "Liste as despesas atípicas que você sabe que vão acontecer nos próximos 12 meses (IPVA, IPTU, matrícula, presentes de fim de ano...) e calcule quanto guardar por mês para cada uma.",
              placeholder: "Despesa: ... — Valor: R$ ... — Vence em: ... meses — Guardar por mês: R$ ...",
            },
          },
        },
        {
          id: lid("planejamento-mensal", 4),
          title: "Ajustando o planejamento ao longo do mês",
          content: {
            explanation: [
              "Mesmo o planejamento mais cuidadoso pode precisar de ajuste no meio do mês — um imprevisto, um gasto maior que o esperado em uma categoria, uma receita que não chegou como previsto.",
              "O ajuste consciente é diferente de simplesmente abandonar o plano: ao perceber que uma categoria vai estourar, a resposta é reduzir outra categoria para compensar, não ignorar o limite.",
              "Verificar o progresso do orçamento no meio do mês (não só no fim) é o que permite fazer esse ajuste a tempo, em vez de descobrir o problema só quando já é tarde.",
            ],
            examples: [
              "Perceber no dia 15 que \"alimentação fora de casa\" já consumiu 80% do limite mensal é o sinal para reduzir esse gasto no restante do mês.",
              "Compensar um gasto extra em \"saúde\" (imprevisto legítimo) reduzindo o limite de \"lazer\" no mesmo mês, em vez de deixar o orçamento total estourar.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Verificar o progresso do orçamento na metade do mês",
                "Identificar categorias perto do limite ou já estouradas",
                "Decidir: é pontual ou vai se repetir?",
                "Compensar ajustando outra categoria, se necessário",
              ],
            },
            keyConcepts: [
              "Ajustar no meio do mês é diferente de abandonar o plano.",
              "Verificar o progresso na metade do mês, não só no fim.",
              "Compensar um estouro reduzindo outra categoria mantém o total sob controle.",
            ],
            quiz: [
              {
                question: "Qual é a melhor resposta ao perceber, no meio do mês, que uma categoria está perto de estourar o limite?",
                options: ["Abandonar o planejamento do mês inteiro", "Reduzir o gasto nessa categoria pelo resto do mês, ou compensar reduzindo outra", "Ignorar e ver o que acontece no fim do mês", "Aumentar o limite de todas as categorias"],
                correctIndex: 1,
                explanation: "Um ajuste consciente e pontual mantém o orçamento sob controle sem precisar abandonar o planejamento inteiro.",
              },
            ],
            exercise: {
              prompt: "No meio do mês atual, verifique quanto você já gastou em cada categoria em relação ao limite planejado. Alguma está perto de estourar? O que você vai fazer a respeito?",
              placeholder: "Categoria mais perto do limite: ...\nJá gastei: R$ ... de R$ ... planejados\nMinha decisão: ...",
            },
          },
        },
        {
          id: lid("planejamento-mensal", 5),
          title: "Fechando o mês e preparando o próximo",
          content: {
            explanation: [
              "Fechar o mês é o momento de comparar o planejado com o realizado, categoria por categoria — não para julgar, mas para aprender o que funcionou e o que não funcionou.",
              "Esse fechamento alimenta diretamente o planejamento do próximo mês: categorias que estouraram consistentemente podem precisar de um limite mais realista, ou de um esforço deliberado de redução.",
              "Fechar um mês e já começar o planejamento do próximo, no mesmo momento, cria um ciclo contínuo — em vez de recomeçar do zero a cada mês.",
            ],
            examples: [
              "Fechar outubro revela que \"transporte\" ficou 20% acima do planejado três meses seguidos — hora de ajustar o limite de novembro para refletir a realidade, ou investigar o motivo do aumento.",
              "Usar o saldo positivo de um mês bem-sucedido para reforçar uma meta ou a reserva, decidindo isso no fechamento, não deixando o dinheiro \"sumir\" sem destino.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Comparar planejado x realizado, categoria por categoria",
                "Identificar o que se repete (padrão) x o que foi pontual",
                "Ajustar os limites do próximo mês com base nisso",
                "Decidir o destino de qualquer saldo positivo",
              ],
            },
            keyConcepts: [
              "Fechamento mensal: comparar planejado x realizado sem julgamento.",
              "Alimenta o planejamento do próximo mês.",
              "Cria um ciclo contínuo em vez de recomeçar do zero todo mês.",
            ],
            quiz: [
              {
                question: "Qual o principal objetivo de comparar o planejado com o realizado no fechamento do mês?",
                options: ["Se sentir mal pelos gastos do mês", "Aprender o que funcionou e ajustar o planejamento do próximo mês com base em dados reais", "Preencher uma exigência do banco", "Calcular impostos"],
                correctIndex: 1,
                explanation: "O fechamento é uma ferramenta de aprendizado contínuo, não um veredito — ele informa decisões melhores no mês seguinte.",
              },
            ],
            exercise: {
              prompt: "Feche o mês atual (ou o último mês completo): compare planejado x realizado em 3 categorias, e já defina um ajuste para o planejamento do próximo mês.",
              placeholder: "Categoria 1: planejei R$ ..., gastei R$ ... — ajuste: ...\nCategoria 2: ...\nCategoria 3: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 3 — Método 50/30/20
    // ---------------------------------------------------------------
    {
      id: "metodo-50-30-20",
      title: "Método 50/30/20",
      description: "Um mergulho mais profundo na regra de divisão de renda mais usada do mundo.",
      icon: "📊",
      lessons: [
        {
          id: lid("metodo-50-30-20", 1),
          title: "De onde vem o método 50/30/20",
          content: {
            explanation: [
              "O método 50/30/20 foi popularizado pela senadora americana Elizabeth Warren no livro \"All Your Worth\", como uma forma simples de dividir a renda líquida sem precisar categorizar cada centavo desde o primeiro dia.",
              "A proposta original divide a renda em três blocos: 50% necessidades, 30% desejos, 20% poupança e quitação de dívidas — uma estrutura simples o suficiente para começar sem planilhas complexas.",
              "A força do método está na simplicidade: em vez de dezenas de categorias, três grandes blocos já dão uma direção clara sobre se o dinheiro está bem distribuído.",
            ],
            examples: [
              "Alguém que nunca fez orçamento pode começar só verificando se está gastando mais de 50% em necessidades — já é um primeiro diagnóstico útil.",
              "Comparar a divisão real (quanto realmente vai pra cada bloco) com a proposta 50/30/20 revela desequilíbrios rapidamente.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Popularizado por Elizabeth Warren no livro 'All Your Worth'",
                "Divide a renda líquida em 3 blocos simples",
                "50% necessidades, 30% desejos, 20% poupança/dívidas",
                "Serve como diagnóstico rápido, não como regra absoluta",
              ],
            },
            keyConcepts: [
              "Método popularizado por Elizabeth Warren.",
              "Divide a renda em 3 blocos: necessidades, desejos, poupança/dívidas.",
              "Simplicidade é a força do método — serve como primeiro diagnóstico.",
            ],
            quiz: [
              {
                question: "Qual é a principal vantagem do método 50/30/20 para quem está começando a organizar as finanças?",
                options: ["Ele garante ficar rico rapidamente", "Sua simplicidade: só 3 blocos, sem precisar de categorização detalhada desde o início", "Ele é obrigatório por lei", "Ele elimina a necessidade de qualquer acompanhamento"],
                correctIndex: 1,
                explanation: "A simplicidade do método é o que o torna acessível como ponto de partida, mesmo para quem nunca organizou as finanças antes.",
              },
            ],
            exercise: {
              prompt: "Some suas despesas do último mês nos três blocos (necessidades, desejos, poupança/dívidas) e calcule a porcentagem de cada um em relação à sua renda.",
              placeholder: "Necessidades: R$ ... (...%)\nDesejos: R$ ... (...%)\nPoupança/dívidas: R$ ... (...%)",
            },
          },
        },
        {
          id: lid("metodo-50-30-20", 2),
          title: "Adaptando as proporções à sua realidade",
          content: {
            explanation: [
              "As proporções 50/30/20 são um ponto de partida, não uma lei — quem vive em cidades com aluguel muito alto, por exemplo, pode facilmente ultrapassar os 50% em necessidades sem estar fazendo nada \"errado\".",
              "Adaptar o método significa ajustar as proporções à sua realidade atual, mantendo a lógica de três blocos, mas com percentuais que fazem sentido pra você — como 65/20/15, por exemplo.",
              "O objetivo de longo prazo pode ser caminhar de volta em direção às proporções originais (por exemplo, reduzindo necessidades ou aumentando renda), mas isso é um processo, não um requisito imediato.",
            ],
            examples: [
              "Alguém com aluguel de 40% da renda pode precisar de uma divisão tipo 70/20/10 temporariamente, até a situação de moradia mudar.",
              "Uma pessoa com renda alta e poucos compromissos fixos pode inverter a lógica, direcionando bem mais que 20% para poupança e investimentos.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Proporção padrão", items: ["50% necessidades", "30% desejos", "20% poupança/dívidas"] },
              right: { label: "Proporção adaptada (ex.)", items: ["70% necessidades", "20% desejos", "10% poupança/dívidas"] },
            },
            keyConcepts: [
              "50/30/20 é ponto de partida, não regra fixa.",
              "Adaptar mantém a lógica de 3 blocos com percentuais realistas.",
              "Caminhar de volta às proporções originais é um objetivo de longo prazo, não imediato.",
            ],
            quiz: [
              {
                question: "Se o aluguel sozinho já consome 40% da renda, o que isso indica sobre usar rigidamente o 50/30/20?",
                options: ["Que a pessoa está fazendo tudo errado", "Que as proporções provavelmente precisam ser adaptadas à realidade, sem abandonar a lógica de blocos", "Que ela deve se mudar imediatamente", "Que o método não serve para ninguém nessa situação"],
                correctIndex: 1,
                explanation: "O método serve de guia, não de camisa de força — adaptar as proporções à realidade é mais útil do que forçar um encaixe que não existe.",
              },
            ],
            exercise: {
              prompt: "Calcule as proporções reais das suas despesas hoje e compare com 50/30/20. Se forem diferentes, defina uma proporção adaptada que faça sentido pra sua realidade atual.",
              placeholder: "Minhas proporções reais: .../.../...\nMinha proporção adaptada: .../.../...",
            },
          },
        },
        {
          id: lid("metodo-50-30-20", 3),
          title: "O que entra em cada uma das três fatias",
          content: {
            explanation: [
              "Necessidades são despesas que você precisaria pagar mesmo com a renda reduzida ao mínimo: moradia, alimentação básica, transporte para o trabalho, saúde, contas essenciais.",
              "Desejos são despesas que melhoram a qualidade de vida mas não são estritamente necessárias: lazer, assinaturas de entretenimento, roupas além do básico, jantar fora.",
              "Poupança e dívidas incluem tanto guardar dinheiro (reserva, metas, investimentos) quanto pagar mais que o mínimo em dívidas — as duas coisas competem pelo mesmo espaço no orçamento.",
            ],
            examples: [
              "Um plano de internet básico é necessidade; um upgrade para o plano mais rápido do mercado, sem necessidade funcional, é desejo.",
              "Pagar o mínimo da fatura do cartão é necessidade (evita juros altíssimos); pagar mais que o mínimo para quitar mais rápido entra no bloco de \"dívidas\" dentro dos 20%.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Necessidades (50%)", items: ["Moradia", "Alimentação básica", "Transporte pro trabalho", "Saúde essencial"] },
              right: { label: "Desejos (30%)", items: ["Lazer", "Streaming e assinaturas", "Roupas além do básico", "Jantar fora"] },
            },
            keyConcepts: [
              "Necessidades: o que você pagaria mesmo com renda mínima.",
              "Desejos: melhoram a qualidade de vida, mas não são essenciais.",
              "Poupança/dívidas: guardar dinheiro E pagar mais que o mínimo em dívidas competem pelo mesmo espaço.",
            ],
            quiz: [
              {
                question: "Em qual bloco do 50/30/20 entra o pagamento EXTRA de uma dívida (além do mínimo)?",
                options: ["Necessidades", "Desejos", "Poupança/dívidas (os 20%)", "Nenhum dos três"],
                correctIndex: 2,
                explanation: "Tanto guardar dinheiro quanto acelerar a quitação de dívidas competem pelo mesmo bloco de 20% no método.",
              },
            ],
            exercise: {
              prompt: "Classifique 6 despesas do seu último mês nos três blocos (necessidade, desejo, poupança/dívida).",
              placeholder: "1. ... — bloco: ...\n2. ... — bloco: ...\n(continue até 6)",
            },
          },
        },
        {
          id: lid("metodo-50-30-20", 4),
          title: "Quando o método não se encaixa (e o que fazer)",
          content: {
            explanation: [
              "O 50/30/20 pressupõe uma renda relativamente estável e um custo de vida que cabe nessas proporções — quando isso não é verdade, forçar o encaixe gera frustração em vez de clareza.",
              "Para renda muito variável, uma alternativa é aplicar as proporções sobre a média dos últimos meses, ou sobre o cenário mais conservador, em vez do mês mais recente.",
              "Para custo de vida muito acima de 50% em necessidades, o foco de curto prazo pode precisar ser reduzir essas despesas fixas (mudança, renegociação) antes que o método volte a fazer sentido.",
            ],
            examples: [
              "Freelancer com receita entre R$ 2.000 e R$ 5.000: aplicar as proporções sobre R$ 2.500 (cenário conservador) evita compromissos que quebram nos meses fracos.",
              "Alguém pagando um aluguel muito acima da faixa recomendada pode planejar uma mudança de moradia como meta de médio prazo, para eventualmente reequilibrar as proporções.",
            ],
            keyConcepts: [
              "O método pressupõe renda estável e custo de vida moderado.",
              "Renda variável: aplicar sobre a média ou o cenário conservador.",
              "Necessidades muito acima de 50%: focar em reduzir despesas fixas antes de tudo.",
            ],
            quiz: [
              {
                question: "Para quem tem renda muito variável, qual abordagem é mais segura ao aplicar o 50/30/20?",
                options: ["Usar sempre o melhor mês como referência", "Usar a média dos últimos meses ou um cenário conservador como referência", "Ignorar o método completamente", "Esperar a renda estabilizar para começar a planejar"],
                correctIndex: 1,
                explanation: "Basear o planejamento no cenário conservador evita compromissos que não se sustentam nos meses de receita mais baixa.",
              },
            ],
            exercise: {
              prompt: "Se sua renda é variável, calcule a média dos últimos 3-6 meses e refaça a divisão 50/30/20 com base nesse valor, em vez do último mês isolado.",
              placeholder: "Renda dos últimos meses: ...\nMédia calculada: R$ ...\nDivisão 50/30/20 sobre a média: .../.../...",
            },
          },
        },
        {
          id: lid("metodo-50-30-20", 5),
          title: "Colocando o método em prática por 3 meses",
          content: {
            explanation: [
              "O 50/30/20 (ou a versão adaptada) só mostra seu valor real quando aplicado por um período, não em um mês isolado — 3 meses é um prazo curto o suficiente para não desanimar e longo o suficiente para revelar padrões.",
              "Durante esse período, o objetivo não é acertar perfeitamente desde o primeiro mês, mas ir ajustando: nenhuma divisão sai perfeita na primeira tentativa.",
              "Ao final dos 3 meses, vale revisar: as proporções fazem sentido? Alguma categoria consistentemente foge do esperado? Isso informa se a divisão deve ser mantida ou ajustada.",
            ],
            examples: [
              "Mês 1: aplicar as proporções e registrar tudo. Mês 2: já ajustar com base no que foi observado. Mês 3: verificar se o padrão estabilizou.",
              "Perceber, depois de 3 meses, que \"desejos\" consistentemente fica em 40% (não 30%) é informação real para decidir: reduzir o gasto ou aceitar uma proporção adaptada.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Mês 1: aplicar as proporções e registrar tudo, sem se cobrar perfeição",
                "Mês 2: ajustar com base no que foi observado no mês 1",
                "Mês 3: verificar se o padrão estabilizou",
                "Revisar: manter as proporções ou adaptar permanentemente?",
              ],
            },
            keyConcepts: [
              "O valor do método aparece com aplicação continuada, não em um mês isolado.",
              "Não é necessário acertar perfeitamente desde o primeiro mês.",
              "Ao final do período, revisar se as proporções fazem sentido ou precisam de ajuste.",
            ],
            quiz: [
              {
                question: "Por que aplicar o método por 3 meses (em vez de julgar por um mês só) dá uma visão mais confiável?",
                options: ["Porque 3 meses é uma exigência legal", "Porque revela se os desvios são pontuais ou um padrão consistente, o que um único mês não mostra", "Porque o primeiro mês nunca conta", "Porque o método só funciona a partir do terceiro mês"],
                correctIndex: 1,
                explanation: "Um único mês pode ter sido atípico por algum motivo pontual — só com repetição dá pra distinguir exceção de padrão.",
              },
            ],
            exercise: {
              prompt: "Comprometa-se a aplicar sua divisão (50/30/20 ou adaptada) pelos próximos 3 meses. Anote aqui a divisão que você vai usar e uma data para revisar ao final do período.",
              placeholder: "Minha divisão: .../.../...\nVou revisar em: (data)",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 4 — Controle de dívidas
    // ---------------------------------------------------------------
    {
      id: "controle-de-dividas",
      title: "Controle de dívidas",
      description: "Mapear, priorizar e sair de dívidas sem entrar em pânico.",
      icon: "📉",
      lessons: [
        {
          id: lid("controle-de-dividas", 1),
          title: "Mapeando todas as suas dívidas",
          content: {
            explanation: [
              "O primeiro passo para sair de dívidas é ter clareza total sobre elas: quantas existem, quanto cada uma deve, qual a taxa de juros e qual o valor mínimo mensal — muita gente evita esse mapeamento por medo do que vai encontrar, o que só piora a situação.",
              "Dívidas \"esquecidas\" ou \"invisíveis\" (parcelamentos pequenos, cheque especial usado esporadicamente) somam mais do que parecem quando finalmente são listadas juntas.",
              "Esse mapeamento não precisa ser perfeito na primeira tentativa — o objetivo é ter uma visão real, mesmo que desconfortável, como base para qualquer plano de saída.",
            ],
            examples: [
              "Listar: cartão de crédito R$ 3.200 (rotativo, 15% a.m.), financiamento do celular R$ 800 (parcelas fixas), cheque especial usado R$ 400 (juros altos) — total real: R$ 4.400, não só \"o cartão\".",
              "Perceber, ao mapear, que a soma de 3 dívidas \"pequenas\" supera uma dívida \"grande\" que parecia a única prioridade.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Listar cada dívida separadamente",
                "Anotar valor total, taxa de juros e parcela mínima de cada uma",
                "Somar o total real (a surpresa mais comum)",
                "Usar esse mapa como base do plano de saída",
              ],
            },
            keyConcepts: [
              "Mapear é o primeiro passo — evitar olhar só piora a situação.",
              "Dívidas pequenas 'esquecidas' somam mais do que parecem isoladas.",
              "O mapa não precisa ser perfeito, precisa ser real.",
            ],
            quiz: [
              {
                question: "Por que dívidas pequenas e 'esquecidas' são particularmente perigosas?",
                options: ["Porque têm sempre os juros mais altos", "Porque, somadas, podem representar um valor maior do que parece quando vistas isoladamente", "Porque bancos escondem essas informações", "Porque não aparecem no CPF"],
                correctIndex: 1,
                explanation: "O perigo está exatamente em não serem vistas em conjunto — cada uma parece pequena, mas a soma pode ser substancial.",
              },
            ],
            exercise: {
              prompt: "Liste todas as suas dívidas atuais (mesmo as pequenas): valor total, taxa de juros (se souber) e parcela mínima mensal.",
              placeholder: "1. ... — Total: R$ ... — Juros: ...% — Parcela mínima: R$ ...\n2. ...",
            },
          },
        },
        {
          id: lid("controle-de-dividas", 2),
          title: "Dívida boa x dívida ruim",
          content: {
            explanation: [
              "Nem toda dívida é igualmente prejudicial: dívida \"boa\" tende a ter juros baixos e financiar algo que gera valor ou se valoriza (financiamento imobiliário, educação); dívida \"ruim\" tem juros altos e financia consumo que já perdeu valor no momento da compra.",
              "Cartão de crédito rotativo e cheque especial são os exemplos clássicos de dívida ruim no Brasil, com taxas de juros que podem superar 10-15% ao MÊS — um patamar que torna a dívida praticamente impossível de vencer se não for atacada rápido.",
              "Reconhecer essa diferença ajuda a priorizar: dívida ruim exige ação urgente; dívida boa pode conviver com um plano de pagamento mais tranquilo, dentro do orçamento.",
            ],
            examples: [
              "Financiamento de um imóvel a juros de 8% ao ano: dívida relativamente \"boa\", financia um bem que tende a manter ou aumentar valor.",
              "Rotativo do cartão de crédito a 15% ao MÊS: dívida \"ruim\", os juros sozinhos podem dobrar o valor devido em poucos meses.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Dívida 'boa'", items: ["Juros relativamente baixos", "Financia algo que gera valor (imóvel, educação)", "Prazo longo e previsível"] },
              right: { label: "Dívida 'ruim'", items: ["Juros muito altos (cartão, cheque especial)", "Financia consumo que já perdeu valor", "Cresce rápido se não for atacada"] },
            },
            keyConcepts: [
              "Dívida boa: juros baixos, financia algo de valor duradouro.",
              "Dívida ruim: juros altos, financia consumo já consumido.",
              "Cartão de crédito rotativo e cheque especial são os exemplos clássicos de dívida ruim.",
            ],
            quiz: [
              {
                question: "O que torna o rotativo do cartão de crédito uma 'dívida ruim' clássica no Brasil?",
                options: ["Ele não pode ser quitado antecipadamente", "As taxas de juros muito altas (podendo superar 10-15% ao mês) fazem a dívida crescer rapidamente", "Ele só existe para quem tem renda baixa", "Ele é ilegal"],
                correctIndex: 1,
                explanation: "A combinação de juros compostos com uma taxa mensal muito alta é o que torna o rotativo particularmente perigoso.",
              },
            ],
            exercise: {
              prompt: "Revise as dívidas que você mapeou na aula anterior e classifique cada uma como 'boa' ou 'ruim', com base nos juros e no que ela financia.",
              placeholder: "Dívida 1: ... — boa/ruim, porque...\nDívida 2: ...",
            },
          },
        },
        {
          id: lid("controle-de-dividas", 3),
          title: "Priorizando qual dívida pagar primeiro",
          content: {
            explanation: [
              "Duas estratégias clássicas de priorização: a \"avalanche\" (pagar primeiro a dívida com maior taxa de juros, matematicamente mais eficiente) e a \"bola de neve\" (pagar primeiro a menor dívida, para ganhar motivação com vitórias rápidas).",
              "A avalanche economiza mais dinheiro no total, porque ataca primeiro o que mais cresce; a bola de neve pode ser mais sustentável psicologicamente para quem precisa de motivação visível para manter o esforço.",
              "Em ambas as estratégias, o valor mínimo de TODAS as dívidas continua sendo pago — a priorização decide onde vai o valor EXTRA disponível além dos mínimos.",
            ],
            examples: [
              "Avalanche: entre uma dívida de R$ 500 a 3% a.m. e outra de R$ 3.000 a 12% a.m., o extra vai para a de 12%, mesmo sendo a maior em valor.",
              "Bola de neve: a mesma pessoa quita primeiro a de R$ 500 (mais rápido), ganhando a sensação de progresso antes de atacar a maior.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Método avalanche", items: ["Prioriza maior taxa de juros", "Economiza mais dinheiro no total", "Exige mais disciplina sem vitórias rápidas"] },
              right: { label: "Método bola de neve", items: ["Prioriza menor valor devido", "Gera motivação com vitórias rápidas", "Pode custar um pouco mais em juros totais"] },
            },
            keyConcepts: [
              "Avalanche: prioriza maior juros, mais eficiente matematicamente.",
              "Bola de neve: prioriza menor valor, mais sustentável psicologicamente.",
              "Em ambos os métodos, os mínimos de todas as dívidas continuam sendo pagos.",
            ],
            quiz: [
              {
                question: "Qual a principal vantagem do método 'bola de neve' sobre o 'avalanche', apesar de custar um pouco mais em juros?",
                options: ["Ele é mais rápido em todos os casos", "Ele gera motivação com vitórias rápidas, o que ajuda a manter a disciplina ao longo do processo", "Ele elimina os juros completamente", "Ele é exigido pelos bancos"],
                correctIndex: 1,
                explanation: "Para muita gente, ver uma dívida inteira zerada rapidamente é o que sustenta o esforço emocional de continuar o plano.",
              },
            ],
            exercise: {
              prompt: "Com base nas suas dívidas mapeadas, monte a ordem de prioridade usando o método avalanche E o método bola de neve. Qual faz mais sentido pra você?",
              placeholder: "Ordem avalanche: ...\nOrdem bola de neve: ...\nVou usar: ... porque...",
            },
          },
        },
        {
          id: lid("controle-de-dividas", 4),
          title: "Renegociando com credores",
          content: {
            explanation: [
              "Credores (bancos, financeiras, lojas) frequentemente preferem receber uma parte da dívida renegociada a não receber nada — isso significa que negociar é, na maioria das vezes, uma opção real, não um sinal de fraqueza.",
              "Antes de negociar, vale saber o valor total real da dívida, ter uma proposta de valor e prazo que caiba no orçamento, e considerar propor um desconto para pagamento à vista, se houver algum valor disponível.",
              "Programas e mutirões de renegociação (como os promovidos por federações de bancos ou órgãos de defesa do consumidor) costumam oferecer condições melhores do que negociar isoladamente — vale pesquisar antes de aceitar a primeira proposta.",
            ],
            examples: [
              "Propor \"R$ 2.000 à vista para quitar uma dívida de R$ 3.500\" — muitos credores aceitam descontos significativos por antecipar o recebimento.",
              "Participar de um mutirão de renegociação de dívidas, que costuma oferecer taxas de desconto e parcelamento melhores que uma negociação direta com o banco.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Levantar o valor total real da dívida",
                "Pesquisar mutirões e programas de renegociação disponíveis",
                "Preparar uma proposta (valor + prazo) que caiba no orçamento",
                "Negociar — e colocar o acordo por escrito",
              ],
            },
            keyConcepts: [
              "Credores costumam preferir receber parte a não receber nada.",
              "Ter uma proposta pronta (valor + prazo) antes de negociar.",
              "Mutirões e programas de renegociação costumam ter condições melhores.",
            ],
            quiz: [
              {
                question: "Por que muitos credores aceitam negociar um desconto para pagamento à vista?",
                options: ["Porque são obrigados por lei", "Porque preferem receber uma parte do valor imediatamente a correr o risco de não receber nada", "Porque desconto à vista é sempre pequeno demais para importar", "Porque é uma armadilha para o consumidor"],
                correctIndex: 1,
                explanation: "Do ponto de vista do credor, dinheiro garantido agora costuma valer mais do que a expectativa incerta de receber o valor total no futuro.",
              },
            ],
            exercise: {
              prompt: "Se você tem uma dívida em aberto, pesquise se existe um mutirão de renegociação disponível, ou prepare uma proposta de negociação (valor + prazo) para levar ao credor.",
              placeholder: "Dívida a negociar: ...\nMutirão encontrado: ...\nMinha proposta: ...",
            },
          },
        },
        {
          id: lid("controle-de-dividas", 5),
          title: "Evitando cair em dívida de novo",
          content: {
            explanation: [
              "Sair de uma dívida sem mudar o padrão que levou a ela é um ciclo comum — por isso o passo final do controle de dívidas é entender a causa raiz: foi um imprevisto sem reserva, um padrão de gasto acima da renda, ou falta de acompanhamento?",
              "Ter uma reserva de emergência, mesmo pequena, é a principal proteção contra voltar a usar crédito caro na primeira dificuldade — ela quebra o ciclo de \"imprevisto vira dívida\".",
              "Reconstruir o hábito de acompanhar receitas e despesas regularmente (voltando às bases do orçamento) evita que o padrão que gerou a dívida original se repita silenciosamente.",
            ],
            examples: [
              "Alguém que caiu no rotativo por um imprevisto de saúde sem reserva: depois de quitar a dívida, o próximo passo lógico é construir a reserva, não só \"gastar menos\".",
              "Reativar o registro de transações no Mind Money depois de sair de uma dívida ajuda a identificar cedo se o padrão antigo está voltando.",
            ],
            keyConcepts: [
              "Entender a causa raiz evita repetir o ciclo.",
              "Reserva de emergência é a principal proteção contra voltar a se endividar.",
              "Retomar o acompanhamento regular do orçamento previne recaída silenciosa.",
            ],
            quiz: [
              {
                question: "Por que ter uma reserva de emergência é considerada a principal proteção contra cair em dívida de novo?",
                options: ["Porque elimina todos os imprevistos da vida", "Porque cobre imprevistos sem precisar recorrer a crédito caro, quebrando o ciclo de 'imprevisto vira dívida'", "Porque garante que você nunca mais vai gastar mais do que ganha", "Porque bancos exigem isso"],
                correctIndex: 1,
                explanation: "A reserva é o que permite absorver um imprevisto sem precisar de crédito caro — o gatilho mais comum de novas dívidas.",
              },
            ],
            exercise: {
              prompt: "Reflita sobre a causa raiz de alguma dívida que você teve (ou tem). O que precisa mudar para que essa situação não se repita?",
              placeholder: "A causa raiz foi: ...\nO que vou mudar: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 5 — Organização financeira na prática
    // ---------------------------------------------------------------
    {
      id: "organizacao-financeira-na-pratica",
      title: "Organização financeira",
      description: "Juntando orçamento, metas, reserva e controle de dívidas em uma rotina só.",
      icon: "🧩",
      lessons: [
        {
          id: lid("organizacao-financeira-na-pratica", 1),
          title: "Juntando todas as peças do quebra-cabeça",
          content: {
            explanation: [
              "Até aqui, cada peça foi tratada separadamente: orçamento, metas, reserva, controle de dívidas. Organização financeira de verdade é o momento de ver como todas essas peças se encaixam num sistema só.",
              "A ordem que costuma funcionar bem: orçamento sob controle primeiro, depois reserva de emergência, depois quitação de dívidas caras, e só então metas de médio/longo prazo e investimentos.",
              "Nenhuma peça funciona isolada por muito tempo: um orçamento sem reserva quebra no primeiro imprevisto; metas sem orçamento não têm de onde tirar o dinheiro.",
            ],
            examples: [
              "Alguém com orçamento organizado mas sem reserva ainda está vulnerável a um único imprevisto desfazer meses de progresso.",
              "Juntar tudo no Mind Money — Dashboard (orçamento), Metas (reserva e objetivos), Score (visão geral) — é a versão prática desse encaixe.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "1. Orçamento sob controle",
                "2. Reserva de emergência",
                "3. Quitação de dívidas caras",
                "4. Metas de médio/longo prazo",
                "5. Investimentos",
              ],
            },
            keyConcepts: [
              "Organização financeira é o encaixe de várias peças, não uma peça isolada.",
              "A ordem importa: orçamento → reserva → dívidas caras → metas → investimentos.",
              "Peças isoladas são frágeis; o sistema completo é resiliente.",
            ],
            quiz: [
              {
                question: "Por que a reserva de emergência costuma vir antes das metas de médio/longo prazo nessa ordem?",
                options: ["Porque é mais fácil de completar", "Porque protege o progresso das outras metas contra imprevistos, que de outra forma poderiam desfazer meses de esforço", "Porque rende mais dinheiro", "Porque é exigida antes de abrir qualquer meta"],
                correctIndex: 1,
                explanation: "Sem essa proteção, um imprevisto pode zerar o progresso de qualquer outra meta em andamento — por isso ela vem antes.",
              },
            ],
            exercise: {
              prompt: "Avalie em que etapa da ordem (orçamento, reserva, dívidas, metas, investimentos) você está hoje, e qual é o próximo passo lógico.",
              placeholder: "Etapa atual: ...\nPróximo passo: ...",
            },
          },
        },
        {
          id: lid("organizacao-financeira-na-pratica", 2),
          title: "Criando sua rotina financeira pessoal",
          content: {
            explanation: [
              "Organização financeira que depende de lembrar de fazer tudo manualmente, sem rotina fixa, tende a se perder com o tempo — criar hábitos regulares é o que sustenta o sistema no longo prazo.",
              "Uma rotina simples costuma ter três frequências: diária/semanal (registrar transações), mensal (planejar e fechar o mês), e trimestral/anual (revisar metas, reserva e investimentos como um todo).",
              "Vincular essas rotinas a momentos já existentes na sua semana (um café da manhã de domingo, o início do mês) aumenta a chance de elas realmente acontecerem.",
            ],
            examples: [
              "Registrar transações toda noite antes de dormir, por 2 minutos, em vez de tentar lembrar tudo no fim do mês.",
              "Reservar a primeira segunda-feira do mês para planejar o mês que começa e fechar o anterior.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Rotina frequente", items: ["Registrar transações (diário/semanal)", "Rápido, poucos minutos"] },
              right: { label: "Rotina espaçada", items: ["Planejar e fechar o mês (mensal)", "Revisar metas e investimentos (trimestral)"] },
            },
            keyConcepts: [
              "Rotina fixa sustenta o sistema; depender da memória não sustenta.",
              "Frequências diferentes para tarefas diferentes: diária, mensal, trimestral.",
              "Vincular a momentos já existentes na rotina aumenta a chance de continuar.",
            ],
            quiz: [
              {
                question: "Por que vincular uma tarefa financeira a um momento já existente na rotina (como um café de domingo) ajuda a mantê-la?",
                options: ["Porque é uma exigência do Mind Money", "Porque reduz a chance de esquecer, já que está associada a algo que já acontece naturalmente", "Porque torna a tarefa mais rápida", "Porque elimina a necessidade de fazer a tarefa"],
                correctIndex: 1,
                explanation: "Hábitos que se apoiam em rotinas já existentes têm muito mais chance de se manter do que os que dependem só de lembrar.",
              },
            ],
            exercise: {
              prompt: "Defina sua rotina financeira pessoal: quando você vai registrar transações, quando vai planejar/fechar o mês, e a que momento da sua semana/mês isso vai estar vinculado.",
              placeholder: "Registro de transações: quando? ...\nPlanejamento mensal: quando? ...\nVinculado a: ...",
            },
          },
        },
        {
          id: lid("organizacao-financeira-na-pratica", 3),
          title: "Organizando documentos e senhas financeiras",
          content: {
            explanation: [
              "Além do dinheiro em si, organização financeira inclui saber onde estão os documentos e acessos importantes: contas bancárias, investimentos, seguros, contratos — informação que costuma ficar espalhada e difícil de reunir quando mais se precisa dela.",
              "Um gerenciador de senhas (em vez de anotações soltas ou senhas repetidas) protege o acesso a essas contas, que concentram informação financeira sensível.",
              "Ter um \"inventário financeiro\" simples — lista de contas, investimentos e contatos importantes — facilita tanto o seu próprio controle quanto, em situações extremas, o acesso por familiares em caso de necessidade.",
            ],
            examples: [
              "Uma pasta (física ou digital) com contratos de financiamento, apólices de seguro e extratos de investimentos organizados por tipo.",
              "Um gerenciador de senhas com todas as contas financeiras, em vez de senhas anotadas em papéis avulsos ou repetidas entre serviços.",
            ],
            keyConcepts: [
              "Organização financeira inclui documentos e acessos, não só dinheiro.",
              "Gerenciador de senhas protege contas com informação sensível.",
              "Um inventário financeiro simples ajuda você e, se necessário, sua família.",
            ],
            quiz: [
              {
                question: "Por que usar um gerenciador de senhas é recomendado para contas financeiras?",
                options: ["Porque é mais bonito que anotar em papel", "Porque protege o acesso a contas com informação financeira sensível, evitando senhas fracas ou repetidas", "Porque é exigido pelos bancos", "Porque acelera o login"],
                correctIndex: 1,
                explanation: "Senhas repetidas ou fracas são um risco real de segurança justamente nas contas que concentram mais informação sensível.",
              },
            ],
            exercise: {
              prompt: "Liste suas contas financeiras principais (bancos, investimentos, seguros) e avalie se você sabe onde estão os documentos e como estão protegidas as senhas de cada uma.",
              placeholder: "Conta/serviço: ... — documentos: onde? ... — senha: protegida como?",
            },
          },
        },
        {
          id: lid("organizacao-financeira-na-pratica", 4),
          title: "Envolvendo a família/parceiro(a) nas finanças",
          content: {
            explanation: [
              "Quando as finanças são compartilhadas (casal, família), organização financeira individual não é suficiente — decisões precisam ser alinhadas, ou um esforço de um lado pode ser desfeito pelo outro sem perceber.",
              "Conversas sobre dinheiro costumam ser evitadas por desconforto, mas alinhar expectativas (metas em comum, limites de gasto individual, divisão de contas) evita conflitos maiores no futuro.",
              "Uma prática útil é ter uma revisão financeira em conjunto periódica (mensal ou quinzenal), curta e objetiva, focada em decisões, não em cobranças.",
            ],
            examples: [
              "Um casal que nunca discutiu metas em comum pode descobrir, só depois de anos, que tinham prioridades completamente diferentes para o dinheiro guardado.",
              "Uma reunião financeira mensal de 20 minutos, revisando gastos e metas em conjunto, evita que decisões importantes sejam tomadas sem alinhamento.",
            ],
            keyConcepts: [
              "Finanças compartilhadas exigem alinhamento, não só organização individual.",
              "Conversas sobre dinheiro evitadas geram conflitos maiores depois.",
              "Revisões periódicas em conjunto, curtas e focadas em decisões, ajudam a manter o alinhamento.",
            ],
            quiz: [
              {
                question: "Qual o risco de não alinhar as finanças quando elas são compartilhadas (casal, família)?",
                options: ["Nenhum, cada um pode cuidar do seu próprio dinheiro sem problema", "O esforço de organização de um lado pode ser desfeito pelo outro sem perceber, por falta de alinhamento", "É sempre melhor não misturar finanças com relacionamentos", "Só importa se houver filhos envolvidos"],
                correctIndex: 1,
                explanation: "Sem alinhamento, decisões desencontradas podem anular o progresso financeiro de ambos os lados.",
              },
            ],
            exercise: {
              prompt: "Se você compartilha finanças com alguém, proponha uma conversa (ou revisão financeira) sobre metas em comum. Anote os principais pontos que gostaria de alinhar.",
              placeholder: "Pontos para alinhar: ...",
            },
          },
        },
        {
          id: lid("organizacao-financeira-na-pratica", 5),
          title: "Mantendo o sistema funcionando no longo prazo",
          content: {
            explanation: [
              "Um sistema de organização financeira não é \"concluído\" — ele precisa ser mantido, porque a vida muda: renda muda, prioridades mudam, novas metas surgem.",
              "Sinais de que o sistema precisa de revisão: você para de registrar transações, os limites do orçamento não fazem mais sentido, ou uma meta importante mudou de prioridade sem o planejamento acompanhar.",
              "Revisões periódicas (a cada 6 meses ou 1 ano) do sistema como um todo — não só do orçamento mensal — garantem que ele continue refletindo sua vida real, não uma versão antiga dela.",
            ],
            examples: [
              "Uma mudança de emprego com novo salário é um gatilho natural para revisar todo o sistema, não só ajustar um número.",
              "Perceber que você parou de registrar transações há 2 meses é um sinal de que algo no sistema não está mais funcionando — vale investigar o motivo, não só \"voltar a tentar\".",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Sinais de que o sistema precisa de revisão (parar de registrar, limites sem sentido, mudança de vida)",
                "Revisão periódica programada (6 meses/1 ano)",
                "Ajustar o sistema à realidade atual",
                "Continuar — organização financeira é contínua, não um projeto com fim",
              ],
            },
            keyConcepts: [
              "O sistema precisa ser mantido, não é um projeto com fim definido.",
              "Mudanças de vida são gatilhos naturais para revisar o sistema inteiro.",
              "Revisões periódicas programadas evitam que o sistema fique desatualizado.",
            ],
            quiz: [
              {
                question: "O que indica que o sistema de organização financeira de alguém pode precisar de revisão?",
                options: ["Só o fato de já ter passado um ano desde a criação", "Sinais como parar de registrar transações, limites que não fazem mais sentido, ou uma mudança de vida importante", "Nunca precisa de revisão depois de criado", "Só quando alguém erra o orçamento uma vez"],
                correctIndex: 1,
                explanation: "Esses sinais indicam que o sistema não está mais refletindo a realidade atual — hora de ajustar, não de abandonar.",
              },
            ],
            exercise: {
              prompt: "Avalie: seu sistema financeiro atual ainda reflete sua realidade? Existe algum sinal de que precisa de revisão? Agende uma data para essa revisão.",
              placeholder: "Sinais que percebi: ...\nData da próxima revisão: ...",
            },
          },
        },
      ],
    },

    // ---------------------------------------------------------------
    // Curso 6 — Automatizando suas finanças
    // ---------------------------------------------------------------
    {
      id: "automatizando-suas-financas",
      title: "Automatizando suas finanças",
      description: "Fazer o sistema trabalhar por você, com o mínimo de esforço manual recorrente.",
      icon: "⚙️",
      lessons: [
        {
          id: lid("automatizando-suas-financas", 1),
          title: "Por que automatizar reduz erros e esquecimentos",
          content: {
            explanation: [
              "Decisões financeiras que dependem de lembrar e agir manualmente todo mês (pagar uma conta, transferir para a reserva) estão sujeitas a esquecimento, atraso ou simplesmente não acontecerem quando o mês fica corrido.",
              "Automatizar remove a dependência de força de vontade ou memória no dia a dia: a ação acontece de qualquer forma, tenha sido um mês tranquilo ou corrido.",
              "Isso não significa abrir mão do controle — automações ainda são definidas, revisadas e ajustadas por você; elas só executam o que já foi decidido, sem exigir repetição manual.",
            ],
            examples: [
              "Um débito automático da fatura do cartão evita esquecimento e a consequente cobrança de juros por atraso.",
              "Uma transferência automática para a reserva no dia do pagamento garante que ela aconteça mesmo em meses corridos, sem depender de lembrar.",
            ],
            keyConcepts: [
              "Automatizar remove a dependência de memória e força de vontade.",
              "Automação executa o que já foi decidido, sem exigir repetição manual.",
              "Controle continua existindo: você define, revisa e ajusta as automações.",
            ],
            quiz: [
              {
                question: "Qual o principal benefício de automatizar tarefas financeiras recorrentes?",
                options: ["Elas ficam mais caras", "Reduz a dependência de lembrar e agir manualmente todo mês, o que evita esquecimentos e atrasos", "Elimina qualquer necessidade de acompanhamento depois", "É uma exigência dos bancos"],
                correctIndex: 1,
                explanation: "A automação garante que a ação aconteça independente de quão corrido esteja o mês, sem depender da memória.",
              },
            ],
            exercise: {
              prompt: "Liste 3 tarefas financeiras que você faz manualmente hoje (pagar contas, transferir para reserva) e que poderiam ser automatizadas.",
              placeholder: "1. ...\n2. ...\n3. ...",
            },
          },
        },
        {
          id: lid("automatizando-suas-financas", 2),
          title: "Automatizando contas fixas e assinaturas",
          content: {
            explanation: [
              "Contas com valor fixo e previsível (aluguel, financiamento, mensalidades) são as candidatas mais óbvias para débito automático — o valor não muda, então não há risco de pagar errado.",
              "Para contas com valor variável (como energia elétrica), o débito automático também funciona, mas exige manter saldo suficiente na conta, já que o valor exato só é conhecido no momento do débito.",
              "Vale revisar periodicamente a lista de débitos automáticos: é comum acumular assinaturas esquecidas justamente porque, uma vez automatizadas, elas nunca mais chamam atenção.",
            ],
            examples: [
              "Débito automático do aluguel, financiamento e mensalidade da academia: valores fixos, sem necessidade de conferência mensal.",
              "Revisar a fatura do cartão a cada poucos meses para identificar assinaturas automáticas que não fazem mais sentido.",
            ],
            diagram: {
              type: "comparison",
              left: { label: "Bons candidatos a débito automático", items: ["Aluguel e financiamento (valor fixo)", "Mensalidades e assinaturas", "Contas com valor previsível"] },
              right: { label: "Exige atenção extra", items: ["Contas de valor variável (energia, água)", "Precisa de saldo suficiente na conta", "Revisar assinaturas periodicamente"] },
            },
            keyConcepts: [
              "Contas de valor fixo são as candidatas mais seguras ao débito automático.",
              "Contas variáveis exigem saldo disponível, já que o valor muda.",
              "Revisar periodicamente evita acumular assinaturas esquecidas.",
            ],
            quiz: [
              {
                question: "Por que é importante revisar periodicamente a lista de débitos automáticos e assinaturas?",
                options: ["Porque eles mudam de banco sozinhos", "Porque, uma vez automatizados, tendem a passar despercebidos, inclusive assinaturas que não fazem mais sentido", "Porque é uma exigência legal revisar todo mês", "Porque débito automático é sempre temporário"],
                correctIndex: 1,
                explanation: "A mesma característica que torna a automação útil (não precisar pensar nela) é o que faz assinaturas esquecidas passarem despercebidas por muito tempo.",
              },
            ],
            exercise: {
              prompt: "Revise suas contas e assinaturas atuais: quais já são automáticas, quais poderiam ser, e existe alguma automática que você esqueceu que existia?",
              placeholder: "Já automáticas: ...\nPoderiam ser automatizadas: ...\nEsquecidas encontradas: ...",
            },
          },
        },
        {
          id: lid("automatizando-suas-financas", 3),
          title: "Automatizando aportes para reserva e metas",
          content: {
            explanation: [
              "O princípio de \"pagar a reserva/meta primeiro\" (visto na trilha de Fundamentos) fica muito mais consistente quando automatizado: uma transferência programada para o dia do pagamento elimina a decisão manual de \"vou guardar ou não esse mês\".",
              "Automatizar aportes também remove o risco de gastar o dinheiro antes de guardar: se a transferência acontece assim que a receita entra, não sobra a chance de gastar primeiro e \"guardar o que sobrar\" (que geralmente é pouco ou nada).",
              "Isso não elimina a necessidade de revisar os valores periodicamente — uma mudança de renda ou de prioridade deve atualizar o valor automatizado, não deixá-lo desatualizado.",
            ],
            examples: [
              "Transferência automática de R$ 300 para a reserva de emergência todo dia 5, assim que o salário cai.",
              "Aporte automático mensal para uma meta específica no Mind Money, registrado assim que a receita chega, em vez de esperar \"sobrar\" no fim do mês.",
            ],
            diagram: {
              type: "formula",
              formula: "Guardar primeiro (automático) resulta em mais progresso do que Guardar o que sobra (manual, no fim do mês)",
              caption: "Automatizar o aporte inverte a ordem: guardar deixa de depender de sobrar dinheiro.",
            },
            keyConcepts: [
              "Automatizar aportes elimina a decisão manual mensal de guardar ou não.",
              "Remove o risco de gastar antes de guardar.",
              "Os valores automatizados ainda precisam ser revisados quando a renda ou as prioridades mudam.",
            ],
            quiz: [
              {
                question: "Qual problema comum a automação de aportes resolve diretamente?",
                options: ["O problema de pagar juros altos", "O risco de gastar todo o dinheiro antes de guardar, deixando só o que sobra (geralmente pouco) para a reserva/meta", "O problema de escolher onde investir", "A necessidade de ter uma conta bancária"],
                correctIndex: 1,
                explanation: "Automatizar o aporte logo que a receita entra garante que guardar aconteça antes de qualquer gasto, não depois.",
              },
            ],
            exercise: {
              prompt: "Se você ainda não automatizou os aportes para sua reserva ou metas, programe uma transferência automática para o dia em que sua receita principal entra.",
              placeholder: "Valor a automatizar: R$ ...\nDia da transferência: ...\nDestino: reserva / meta específica",
            },
          },
        },
        {
          id: lid("automatizando-suas-financas", 4),
          title: "Alertas e lembretes financeiros",
          content: {
            explanation: [
              "Nem tudo pode (ou deve) ser totalmente automatizado — para essas situações, alertas e lembretes cumprem um papel intermediário: avisam no momento certo, sem exigir acompanhamento constante.",
              "Alertas úteis incluem: aproximação de um limite de gastos numa categoria, vencimento de uma conta que não é debitada automaticamente, ou progresso de uma meta que está fora do ritmo esperado.",
              "O Mind Money já oferece parte disso automaticamente: o alerta de limite de gastos e as notificações de meta atingida — mas lembretes pessoais (num calendário ou app) complementam o que o sistema ainda não cobre.",
            ],
            examples: [
              "Um alerta de calendário para o vencimento de uma conta que exige pagamento manual (boleto que não aceita débito automático).",
              "A notificação automática do Mind Money quando os gastos do mês se aproximam do limite definido.",
            ],
            keyConcepts: [
              "Alertas cobrem o que não pode (ou não deve) ser automatizado.",
              "Avisam no momento certo, sem exigir acompanhamento constante.",
              "Combinar alertas automáticos do sistema com lembretes pessoais cobre mais situações.",
            ],
            quiz: [
              {
                question: "Qual é a função de um alerta financeiro, diferente de uma automação completa?",
                options: ["Executar a ação sozinho, sem intervenção", "Avisar no momento certo para que você tome uma decisão ou ação, sem exigir acompanhamento constante", "Substituir totalmente o orçamento", "Bloquear gastos automaticamente"],
                correctIndex: 1,
                explanation: "Alertas informam para que você aja, mas não agem sozinhos — diferente de uma automação como um débito automático.",
              },
            ],
            exercise: {
              prompt: "Identifique uma situação financeira que hoje depende só da sua memória (um vencimento, um limite) e configure um alerta ou lembrete para ela.",
              placeholder: "Situação: ...\nAlerta configurado: ...",
            },
          },
        },
        {
          id: lid("automatizando-suas-financas", 5),
          title: "Revisando as automações periodicamente",
          content: {
            explanation: [
              "Automações criadas e nunca revisadas correm o risco de ficar desatualizadas: um valor de aporte que não reflete mais a renda atual, um débito automático de um serviço cancelado que continua sendo cobrado.",
              "Uma revisão periódica (a cada 3-6 meses) de todas as automações — débitos, aportes, alertas — garante que elas continuem fazendo sentido, em vez de rodar no \"piloto automático\" desatualizado.",
              "Essa revisão é rápida quando feita com regularidade: listar as automações ativas e confirmar, uma a uma, se ainda fazem sentido, leva poucos minutos.",
            ],
            examples: [
              "Revisar, a cada 6 meses, se o valor do aporte automático para a reserva ainda é adequado à renda atual.",
              "Descobrir, numa revisão, um débito automático de um serviço cancelado há meses que nunca foi removido.",
            ],
            diagram: {
              type: "steps",
              steps: [
                "Listar todas as automações ativas (débitos, aportes, alertas)",
                "Para cada uma: ainda faz sentido?",
                "Ajustar valores desatualizados",
                "Remover o que não é mais necessário",
              ],
            },
            keyConcepts: [
              "Automações não revisadas podem ficar desatualizadas com o tempo.",
              "Revisão periódica (3-6 meses) mantém tudo alinhado com a realidade atual.",
              "A revisão é rápida quando feita com regularidade.",
            ],
            quiz: [
              {
                question: "O que pode acontecer com uma automação financeira que nunca é revisada?",
                options: ["Ela sempre se atualiza sozinha", "Ela pode ficar desatualizada — como um valor de aporte que não reflete mais a renda, ou uma cobrança de serviço já cancelado", "Nada, automações não precisam de revisão", "Ela é automaticamente cancelada pelo banco"],
                correctIndex: 1,
                explanation: "Sem revisão, automações continuam executando o que foi configurado no passado, mesmo que a realidade tenha mudado.",
              },
            ],
            exercise: {
              prompt: "Liste todas as suas automações financeiras atuais (débitos, aportes, alertas) e revise uma a uma: ainda fazem sentido?",
              placeholder: "Automação 1: ... — ainda faz sentido? ...\nAutomação 2: ...",
            },
          },
        },
      ],
    },
  ],
};
