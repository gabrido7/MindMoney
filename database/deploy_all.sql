-- ============================================================
-- MindMoney — script consolidado para provisionar o banco na nuvem
-- Gerado a partir de schema.sql + seed.sql + migrations/001..022
-- Uso (PowerShell, evita corromper acentos -- ver CLAUDE.md):
--   Get-Content -Raw -Encoding UTF8 deploy_all.sql | mysql -h <host> -P <port> -u <user> -p --ssl-mode=REQUIRED
-- ============================================================

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

-- ===== seed.sql =====
-- Mind Money — dados iniciais (templates de categoria/subcategoria)
-- Espelha exatamente src/features/categories/data/defaultCategories.ts.
-- Pré-requisito: schema.sql já aplicado.

USE mindmoney;

INSERT INTO category_templates (name, color, type, is_builtin, sort_order) VALUES
  ('Salário',      '#22c55e', 'entrada', TRUE,  1),
  ('Alimentação',  '#f97316', 'saida',   FALSE, 2),
  ('Transporte',   '#3b82f6', 'saida',   FALSE, 3),
  ('Moradia',      '#ef4444', 'saida',   FALSE, 4),
  ('Lazer',        '#a855f7', 'saida',   FALSE, 5),
  ('Saúde',        '#10b981', 'saida',   FALSE, 6),
  ('Educação',     '#6366f1', 'saida',   FALSE, 7),
  ('Investimento', '#eab308', 'saida',   FALSE, 8),
  ('Compras',      '#ec4899', 'saida',   FALSE, 9),
  ('Assinaturas',  '#59d8ff', 'saida',   FALSE, 10),
  ('Outros',       '#6b7280', 'ambos',   TRUE,  11);

INSERT INTO subcategory_templates (category_template_id, name, color, sort_order)
SELECT ct.id, sub.name, sub.color, sub.sort_order
FROM category_templates ct
JOIN (
  SELECT 'Alimentação' AS category, 'Mercado' AS name, '#f97316' AS color, 1 AS sort_order
  UNION ALL SELECT 'Alimentação', 'Restaurante', '#fb923c', 2
  UNION ALL SELECT 'Alimentação', 'Delivery',    '#fdba74', 3
  UNION ALL SELECT 'Alimentação', 'Lanche',      '#fed7aa', 4

  UNION ALL SELECT 'Transporte', 'Combustível',        '#3b82f6', 1
  UNION ALL SELECT 'Transporte', 'Uber',                '#60a5fa', 2
  UNION ALL SELECT 'Transporte', 'Manutenção',          '#93c5fd', 3
  UNION ALL SELECT 'Transporte', 'Transporte Público',  '#bfdbfe', 4
  UNION ALL SELECT 'Transporte', 'Estacionamento',      '#dbeafe', 5

  UNION ALL SELECT 'Moradia', 'Aluguel',       '#ed4a4a', 1
  UNION ALL SELECT 'Moradia', 'Financiamento', '#e84f4f', 2
  UNION ALL SELECT 'Moradia', 'Condomínio',    '#e35454', 3
  UNION ALL SELECT 'Moradia', 'Energia',       '#e35b5b', 4
  UNION ALL SELECT 'Moradia', 'Água',          '#e06060', 5
  UNION ALL SELECT 'Moradia', 'Internet',      '#d96868', 6

  UNION ALL SELECT 'Lazer', 'Cinema',    '#a854f7', 1
  UNION ALL SELECT 'Lazer', 'Viagem',    '#c084fc', 2
  UNION ALL SELECT 'Lazer', 'Streaming', '#ce9dfc', 3
  UNION ALL SELECT 'Lazer', 'Jogos',     '#9c39fa', 4
  UNION ALL SELECT 'Lazer', 'Eventos',   '#cc9ef7', 5

  UNION ALL SELECT 'Saúde', 'Farmácia',  '#04b579', 1
  UNION ALL SELECT 'Saúde', 'Consulta',  '#22b382', 2
  UNION ALL SELECT 'Saúde', 'Exames',    '#16b580', 3
  UNION ALL SELECT 'Saúde', 'Academia',  '#3dba90', 4
  UNION ALL SELECT 'Saúde', 'Convênio',  '#62b599', 5
  UNION ALL SELECT 'Saúde', 'Luta',      '#72b39c', 6

  UNION ALL SELECT 'Educação', 'Curso',      '#7173f0', 1
  UNION ALL SELECT 'Educação', 'Faculdade',  '#8082ed', 2
  UNION ALL SELECT 'Educação', 'Livros',     '#8f91eb', 3
  UNION ALL SELECT 'Educação', 'Material',   '#9d9feb', 4

  UNION ALL SELECT 'Investimento', 'Criptomoeda',   '#eab308', 1
  UNION ALL SELECT 'Investimento', 'FII',           '#facc15', 2
  UNION ALL SELECT 'Investimento', 'Ações',         '#fde047', 3
  UNION ALL SELECT 'Investimento', 'Renda Fixa',    '#fef08a', 4
  UNION ALL SELECT 'Investimento', 'Tesouro Direto','#fff5a6', 5

  UNION ALL SELECT 'Compras', 'Roupas',      '#e864a5', 1
  UNION ALL SELECT 'Compras', 'Eletrônicos', '#e675ac', 2
  UNION ALL SELECT 'Compras', 'Casa',        '#e386b3', 3
  UNION ALL SELECT 'Compras', 'Presentes',   '#e39abd', 4

  UNION ALL SELECT 'Assinaturas', 'Netflix', '#73deff', 1
  UNION ALL SELECT 'Assinaturas', 'Spotify', '#87e3ff', 2
  UNION ALL SELECT 'Assinaturas', 'Amazon',  '#9ee8ff', 3
) AS sub ON sub.category = ct.name;

