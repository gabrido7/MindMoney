import { transactionsRepository } from "../transactions/transactions.repository";
import { goalsRepository } from "../goals/goals.repository";
import { scoreService } from "../score/score.service";
import { currentMonth, getPreviousMonth } from "../../utils/month";
import { formatCurrency } from "../../utils/formatCurrency";
import type { Insight } from "./insights.types";

/**
 * Recurso "inteligente" do Mind Money: hoje é 100% regra determinística
 * sobre dados reais do próprio usuário — nunca inventa números, nunca
 * mistura dados de outra conta (tudo aqui recebe userId e só consulta o
 * que pertence a ele, mesmo padrão do resto da API).
 *
 * Não há nenhuma chave de API de IA configurada neste projeto
 * (nenhuma variável tipo AI_PROVIDER_API_KEY no .env). Por isso não há
 * nenhuma chamada a um provedor externo aqui — seria uma integração
 * fingida, sem credencial real por trás. A separação de camadas abaixo
 * já deixa isso pronto para o futuro: "cálculo" (as funções do
 * *Repository, já existentes) fica isolado de "regra de negócio" (os
 * limiares/decisões desta função) e de "geração de insight" (o texto
 * final). Um provedor de IA externo entraria como uma etapa adicional
 * DEPOIS do cálculo determinístico — para redigir o texto de forma mais
 * natural, por exemplo — nunca no lugar dele, e nunca sem uma chave de
 * verdade configurada.
 */
