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
