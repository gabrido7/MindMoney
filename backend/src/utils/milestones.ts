/** Marcos de progresso que disparam uma pequena celebração na tela quando um evento real cruza um deles. */
export const PROGRESS_MILESTONES = [25, 50, 75, 100] as const;

/**
 * Qual marco (se algum) foi cruzado -- compara o progresso antes e depois
 * do evento, não só o valor final, senão algo que já estava em 80%
 * "celebraria" 25%/50% de novo a cada evento novo. Quando um evento cruza
 * mais de um marco de uma vez, celebra o mais alto. Usado tanto por
 * objectives (aporte) quanto por debts (pagamento) -- mesma lógica, dois
 * domínios, promovido pra cá em vez de duplicado.
 */
export function computeMilestone(previousProgressPercent: number, newProgressPercent: number): number | null {
  const crossed = PROGRESS_MILESTONES.filter((m) => previousProgressPercent < m && newProgressPercent >= m);
  return crossed.length > 0 ? Math.max(...crossed) : null;
}
