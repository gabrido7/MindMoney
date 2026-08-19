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
