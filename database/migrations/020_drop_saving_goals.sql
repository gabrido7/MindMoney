-- Unificação Meta/Objetivo: saving_goals (meta mensal, uma por mês) nunca
-- teve tela nenhuma pra criar/editar/ver -- GoalCard.tsx existia mas não era
-- importado em lugar nenhum do frontend. financial_objectives (migration
-- 006) já é a única coisa real que o usuário usa e já é chamada de "Meta"
-- em toda a UI. "Capacidade de economia" do score, a notificação
-- goal_achieved, o insight de meta e o assistente passam a derivar a meta
-- do mês da soma de requiredMonthlyAmount dos objetivos ativos, em vez de
-- consultar esta tabela -- ver backend/src/modules/objectives/objectiveMath.ts.
USE mindmoney;

DROP TABLE IF EXISTS saving_goals;
