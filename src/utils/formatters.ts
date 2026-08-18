export const formatCurrency = (value: number): string =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatDateBR = (isoDate: string): string =>
  isoDate.split("-").reverse().join("/");

export const formatMonthBR = (yyyyMm: string): string =>
  yyyyMm.split("-").reverse().join("/");

export const calcPercentChange = (current: number, previous: number): number => {
  if (previous === 0) return current === 0 ? 0 : current > 0 ? 100 : -100;
  return ((current - previous) / previous) * 100;
};

export const currentMonth = (): string => new Date().toISOString().slice(0, 7);
