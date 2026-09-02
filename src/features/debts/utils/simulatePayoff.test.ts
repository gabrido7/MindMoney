import { describe, it, expect } from "vitest";
import { simulatePayoff } from "./simulatePayoff";

describe("simulatePayoff", () => {
  it("retorna null para parcela ou saldo zero, negativo ou não informado", () => {
    expect(simulatePayoff(1000, 2, 0)).toBeNull();
    expect(simulatePayoff(1000, 2, -50)).toBeNull();
    expect(simulatePayoff(0, 2, 100)).toBeNull();
    expect(simulatePayoff(-100, 2, 100)).toBeNull();
  });

  it("sem juros (0%), é divisão simples arredondada pra cima", () => {
    const result = simulatePayoff(1000, 0, 300);
    expect(result).not.toBeNull();
    expect(result!.monthsNeeded).toBe(4); // ceil(1000/300)
    expect(result!.totalPaid).toBe(1200);
    expect(result!.totalInterest).toBe(200);
    expect(result!.insufficientPayment).toBe(false);
  });

  it("divisão exata sem juros não sobra resto", () => {
    const result = simulatePayoff(900, 0, 300);
    expect(result!.monthsNeeded).toBe(3);
    expect(result!.totalInterest).toBe(0);
  });

  it("com juros, quita mais devagar que a divisão simples equivalente", () => {
    const semJuros = simulatePayoff(1000, 0, 300)!;
    const comJuros = simulatePayoff(1000, 5, 300)!;
    expect(comJuros.monthsNeeded).toBeGreaterThanOrEqual(semJuros.monthsNeeded);
    expect(comJuros.totalInterest).toBeGreaterThan(0);
  });

  it("marca insufficientPayment quando a parcela nem cobre o juro do mês", () => {
    // saldo 10000, 5% a.m. = R$500 de juro só no mês -- parcela de R$400 nunca quita
    const result = simulatePayoff(10000, 5, 400);
    expect(result!.insufficientPayment).toBe(true);
    expect(result!.monthsNeeded).toBe(0);
  });

  it("parcela igual ao juro do mês também conta como insuficiente (nunca abate o principal)", () => {
    const result = simulatePayoff(10000, 5, 500);
    expect(result!.insufficientPayment).toBe(true);
  });

  it("marca tooFar quando levaria mais de 20 anos, mas ainda converge", () => {
    // juro baixo, parcela pequena mas ainda acima do juro mensal
    const result = simulatePayoff(100000, 0.5, 510);
    expect(result!.insufficientPayment).toBe(false);
    expect(result!.tooFar).toBe(true);
  });

  it("um mês de parcela maior que o saldo total quita em 1 mês", () => {
    const result = simulatePayoff(100, 2, 500);
    expect(result!.monthsNeeded).toBe(1);
  });
});
