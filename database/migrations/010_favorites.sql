-- Migration 010: conteúdos salvos pelo usuário (Educação Financeira e Ferramentas)
--
-- Mesmo raciocínio de lesson_progress (migration 008): o conteúdo em si
-- (aulas, calculadoras) é estático e vive no código do frontend. O que é
-- real e por usuário é QUAL conteúdo cada um marcou como favorito.
-- content_id é a slug definida no frontend (lessonId completo, ex.:
-- "fundamentos.reserva-emergencia.aula-1", ou o id da ferramenta, ex.:
-- "financiamento") -- não é FK, o catálogo evolui no código, não no banco.
--
-- Uso: mysql -u root mindmoney < database/migrations/010_favorites.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS favorites (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL,
  content_type  ENUM('lesson', 'tool') NOT NULL,
  content_id    VARCHAR(150) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_favorites_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uq_favorites_user_content UNIQUE (user_id, content_type, content_id),
  INDEX idx_favorites_user (user_id)
) ENGINE=InnoDB;
