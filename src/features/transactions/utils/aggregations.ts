import type { Transaction, CategoryTotal, CategoryComparison } from "../../../types";
import { calcPercentChange } from "../../../utils/formatters";

export const filterByMonth = (transactions: Transaction[], month: string) =>
  transactions.filter((t) => t.date.startsWith(month));

export const sumByType = (transactions: Transaction[], type: Transaction["type"]) =>
  transactions
    .filter((t) => t.type === type)
    .reduce((acc, t) => acc + t.amount, 0);

export const groupByCategory = (transactions: Transaction[]): Record<string, number> =>
  transactions
    .filter((t) => t.type === "saida")
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

export const categoryTotals = (transactions: Transaction[]): CategoryTotal[] => {
  const grouped = groupByCategory(transactions);
  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
};

export const groupBySubcategory = (
  transactions: Transaction[],
  category: string
): Record<string, number> =>
  transactions
    .filter((t) => t.category === category)
    .reduce((acc: Record<string, number>, t) => {
      const key = t.subcategory || "Outros";
      acc[key] = (acc[key] || 0) + t.amount;
      return acc;
    }, {});

export const compareCategories = (
  current: Transaction[],
  previous: Transaction[]
): CategoryComparison[] => {
  const currentByCategory = groupByCategory(current);
  const previousByCategory = groupByCategory(previous);

  return Object.keys(currentByCategory).map((category) => {
    const currentValue = currentByCategory[category] || 0;
    const previousValue = previousByCategory[category] || 0;
    return {
      category,
      change: calcPercentChange(currentValue, previousValue),
      current: currentValue,
      previous: previousValue,
    };
  });
};

/**
 * Igual a compareCategories, mas opera sobre totais já agregados por
 * categoria (o formato que o backend devolve em categoryBreakdown) em vez
 * de transações brutas — usada pelo Dashboard, que agora busca o
 * comparativo mês-a-mês pronto da API em vez de recalcular a partir do
 * histórico completo de transações no navegador.
 */
export const compareCategoryBreakdowns = (
  current: CategoryTotal[],
  previous: CategoryTotal[]
): CategoryComparison[] => {
  const previousByName = new Map(previous.map((c) => [c.name, c.value]));

  return current.map((c) => {
    const previousValue = previousByName.get(c.name) ?? 0;
    return {
      category: c.name,
      change: calcPercentChange(c.value, previousValue),
      current: c.value,
      previous: previousValue,
    };
  });
};

export const getPreviousMonth = (month: string): string => {
  const date = new Date(month + "-01T00:00:00");
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().slice(0, 7);
};

export const monthlyEvolution = (transactions: Transaction[]) => {
  const monthly = transactions.reduce(
    (acc: Record<string, { entradas: number; saidas: number }>, t) => {
      const month = t.date.slice(0, 7);
      if (!acc[month]) acc[month] = { entradas: 0, saidas: 0 };
      if (t.type === "entrada") acc[month].entradas += t.amount;
      else acc[month].saidas += t.amount;
      return acc;
    },
    {}
  );

  return Object.entries(monthly)
    .map(([month, { entradas, saidas }]) => ({
      month,
      saldo: entradas - saidas,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};