-- ===== migrations/001_notifications.sql =====
-- Migration 001: notifications
-- Etapa 4 (banco) deixou notifications fora de proposito: nenhum endpoint
-- existia ainda para justificar persistir estado de leitura. Agora a API
-- expõe GET /api/notifications e PUT /api/notifications/:id/read, e "marcar
-- como lida" é por definição estado que precisa ser persistido (não dá pra
-- marcar como lido algo puramente calculado on-the-fly) — por isso a tabela
-- entra agora, não antes.
--
-- Uso: mysql -u root mindmoney < database/migrations/001_notifications.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS notifications (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  type            VARCHAR(50)     NOT NULL, -- 'limit_exceeded' | 'goal_achieved'
  title           VARCHAR(150)    NOT NULL,
  message         VARCHAR(500)    NOT NULL,
  read_at         TIMESTAMP       NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_user_created (user_id, created_at)
) ENGINE=InnoDB;

-- ===== migrations/002_financial_score_history.sql =====
-- Migration 002: financial_score_history
-- Etapa 4 (banco) deixou score fora de proposito: nao havia formula definida
-- pra persistir. Agora a formula existe (documentada em
-- backend/src/modules/score/score.service.ts) e a etapa 11 pede historico +
-- evolucao visivel pro usuario -- isso exige guardar o valor de cada mes,
-- porque recalcular do zero sempre mudaria valores passados se transacoes
-- antigas forem editadas depois. Esta tabela funciona como um cache que é
-- recalculado (upsert) toda vez que o score daquele mes é consultado, nao
-- como um livro-razao gravado uma única vez.
--
-- Uso: mysql -u root mindmoney < database/migrations/002_financial_score_history.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS financial_score_history (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  reference_month CHAR(7)         NOT NULL, -- formato 'YYYY-MM'
  score           TINYINT UNSIGNED NOT NULL,
  details         JSON            NULL,
  calculated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_score_history_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_score_range CHECK (score BETWEEN 0 AND 100),
  CONSTRAINT chk_score_month_format CHECK (reference_month REGEXP '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  UNIQUE KEY uq_score_user_month (user_id, reference_month)
) ENGINE=InnoDB;

-- ===== migrations/003_newsletter_subscribers.sql =====
-- Migration 003: newsletter_subscribers
-- A landing page pública ganhou um formulário de captura de e-mail (Etapa
-- de landing page). Diferente de notifications/financial_score_history,
-- este dado não deriva de nada existente e não pertence a nenhum usuário
-- autenticado (o visitante ainda não tem conta) -- por isso é uma tabela
-- própria, sem FK para users.
--
-- Uso: mysql -u root mindmoney < database/migrations/003_newsletter_subscribers.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150)  NOT NULL,
  email         VARCHAR(255)  NOT NULL,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_newsletter_subscribers_email UNIQUE (email)
) ENGINE=InnoDB;

