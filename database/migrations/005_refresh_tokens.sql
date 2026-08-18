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
