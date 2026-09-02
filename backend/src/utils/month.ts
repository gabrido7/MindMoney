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

/**
 * Próxima ocorrência do dia `dueDay` (1-31) -- esse mês, se ainda não
 * passou, senão o mês seguinte. Faz clamp pro último dia do mês quando o
 * mês é mais curto que dueDay (ex: due_day=31 caindo em fevereiro vira o
 * dia 28/29, não rola pra março -- rollover do JS Date daria uma data errada).
 * Base de daysUntilNextDueDay/nextDueDateISO -- as duas precisam da mesma
 * data, uma como contagem de dias, outra como string.
 */
function nextDueDate(dueDay: number): Date {
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const clampedThisMonth = (year: number, month: number): Date => {
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return new Date(Date.UTC(year, month, Math.min(dueDay, daysInMonth)));
  };

  let nextDue = clampedThisMonth(now.getUTCFullYear(), now.getUTCMonth());
  if (nextDue.getTime() < startOfToday.getTime()) {
    nextDue = clampedThisMonth(now.getUTCFullYear(), now.getUTCMonth() + 1);
  }
  return nextDue;
}

export const daysUntilNextDueDay = (dueDay: number): number => {
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return Math.round((nextDueDate(dueDay).getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));
};

/** A mesma próxima ocorrência de daysUntilNextDueDay, como 'YYYY-MM-DD' -- usado pra identificar de forma única qual vencimento um alerta se refere (ver debt_due_alerts, migration 017). */
export const nextDueDateISO = (dueDay: number): string => nextDueDate(dueDay).toISOString().slice(0, 10);
