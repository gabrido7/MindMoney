/**
 * Regras de negócio compartilhadas entre módulos do backend (e espelhadas
 * no frontend em src/config/rules.ts, já que os dois runtimes não podem
 * importar o mesmo arquivo). Antes deste módulo existir, ALERT_PERCENT = 70
 * estava redeclarado de forma independente em dashboard.service.ts,
 * score.service.ts, notifications.service.ts e no Dashboard.tsx do
 * frontend -- quatro lugares pra lembrar de manter em sincronia se o
 * limiar mudar. Agora tanto o backend quanto o front consultam apenas isto
 * (o front, via o campo `alert.threshold` que a API já devolve em
 * /api/dashboard, no lugar de guardar o próprio número).
 */

/** % das entradas gasto no mês a partir do qual o alerta de limite dispara. */
export const ALERT_PERCENT = 70;

/** "quase no limite" = essa fração do próprio ALERT_PERCENT. */
export const NEAR_ALERT_RATIO = 0.8;

/** Sem meta definida, guardar essa fração (ou mais) das entradas já vale a nota cheia de capacidade de economia no score. */
export const SAVINGS_RATE_FULL_SCORE = 0.2;

/** Orçamento por categoria: % do valor orçado gasto a partir do qual o status vira "próximo do limite". */
export const CATEGORY_BUDGET_NEAR_PERCENT = 80;

/** Dívidas: marcos (dias antes do vencimento) em que o alerta de "vencimento próximo" dispara -- cada um notifica de forma independente (ver debt_due_alerts, migration 017). */
export const DEBT_DUE_MILESTONES = [30, 15, 7, 3, 0];

/** Nome fixo da categoria de sistema usada pra registrar pagamentos de dívida como transação real (ver migration 016). */
export const DEBT_PAYMENT_CATEGORY_NAME = "Dívidas";