-- ===== migrations/004_password_reset_tokens.sql =====
-- Migration 004: password_reset_tokens
-- Fluxo real de "esqueci minha senha". O token nunca é guardado em texto
-- puro (só o hash SHA-256 dele) -- mesmo princípio de password_hash em
-- users: quem tiver acesso de leitura ao banco não consegue usar a
-- coluna para redefinir a senha de ninguém. expires_at + used_at tornam
-- cada token de uso único e com validade curta.
--
-- Uso: mysql -u root mindmoney < database/migrations/004_password_reset_tokens.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  token_hash    CHAR(64)        NOT NULL,
  expires_at    TIMESTAMP       NOT NULL,
  used_at       TIMESTAMP       NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_password_reset_tokens_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_password_reset_tokens_hash (token_hash),
  INDEX idx_password_reset_tokens_user (user_id)
) ENGINE=InnoDB;

-- ===== migrations/005_refresh_tokens.sql =====
-- Migration 005: refresh_tokens
-- Antes desta migration, o JWT emitido em login/cadastro durava 7 dias
-- inteiros sem nenhuma forma de renovação ou revogação: a sessão só
-- terminava quando o token expirava de vez (derrubando o usuário sem
-- aviso) ou nunca, se o e-mail comprometido de alguém vazasse -- não
-- havia como invalidar um token já emitido.
--
-- Agora o JWT (JWT_EXPIRES_IN, padrão 15min) é só o "access token" de
-- vida curta. Este refresh token (aleatório, hash SHA-256 persistido,
-- nunca o valor em texto puro -- mesmo princípio de password_hash e
-- password_reset_tokens) vive mais (REFRESH_TOKEN_DAYS, padrão 30 dias)
-- e é o que permite renovar o access token silenciosamente, sem exigir
-- login de novo. Cada uso ROTACIONA o token (revoga o antigo, emite um
-- novo) -- um token roubado e reusado depois do dono já ter renovado
-- vira imediatamente detectável/inválido.
--
-- Uso: mysql -u root mindmoney < database/migrations/005_refresh_tokens.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  token_hash    CHAR(64)        NOT NULL,
  expires_at    TIMESTAMP       NOT NULL,
  revoked_at    TIMESTAMP       NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_refresh_tokens_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_refresh_tokens_hash (token_hash),
  INDEX idx_refresh_tokens_user (user_id)
) ENGINE=InnoDB;

