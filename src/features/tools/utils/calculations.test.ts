import { describe, it, expect } from "vitest";
import {
  toMonthlyRate,
  toMonths,
  calculateSimpleInterest,
  calculateCompoundInterest,
  calculateInflationImpact,
  calculatePurchasingPower,
  calculateEmergencyFund,
  calculateRetirementTarget,
  calculateMonthlyContribution,
  calculateFinancing,
  calculateLoan,
  compareInvestments,
  calculateRealReturn,
} from "./calculations";
import { parseLocaleNumber } from "./number";

describe("toMonthlyRate", () => {
  it("mantém a taxa mensal quando o período já é mensal", () => {
    expect(toMonthlyRate(1, "monthly")).toBeCloseTo(0.01, 10);
  });

  it("converte taxa anual para mensal de forma que os 12 meses componham de volta a taxa anual", () => {
    const monthly = toMonthlyRate(12, "annual");
    const annualBack = (Math.pow(1 + monthly, 12) - 1) * 100;
    expect(annualBack).toBeCloseTo(12, 8);
  });
});

describe("toMonths", () => {
  it("mantém o valor quando a unidade já é meses", () => {
    expect(toMonths(18, "months")).toBe(18);
  });

  it("converte anos para meses", () => {
    expect(toMonths(5, "years")).toBe(60);
  });
});

describe("parseLocaleNumber", () => {
  it("aceita vírgula como separador decimal", () => {
    expect(parseLocaleNumber("0,8")).toBeCloseTo(0.8, 10);
  });

  it("aceita ponto como separador decimal", () => {
    expect(parseLocaleNumber("1000.5")).toBeCloseTo(1000.5, 10);
  });

  it("retorna NaN para entrada vazia ou inválida", () => {
    expect(Number.isNaN(parseLocaleNumber(""))).toBe(true);
    expect(Number.isNaN(parseLocaleNumber("abc"))).toBe(true);
  });
});

describe("calculateSimpleInterest", () => {
  it("calcula juros simples corretamente (R$1.000 a 1% ao mês por 12 meses)", () => {
    const result = calculateSimpleInterest({ principal: 1000, monthlyRate: 0.01, months: 12 });
    expect(result.totalInterest).toBeCloseTo(120, 6);
    expect(result.futureValue).toBeCloseTo(1120, 6);
    expect(result.series).toHaveLength(13);
    expect(result.series[0].balance).toBeCloseTo(1000, 6);
  });

  it("juros simples cresce de forma linear (mesmo incremento a cada mês)", () => {
    const result = calculateSimpleInterest({ principal: 1000, monthlyRate: 0.02, months: 3 });
    const deltas = result.series.slice(1).map((p, i) => p.balance - result.series[i].balance);
    expect(deltas[0]).toBeCloseTo(deltas[1], 8);
    expect(deltas[1]).toBeCloseTo(deltas[2], 8);
  });
});

describe("calculateCompoundInterest", () => {
  it("sem aportes, reproduz a fórmula fechada de juros compostos (R$1.000 a 1% ao mês por 12 meses)", () => {
    const result = calculateCompoundInterest({ initial: 1000, monthlyContribution: 0, monthlyRate: 0.01, months: 12 });
    expect(result.futureValue).toBeCloseTo(1000 * Math.pow(1.01, 12), 6);
    expect(result.totalInvested).toBe(1000);
  });

  it("com aportes, reproduz a fórmula de valor futuro de uma série de aportes (PMT=100, 1% a.m., 12 meses)", () => {
    const result = calculateCompoundInterest({ initial: 0, monthlyContribution: 100, monthlyRate: 0.01, months: 12 });
    const expectedFV = 100 * ((Math.pow(1.01, 12) - 1) / 0.01);
    expect(result.futureValue).toBeCloseTo(expectedFV, 6);
    expect(result.totalInvested).toBeCloseTo(1200, 6);
  });

  it("com taxa zero, o saldo final é só a soma do inicial com os aportes", () => {
    const result = calculateCompoundInterest({ initial: 500, monthlyContribution: 100, monthlyRate: 0, months: 10 });
    expect(result.futureValue).toBeCloseTo(1500, 6);
    expect(result.totalInterest).toBeCloseTo(0, 6);
  });
});

