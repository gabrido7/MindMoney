import { debtsService, type EnrichedDebt } from "../debts/debts.service";
import { debtsRepository } from "../debts/debts.repository";
import { financialProfileService } from "../financialProfile/financialProfile.service";
import { transactionsRepository } from "../transactions/transactions.repository";
import { objectivesRepository } from "../objectives/objectives.repository";
import { currentMonth, getPreviousMonth } from "../../utils/month";
import { formatCurrency } from "../../utils/formatCurrency";
import { simulatePayoff } from "./debtAdvice.math";
import { simulateCascade } from "./debtAdvice.cascade";
import type { AdviceSeverity, DebtAdvice } from "./debtAdvice.types";

const DEBT_TO_INCOME_CRITICAL = 50;
const DEBT_TO_INCOME_WARNING = 30;
const REVOLVING_CARD_RATE_THRESHOLD = 10; // % ao mês
const VARIABLE_INCOME_RISK_RATIO = 0.4;
const DISCRETIONARY_CATEGORY_MIN_RATIO = 0.15; // % da renda média pra uma categoria "valer a pena" citar
const DISCRETIONARY_REDIRECT_RATIO = 0.3; // fração do valor da categoria que se propõe redirecionar
const PAYMENT_CONSISTENCY_DAYS = 45; // margem sobre 1 mês -- dá folga sem deixar de pegar inação real
const SEVERITY_RANK: Record<AdviceSeverity, number> = { critical: 0, warning: 1, success: 2 };
const DAY_MS = 1000 * 60 * 60 * 24;

function pct(value: number): string {
  return `${value.toFixed(0)}%`;
}

function formatDateBR(dateISO: string): string {
  return dateISO.split("-").reverse().join("/");
}

/** Último dia do mês (YYYY-MM) como 'YYYY-MM-DD' -- mesmo truque "dia 0 do mês seguinte" de nextDueDate em utils/month.ts. */
function endOfMonthISO(yyyyMm: string): string {
  const [year, month] = yyyyMm.split("-").map(Number);
  return new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
}

/** 'MM/YYYY' daqui a N meses -- usado pra dar uma data aproximada de "livre de dívidas" na projeção. */
function futureMonthLabel(monthsFromNow: number): string {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() + monthsFromNow);
  return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
}

/**
 * Motor de conselhos sobre dívidas: 100% regra determinística sobre dados
 * reais do próprio usuário, mesmo princípio de insights.service.ts e
 * financialProfile.service.ts's computeRecommendations -- nenhuma regra
 * aqui produz texto sem um cálculo real por trás, e nenhuma dispara sem que
 * os dados do usuário a justifiquem (ver CLAUDE.md: sem IA configurada,
 * sem dados fictícios).
 */
