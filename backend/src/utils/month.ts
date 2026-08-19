/** '2026-08' -> '08/2026' (mesma formatação usada no front, formatMonthBR). */
export const formatMonthLabel = (yyyyMm: string): string => yyyyMm.split("-").reverse().join("/");

export const currentMonth = (): string => new Date().toISOString().slice(0, 7);

export const getPreviousMonth = (month: string): string => {
  const date = new Date(`${month}-01T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() - 1);
  return date.toISOString().slice(0, 7);
};

export const calcPercentChange = (current: number, previous: number): number => {
  if (previous === 0) return current === 0 ? 0 : current > 0 ? 100 : -100;
  return ((current - previous) / previous) * 100;
};

/** Diferença em meses inteiros entre "from" e "to" (positiva se "to" é depois de "from", negativa se antes). */
export const monthsBetween = (from: string, to: string): number => {
  const [fromYear, fromMonth] = from.split("-").map(Number);
  const [toYear, toMonth] = to.split("-").map(Number);
  return (toYear - fromYear) * 12 + (toMonth - fromMonth);
};

/**
 * Dias entre hoje e o último dia de "targetMonth" (o prazo de uma meta só tem
 * granularidade de mês -- "até dezembro de 2027" -- então o último dia do mês
 * é o fim do prazo). Negativo quando o prazo já passou.
 */
export const daysUntilEndOfMonth = (targetMonth: string): number => {
  const [year, month] = targetMonth.split("-").map(Number);
  const endOfMonth = new Date(Date.UTC(year, month, 0)); // dia 0 do mês seguinte = último dia deste mês
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const diffMs = endOfMonth.getTime() - startOfToday.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};
