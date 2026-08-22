export const formatCurrency = (value: number): string =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatPercent = (value: number, decimals = 2): string =>
  `${value.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}%`;

export const formatDateBR = (isoDate: string): string =>
  isoDate.split("-").reverse().join("/");

export const formatMonthBR = (yyyyMm: string): string =>
  yyyyMm.split("-").reverse().join("/");

export const calcPercentChange = (current: number, previous: number): number => {
  if (previous === 0) return current === 0 ? 0 : current > 0 ? 100 : -100;
  return ((current - previous) / previous) * 100;
};

export const currentMonth = (): string => new Date().toISOString().slice(0, 7);

const MONTHS_PT = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

/** '2026-08' -> 'agosto de 2026' */
export const formatMonthLongBR = (yyyyMm: string): string => {
  const [year, month] = yyyyMm.split("-").map(Number);
  return `${MONTHS_PT[month - 1]} de ${year}`;
};

/** '2026-08' + 3 -> '2026-11' */
export const addMonths = (yyyyMm: string, months: number): string => {
  const [year, month] = yyyyMm.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + months, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
};

/** Diferença em meses inteiros entre "from" e "to" (positiva se "to" é depois de "from"). */
export const monthsBetween = (from: string, to: string): number => {
  const [fromYear, fromMonth] = from.split("-").map(Number);
  const [toYear, toMonth] = to.split("-").map(Number);
  return (toYear - fromYear) * 12 + (toMonth - fromMonth);
};
