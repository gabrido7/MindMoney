-- Migration 001: notifications
-- Etapa 4 (banco) deixou notifications fora de proposito: nenhum endpoint
-- existia ainda para justificar persistir estado de leitura. Agora a API
-- expõe GET /api/notifications e PUT /api/notifications/:id/read, e "marcar
-- como lida" é por definição estado que precisa ser persistido (não dá pra
-- marcar como lido algo puramente calculado on-the-fly) — por isso a tabela
-- entra agora, não antes.
--
-- Uso: mysql -u root mindmoney < database/migrations/001_notifications.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS notifications (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  type            VARCHAR(50)     NOT NULL, -- 'limit_exceeded' | 'goal_achieved'
  title           VARCHAR(150)    NOT NULL,
  message         VARCHAR(500)    NOT NULL,
  read_at         TIMESTAMP       NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_user_created (user_id, created_at)
) ENGINE=InnoDB;
