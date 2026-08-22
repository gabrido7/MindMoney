/** Aceita vírgula OU ponto como separador decimal (não trata separador de milhar digitado). */
export function parseLocaleNumber(raw: string): number {
  if (!raw) return NaN;
  const normalized = raw.trim().replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}
