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
