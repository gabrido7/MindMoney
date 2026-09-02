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
