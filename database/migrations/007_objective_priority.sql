-- Migration 007: prioridade dos objetivos financeiros
--
-- Cada objetivo (financial_objectives, migration 006) ganha uma prioridade
-- definida pelo próprio usuário -- alta/média/baixa -- usada tanto para
-- ordenar a lista de metas (prioridade mais alta primeiro) quanto para o
-- módulo de insights sinalizar quando uma meta de alta prioridade está
-- atrasada ou fora do ritmo necessário.
--
-- Uso: mysql -u root mindmoney < database/migrations/007_objective_priority.sql

USE mindmoney;

ALTER TABLE financial_objectives
  ADD COLUMN priority ENUM('alta','media','baixa') NOT NULL DEFAULT 'media' AFTER category;
