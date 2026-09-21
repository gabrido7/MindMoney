-- Migration 021: cartão de crédito parcelado -- parcelas futuras geradas
-- de uma vez no cadastro, como transações reais (mesmo mecanismo de
-- debt_payments.transaction_id já existente, migration 016).
--
-- paid_off_notified_at: quitação por parcela pré-agendada acontece quando o
-- TEMPO passa (a última parcela vira passado), não numa mutação explícita
-- como addPayment -- sem cron, list() reavalia a cada carregamento (mesmo
-- padrão de debt_due_alerts, migration 017) e usa esta coluna pra nunca
-- comemorar (XP + notificação) a mesma quitação duas vezes.
--
-- Uso: mysql -u root --default-character-set=utf8mb4 mindmoney < database/migrations/021_debt_auto_installments.sql

USE mindmoney;

ALTER TABLE debts
  ADD COLUMN paid_off_notified_at TIMESTAMP NULL DEFAULT NULL AFTER due_day;
