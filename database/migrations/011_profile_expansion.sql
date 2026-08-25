-- Migration 011: expansão da tela de Perfil (foto, segurança, notificações,
-- perfil financeiro)
--
-- Quatro pedaços de dado novo, cada um justificando sua própria coluna/tabela:
--
-- 1. users.avatar_path / users.password_changed_at -- dois campos simples
--    demais para merecerem tabela própria, então entram direto em "users".
--    avatar_path guarda só o caminho relativo do arquivo salvo em disco
--    (backend/uploads/avatars/<hash>.<ext>), nunca o binário no banco.
--    password_changed_at começa NULL (conta criada, senha nunca trocada) e
--    é setado toda vez que updatePassword() roda -- troca de senha comum,
--    redefinição via "esqueci minha senha", ambas passam pelo mesmo método.
--
-- 2. refresh_tokens.user_agent / refresh_tokens.last_used_at -- a tabela já
--    existia (migration 005); cada linha JÁ é, na prática, uma sessão ativa
--    (um refresh token = um dispositivo/navegador logado). Só faltava
--    guardar o suficiente para o usuário reconhecer qual é qual na tela de
--    "Sessões ativas" -- não guardamos IP nem geolocalização de propósito
--    (não é necessário para a função de revogar sessão, e o app não faz
--    nenhum uso de segurança real desse dado que justifique coletá-lo).
--
-- 3. notification_preferences -- controle por usuário de quais tipos de
--    notificação real ele quer receber. Ausência de linha para um tipo
--    específico é tratada como "ativado" (true por padrão, ver
--    notifications.service.ts) -- não é necessário popular uma linha por
--    tipo/usuário no cadastro.
--
-- 4. user_financial_profiles -- experiência, faixa de renda e prioridades
--    financeiras informadas pelo próprio usuário, uma vez, usadas só para
--    gerar recomendações determinísticas (mesmo raciocínio de insights: sem
--    IA, regras claras sobre dado real). priorities é uma lista curta de
--    strings fixas (ver users.validation.ts) guardada como JSON por não ter
--    cardinalidade que justifique uma tabela de junção separada.
--
-- Uso: mysql -u root mindmoney < database/migrations/011_profile_expansion.sql

USE mindmoney;

ALTER TABLE users
  ADD COLUMN avatar_path VARCHAR(255) NULL AFTER password_hash,
  ADD COLUMN password_changed_at TIMESTAMP NULL AFTER avatar_path;

ALTER TABLE refresh_tokens
  ADD COLUMN user_agent VARCHAR(255) NULL AFTER token_hash,
  ADD COLUMN last_used_at TIMESTAMP NULL AFTER expires_at;

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id       BIGINT UNSIGNED NOT NULL,
  type          ENUM('limit_exceeded', 'goal_achieved', 'objective_deadline') NOT NULL,
  enabled       BOOLEAN         NOT NULL DEFAULT TRUE,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, type),
  CONSTRAINT fk_notification_preferences_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_financial_profiles (
  user_id           BIGINT UNSIGNED PRIMARY KEY,
  experience_level  ENUM('iniciante', 'intermediario', 'avancado') NULL,
  income_range      ENUM('ate_2k', '2k_5k', '5k_10k', '10k_20k', 'acima_20k') NULL,
  priorities        JSON            NULL,
  updated_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_financial_profiles_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
