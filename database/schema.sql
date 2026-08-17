-- Mind Money — Schema MySQL/MariaDB (definitivo, etapa 4)
-- Motor: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
--
-- Escopo desta versão: só o que é realmente necessário para transações,
-- categorias/subcategorias, metas e login. Score financeiro, notificações,
-- relatórios e perfil/configurações NÃO entram aqui — não existe nenhuma
-- funcionalidade real ainda que os use, e adicioná-los agora seria
-- especulação. Ver database/README.md para o raciocínio completo por tabela.

CREATE DATABASE IF NOT EXISTS mindmoney
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mindmoney;

-- =========================================================
-- USUÁRIOS (auth — a tela de login vem a seguir)
-- =========================================================

CREATE TABLE users (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(120)    NOT NULL,
  email           VARCHAR(255)    NOT NULL,
  password_hash   VARCHAR(255)    NOT NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  CONSTRAINT chk_users_email_format CHECK (email LIKE '_%@_%.__%')
) ENGINE=InnoDB;

-- =========================================================
-- TEMPLATES DE CATEGORIA (fonte única dos padrões — usados para
-- popular as categorias de cada usuário novo; não pertencem a
-- nenhum usuário e não têm FK para "users")
-- =========================================================

CREATE TABLE category_templates (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(60)     NOT NULL,
  color           CHAR(7)         NOT NULL,
  type            ENUM('entrada','saida','ambos') NOT NULL,
  is_builtin      BOOLEAN         NOT NULL DEFAULT FALSE,
  sort_order      SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  UNIQUE KEY uq_category_templates_name (name),
  CONSTRAINT chk_category_templates_color CHECK (color REGEXP '^#[0-9A-Fa-f]{6}$')
) ENGINE=InnoDB;

CREATE TABLE subcategory_templates (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_template_id  BIGINT UNSIGNED NOT NULL,
  name                  VARCHAR(60)     NOT NULL,
  color                 CHAR(7)         NOT NULL,
  sort_order            SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  CONSTRAINT fk_subcat_templates_category
    FOREIGN KEY (category_template_id) REFERENCES category_templates(id) ON DELETE CASCADE,
  UNIQUE KEY uq_subcategory_templates_name (category_template_id, name),
  CONSTRAINT chk_subcategory_templates_color CHECK (color REGEXP '^#[0-9A-Fa-f]{6}$')
) ENGINE=InnoDB;

-- =========================================================
-- CATEGORIAS E SUBCATEGORIAS (por usuário — cada um tem sua
-- própria cópia, editável, criada a partir dos templates acima)
-- =========================================================

CREATE TABLE categories (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  name            VARCHAR(60)     NOT NULL,
  color           CHAR(7)         NOT NULL,
  type            ENUM('entrada','saida','ambos') NOT NULL,
  is_builtin      BOOLEAN         NOT NULL DEFAULT FALSE,
  -- soft delete: no front atual "category" é só uma string solta na
  -- transação, então remover uma categoria não afeta transações antigas.
  -- Aqui a transação referencia categories.id de verdade (FK), então
  -- "remover" uma categoria em uso precisa ser arquivar, não apagar —
  -- caso contrário a integridade das transações já lançadas quebraria.
  archived_at     TIMESTAMP       NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_categories_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_categories_user_name (user_id, name),
  CONSTRAINT chk_categories_color CHECK (color REGEXP '^#[0-9A-Fa-f]{6}$')
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
  UNIQUE KEY uq_subcategories_category_name (category_id, name),
  CONSTRAINT chk_subcategories_color CHECK (color REGEXP '^#[0-9A-Fa-f]{6}$')
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
  -- RESTRICT (não CASCADE nem SET NULL): uma categoria com transações
  -- não pode ser apagada, só arquivada (ver comentário em "categories").
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
  CONSTRAINT chk_saving_goals_month_format CHECK (reference_month REGEXP '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  UNIQUE KEY uq_saving_goals_user_month (user_id, reference_month)
) ENGINE=InnoDB;

-- =========================================================
-- PROCEDURE: copia os templates de categoria/subcategoria para
-- um usuário recém-criado. É assim que "dados iniciais das
-- categorias/subcategorias" chegam até cada usuário (não faz
-- sentido inserir em "categories" direto, pois user_id é NOT NULL
-- e obrigatoriamente aponta para um usuário que já existe).
-- =========================================================

DELIMITER $$

CREATE PROCEDURE sp_seed_user_categories(IN p_user_id BIGINT UNSIGNED)
BEGIN
  INSERT INTO categories (user_id, name, color, type, is_builtin)
  SELECT p_user_id, ct.name, ct.color, ct.type, ct.is_builtin
  FROM category_templates ct
  ORDER BY ct.sort_order;

  INSERT INTO subcategories (category_id, name, color)
  SELECT c.id, st.name, st.color
  FROM subcategory_templates st
  JOIN category_templates ct ON ct.id = st.category_template_id
  JOIN categories c ON c.user_id = p_user_id AND c.name = ct.name
  ORDER BY st.sort_order;
END$$

DELIMITER ;