export const debtAdviceService = {
  async generate(userId: number): Promise<DebtAdvice[]> {
    const advice: DebtAdvice[] = [];
    const month = currentMonth();
    const today = new Date().toISOString().slice(0, 10);

    const [debts, profile, incomeByMonth, breakdown, objectives, remainingByOffset, lastPayments] = await Promise.all([
      debtsService.list(userId),
      financialProfileService.get(userId),
      Promise.all(
        [0, 1, 2].map(async (offset) => {
          let m = month;
          for (let i = 0; i < offset; i++) m = getPreviousMonth(m);
          const totals = await transactionsRepository.sumByTypeForMonth(userId, m);
          return totals.entradas;
        })
      ),
      transactionsRepository.categoryBreakdownForMonth(userId, month),
      objectivesRepository.listByUser(userId),
      // Snapshot real de "quanto eu devia" hoje / fim do mês passado / fim de
      // 2 meses atrás -- base da tendência no diagnóstico geral (item 0).
      Promise.all(
        [0, 1, 2].map((offset) => {
          if (offset === 0) return debtsRepository.totalRemainingAsOf(userId, today);
          let m = month;
          for (let i = 0; i < offset; i++) m = getPreviousMonth(m);
          return debtsRepository.totalRemainingAsOf(userId, endOfMonthISO(m));
        })
      ),
      debtsRepository.lastPaymentDates(userId),
    ]);

    const activeDebts = debts.filter((d) => !d.paidOff);

    // 9) sem dívidas ativas: reforço positivo, sem forçar mais nenhuma regra.
    if (activeDebts.length === 0) {
      advice.push({
        id: "sem-dividas",
        severity: "success",
        title: "Você não tem dívidas ativas",
        message: "Continue assim -- manter-se livre de dívidas é uma das bases mais importantes de uma vida financeira saudável.",
      });
      return advice;
    }

    // Média só dos meses com entrada real -- um usuário novo, com histórico
    // de só 1 mês, não pode ter sua renda média "puxada pra baixo" por
    // meses 2 e 3 que simplesmente ainda não existem (isso inflaria
    // artificialmente o % de comprometimento de renda abaixo).
    const monthsWithIncome = incomeByMonth.filter((v) => v > 0);
    const avgIncome = monthsWithIncome.length > 0 ? monthsWithIncome.reduce((sum, v) => sum + v, 0) / monthsWithIncome.length : 0;
    const totalMonthlyDebtService = activeDebts.reduce((sum, d) => sum + (d.installmentAmount ?? 0), 0);

    // 0) diagnóstico geral -- sintetiza tendência real dos últimos 3 meses
    // (quanto a dívida total cresceu/caiu de verdade, não um cálculo
    // isolado) com uma projeção combinada de quitação (todas as dívidas
    // atacadas juntas, via avalanche, não uma projeção por dívida) num
    // resumo só. Sempre o primeiro item da lista quando há dívida ativa --
    // fixado na posição 0 depois do sort por gravidade, no final da função.
    let trendSentence = "";
    let trendSeverity: AdviceSeverity = "warning";
    const [remainingNow, , remainingTwoMonthsAgo] = remainingByOffset;
    if (remainingTwoMonthsAgo > 0) {
      const delta = remainingNow - remainingTwoMonthsAgo;
      if (delta < -0.01) {
        trendSeverity = "success";
        trendSentence = `Sua dívida total caiu ${formatCurrency(Math.abs(delta))} nos últimos 3 meses (de ${formatCurrency(remainingTwoMonthsAgo)} para ${formatCurrency(remainingNow)}). `;
      } else if (delta > 0.01) {
        trendSeverity = "critical";
        trendSentence = `Sua dívida total cresceu ${formatCurrency(delta)} nos últimos 3 meses (de ${formatCurrency(remainingTwoMonthsAgo)} para ${formatCurrency(remainingNow)}) -- você está tomando mais dívida do que quitando. `;
      } else {
        trendSeverity = "warning";
        trendSentence = `Sua dívida total ficou praticamente estável nos últimos 3 meses, em torno de ${formatCurrency(remainingNow)}. `;
      }
    }

    const cascade = simulateCascade(debts);
    const projectionSentence = cascade
      ? `Seguindo o plano recomendado (estratégia avalanche) com as parcelas atuais, você fica livre de todas as dívidas em ${cascade.totalMonths} ${cascade.totalMonths === 1 ? "mês" : "meses"} (por volta de ${futureMonthLabel(cascade.totalMonths)}), pagando ${formatCurrency(cascade.totalInterest)} de juros no total.`
      : "Defina a parcela mensal das suas dívidas pra ver uma projeção real de quando ficaria livre delas.";

    const diagnosis: DebtAdvice = {
      id: "diagnostico-geral",
      severity: trendSentence ? trendSeverity : "warning",
      title: "Diagnóstico geral das suas dívidas",
      message: (trendSentence + projectionSentence).trim(),
    };

    // consistência de pagamento -- detecta inação real (ninguém registrando
    // pagamento), não só números ruins. Só avalia dívida com parcela
    // definida e criada há mais de PAYMENT_CONSISTENCY_DAYS dias -- dívida
    // recém-criada não pode ser cobrada de um pagamento que ainda nem venceu.
    const lastPaymentByDebt = new Map(lastPayments.map((p) => [p.debtId, p.lastPaidAt]));
    const nowMs = Date.now();
    for (const debt of activeDebts) {
      if (!debt.installmentAmount) continue;
      const ageDays = (nowMs - new Date(debt.createdAt).getTime()) / DAY_MS;
      if (ageDays < PAYMENT_CONSISTENCY_DAYS) continue;

      const lastPaidAt = lastPaymentByDebt.get(debt.id) ?? null;
      const daysSincePayment = lastPaidAt ? (nowMs - new Date(lastPaidAt).getTime()) / DAY_MS : Infinity;
      if (daysSincePayment >= PAYMENT_CONSISTENCY_DAYS) {
        advice.push({
          id: `consistencia-${debt.id}`,
          severity: "critical",
          title: `Nenhum pagamento recente em "${debt.name}"`,
          message: lastPaidAt
            ? `O último pagamento registrado foi em ${formatDateBR(lastPaidAt)}, há mais de um mês. Parcelas puladas fazem os juros corroerem o progresso -- registre o pagamento assim que possível, mesmo que atrasado.`
            : `Essa dívida nunca teve um pagamento registrado, mesmo já tendo parcela definida. Registrar os pagamentos reais é o que faz o restante desses conselhos ficarem precisos.`,
        });
      }
    }

    // 1) comprometimento de renda com dívidas
    if (avgIncome > 0) {
      const ratio = (totalMonthlyDebtService / avgIncome) * 100;
      if (ratio > DEBT_TO_INCOME_CRITICAL) {
        advice.push({
          id: "comprometimento-renda",
          severity: "critical",
          title: `${pct(ratio)} da sua renda está comprometida com dívidas`,
          message: `Suas parcelas mensais somam ${formatCurrency(totalMonthlyDebtService)}, contra uma renda média de ${formatCurrency(avgIncome)} nos últimos 3 meses. Especialistas recomendam manter esse comprometimento abaixo de 30% -- acima de 50%, qualquer imprevisto pode levar à inadimplência. Priorize renegociar as dívidas mais caras antes de qualquer gasto não essencial.`,
        });
      } else if (ratio > DEBT_TO_INCOME_WARNING) {
        advice.push({
          id: "comprometimento-renda",
          severity: "warning",
          title: `${pct(ratio)} da sua renda está comprometida com dívidas`,
          message: `Suas parcelas mensais somam ${formatCurrency(totalMonthlyDebtService)}, contra uma renda média de ${formatCurrency(avgIncome)} nos últimos 3 meses. O ideal é manter esse comprometimento abaixo de 30% -- vale evitar novas dívidas até esse número cair.`,
        });
      } else {
        advice.push({
          id: "comprometimento-renda",
          severity: "success",
          title: `Suas dívidas estão sob controle: ${pct(ratio)} da renda`,
          message: `Suas parcelas mensais somam ${formatCurrency(totalMonthlyDebtService)} contra uma renda média de ${formatCurrency(avgIncome)} -- bem abaixo dos 30% considerados o limite saudável de comprometimento.`,
        });
      }
    }

    // 2) armadilha: parcela não cobre nem os juros
    const trapped: EnrichedDebt[] = [];
    for (const debt of activeDebts) {
      if (!debt.installmentAmount) continue;
      const sim = simulatePayoff(debt.remainingAmount, debt.interestRate ?? 0, debt.installmentAmount);
      if (sim?.insufficientPayment) {
        trapped.push(debt);
        advice.push({
          id: `armadilha-${debt.id}`,
          severity: "critical",
          title: `"${debt.name}" nunca será quitada no ritmo atual`,
          message: `A parcela de ${formatCurrency(debt.installmentAmount)} não cobre nem os juros do mês sobre o saldo de ${formatCurrency(debt.remainingAmount)}. Nessas condições a dívida só cresce -- é essencial aumentar o valor pago ou renegociar essa dívida imediatamente.`,
        });
      }
    }

    // 3) plano de ataque prioritário -- maior custo real em juros entre as dívidas "saudáveis"
    let priorityDebt: { debt: EnrichedDebt; sim: NonNullable<ReturnType<typeof simulatePayoff>> } | null = null;
    for (const debt of activeDebts) {
      if (trapped.includes(debt) || !debt.installmentAmount) continue;
      const sim = simulatePayoff(debt.remainingAmount, debt.interestRate ?? 0, debt.installmentAmount);
      if (sim && !sim.insufficientPayment && (!priorityDebt || sim.totalInterest > priorityDebt.sim.totalInterest)) {
        priorityDebt = { debt, sim };
      }
    }
    if (priorityDebt) {
      advice.push({
        id: "plano-ataque",
        severity: "warning",
        title: `Ataque "${priorityDebt.debt.name}" primeiro`,
        message: `No ritmo atual, essa dívida ainda vai custar ${formatCurrency(priorityDebt.sim.totalInterest)} só de juros ao longo de ${priorityDebt.sim.monthsNeeded} meses -- o maior custo real entre suas dívidas. Qualquer valor extra que puder direcionar a ela primeiro reduz esse custo mais do que em qualquer outra.`,
      });
    }

    // 4) cartão de crédito rotativo caro
    for (const debt of activeDebts) {
      if (debt.type !== "cartao_credito" || !debt.interestRate || debt.interestRate < REVOLVING_CARD_RATE_THRESHOLD) continue;
      const annualEquivalent = (Math.pow(1 + debt.interestRate / 100, 12) - 1) * 100;
      advice.push({
        id: `cartao-rotativo-${debt.id}`,
        severity: "critical",
        title: `"${debt.name}" tem um dos juros mais caros que existem`,
        message: `${debt.interestRate.toLocaleString("pt-BR")}% ao mês equivalem a aproximadamente ${pct(annualEquivalent)} ao ano se não for quitado. Quitar esse cartão deve vir antes de qualquer investimento -- nenhuma aplicação comum rende perto disso.`,
      });
    }

    // 5) reserva mínima antes de acelerar pagamentos
    const hasReserve = objectives.some((o) => o.category === "reserva");
    if (
      (profile.financialSituation === "endividado" || profile.financialSituation === "vivo_no_limite") &&
      !hasReserve
    ) {
      advice.push({
        id: "reserva-antes-de-acelerar",
        severity: "warning",
        title: "Considere uma reserva mínima antes de acelerar pagamentos",
        message: "Parece contraintuitivo quando se está endividado, mas ter uma reserva pequena (mesmo 1 mês de despesas essenciais) evita que um imprevisto vire uma dívida nova no cartão. Priorize isso antes de colocar todo valor extra nas dívidas atuais.",
      });
    }

    // 6) fragmentação de dívidas
    const fragmentedTypes = new Set(["cartao_credito", "parcelamento", "cheque_especial"]);
    const fragmentedCount = activeDebts.filter((d) => fragmentedTypes.has(d.type)).length;
    if (fragmentedCount >= 2) {
      advice.push({
        id: "fragmentacao",
        severity: "warning",
        title: `Você tem ${fragmentedCount} dívidas rotativas abertas ao mesmo tempo`,
        message: "Cartão de crédito, parcelamento e cheque especial concentrados assim tornam mais fácil perder o controle. Escolha uma estratégia (bola de neve ou avalanche, já disponíveis nesta página) e concentre o esforço extra numa dívida de cada vez, em vez de dividir entre todas.",
      });
    }

    // 7) risco de renda variável
    if (profile.incomeVariable && profile.incomeMin && totalMonthlyDebtService > profile.incomeMin * VARIABLE_INCOME_RISK_RATIO) {
      const worstCaseRatio = (totalMonthlyDebtService / profile.incomeMin) * 100;
      advice.push({
        id: "risco-renda-variavel",
        severity: "warning",
        title: "Suas parcelas fixas pesam demais no seu pior mês",
        message: `Sua renda é variável e, no seu mês de menor renda (${formatCurrency(profile.incomeMin)}), as parcelas de dívida comprometeriam ${pct(worstCaseRatio)} dela. Vale montar uma reserva de segurança maior que a de quem tem renda fixa, justamente para cobrir parcelas nos meses mais fracos.`,
      });
    }

    // 8) redirecionamento real de categoria discricionária
    if (priorityDebt && avgIncome > 0) {
      const topCategory = breakdown.find((c) => c.name !== "Dívidas");
      if (topCategory && topCategory.value >= avgIncome * DISCRETIONARY_CATEGORY_MIN_RATIO) {
        const redirectAmount = topCategory.value * DISCRETIONARY_REDIRECT_RATIO;
        const boosted = simulatePayoff(
          priorityDebt.debt.remainingAmount,
          priorityDebt.debt.interestRate ?? 0,
          priorityDebt.debt.installmentAmount! + redirectAmount
        );
        if (boosted && !boosted.insufficientPayment) {
          const monthsSaved = priorityDebt.sim.monthsNeeded - boosted.monthsNeeded;
          const interestSaved = priorityDebt.sim.totalInterest - boosted.totalInterest;
          if (monthsSaved > 0 && interestSaved > 0) {
            advice.push({
              id: "redirecionar-categoria",
              severity: "warning",
              title: `Redirecionar parte de "${topCategory.name}" quitaria "${priorityDebt.debt.name}" mais rápido`,
              message: `Você gastou ${formatCurrency(topCategory.value)} em ${topCategory.name} este mês. Redirecionando ${formatCurrency(redirectAmount)} disso para a parcela de "${priorityDebt.debt.name}", ela seria quitada ${monthsSaved} ${monthsSaved === 1 ? "mês" : "meses"} mais cedo, economizando ${formatCurrency(interestSaved)} em juros.`,
            });
          }
        }
      }
    }

    // Ordena por gravidade real (critical -> warning -> success) em vez da
    // ordem em que as regras foram escritas no código -- Array.sort do V8 é
    // estável, então regras de mesma gravidade mantêm a ordem relativa
    // original. O diagnóstico geral fica sempre em primeiro -- é o resumo,
    // não compete por posição com o resto.
    advice.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
    advice.unshift(diagnosis);

    return advice;
  },
};
