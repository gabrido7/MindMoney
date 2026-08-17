-- Mind Money — Schema MySQL (Etapa 3)
-- Motor: InnoDB (obrigatório para FKs) | Charset: utf8mb4 (PT-BR completo)
-- Convenção: chaves primárias BIGINT UNSIGNED AUTO_INCREMENT, timestamps padrão,
-- valores monetários sempre DECIMAL (nunca FLOAT/DOUBLE).

CREATE DATABASE IF NOT EXISTS mindmoney
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mindmoney;

-- =========================================================
-- USUÁRIOS, PERFIL E CONFIGURAÇÕES
-- =========================================================

CREATE TABLE users (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(120)    NOT NULL,
  email           VARCHAR(255)    NOT NULL,
  password_hash   VARCHAR(255)    NOT NULL,
  email_verified_at TIMESTAMP     NULL,
  last_login_at   TIMESTAMP       NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE password_reset_tokens (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  token_hash      VARCHAR(255)    NOT NULL,
  expires_at      TIMESTAMP       NOT NULL,
  used_at         TIMESTAMP       NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reset_tokens_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_reset_token_hash (token_hash)
) ENGINE=InnoDB;

CREATE TABLE profiles (
  user_id         BIGINT UNSIGNED PRIMARY KEY,
  avatar_url      VARCHAR(500)    NULL,
  phone           VARCHAR(30)     NULL,
  birth_date      DATE            NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_profiles_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE user_settings (
  user_id         BIGINT UNSIGNED PRIMARY KEY,
  theme           ENUM('light','dark','system') NOT NULL DEFAULT 'system',
  currency        CHAR(3)         NOT NULL DEFAULT 'BRL',
  locale          VARCHAR(10)     NOT NULL DEFAULT 'pt-BR',
  alert_percent   DECIMAL(5,2)    NOT NULL DEFAULT 70.00,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_settings_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- CATEGORIAS E SUBCATEGORIAS (por usuário, como no front atual)
-- =========================================================

CREATE TABLE categories (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  name            VARCHAR(60)     NOT NULL,
  color           CHAR(7)         NOT NULL,
  type            ENUM('entrada','saida','ambos') NOT NULL,
  is_builtin      BOOLEAN         NOT NULL DEFAULT FALSE,
  archived_at     TIMESTAMP       NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_categories_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_categories_user_name (user_id, name)
) ENGINE=InnoDB;

CREATE TABLE subcategories (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id     BIGINT UNSIGNED NOT NULL,
  name            VARCHAR(60)     NOT NULL,
  color           CHAR(7)         NOT NULL,
  archived_at     TIMESTAMP       NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_subcategories_category
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY uq_subcategories_category_name (category_id, name)
) ENGINE=InnoDB;

-- =========================================================
-- TRANSAÇÕES
-- =========================================================

CREATE TABLE transactions (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  category_id     BIGINT UNSIGNED NOT NULL,
  subcategory_id  BIGINT UNSIGNED NULL,
  description     VARCHAR(255)    NOT NULL,
  amount          DECIMAL(12,2)   NOT NULL,
  type            ENUM('entrada','saida') NOT NULL,
  transaction_date DATE           NOT NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_transactions_category
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  CONSTRAINT fk_transactions_subcategory
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
  CONSTRAINT chk_transactions_amount_positive CHECK (amount > 0),
  INDEX idx_transactions_user_date (user_id, transaction_date),
  INDEX idx_transactions_user_category (user_id, category_id)
) ENGINE=InnoDB;

-- =========================================================
-- METAS DE ECONOMIA (uma por usuário/mês)
-- =========================================================

CREATE TABLE saving_goals (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  reference_month CHAR(7)         NOT NULL, -- formato 'YYYY-MM'
  target_amount   DECIMAL(12,2)   NOT NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_saving_goals_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_saving_goals_amount_positive CHECK (target_amount > 0),
  UNIQUE KEY uq_saving_goals_user_month (user_id, reference_month)
) ENGINE=InnoDB;

-- =========================================================
-- SCORE FINANCEIRO (histórico é a fonte única de verdade;
-- o score "atual" é sempre a linha mais recente por usuário)
-- =========================================================

CREATE TABLE financial_score_history (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  reference_month CHAR(7)         NOT NULL,
  score           TINYINT UNSIGNED NOT NULL, -- 0 a 100
  details         JSON            NULL,      -- fatores usados no cálculo (auditável)
  calculated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_score_history_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_score_range CHECK (score BETWEEN 0 AND 100),
  UNIQUE KEY uq_score_user_month (user_id, reference_month)
) ENGINE=InnoDB;

-- =========================================================
-- NOTIFICAÇÕES
-- =========================================================

CREATE TABLE notifications (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  type            VARCHAR(50)     NOT NULL, -- 'limit_exceeded', 'goal_achieved', 'goal_at_risk', 'score_drop', ...
  title           VARCHAR(150)    NOT NULL,
  message         VARCHAR(500)    NOT NULL,
  read_at         TIMESTAMP       NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_user_read (user_id, read_at)
) ENGINE=InnoDB;

-- =========================================================
-- RELATÓRIOS GERADOS (histórico de exportações; a visualização
-- em tela é sempre consulta direta, isto é só o log de exports)
-- =========================================================

CREATE TABLE reports (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  type            VARCHAR(50)     NOT NULL, -- 'monthly_summary', 'category_breakdown', 'custom_range', ...
  period_start    DATE            NOT NULL,
  period_end      DATE            NOT NULL,
  format          ENUM('pdf','csv','json') NOT NULL,
  file_path       VARCHAR(500)    NULL,
  generated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reports_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_reports_user_generated (user_id, generated_at)
) ENGINE=InnoDB;
