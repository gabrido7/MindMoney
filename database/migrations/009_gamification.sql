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
