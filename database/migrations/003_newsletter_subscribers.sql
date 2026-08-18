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
