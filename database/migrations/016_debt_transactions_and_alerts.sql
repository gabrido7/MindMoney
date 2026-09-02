-- Migration 016: Central de Dívidas -- pagamento vira transação real, histórico
-- global e alerta de vencimento
--
-- 1. Categoria "Dívidas" (saida, is_builtin -- mesmo tratamento de
--    Salário/Outros, sinaliza categoria de sistema) -- todo pagamento de
--    dívida registrado a partir de agora vira uma transação real nela, pra
--    aparecer no Dashboard/score/orçamento por categoria como qualquer
--    outro gasto. Mesmo padrão de seed + backfill da migration 014
--    (Telefone/Pets/Família): INSERT no template + INSERT ... WHERE NOT
--    EXISTS pros usuários que já existem, usando a uq_categories_user_name
--    já existente pra nunca duplicar.
--
-- 2. debt_payments.transaction_id -- liga cada pagamento à transação real
--    que ele gerou. ON DELETE SET NULL (não CASCADE): se a transação sumir
--    por outro caminho, o pagamento em si continua existindo -- ele
--    aconteceu de verdade, só perde o vínculo.
--
-- 3. notification_preferences.type ganha 'debt_due_date' -- mesmo padrão
--    ENUM das migrations 012/014. notifications.type continua livre
--    (VARCHAR), não precisa de ALTER.
--
-- Uso: mysql -u root --default-character-set=utf8mb4 mindmoney < database/migrations/016_debt_transactions_and_alerts.sql

USE mindmoney;

ALTER TABLE debt_payments
  ADD COLUMN transaction_id BIGINT UNSIGNED NULL AFTER note,
  ADD CONSTRAINT fk_debt_payments_transaction
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL;

ALTER TABLE notification_preferences
  MODIFY COLUMN type ENUM(
    'limit_exceeded', 'goal_achieved', 'objective_deadline',
    'category_budget_exceeded', 'onboarding_pending', 'debt_due_date'
  ) NOT NULL;

INSERT INTO category_templates (name, color, type, is_builtin, sort_order) VALUES
  ('Dívidas', '#b91c1c', 'saida', TRUE, 15)
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO categories (user_id, name, color, type, is_builtin)
SELECT u.id, ct.name, ct.color, ct.type, ct.is_builtin
FROM users u
JOIN category_templates ct ON ct.name = 'Dívidas'
WHERE NOT EXISTS (
  SELECT 1 FROM categories c WHERE c.user_id = u.id AND c.name = ct.name
);
