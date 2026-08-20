-- Migration 008: progresso da trilha de aprendizado (Educação Financeira)
--
-- O conteúdo em si (trilhas, cursos, aulas, texto, quiz) é estático e vive
-- no código do frontend -- é editorial, igual para todo mundo, não dado de
-- usuário (mesmo raciocínio de "sem mock" já documentado no SECURITY.md:
-- não existe motivo pra guardar em banco algo que não muda por usuário).
--
-- O que É real e por usuário é o PROGRESSO: quais aulas cada um já
-- completou, a resposta que deu no exercício prático e o resultado do
-- quiz. lesson_id é uma slug definida no frontend (ex.:
-- "fundamentos.reserva-emergencia.o-que-e"), não uma FK -- o catálogo de
-- aulas evolui no código, não no banco.
--
-- Uso: mysql -u root mindmoney < database/migrations/008_lesson_progress.sql

USE mindmoney;

CREATE TABLE IF NOT EXISTS lesson_progress (
  id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id            BIGINT UNSIGNED NOT NULL,
  lesson_id          VARCHAR(150)    NOT NULL,
  completed_at       TIMESTAMP       NULL,
  quiz_score         TINYINT UNSIGNED NULL,
  quiz_total         TINYINT UNSIGNED NULL,
  exercise_response  TEXT            NULL,
  created_at         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_lesson_progress_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uq_lesson_progress_user_lesson UNIQUE (user_id, lesson_id),
  INDEX idx_lesson_progress_user (user_id)
) ENGINE=InnoDB;
