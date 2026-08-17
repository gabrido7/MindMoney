-- Usuário de aplicação com privilégios mínimos. O backend deve se conectar
-- com este usuário, nunca com root: sem DROP/ALTER/CREATE/GRANT — só o que
-- uma API precisa para operar linhas dentro do schema já existente.
--
-- Troque a senha abaixo antes de rodar em qualquer ambiente que não seja
-- a sua máquina local de desenvolvimento.

CREATE USER IF NOT EXISTS 'mindmoney_app'@'localhost' IDENTIFIED BY 'troque_esta_senha_em_producao';

GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON mindmoney.* TO 'mindmoney_app'@'localhost';

FLUSH PRIVILEGES;
