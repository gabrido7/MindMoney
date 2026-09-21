import { describe, it, expect } from "vitest";
import { buildStrategicPlan } from "./strategicPlan";
import type { Debt, FinancialProfile, ApiObjective } from "../../../types/api";
import type { ProgressMap } from "./trailProgress";

function emptyProfile(overrides: Partial<FinancialProfile> = {}): FinancialProfile {
  return {
    experienceLevel: null,
    financialSituation: null,
    incomeRange: null,
    incomeVariable: false,
    incomeMin: null,
    incomeMax: null,
    incomeSources: [],
    priorities: [],
    habits: null,
    updatedAt: null,
    recommendations: [],
    behaviorProfile: null,
    ...overrides,
  };
}

let nextDebtId = 1;
function makeDebt(overrides: Partial<Debt>): Debt {
  return {
    id: nextDebtId++,
    type: "outro",
    name: "Dívida",
    totalAmount: 1000,
    installmentAmount: null,
    interestRate: null,
    installmentsCount: null,
    dueDay: null,
    createdAt: "2026-01-01",
    paidAmount: 0,
    remainingAmount: 1000,
    progressPercent: 0,
    paidOff: false,
    status: "ativa",
    daysUntilDue: null,
    ...overrides,
  };
}

let nextObjectiveId = 1;
function makeObjective(overrides: Partial<ApiObjective>): ApiObjective {
  return {
    id: nextObjectiveId++,
    name: "Objetivo",
    category: "personalizada",
    priority: "media",
    targetAmount: 1000,
    targetMonth: "2026-12",
    currentAmount: 0,
    remainingAmount: 1000,
    progressPercent: 0,
    achieved: false,
    overdue: false,
    monthsRemaining: 6,
    requiredMonthlyAmount: 0,
    daysRemaining: 180,
    createdAt: "2026-01-01",
    monthlyPace: null,
    paceStatus: null,
    paceMonthlyDifference: 0,
    paceMonthsEarlier: 0,
    ...overrides,
  };
}

const emptyProgress: ProgressMap = {};

describe("buildStrategicPlan", () => {
  it("perfil totalmente vazio ainda devolve cursos de fundamentos, nunca uma lista vazia", () => {
    const plan = buildStrategicPlan({
      profile: null,
      debts: [],
      assets: [],
      objectives: [],
      progress: emptyProgress,
    });

    expect(plan.length).toBeGreaterThan(0);
    expect(plan.every((item) => item.trail.id === "fundamentos")).toBe(true);
  });

  it("dívida com juros altos coloca um curso sobre dívida no topo, com o motivo citando o nome e a taxa reais", () => {
    const debt = makeDebt({ name: "Cartão Caro", interestRate: 15, paidOff: false });
    const plan = buildStrategicPlan({
      profile: emptyProfile(),
      debts: [debt],
      assets: [],
      objectives: [],
      progress: emptyProgress,
    });

    // "controle-de-dividas" (organização financeira) e os cursos de
    // "crédito e dívidas" empatam em pontuação -- os dois são
    // legitimamente sobre o mesmo assunto, o que importa é que o motivo
    // real (nome da dívida + taxa) apareça no item que ganhou o desempate.
    expect(plan[0].reason).toContain("Cartão Caro");
    expect(plan[0].reason).toContain("15%");
    expect(["organizacao-financeira", "credito-e-dividas"]).toContain(plan[0].trail.id);
  });

  it("dívida quitada (paidOff) não conta como sinal de juros altos", () => {
    const debt = makeDebt({ name: "Cartão Quitado", interestRate: 20, paidOff: true, remainingAmount: 0 });
    const plan = buildStrategicPlan({
      profile: emptyProfile(),
      debts: [debt],
      assets: [],
      objectives: [],
      progress: emptyProgress,
    });

    // sem outro sinal, cai de volta pro fallback de fundamentos -- não prioriza crédito/dívidas por uma dívida já quitada
    expect(plan.every((item) => item.trail.id === "fundamentos")).toBe(true);
  });

  it("curso já concluído (100%) nunca aparece no plano", () => {
    const debt = makeDebt({ name: "Cartão Caro", interestRate: 15 });
    const fullyDoneProgress: ProgressMap = {
      "credito-e-dividas.como-sair-das-dividas.aula-1": { completed: true },
      "credito-e-dividas.como-sair-das-dividas.aula-2": { completed: true },
      "credito-e-dividas.como-sair-das-dividas.aula-3": { completed: true },
      "credito-e-dividas.como-sair-das-dividas.aula-4": { completed: true },
      "credito-e-dividas.como-sair-das-dividas.aula-5": { completed: true },
    };

    const plan = buildStrategicPlan({
      profile: emptyProfile(),
      debts: [debt],
      assets: [],
      objectives: [],
      progress: fullyDoneProgress,
    });

    expect(plan.some((item) => item.course.id === "como-sair-das-dividas")).toBe(false);
  });

  it("curso já começado (progresso parcial) ganha prioridade sobre um curso nunca iniciado de relevância parecida", () => {
    const profile = emptyProfile({ priorities: ["investir"] });
    const partialProgress: ProgressMap = {
      "investimentos.renda-fixa.aula-1": { completed: true },
    };

    const plan = buildStrategicPlan({
      profile,
      debts: [],
      assets: [],
      objectives: [],
      progress: partialProgress,
    });

    expect(plan[0].course.id).toBe("renda-fixa");
  });

  it("objetivo de patrimônio prioriza cursos de aposentadoria", () => {
    const objective = makeObjective({ category: "patrimonio" });
    const profile = emptyProfile({ priorities: ["aposentadoria"] });

    const plan = buildStrategicPlan({
      profile,
      debts: [],
      assets: [],
      objectives: [objective],
      progress: emptyProgress,
    });

    expect(plan[0].trail.id).toBe("aposentadoria-e-independencia");
  });
});
