-- Usuário de aplicação com privilégios mínimos, versão para o Aiven
-- (ou qualquer MySQL gerenciado remoto). Mesma ideia de create_app_user.sql
-- (sem DROP/ALTER/CREATE/GRANT -- só o que a API precisa), mas com
-- @'%' em vez de @'localhost', porque aqui o backend nunca roda na mesma
-- máquina do banco.
--
-- Troque 'coloque_uma_senha_forte_aqui' antes de rodar -- essa é a senha
-- que vai virar DB_PASSWORD nas variáveis de ambiente do Render.
--
-- Rode isso DEPOIS de deploy_all.sql (precisa que o schema já exista),
-- conectado como o usuário admin que o Aiven te deu (ex: avnadmin):
--   mysql -h <host> -P <port> -u avnadmin -p < create_app_user_aiven.sql
-- (sem --ssl-mode: clientes mysql mais antigos, como o do XAMPP, não
-- reconhecem essa flag -- a conexão negocia TLS automaticamente, que é o
-- que o Aiven exige)

CREATE USER IF NOT EXISTS 'mindmoney_app'@'%' IDENTIFIED BY 'Mind_Money_GAEF_MelhorProjetoDaETEC';

GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON mindmoney.* TO 'mindmoney_app'@'%';

FLUSH PRIVILEGES;
