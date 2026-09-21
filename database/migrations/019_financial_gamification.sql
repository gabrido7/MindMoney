-- Migration 019: recompensa real pro núcleo financeiro (não só educação/metas)
--
-- Duas notificações novas -- mesmo padrão ENUM das migrations 012/014/016 --
-- pra alcançar o usuário fora da página quando algo bom acontece de
-- verdade: quitar uma dívida por completo, e o patrimônio líquido
-- (ativos - dívidas) ficar positivo pela primeira vez.
--
-- Uso: mysql -u root --default-character-set=utf8mb4 mindmoney < database/migrations/019_financial_gamification.sql

USE mindmoney;

ALTER TABLE notification_preferences
  MODIFY COLUMN type ENUM(
    'limit_exceeded', 'goal_achieved', 'objective_deadline',
    'category_budget_exceeded', 'onboarding_pending', 'debt_due_date',
    'debt_paid_off', 'net_worth_positive'
  ) NOT NULL;
