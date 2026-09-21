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
