import { describe, it, expect } from "vitest";
import { simulateCascade } from "./simulateCascade";
import type { Debt } from "../../../types/api";

let nextId = 1;
const makeDebt = (overrides: Partial<Debt>): Debt => ({
  id: nextId++,
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
  daysUntilDue: null,
  ...overrides,
});

describe("simulateCascade", () => {
  it("retorna null quando nenhuma dívida ativa tem parcela definida", () => {
    const debts = [makeDebt({ installmentAmount: null }), makeDebt({ installmentAmount: null })];
    expect(simulateCascade(debts, "bola_de_neve")).toBeNull();
  });

  it("1 dívida só, sem juros: quita em (saldo / parcela) meses, sem juro total", () => {
    const debts = [makeDebt({ remainingAmount: 1000, installmentAmount: 250, interestRate: 0 })];
    const result = simulateCascade(debts, "bola_de_neve");
    expect(result).not.toBeNull();
    expect(result!.totalMonths).toBe(4);
    expect(result!.totalInterest).toBe(0);
    expect(result!.excludedCount).toBe(0);
  });

  it("dívida sem parcela fica de fora e conta em excludedCount", () => {
    const debts = [
      makeDebt({ name: "Com parcela", remainingAmount: 500, installmentAmount: 250, interestRate: 0 }),
      makeDebt({ name: "Sem parcela", remainingAmount: 900, installmentAmount: null }),
    ];
    const result = simulateCascade(debts, "bola_de_neve");
    expect(result).not.toBeNull();
    expect(result!.excludedCount).toBe(1);
    expect(result!.totalMonths).toBe(2); // só a dívida com parcela entra na conta
  });

  it("bola de neve e avalanche dão resultados diferentes quando a ordem de ataque muda o que sobra pra reinvestir mais cedo", () => {
    // 3 dívidas: com só 2, quem sobra recebe o valor livre de qualquer jeito
    // (não há disputa de prioridade). Com 3, a estratégia decide pra qual
    // das duas sobreviventes (depois que "Rápida" quita) o valor livre vai:
    // bola de neve manda pra "Média" (menor saldo), avalanche manda pra
    // "Cara" (maior juro) -- exatamente a divergência que devia existir.
    const debts = [
      makeDebt({ name: "Rápida", remainingAmount: 150, installmentAmount: 80, interestRate: 1 }),
      makeDebt({ name: "Média", remainingAmount: 600, installmentAmount: 120, interestRate: 1 }),
      makeDebt({ name: "Cara", remainingAmount: 900, installmentAmount: 120, interestRate: 6 }),
    ];
    const snowball = simulateCascade(debts, "bola_de_neve")!;
    const avalanche = simulateCascade(debts, "avalanche")!;

    expect(snowball).not.toBeNull();
    expect(avalanche).not.toBeNull();
    // Avalanche libera a dívida cara (juro alto) mais cedo -- deve gerar menos juro total.
    expect(avalanche.totalInterest).toBeLessThan(snowball.totalInterest);
  });

  it("não converge (parcelas somadas não cobrem o juro) devolve null em vez de travar", () => {
    const debts = [makeDebt({ remainingAmount: 100000, installmentAmount: 10, interestRate: 50 })];
    expect(simulateCascade(debts, "bola_de_neve")).toBeNull();
  });

  it("ignora dívidas já quitadas", () => {
    const debts = [
      makeDebt({ name: "Quitada", paidOff: true, remainingAmount: 0, installmentAmount: 100 }),
      makeDebt({ name: "Ativa", remainingAmount: 400, installmentAmount: 200, interestRate: 0 }),
    ];
    const result = simulateCascade(debts, "bola_de_neve");
    expect(result!.totalMonths).toBe(2);
  });
});
