import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { simulateGoal } from "./simulateGoal";

describe("simulateGoal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("retorna null para valor mensal zero, negativo ou não informado", () => {
    expect(simulateGoal(1000, "2027-06", 0)).toBeNull();
    expect(simulateGoal(1000, "2027-06", -50)).toBeNull();
  });

  it("calcula quantos meses e qual mês a meta seria atingida", () => {
    const result = simulateGoal(3000, "2027-06", 300);
    expect(result).not.toBeNull();
    expect(result!.monthsNeeded).toBe(10); // 3000 / 300
    expect(result!.projectedMonth).toBe("2027-06");
  });

  it("arredonda pra cima quando a divisão não é exata", () => {
    const result = simulateGoal(1000, "2027-06", 300);
    expect(result!.monthsNeeded).toBe(4); // ceil(1000/300) = 4
    expect(result!.projectedMonth).toBe("2026-12");
  });

  it("deltaVsDeadlineMonths negativo quando a projeção fica antes do prazo atual", () => {
    // meta com prazo dez/2027, mas no ritmo simulado dá pra terminar bem antes
    const result = simulateGoal(300, "2027-12", 300); // 1 mês -> set/2026
    expect(result!.deltaVsDeadlineMonths).toBeLessThan(0);
  });

  it("deltaVsDeadlineMonths positivo quando a projeção fica depois do prazo atual", () => {
    const result = simulateGoal(3000, "2026-09", 100); // 30 meses, bem depois do prazo
    expect(result!.deltaVsDeadlineMonths).toBeGreaterThan(0);
  });

  it("deltaVsDeadlineMonths zero quando a projeção cai no mesmo mês do prazo", () => {
    const result = simulateGoal(300, "2026-09", 300); // 1 mês -> set/2026
    expect(result!.projectedMonth).toBe("2026-09");
    expect(result!.deltaVsDeadlineMonths).toBe(0);
  });

  it("marca tooFar quando o ritmo levaria mais de 50 anos", () => {
    const result = simulateGoal(100000, "2027-06", 1);
    expect(result!.tooFar).toBe(true);
  });

  it("valor mensal maior que o restante ainda conta pelo menos 1 mês (aproximação simples, sem fração de mês)", () => {
    const result = simulateGoal(100, "2027-06", 500);
    expect(result!.monthsNeeded).toBe(1);
    expect(result!.projectedMonth).toBe("2026-09");
  });
});