describe("calculateInflationImpact", () => {
  it("equivale a juros compostos sem aportes sobre o valor atual", () => {
    const inflation = calculateInflationImpact({ currentAmount: 2000, monthlyRate: 0.005, months: 24 });
    const compound = calculateCompoundInterest({ initial: 2000, monthlyContribution: 0, monthlyRate: 0.005, months: 24 });
    expect(inflation.futureAmount).toBeCloseTo(compound.futureValue, 6);
  });
});

describe("calculatePurchasingPower", () => {
  it("R$1.000 perdem poder de compra com inflação positiva ao longo do tempo", () => {
    const result = calculatePurchasingPower({ amount: 1000, monthlyRate: 0.01, months: 12 });
    expect(result.futureRealValue).toBeLessThan(1000);
    expect(result.lossAmount).toBeCloseTo(1000 - result.futureRealValue, 6);
    expect(result.lossPercent).toBeGreaterThan(0);
  });

  it("com taxa zero, o poder de compra não muda", () => {
    const result = calculatePurchasingPower({ amount: 500, monthlyRate: 0, months: 36 });
    expect(result.futureRealValue).toBeCloseTo(500, 6);
    expect(result.lossPercent).toBeCloseTo(0, 6);
  });

  it("é o inverso de juros compostos sem aportes: aplicar a inflação de volta recupera o valor nominal futuro", () => {
    const purchasing = calculatePurchasingPower({ amount: 1000, monthlyRate: 0.008, months: 18 });
    const grownBack = purchasing.futureRealValue * Math.pow(1.008, 18);
    expect(grownBack).toBeCloseTo(1000, 6);
  });
});

describe("calculateEmergencyFund", () => {
  it("calcula o alvo, o restante e os meses até atingir a reserva", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 2000,
      monthsCoverage: 6,
      currentSavings: 5000,
      monthlyContribution: 500,
    });
    expect(result.targetAmount).toBe(12000);
    expect(result.remaining).toBe(7000);
    expect(result.monthsToReach).toBe(14);
  });

  it("quando já atingiu o alvo, meses para atingir é zero", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 1000,
      monthsCoverage: 3,
      currentSavings: 10000,
      monthlyContribution: 0,
    });
    expect(result.remaining).toBe(0);
    expect(result.monthsToReach).toBe(0);
  });

  it("sem aporte mensal e sem atingir o alvo, meses para atingir é null (indefinido)", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 1000,
      monthsCoverage: 6,
      currentSavings: 0,
      monthlyContribution: 0,
    });
    expect(result.monthsToReach).toBeNull();
  });
});

describe("calculateRetirementTarget", () => {
  it("reproduz o exemplo ensinado na trilha de educação (R$5.000/mês, regra dos 4% => R$1.500.000)", () => {
    const result = calculateRetirementTarget({ desiredMonthlyIncome: 5000, withdrawalRatePercent: 4 });
    expect(result.annualIncome).toBe(60000);
    expect(result.targetAmount).toBeCloseTo(1500000, 4);
  });

  it("uma taxa de saque mais conservadora exige um patrimônio maior", () => {
    const at4 = calculateRetirementTarget({ desiredMonthlyIncome: 5000, withdrawalRatePercent: 4 });
    const at35 = calculateRetirementTarget({ desiredMonthlyIncome: 5000, withdrawalRatePercent: 3.5 });
    expect(at35.targetAmount).toBeGreaterThan(at4.targetAmount);
  });
});

describe("calculateMonthlyContribution", () => {
  it("o aporte calculado, reaplicado em juros compostos, atinge o valor-alvo (round-trip)", () => {
    const target = 1500000;
    const result = calculateMonthlyContribution({ targetAmount: target, initial: 0, monthlyRate: 0.007, months: 240 });
    expect(result.alreadyReached).toBe(false);
    expect(result.requiredMonthlyContribution).toBeGreaterThan(0);

    const reapplied = calculateCompoundInterest({
      initial: 0,
      monthlyContribution: result.requiredMonthlyContribution,
      monthlyRate: 0.007,
      months: 240,
    });
    expect(reapplied.futureValue).toBeCloseTo(target, 2);
  });

  it("quando o valor inicial já supera o alvo sozinho, não exige aporte novo", () => {
    const result = calculateMonthlyContribution({ targetAmount: 1000, initial: 10000, monthlyRate: 0.01, months: 12 });
    expect(result.alreadyReached).toBe(true);
    expect(result.requiredMonthlyContribution).toBe(0);
  });

  it("funciona também com taxa de retorno zero", () => {
    const result = calculateMonthlyContribution({ targetAmount: 1200, initial: 0, monthlyRate: 0, months: 12 });
    expect(result.requiredMonthlyContribution).toBeCloseTo(100, 6);
  });
});

