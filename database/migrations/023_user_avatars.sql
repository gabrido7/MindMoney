-- Migration 023: fotos de perfil dentro do MySQL, não em disco.
--
-- Em hospedagem gratuita (Render) o disco do servidor é apagado a cada deploy
-- e reinício, então a foto salva em arquivo sumia e users.avatar_path ficava
-- apontando para um arquivo que não existe mais. As fotos têm no máximo 2 MB
-- (limite do upload), então cabem sem problema numa tabela própria -- separada
-- de `users` de propósito, para o `SELECT * FROM users` das requisições
-- comuns não carregar o binário junto.
--
-- file_key: identificador aleatório (UUID) que vai na URL da imagem
-- (/uploads/avatars/<file_key>). Como o <img> não envia o token de login, o
-- que protege a foto é essa chave impossível de adivinhar -- a mesma ideia do
-- nome de arquivo aleatório de antes. Trocar a foto gera uma chave nova, o
-- que também invalida o cache do navegador.
--
-- users.avatar_path passa a guardar o file_key. Os valores antigos eram nomes
-- de arquivo que já não existem, então são zerados (volta a aparecer a inicial
-- do nome em vez de uma imagem quebrada).
--
-- Uso: mysql -u root --default-character-set=utf8mb4 mindmoney < database/migrations/023_user_avatars.sql

USE mindmoney;

CREATE TABLE user_avatars (
  file_key   CHAR(36)         NOT NULL,
  user_id    BIGINT UNSIGNED  NOT NULL,
  mime_type  VARCHAR(20)      NOT NULL,
  data       MEDIUMBLOB       NOT NULL,
  created_at TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (file_key),
  UNIQUE KEY uq_user_avatars_user (user_id),
  CONSTRAINT fk_user_avatars_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

UPDATE users SET avatar_path = NULL WHERE avatar_path IS NOT NULL;
