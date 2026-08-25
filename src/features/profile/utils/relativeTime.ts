/** "há 3 dias", "hoje", "há 2 meses" -- usado pra sessão ativa (último uso) e senha (última troca). */
export function formatRelative(isoDate: string): string {
  const date = new Date(isoDate.replace(" ", "T"));
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 30) return `há ${days} dias`;

  const months = Math.floor(days / 30);
  if (months < 12) return `há ${months} ${months === 1 ? "mês" : "meses"}`;

  const years = Math.floor(months / 12);
  return `há ${years} ${years === 1 ? "ano" : "anos"}`;
}