-- ===== migrations/006_financial_objectives.sql =====
-- Migration 006: financial_objectives + objective_contributions
--
-- Conceito novo, deliberadamente separado de saving_goals (a meta mensal
-- que já existe, usada pelo GoalCard do Dashboard e pelo componente
-- "capacidade de economia" do score -- essa continua exatamente como
-- está, intocada). saving_goals modela "quanto eu quero guardar ESTE
-- MÊS"; financial_objectives modela um objetivo nomeado e de longo
-- prazo ("comprar um carro até dezembro de 2027"), que acumula progresso
-- ao longo de vários meses.
--
-- "Quanto já tenho guardado" para um objetivo não é um número que dá
-- pra inventar nem derivar de transações genéricas (nenhuma transação
-- do app está ligada a um objetivo específico) -- por isso
-- objective_contributions existe: cada aporte é um registro real,
-- lançado pelo usuário, e o valor atual do objetivo é a soma deles
-- (calculado sob demanda, não guardado).
--
-- Uso: mysql -u root mindmoney < database/migrations/006_financial_objectives.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS financial_objectives (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  name            VARCHAR(120)    NOT NULL,
  category        ENUM('compra','viagem','educacao','reserva','patrimonio','personalizada') NOT NULL,
  target_amount   DECIMAL(12,2)   NOT NULL,
  target_month    CHAR(7)         NOT NULL, -- prazo, formato 'YYYY-MM'
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_financial_objectives_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_financial_objectives_target_positive CHECK (target_amount > 0),
  CONSTRAINT chk_financial_objectives_month_format CHECK (target_month REGEXP '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  INDEX idx_financial_objectives_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS objective_contributions (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  objective_id    BIGINT UNSIGNED NOT NULL,
  amount          DECIMAL(12,2)   NOT NULL,
  contributed_at  DATE            NOT NULL,
  note            VARCHAR(255)    NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_objective_contributions_objective
    FOREIGN KEY (objective_id) REFERENCES financial_objectives(id) ON DELETE CASCADE,
  CONSTRAINT chk_objective_contributions_amount_positive CHECK (amount > 0),
  INDEX idx_objective_contributions_objective (objective_id)
) ENGINE=InnoDB;

-- ===== migrations/007_objective_priority.sql =====
-- Migration 007: prioridade dos objetivos financeiros
--
-- Cada objetivo (financial_objectives, migration 006) ganha uma prioridade
-- definida pelo próprio usuário -- alta/média/baixa -- usada tanto para
-- ordenar a lista de metas (prioridade mais alta primeiro) quanto para o
-- módulo de insights sinalizar quando uma meta de alta prioridade está
-- atrasada ou fora do ritmo necessário.
--
-- Uso: mysql -u root mindmoney < database/migrations/007_objective_priority.sql

USE mindmoney;

ALTER TABLE financial_objectives
  ADD COLUMN priority ENUM('alta','media','baixa') NOT NULL DEFAULT 'media' AFTER category;

-- ===== migrations/008_lesson_progress.sql =====
-- Migration 008: progresso da trilha de aprendizado (Educação Financeira)
--
-- O conteúdo em si (trilhas, cursos, aulas, texto, quiz) é estático e vive
-- no código do frontend -- é editorial, igual para todo mundo, não dado de
-- usuário (mesmo raciocínio de "sem mock" já documentado no SECURITY.md:
-- não existe motivo pra guardar em banco algo que não muda por usuário).
--
-- O que É real e por usuário é o PROGRESSO: quais aulas cada um já
-- completou, a resposta que deu no exercício prático e o resultado do
-- quiz. lesson_id é uma slug definida no frontend (ex.:
-- "fundamentos.reserva-emergencia.o-que-e"), não uma FK -- o catálogo de
-- aulas evolui no código, não no banco.
--
-- Uso: mysql -u root mindmoney < database/migrations/008_lesson_progress.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS lesson_progress (
  id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id            BIGINT UNSIGNED NOT NULL,
  lesson_id          VARCHAR(150)    NOT NULL,
  completed_at       TIMESTAMP       NULL,
  quiz_score         TINYINT UNSIGNED NULL,
  quiz_total         TINYINT UNSIGNED NULL,
  exercise_response  TEXT            NULL,
  created_at         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_lesson_progress_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uq_lesson_progress_user_lesson UNIQUE (user_id, lesson_id),
  INDEX idx_lesson_progress_user (user_id)
) ENGINE=InnoDB;

-- ===== migrations/009_gamification.sql =====
-- Migration 009: gamificação (XP, nível, conquistas)
--
-- xp_events é um ledger real de XP ganho, não um contador que se
-- sobrescreve -- cada evento fica registrado, e o total é a soma. O par
-- (user_id, reason, reference_id) é UNIQUE de propósito: é o que torna
-- awardXp() idempotente (completar a mesma aula duas vezes, ou reabrir
-- um quiz já respondido, nunca dá XP em dobro) sem precisar de lógica
-- de aplicação pra evitar duplicata -- o banco garante isso sozinho.
--
-- O catálogo de conquistas (títulos, emojis, critério) é estático no
-- código do backend (mesmo raciocínio do conteúdo da trilha: é igual
-- pra todo mundo). user_achievements só guarda QUAL usuário desbloqueou
-- QUAL conquista e quando -- o dado real e por usuário.
--
-- Uso: mysql -u root mindmoney < database/migrations/009_gamification.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS xp_events (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  amount        SMALLINT UNSIGNED NOT NULL,
  reason        VARCHAR(40)     NOT NULL,
  reference_id  VARCHAR(150)    NOT NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_xp_events_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uq_xp_events_dedupe UNIQUE (user_id, reason, reference_id),
  INDEX idx_xp_events_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_achievements (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  achievement_id  VARCHAR(60)     NOT NULL,
  unlocked_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_achievements_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uq_user_achievements UNIQUE (user_id, achievement_id),
  INDEX idx_user_achievements_user (user_id)
) ENGINE=InnoDB;

-- ===== migrations/010_favorites.sql =====
-- Migration 010: conteúdos salvos pelo usuário (Educação Financeira e Ferramentas)
--
-- Mesmo raciocínio de lesson_progress (migration 008): o conteúdo em si
-- (aulas, calculadoras) é estático e vive no código do frontend. O que é
-- real e por usuário é QUAL conteúdo cada um marcou como favorito.
-- content_id é a slug definida no frontend (lessonId completo, ex.:
-- "fundamentos.reserva-emergencia.aula-1", ou o id da ferramenta, ex.:
-- "financiamento") -- não é FK, o catálogo evolui no código, não no banco.
--
-- Uso: mysql -u root mindmoney < database/migrations/010_favorites.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS favorites (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  content_type  ENUM('lesson', 'tool') NOT NULL,
  content_id    VARCHAR(150) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_favorites_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uq_favorites_user_content UNIQUE (user_id, content_type, content_id),
  INDEX idx_favorites_user (user_id)
) ENGINE=InnoDB;

-- ===== migrations/011_profile_expansion.sql =====
-- Migration 011: expansão da tela de Perfil (foto, segurança, notificações,
-- perfil financeiro)
--
-- Quatro pedaços de dado novo, cada um justificando sua própria coluna/tabela:
--
-- 1. users.avatar_path / users.password_changed_at -- dois campos simples
--    demais para merecerem tabela própria, então entram direto em "users".
--    avatar_path guarda só o caminho relativo do arquivo salvo em disco
--    (backend/uploads/avatars/<hash>.<ext>), nunca o binário no banco.
--    password_changed_at começa NULL (conta criada, senha nunca trocada) e
--    é setado toda vez que updatePassword() roda -- troca de senha comum,
--    redefinição via "esqueci minha senha", ambas passam pelo mesmo método.
--
-- 2. refresh_tokens.user_agent / refresh_tokens.last_used_at -- a tabela já
--    existia (migration 005); cada linha JÁ é, na prática, uma sessão ativa
--    (um refresh token = um dispositivo/navegador logado). Só faltava
--    guardar o suficiente para o usuário reconhecer qual é qual na tela de
--    "Sessões ativas" -- não guardamos IP nem geolocalização de propósito
--    (não é necessário para a função de revogar sessão, e o app não faz
--    nenhum uso de segurança real desse dado que justifique coletá-lo).
--
-- 3. notification_preferences -- controle por usuário de quais tipos de
--    notificação real ele quer receber. Ausência de linha para um tipo
--    específico é tratada como "ativado" (true por padrão, ver
--    notifications.service.ts) -- não é necessário popular uma linha por
--    tipo/usuário no cadastro.
--
-- 4. user_financial_profiles -- experiência, faixa de renda e prioridades
--    financeiras informadas pelo próprio usuário, uma vez, usadas só para
--    gerar recomendações determinísticas (mesmo raciocínio de insights: sem
--    IA, regras claras sobre dado real). priorities é uma lista curta de
--    strings fixas (ver users.validation.ts) guardada como JSON por não ter
--    cardinalidade que justifique uma tabela de junção separada.
--
-- Uso: mysql -u root mindmoney < database/migrations/011_profile_expansion.sql

USE mindmoney;

ALTER TABLE users
  ADD COLUMN avatar_path VARCHAR(255) NULL AFTER password_hash,
  ADD COLUMN password_changed_at TIMESTAMP NULL AFTER avatar_path;

ALTER TABLE refresh_tokens
  ADD COLUMN user_agent VARCHAR(255) NULL AFTER token_hash,
  ADD COLUMN last_used_at TIMESTAMP NULL AFTER expires_at;

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id       BIGINT UNSIGNED NOT NULL,
  type          ENUM('limit_exceeded', 'goal_achieved', 'objective_deadline') NOT NULL,
  enabled       BOOLEAN         NOT NULL DEFAULT TRUE,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, type),
  CONSTRAINT fk_notification_preferences_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_financial_profiles (
  user_id           BIGINT UNSIGNED PRIMARY KEY,
  experience_level  ENUM('iniciante', 'intermediario', 'avancado') NULL,
  income_range      ENUM('ate_2k', '2k_5k', '5k_10k', '10k_20k', 'acima_20k') NULL,
  priorities        JSON            NULL,
  updated_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_financial_profiles_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===== migrations/012_category_budgets.sql =====
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

-- ===== migrations/013_onboarding.sql =====
-- Migration 013: onboarding guiado
--
-- Hoje, cadastro -> dashboard vazio, sem nenhum dado, sem orientação -- o
-- momento de maior risco de abandono do produto. onboarding_completed_at
-- marca se o usuário já passou pelo assistente de primeiro acesso (que
-- lança renda, despesas fixas e a primeira meta como transações/metas
-- reais via os endpoints que já existem -- o onboarding em si não guarda
-- nenhum dado próprio, só a marca de "já vi isso").
--
-- Contas que já existiam antes desta migration não devem ver o assistente
-- do zero (já têm dado real, o onboarding não faria sentido pra elas) --
-- por isso o backfill abaixo marca todo mundo como já concluído, usando a
-- própria data de criação da conta. Só cadastros feitos DEPOIS desta
-- migration nascem com a coluna NULL e veem o assistente.
--
-- Uso: mysql -u root mindmoney < database/migrations/013_onboarding.sql

USE mindmoney;

ALTER TABLE users
  ADD COLUMN onboarding_completed_at TIMESTAMP NULL AFTER password_changed_at;

UPDATE users SET onboarding_completed_at = created_at WHERE onboarding_completed_at IS NULL;

-- ===== migrations/014_onboarding_expansion.sql =====
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

-- ===== migrations/015_debt_payments.sql =====
-- Migration 015: pagamentos reais de dívida
--
-- Hoje uma dívida (debts, migration 014) é uma ficha estática -- total_amount
-- nunca muda depois de criada, não tem como registrar "paguei a parcela
-- desse mês". debt_payments espelha exatamente objective_contributions
-- (migration 006): um pagamento real reduz o quanto falta, mas o "quanto já
-- foi pago" nunca é persistido na própria dívida -- é sempre um SUM sob
-- demanda (mesmo raciocínio de nunca guardar o que dá pra derivar, já usado
-- em financial_score_history/category_budgets). Sem user_id próprio -- a
-- posse é sempre resolvida via join em debts.user_id, mesmo padrão de IDOR
-- de objective_contributions.
--
-- Uso: mysql -u root --default-character-set=utf8mb4 mindmoney < database/migrations/015_debt_payments.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS debt_payments (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  debt_id     BIGINT UNSIGNED NOT NULL,
  amount      DECIMAL(12,2)   NOT NULL,
  paid_at     DATE            NOT NULL,
  note        VARCHAR(255)    NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_debt_payments_debt
    FOREIGN KEY (debt_id) REFERENCES debts(id) ON DELETE CASCADE,
  CONSTRAINT chk_debt_payments_amount_positive CHECK (amount > 0),
  INDEX idx_debt_payments_debt (debt_id)
) ENGINE=InnoDB;

-- ===== migrations/016_debt_transactions_and_alerts.sql =====
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

-- ===== migrations/017_debt_due_alerts.sql =====
-- Migration 017: marcos de alerta de vencimento de dívida
--
-- O alerta de vencimento (migration 016) só disparava uma vez, pra dívida
-- mais urgente, com o dedupe genérico de notifications ("no máximo 1 não
-- lida do tipo por vez"). Agora são 5 marcos por dívida (dia do vencimento,
-- 3, 7, 15 e 30 dias antes) -- o dedupe por tipo bloquearia um marco
-- enquanto outro estiver não lido. debt_due_alerts guarda só "esse marco,
-- pra esse vencimento específico, já foi avisado" -- nenhum dado
-- financeiro, só controle de idempotência. due_date muda todo mês (mesmo
-- due_day, ciclo seguinte), então o mesmo marco volta a disparar no
-- próximo vencimento naturalmente, sem lógica extra.
--
-- Uso: mysql -u root --default-character-set=utf8mb4 mindmoney < database/migrations/017_debt_due_alerts.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS debt_due_alerts (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  debt_id         BIGINT UNSIGNED NOT NULL,
  milestone_days  SMALLINT UNSIGNED NOT NULL,
  due_date        DATE NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_debt_due_alerts_debt
    FOREIGN KEY (debt_id) REFERENCES debts(id) ON DELETE CASCADE,
  UNIQUE KEY uq_debt_due_alerts (debt_id, milestone_days, due_date)
) ENGINE=InnoDB;

-- ===== migrations/018_assets.sql =====
-- Migration 018: Central de Ativos -- patrimônio líquido = ativos - dívidas
--
-- Dívida usa total_amount fixo + debt_payments (soma reduz o restante).
-- Ativo não tem "total" pra reduzir -- o valor dele muda com o tempo
-- (poupança rende, investimento oscila). Em vez de um campo current_value
-- sobrescrito toda hora (perderia histórico), segue o mesmo princípio de
-- "nunca guardar o que dá pra derivar, sempre logar o evento real" já
-- usado em debt_payments/objective_contributions: asset_value_updates é um
-- log de "no dia X, esse ativo valia R$Y" -- o valor atual é sempre o
-- registro mais recente, nunca uma soma.
--
-- ON DELETE CASCADE nos dois -- sem ligação com transactions (ativo não
-- gera transação real, diferente de pagamento de dívida), então apagar o
-- histórico de valor junto com o ativo não reescreve nenhum dado
-- financeiro de verdade.
--
-- Uso: mysql -u root --default-character-set=utf8mb4 mindmoney < database/migrations/018_assets.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS assets (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  type        ENUM('conta_corrente', 'poupanca', 'investimento', 'imovel', 'veiculo', 'outro') NOT NULL,
  name        VARCHAR(120) NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_assets_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_assets_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS asset_value_updates (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  asset_id    BIGINT UNSIGNED NOT NULL,
  value       DECIMAL(12,2) NOT NULL,
  valued_at   DATE NOT NULL,
  note        VARCHAR(255) NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_asset_value_updates_asset
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  CONSTRAINT chk_asset_value_updates_value_non_negative CHECK (value >= 0),
  INDEX idx_asset_value_updates_asset (asset_id)
) ENGINE=InnoDB;

-- ===== migrations/019_financial_gamification.sql =====
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

-- ===== migrations/020_drop_saving_goals.sql =====
-- Unificação Meta/Objetivo: saving_goals (meta mensal, uma por mês) nunca
-- teve tela nenhuma pra criar/editar/ver -- GoalCard.tsx existia mas não era
-- importado em lugar nenhum do frontend. financial_objectives (migration
-- 006) já é a única coisa real que o usuário usa e já é chamada de "Meta"
-- em toda a UI. "Capacidade de economia" do score, a notificação
-- goal_achieved, o insight de meta e o assistente passam a derivar a meta
-- do mês da soma de requiredMonthlyAmount dos objetivos ativos, em vez de
-- consultar esta tabela -- ver backend/src/modules/objectives/objectiveMath.ts.
DROP TABLE IF EXISTS saving_goals;

-- ===== migrations/021_debt_auto_installments.sql =====
-- Migration 021: cartão de crédito parcelado -- parcelas futuras geradas
-- de uma vez no cadastro, como transações reais (mesmo mecanismo de
-- debt_payments.transaction_id já existente, migration 016).
--
-- paid_off_notified_at: quitação por parcela pré-agendada acontece quando o
-- TEMPO passa (a última parcela vira passado), não numa mutação explícita
-- como addPayment -- sem cron, list() reavalia a cada carregamento (mesmo
-- padrão de debt_due_alerts, migration 017) e usa esta coluna pra nunca
-- comemorar (XP + notificação) a mesma quitação duas vezes.
--
-- Uso: mysql -u root --default-character-set=utf8mb4 mindmoney < database/migrations/021_debt_auto_installments.sql

USE mindmoney;

ALTER TABLE debts
  ADD COLUMN paid_off_notified_at TIMESTAMP NULL DEFAULT NULL AFTER due_day;

-- ===== migrations/022_accounts.sql =====
-- Migration 022: contas/carteiras múltiplas -- toda transação passa a
-- pertencer a uma conta real, com saldo derivado (initial_balance + soma
-- das transações), em vez de "conta_corrente"/"poupanca" como Ativo (valor
-- 100% manual, sem nenhuma ligação com o que realmente aconteceu -- a
-- duplicidade que ficou pendente desde a Central de Ativos).
--
-- Ordem importa: cria a tabela, adiciona a coluna nullable, faz o backfill
-- (1 conta por usuário existente + aponta as transações dele pra ela), só
-- então torna a coluna obrigatória. Migra os ativos conta_corrente/poupanca
-- reais pra virarem contas próprias ANTES de apagá-los e estreitar o ENUM
-- de assets.type.
--
-- Uso: mysql -u root --default-character-set=utf8mb4 mindmoney < database/migrations/022_accounts.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS accounts (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  type            ENUM('corrente', 'poupanca', 'carteira', 'outro') NOT NULL,
  name            VARCHAR(120) NOT NULL,
  initial_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_accounts_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_accounts_user (user_id)
) ENGINE=InnoDB;

-- 1) coluna nullable por enquanto -- só vira obrigatória depois do backfill.
ALTER TABLE transactions
  ADD COLUMN account_id BIGINT UNSIGNED NULL AFTER user_id;

-- 2) toda conta de usuário EXISTENTE ganha uma "Conta Principal" -- garante
--    que todo mundo já tem pelo menos uma conta antes do próximo passo.
INSERT INTO accounts (user_id, type, name, initial_balance)
SELECT id, 'corrente', 'Conta Principal', 0 FROM users;

-- 3) aponta toda transação existente pra conta recém-criada do respectivo
--    usuário -- nesse momento cada usuário tem exatamente 1 conta, então o
--    JOIN não tem ambiguidade nenhuma.
UPDATE transactions t
JOIN accounts a ON a.user_id = t.user_id
SET t.account_id = a.id
WHERE t.account_id IS NULL;

