-- Migration 013: onboarding guiado
--
-- Hoje, cadastro -> dashboard vazio, sem nenhum dado, sem orientação -- o
-- momento de maior risco de abandono do produto. onboarding_completed_at
-- marca se o usuário já passou pelo assistente de primeiro acesso (que
-- lança renda, despesas fixas e a primeira meta como transações/metas
-- reais via os endpoints que já existem -- o onboarding em si não guarda
-- nenhum dado próprio, só a marca de "já vi isso").
--
-- Contas que já existiam antes desta migration não devem ver o assistente
-- do zero (já têm dado real, o onboarding não faria sentido pra elas) --
-- por isso o backfill abaixo marca todo mundo como já concluído, usando a
-- própria data de criação da conta. Só cadastros feitos DEPOIS desta
-- migration nascem com a coluna NULL e veem o assistente.
--
-- Uso: mysql -u root mindmoney < database/migrations/013_onboarding.sql

USE mindmoney;

ALTER TABLE users
  ADD COLUMN onboarding_completed_at TIMESTAMP NULL AFTER password_changed_at;

UPDATE users SET onboarding_completed_at = created_at WHERE onboarding_completed_at IS NULL;
