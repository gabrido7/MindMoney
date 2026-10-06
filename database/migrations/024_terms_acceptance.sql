-- Migration 024: registro do aceite dos Termos de Uso e da Política de
-- Privacidade no cadastro (LGPD: consentimento comprovável, não só uma caixa
-- marcada na tela).
--
-- terms_accepted_at: quando a pessoa aceitou. terms_version: qual versão dos
-- textos ela viu (data da última atualização, ex.: '2026-10-06'), para saber o
-- que valia na época se os textos mudarem.
--
-- Contas criadas antes desta migration ficam com NULL nas duas colunas: elas
-- se cadastraram antes de existirem os textos, e fingir um aceite que não
-- aconteceu seria pior do que deixar em branco.
--
-- Uso: mysql -u root --default-character-set=utf8mb4 mindmoney < database/migrations/024_terms_acceptance.sql

USE mindmoney;

ALTER TABLE users
  ADD COLUMN terms_accepted_at TIMESTAMP NULL DEFAULT NULL AFTER onboarding_skipped_steps,
  ADD COLUMN terms_version VARCHAR(20) NULL DEFAULT NULL AFTER terms_accepted_at;