-- 4) migra os ativos conta_corrente/poupanca reais -- cada um vira sua
--    própria conta (nome do ativo, tipo mapeado, saldo inicial = valor
--    mais recente registrado nele). Feito ANTES de apagar os ativos, pra
--    não perder o valor.
INSERT INTO accounts (user_id, type, name, initial_balance)
SELECT a.user_id,
       CASE WHEN a.type = 'conta_corrente' THEN 'corrente' ELSE 'poupanca' END,
       a.name,
       COALESCE(v.value, 0)
FROM assets a
LEFT JOIN (
  SELECT asset_id, value,
         ROW_NUMBER() OVER (PARTITION BY asset_id ORDER BY valued_at DESC, id DESC) AS rn
  FROM asset_value_updates
) v ON v.asset_id = a.id AND v.rn = 1
WHERE a.type IN ('conta_corrente', 'poupanca');

DELETE FROM assets WHERE type IN ('conta_corrente', 'poupanca');

-- 5) só agora account_id vira obrigatório + protegido com RESTRICT (mesmo
--    tratamento de category_id -- apagar uma conta com transação não pode
--    reescrever histórico financeiro real).
ALTER TABLE transactions
  MODIFY COLUMN account_id BIGINT UNSIGNED NOT NULL,
  ADD CONSTRAINT fk_transactions_account
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
  ADD INDEX idx_transactions_account (account_id);

-- 6) estreita o ENUM de assets.type -- conta_corrente/poupanca não existem
--    mais como ativo manual, accounts.type já cobre o mesmo conceito, só
--    que com saldo derivado em vez de digitado.
ALTER TABLE assets
  MODIFY COLUMN type ENUM('investimento', 'imovel', 'veiculo', 'outro') NOT NULL;
