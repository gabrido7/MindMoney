-- Migration 006: financial_objectives + objective_contributions
--
-- Conceito novo, deliberadamente separado de saving_goals (a meta mensal
-- que já existe, usada pelo GoalCard do Dashboard e pelo componente
-- "capacidade de economia" do score -- essa continua exatamente como
-- está, intocada). saving_goals modela "quanto eu quero guardar ESTE
-- MÊS"; financial_objectives modela um objetivo nomeado e de longo
-- prazo ("comprar um carro até dezembro de 2027"), que acumula progresso
-- ao longo de vários meses.
--
-- "Quanto já tenho guardado" para um objetivo não é um número que dá
-- pra inventar nem derivar de transações genéricas (nenhuma transação
-- do app está ligada a um objetivo específico) -- por isso
-- objective_contributions existe: cada aporte é um registro real,
-- lançado pelo usuário, e o valor atual do objetivo é a soma deles
-- (calculado sob demanda, não guardado).
--
-- Uso: mysql -u root mindmoney < database/migrations/006_financial_objectives.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS financial_objectives (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  name            VARCHAR(120)    NOT NULL,
  category        ENUM('compra','viagem','educacao','reserva','patrimonio','personalizada') NOT NULL,
  target_amount   DECIMAL(12,2)   NOT NULL,
  target_month    CHAR(7)         NOT NULL, -- prazo, formato 'YYYY-MM'
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_financial_objectives_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_financial_objectives_target_positive CHECK (target_amount > 0),
  CONSTRAINT chk_financial_objectives_month_format CHECK (target_month REGEXP '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  INDEX idx_financial_objectives_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS objective_contributions (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  objective_id    BIGINT UNSIGNED NOT NULL,
  amount          DECIMAL(12,2)   NOT NULL,
  contributed_at  DATE            NOT NULL,
  note            VARCHAR(255)    NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_objective_contributions_objective
    FOREIGN KEY (objective_id) REFERENCES financial_objectives(id) ON DELETE CASCADE,
  CONSTRAINT chk_objective_contributions_amount_positive CHECK (amount > 0),
  INDEX idx_objective_contributions_objective (objective_id)
) ENGINE=InnoDB;
