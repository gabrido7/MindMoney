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