describe("calculateFinancing", () => {
  it("sistema Price: parcela fixa e saldo devedor zera ao final", () => {
    const result = calculateFinancing({ amount: 10000, monthlyRate: 0.02, months: 12, system: "price" });
    expect(result.firstInstallment).toBeCloseTo(result.lastInstallment, 6);
    expect(result.schedule[result.schedule.length - 1].balance).toBeCloseTo(0, 4);
    expect(result.totalInterest).toBeCloseTo(result.totalPaid - 10000, 6);
  });

  it("sistema SAC: parcela decrescente e saldo devedor zera ao final", () => {
    const result = calculateFinancing({ amount: 10000, monthlyRate: 0.02, months: 12, system: "sac" });
    expect(result.firstInstallment).toBeGreaterThan(result.lastInstallment);
    expect(result.schedule[result.schedule.length - 1].balance).toBeCloseTo(0, 4);
  });

  it("SAC paga menos juros totais que Price para os mesmos parâmetros", () => {
    const price = calculateFinancing({ amount: 10000, monthlyRate: 0.02, months: 12, system: "price" });
    const sac = calculateFinancing({ amount: 10000, monthlyRate: 0.02, months: 12, system: "sac" });
    expect(sac.totalInterest).toBeLessThan(price.totalInterest);
  });
});

describe("calculateLoan", () => {
  it("calcula parcela, custo total e custo efetivo incluindo tarifas extras", () => {
    const result = calculateLoan({ amount: 5000, monthlyRate: 0.03, months: 24, extraFees: 100 });
    expect(result.installment).toBeGreaterThan(0);
    expect(result.totalPaid).toBeCloseTo(result.installment * 24 + 100, 6);
    expect(result.totalCost).toBeCloseTo(result.totalPaid - 5000, 6);
  });
});

describe("compareInvestments", () => {
  it("cada cenário reproduz o mesmo resultado de calculateCompoundInterest isoladamente", () => {
    const [scenarioA] = compareInvestments(
      [{ name: "A", initial: 1000, monthlyContribution: 100, monthlyRate: 0.01 }],
      12
    );
    const direct = calculateCompoundInterest({ initial: 1000, monthlyContribution: 100, monthlyRate: 0.01, months: 12 });
    expect(scenarioA.futureValue).toBeCloseTo(direct.futureValue, 6);
  });

  it("um cenário com taxa maior rende mais que um com taxa menor, mesmos aportes", () => {
    const [low, high] = compareInvestments(
      [
        { name: "Baixa", initial: 1000, monthlyContribution: 100, monthlyRate: 0.005 },
        { name: "Alta", initial: 1000, monthlyContribution: 100, monthlyRate: 0.015 },
      ],
      24
    );
    expect(high.futureValue).toBeGreaterThan(low.futureValue);
  });
});

describe("calculateRealReturn", () => {
  it("reproduz a fórmula de Fisher (10% nominal, 5% inflação => ~4,76% real)", () => {
    const result = calculateRealReturn({ nominalRatePercent: 10, inflationRatePercent: 5 });
    expect(result.realRatePercent).toBeCloseTo(4.7619, 3);
    expect(result.approxRealRatePercent).toBe(5);
  });

  it("com nominal igual à inflação, o retorno real é zero", () => {
    const result = calculateRealReturn({ nominalRatePercent: 8, inflationRatePercent: 8 });
    expect(result.realRatePercent).toBeCloseTo(0, 8);
  });

  it("com inflação maior que o nominal, o retorno real é negativo", () => {
    const result = calculateRealReturn({ nominalRatePercent: 4, inflationRatePercent: 6 });
    expect(result.realRatePercent).toBeLessThan(0);
  });
});
