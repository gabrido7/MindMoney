-- Migration 014: onboarding guiado v2 (boas-vindas, motivação, perfil
-- financeiro completo, renda com fontes/variação, dívidas, hábitos)
--
-- O onboarding v1 (migration 013) só marcava "concluído" -- toda a captura
-- de dado passava pelos endpoints de transactions/goals já existentes. Esta
-- versão pergunta mais coisa, então precisa de mais lugar pra guardar:
--
-- 1. user_financial_profiles ganha 5 colunas novas: financial_situation
--    (autodescrição da vida financeira -- não existia nada parecido),
--    income_variable/income_min/income_max (renda variável, opcional),
--    income_sources (JSON, mesma lógica de "priorities": lista curta sem
--    cardinalidade que justifique tabela própria) e habits (JSON com as 4
--    respostas de hábito financeiro, usadas só pra computar um perfil
--    comportamental determinístico em tempo de leitura -- não guardamos o
--    rótulo calculado, mesmo raciocínio de nunca persistir o que dá pra
--    derivar, já usado em financial_score_history/category_budgets).
--
-- 2. debts é tabela nova -- dívida é uma entidade própria (tem juros,
--    parcela, vencimento), não cabe como coluna solta em lugar nenhum.
--    Dado real e persistido (o usuário pediu "ledger completo", não só uma
--    tela que descarta a resposta) -- sem soft delete: dívida quitada é
--    removida de verdade pelo usuário, diferente de categories (que precisa
--    do archived_at porque transações antigas referenciam o id).
--
-- 3. users.onboarding_skipped_steps -- snapshot de quais etapas o usuário
--    pulou, gravado uma única vez quando o onboarding é concluído (junto
--    com onboarding_completed_at). Alimenta a notificação
--    "onboarding_pending" (item 4).
--
-- 4. notification_preferences.type ganha 'onboarding_pending' -- mesmo
--    padrão da migration 012 pra category_budget_exceeded. notifications.type
--    já é VARCHAR(50) livre, não precisa de ALTER.
--
-- 5. Telefone/Pets/Família não existiam como categoria (nem template nem
--    subcategoria) e agora são cards reais na etapa de despesas fixas --
--    viram category_templates novos + backfill real pra quem já tinha
--    conta (senão só usuário cadastrado depois desta migration teria essas
--    categorias disponíveis). uq_categories_user_name já existente evita
--    duplicar em quem, por acaso, já tivesse criado uma categoria com esse
--    nome manualmente.
--
-- Uso: mysql -u root mindmoney < database/migrations/014_onboarding_expansion.sql

USE mindmoney;

ALTER TABLE user_financial_profiles
  ADD COLUMN financial_situation ENUM('tudo_controle', 'aperta_mas_consigo', 'vivo_no_limite', 'endividado') NULL AFTER experience_level,
  ADD COLUMN income_variable BOOLEAN NOT NULL DEFAULT FALSE AFTER income_range,
  ADD COLUMN income_min DECIMAL(12,2) NULL AFTER income_variable,
  ADD COLUMN income_max DECIMAL(12,2) NULL AFTER income_min,
  ADD COLUMN income_sources JSON NULL AFTER income_max,
  ADD COLUMN habits JSON NULL AFTER priorities;

CREATE TABLE IF NOT EXISTS debts (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id             BIGINT UNSIGNED NOT NULL,
  type                ENUM('cartao_credito', 'emprestimo', 'financiamento', 'cheque_especial', 'parcelamento', 'outro') NOT NULL,
  name                VARCHAR(120)    NOT NULL,
  total_amount        DECIMAL(12,2)   NOT NULL,
  installment_amount  DECIMAL(12,2)   NULL,
  interest_rate       DECIMAL(5,2)    NULL,
  installments_count  SMALLINT UNSIGNED NULL,
  due_day             TINYINT UNSIGNED NULL,
  created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_debts_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_debts_total_amount_positive CHECK (total_amount > 0),
  CONSTRAINT chk_debts_due_day_range CHECK (due_day IS NULL OR due_day BETWEEN 1 AND 31),
  INDEX idx_debts_user (user_id)
) ENGINE=InnoDB;

ALTER TABLE users
  ADD COLUMN onboarding_skipped_steps JSON NULL AFTER onboarding_completed_at;

ALTER TABLE notification_preferences
  MODIFY COLUMN type ENUM('limit_exceeded', 'goal_achieved', 'objective_deadline', 'category_budget_exceeded', 'onboarding_pending') NOT NULL;

INSERT INTO category_templates (name, color, type, is_builtin, sort_order) VALUES
  ('Telefone', '#0ea5e9', 'saida', FALSE, 12),
  ('Pets',     '#84cc16', 'saida', FALSE, 13),
  ('Família',  '#f43f5e', 'saida', FALSE, 14)
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO categories (user_id, name, color, type, is_builtin)
SELECT u.id, ct.name, ct.color, ct.type, ct.is_builtin
FROM users u
JOIN category_templates ct ON ct.name IN ('Telefone', 'Pets', 'Família')
WHERE NOT EXISTS (
  SELECT 1 FROM categories c WHERE c.user_id = u.id AND c.name = ct.name
);