export const insightsService = {
  async generate(userId: number, month: string = currentMonth()): Promise<Insight[]> {
    const insights: Insight[] = [];
    const previousMonth = getPreviousMonth(month);

    // ---- cálculo financeiro (dados reais, sem interpretação ainda) ----
    const [breakdown, previousBreakdown, goal, score, last3] = await Promise.all([
      transactionsRepository.categoryBreakdownForMonth(userId, month),
      transactionsRepository.categoryBreakdownForMonth(userId, previousMonth),
      goalsRepository.findByMonth(userId, month),
      scoreService.calculate(userId, month),
      Promise.all(
        [0, 1, 2].map(async (offset) => {
          let m = month;
          for (let i = 0; i < offset; i++) m = getPreviousMonth(m);
          const b = await transactionsRepository.categoryBreakdownForMonth(userId, m);
          return { month: m, breakdown: b };
        })
      ),
    ]);

    // ---- regra de negócio + geração de insight ----

    // 1) aumento de gasto por categoria (vs mês anterior)
    const previousByName = new Map(previousBreakdown.map((c) => [c.name, c.value]));
    for (const category of breakdown) {
      const previousValue = previousByName.get(category.name) ?? 0;
      if (previousValue > 0 && category.value > previousValue * 1.2) {
        const increasePercent = ((category.value - previousValue) / previousValue) * 100;
        insights.push({
          type: "aumento_gasto",
          severity: "warning",
          title: `Gasto maior em ${category.name}`,
          message: `Você gastou ${formatCurrency(category.value)} em ${category.name} este mês, ${increasePercent.toFixed(0)}% a mais que no mês anterior (${formatCurrency(previousValue)}).`,
        });
      }
    }

    // 2) categoria problemática: apareceu entre as 2 maiores em pelo menos 2 dos últimos 3 meses
    const topAppearances = new Map<string, number>();
    for (const { breakdown: monthBreakdown } of last3) {
      const top2 = [...monthBreakdown].sort((a, b) => b.value - a.value).slice(0, 2);
      for (const c of top2) {
        topAppearances.set(c.name, (topAppearances.get(c.name) ?? 0) + 1);
      }
    }
    for (const [categoryName, count] of topAppearances) {
      if (count >= 2) {
        insights.push({
          type: "categoria_problematica",
          severity: "warning",
          title: `${categoryName} é um gasto recorrente`,
          message: `${categoryName} esteve entre as duas maiores despesas em ${count} dos últimos 3 meses. Vale revisar se dá para reduzir esse gasto.`,
        });
      }
    }

    // 3) evolução positiva: saldo melhorando nos últimos 3 meses
    const saldos = await Promise.all(
      last3.map(async ({ month: m }) => {
        const totals = await transactionsRepository.sumByTypeForMonth(userId, m);
        return totals.entradas - totals.saidas;
      })
    );
    const [saldoAtual, saldoAnterior, saldoDoisMesesAtras] = saldos; // last3[0] = mês atual
    if (saldoAtual > saldoAnterior && saldoAnterior > saldoDoisMesesAtras) {
      insights.push({
        type: "evolucao_positiva",
        severity: "success",
        title: "Saldo em evolução",
        message: "Seu saldo mensal vem melhorando nos últimos 3 meses seguidos. Continue assim!",
      });
    }

    // 4) análise de meta
    if (goal) {
      const totals = await transactionsRepository.sumByTypeForMonth(userId, month);
      const saldo = totals.entradas - totals.saidas;
      const progress = (saldo / goal.target_amount) * 100;
      if (progress >= 100) {
        insights.push({
          type: "meta",
          severity: "success",
          title: "Meta do mês atingida",
          message: `Você já alcançou ${progress.toFixed(0)}% da sua meta de ${formatCurrency(goal.target_amount)} para ${month}.`,
        });
      } else if (progress < 50) {
        insights.push({
          type: "meta",
          severity: "warning",
          title: "Meta do mês em risco",
          message: `Você está em ${Math.max(progress, 0).toFixed(0)}% da meta de ${formatCurrency(goal.target_amount)}. Faltam ${formatCurrency(Math.max(goal.target_amount - saldo, 0))} até o fim do mês.`,
        });
      }
    }

    // 5) recomendação geral, baseada no score já calculado (etapa 11)
    const biggest = [...breakdown].sort((a, b) => b.value - a.value)[0];
    if (score.level === "Crítico" || score.level === "Atenção") {
      insights.push({
        type: "recomendacao_geral",
        severity: "warning",
        title: "Vale revisar o orçamento deste mês",
        message: biggest
          ? `Seu score financeiro está em "${score.level}". Sua maior despesa foi em ${biggest.name} — esse é um bom ponto de partida para cortar gastos.`
          : `Seu score financeiro está em "${score.level}". Revisar os gastos deste mês pode ajudar a melhorar esse número.`,
      });
    } else if (score.level === "Excelente") {
      insights.push({
        type: "recomendacao_geral",
        severity: "success",
        title: "Score financeiro excelente",
        message: "Seus indicadores estão bons este mês. Considere direcionar parte do saldo para uma meta ou investimento.",
      });
    }

    return insights;
  },

  /**
   * Q&A simples baseado em padrões (não é um modelo de linguagem) — reconhece
   * um conjunto pequeno de perguntas comuns e responde com dados reais do
   * próprio usuário. Fora desses padrões, admite que não entendeu em vez de
   * inventar uma resposta.
   */
  async answerQuestion(userId: number, question: string, month: string = currentMonth()): Promise<string> {
    const q = question.toLowerCase().trim();

    if (/(maior gasto|categoria que mais gastei|onde gastei mais)/.test(q)) {
      const breakdown = await transactionsRepository.categoryBreakdownForMonth(userId, month);
      const top = [...breakdown].sort((a, b) => b.value - a.value)[0];
      return top
        ? `Sua maior despesa em ${month} foi em ${top.name}, totalizando ${formatCurrency(top.value)}.`
        : `Você ainda não tem despesas registradas em ${month}.`;
    }

    if (/gastei.*(em|com|na|no)\s+([a-zà-ú]+)/.test(q)) {
      const breakdown = await transactionsRepository.categoryBreakdownForMonth(userId, month);
      const match = breakdown.find((c) => q.includes(c.name.toLowerCase()));
      if (match) {
        return `Você gastou ${formatCurrency(match.value)} em ${match.name} em ${month}.`;
      }
      return `Não encontrei nenhuma categoria correspondente nas suas despesas de ${month}.`;
    }

    if (/(economizei|economia|guardei|poupei)/.test(q)) {
      const totals = await transactionsRepository.sumByTypeForMonth(userId, month);
      const saldo = totals.entradas - totals.saidas;
      const rate = totals.entradas > 0 ? (saldo / totals.entradas) * 100 : 0;
      return `Em ${month}, seu saldo foi de ${formatCurrency(saldo)} — ${rate.toFixed(1)}% das suas entradas.`;
    }

    if (/meta/.test(q)) {
      const goal = await goalsRepository.findByMonth(userId, month);
      if (!goal) return `Você não definiu uma meta para ${month}.`;
      const totals = await transactionsRepository.sumByTypeForMonth(userId, month);
      const saldo = totals.entradas - totals.saidas;
      const progress = (saldo / goal.target_amount) * 100;
      return `Sua meta de ${month} é ${formatCurrency(goal.target_amount)}. Você já atingiu ${Math.max(progress, 0).toFixed(0)}%.`;
    }

    if (/(score|pontuação|nota financeira)/.test(q)) {
      const score = await scoreService.calculate(userId, month);
      return `Seu score financeiro em ${month} é ${score.score}/100 ("${score.level}").`;
    }

    return "Não consegui entender sua pergunta. Tente perguntar sobre uma categoria específica (\"quanto gastei em alimentação\"), sua economia do mês, sua meta ou seu score.";
  },
};
