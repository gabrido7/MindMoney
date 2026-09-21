import { describe, it, expect } from "vitest";
import { rankDebts } from "./rankDebts";
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
  status: "ativa",
  daysUntilDue: null,
  ...overrides,
});

describe("rankDebts", () => {
  it("bola de neve ordena por menor saldo restante primeiro", () => {
    const debts = [
      makeDebt({ name: "Financiamento", remainingAmount: 15000 }),
      makeDebt({ name: "Cartão", remainingAmount: 800 }),
      makeDebt({ name: "Empréstimo", remainingAmount: 3000 }),
    ];
    const ranked = rankDebts(debts, "bola_de_neve");
    expect(ranked.map((d) => d.name)).toEqual(["Cartão", "Empréstimo", "Financiamento"]);
  });

  it("avalanche ordena por maior juro primeiro", () => {
    const debts = [
      makeDebt({ name: "Financiamento", interestRate: 1.2 }),
      makeDebt({ name: "Cartão", interestRate: 12 }),
      makeDebt({ name: "Empréstimo", interestRate: 4 }),
    ];
    const ranked = rankDebts(debts, "avalanche");
    expect(ranked.map((d) => d.name)).toEqual(["Cartão", "Empréstimo", "Financiamento"]);
  });

  it("avalanche joga dívida sem juro informado pro fim, não trata como juro zero", () => {
    const debts = [
      makeDebt({ name: "Sem juro", interestRate: null }),
      makeDebt({ name: "Juro baixo", interestRate: 0.5 }),
    ];
    const ranked = rankDebts(debts, "avalanche");
    expect(ranked.map((d) => d.name)).toEqual(["Juro baixo", "Sem juro"]);
  });

  it("ignora dívidas já quitadas em ambas as estratégias", () => {
    const debts = [
      makeDebt({ name: "Quitada", remainingAmount: 0, paidOff: true, interestRate: 50 }),
      makeDebt({ name: "Ativa", remainingAmount: 500, interestRate: 2 }),
    ];
    expect(rankDebts(debts, "bola_de_neve").map((d) => d.name)).toEqual(["Ativa"]);
    expect(rankDebts(debts, "avalanche").map((d) => d.name)).toEqual(["Ativa"]);
  });

  it("lista vazia ou com 1 item só, devolve o mesmo tamanho sem quebrar", () => {
    expect(rankDebts([], "bola_de_neve")).toEqual([]);
    const single = [makeDebt({ name: "Só uma" })];
    expect(rankDebts(single, "avalanche").map((d) => d.name)).toEqual(["Só uma"]);
  });

  it("não modifica o array original", () => {
    const debts = [makeDebt({ name: "A", remainingAmount: 100 }), makeDebt({ name: "B", remainingAmount: 50 })];
    const original = [...debts];
    rankDebts(debts, "bola_de_neve");
    expect(debts).toEqual(original);
  });
});
