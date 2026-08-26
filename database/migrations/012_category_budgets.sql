-- Migration 012: orçamento por categoria
--
-- Hoje o único alerta de gasto é geral (limit_exceeded: % das entradas gasto
-- no mês inteiro). category_budgets deixa o usuário definir um teto por
-- categoria/mês (ex.: "R$400 em Alimentação") -- o pedido mais comum em
-- qualquer app de controle financeiro e que ainda não existia aqui.
--
-- Segue exatamente o mesmo formato de saving_goals (uma linha por
-- usuário/categoria/mês, valor sempre DECIMAL): "quanto já foi gasto" não é
-- guardado aqui, é calculado sob demanda a partir de transactions, mesmo
-- raciocínio já usado em todo o resto do projeto (nunca persistir o que dá
-- pra derivar).
--
-- Uso: mysql -u root mindmoney < database/migrations/012_category_budgets.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS category_budgets (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  category_id     BIGINT UNSIGNED NOT NULL,
  reference_month CHAR(7)         NOT NULL, -- formato 'YYYY-MM'
  amount          DECIMAL(12,2)   NOT NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_category_budgets_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_category_budgets_category
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  CONSTRAINT chk_category_budgets_amount_positive CHECK (amount > 0),
  CONSTRAINT chk_category_budgets_month_format CHECK (reference_month REGEXP '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  UNIQUE KEY uq_category_budgets_user_category_month (user_id, category_id, reference_month),
  INDEX idx_category_budgets_user_month (user_id, reference_month)
) ENGINE=InnoDB;

-- Novo tipo de notificação real (efeito colateral de criar/editar
-- transação, mesmo padrão de limit_exceeded/goal_achieved/objective_deadline
-- -- nunca criada manualmente): dispara quando uma categoria orçada
-- ultrapassa o valor definido. notifications.type já é VARCHAR(50) livre
-- (não precisa de ALTER); notification_preferences.type é o único ENUM
-- que precisa aceitar o valor novo.
ALTER TABLE notification_preferences
  MODIFY COLUMN type ENUM('limit_exceeded', 'goal_achieved', 'objective_deadline', 'category_budget_exceeded') NOT NULL;
