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
