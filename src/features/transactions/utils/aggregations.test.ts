import { describe, it, expect } from "vitest";
import {
  filterByMonth,
  sumByType,
  categoryTotals,
  groupBySubcategory,
  compareCategories,
  getPreviousMonth,
  monthlyEvolution,
} from "./aggregations";
import type { Transaction } from "../../../types";

const tx = (overrides: Partial<Transaction>): Transaction => ({
  id: overrides.id ?? Math.random().toString(),
  description: "x",
  amount: 100,
  type: "saida",
  date: "2026-08-01",
  category: "Alimentação",
  ...overrides,
});

describe("filterByMonth", () => {
  it("mantém só transações do mês pedido", () => {
    const transactions = [
      tx({ date: "2026-08-05" }),
      tx({ date: "2026-07-20" }),
      tx({ date: "2026-08-31" }),
    ];
    expect(filterByMonth(transactions, "2026-08")).toHaveLength(2);
  });
});

describe("sumByType", () => {
  it("soma só o tipo pedido", () => {
    const transactions = [
      tx({ type: "entrada", amount: 5000 }),
      tx({ type: "saida", amount: 1200 }),
      tx({ type: "saida", amount: 300 }),
    ];
    expect(sumByType(transactions, "entrada")).toBe(5000);
    expect(sumByType(transactions, "saida")).toBe(1500);
  });

  it("mês sem transações retorna 0 (sem divisão por zero)", () => {
    expect(sumByType([], "entrada")).toBe(0);
  });
});

describe("categoryTotals", () => {
  it("agrupa saídas por categoria, ignora entradas", () => {
    const transactions = [
      tx({ type: "saida", category: "Alimentação", amount: 300 }),
      tx({ type: "saida", category: "Alimentação", amount: 200 }),
      tx({ type: "saida", category: "Transporte", amount: 100 }),
      tx({ type: "entrada", category: "Salário", amount: 5000 }),
    ];
    const result = categoryTotals(transactions);
    expect(result).toEqual(
      expect.arrayContaining([
        { name: "Alimentação", value: 500 },
        { name: "Transporte", value: 100 },
      ])
    );
    expect(result.find((c) => c.name === "Salário")).toBeUndefined();
  });
});

describe("groupBySubcategory", () => {
  it("agrupa por subcategoria, sem subcategoria cai em 'Outros'", () => {
    const transactions = [
      tx({ category: "Alimentação", subcategory: "Mercado", amount: 200 }),
      tx({ category: "Alimentação", subcategory: "Mercado", amount: 100 }),
      tx({ category: "Alimentação", subcategory: undefined, amount: 50 }),
    ];
    const result = groupBySubcategory(transactions, "Alimentação");
    expect(result).toEqual({ Mercado: 300, Outros: 50 });
  });
});

describe("compareCategories", () => {
  it("calcula variação por categoria entre dois meses", () => {
    const current = [tx({ category: "Alimentação", amount: 200 })];
    const previous = [tx({ category: "Alimentação", amount: 100 })];
    const result = compareCategories(current, previous);
    expect(result[0]).toMatchObject({ category: "Alimentação", change: 100, current: 200, previous: 100 });
  });

  it("categoria nova (sem histórico no mês anterior) não gera -Infinity", () => {
    const current = [tx({ category: "Pets", amount: 50 })];
    const result = compareCategories(current, []);
    expect(Number.isFinite(result[0].change)).toBe(true);
  });
});

describe("getPreviousMonth", () => {
  it("volta um mês corretamente, inclusive na virada de ano", () => {
    expect(getPreviousMonth("2026-08")).toBe("2026-07");
    expect(getPreviousMonth("2026-01")).toBe("2025-12");
  });
});

describe("monthlyEvolution", () => {
  it("calcula saldo por mês e ordena cronologicamente", () => {
    const transactions = [
      tx({ date: "2026-08-01", type: "entrada", amount: 1000 }),
      tx({ date: "2026-08-15", type: "saida", amount: 400 }),
      tx({ date: "2026-07-01", type: "entrada", amount: 500 }),
    ];
    const result = monthlyEvolution(transactions);
    expect(result).toEqual([
      { month: "2026-07", saldo: 500 },
      { month: "2026-08", saldo: 600 },
    ]);
  });
});
