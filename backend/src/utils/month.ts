/** '2026-08' -> '08/2026' (mesma formatação usada no front, formatMonthBR). */
export const formatMonthLabel = (yyyyMm: string): string => yyyyMm.split("-").reverse().join("/");

export const currentMonth = (): string => new Date().toISOString().slice(0, 7);

/** "Hoje" como 'YYYY-MM-DD' -- sempre via `new Date()` (nunca CURDATE() direto no SQL), pra quem decide "o que é hoje" ser a aplicação, testável com vi.setSystemTime; o relógio do servidor MySQL não tem como ser congelado junto num teste. */
export const todayISO = (): string => new Date().toISOString().slice(0, 10);

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

/** Último dia do mês (YYYY-MM) como 'YYYY-MM-DD' -- mesmo truque "dia 0 do mês seguinte" usado em nextDueDate abaixo. Usado por qualquer cálculo de snapshot "como estava no fim desse mês" (debtAdvice, netWorth). */
export const endOfMonthISO = (yyyyMm: string): string => {
  const [year, month] = yyyyMm.split("-").map(Number);
  return new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
};

/**
 * Data do dia `day` (1-31) num mês/ano dados, com clamp pro último dia do
 * mês quando o mês é mais curto (ex: day=31 em fevereiro vira 28/29, não
 * rola pra março -- rollover do JS Date daria uma data errada). `month` não
 * precisa estar em 0-11: passar 12, 13... rola pros anos seguintes
 * naturalmente (Date.UTC já normaliza), o que permite gerar N meses seguidos
 * só incrementando o índice.
 */
function clampedDateForMonth(year: number, month: number, day: number): Date {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(day, daysInMonth)));
}

/**
 * Próxima ocorrência do dia `dueDay` (1-31) -- esse mês, se ainda não
 * passou, senão o mês seguinte. Base de daysUntilNextDueDay/nextDueDateISO
 * -- as duas precisam da mesma data, uma como contagem de dias, outra como
 * string -- e de installmentDueDates (primeira parcela de uma compra
 * parcelada é sempre a próxima ocorrência do vencimento).
 */
function nextDueDate(dueDay: number): Date {
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  let nextDue = clampedDateForMonth(now.getUTCFullYear(), now.getUTCMonth(), dueDay);
  if (nextDue.getTime() < startOfToday.getTime()) {
    nextDue = clampedDateForMonth(now.getUTCFullYear(), now.getUTCMonth() + 1, dueDay);
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

/**
 * As `count` datas de vencimento de uma compra parcelada, uma por mês, a
 * partir da próxima ocorrência de `dueDay` (mesma regra de nextDueDate) --
 * cada mês com seu próprio clamp de fim de mês (due_day=31 não "vaza" pro
 * mês seguinte em fevereiro, cada ocorrência é clampada independente).
 */
export const installmentDueDates = (dueDay: number, count: number): string[] => {
  const first = nextDueDate(dueDay);
  const dates: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = clampedDateForMonth(first.getUTCFullYear(), first.getUTCMonth() + i, dueDay);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
};
