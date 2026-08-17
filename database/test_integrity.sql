-- Mind Money — teste de integridade do schema
-- Roda contra um banco já criado por schema.sql + seed.sql. Cria um usuário
-- de teste, exercita cada constraint (positiva e negativa) e limpa tudo no
-- final, sem deixar resíduo. Espera-se ver os "deve FALHAR" listados como
-- ERROR na saída — isso é o teste passando, não um problema.
--
-- Uso:
--   mysql -u root --force -t < database/test_integrity.sql

USE mindmoney;

SELECT '=== 1. cria usuario de teste ===' AS step;
INSERT INTO users (name, email, password_hash) VALUES ('Teste', 'teste@mindmoney.dev', 'hash_fake_bcrypt');
SET @uid = LAST_INSERT_ID();

SELECT '=== 2. procedure de seed cria 11 categorias / 42 subcategorias ===' AS step;
CALL sp_seed_user_categories(@uid);
SELECT COUNT(*) AS categorias_do_usuario FROM categories WHERE user_id = @uid;
SELECT COUNT(*) AS subcategorias_do_usuario FROM subcategories s JOIN categories c ON c.id = s.category_id WHERE c.user_id = @uid;

SET @cat_alimentacao = (SELECT id FROM categories WHERE user_id = @uid AND name = 'Alimentação');
SET @sub_mercado = (SELECT id FROM subcategories WHERE category_id = @cat_alimentacao AND name = 'Mercado');

SELECT '=== 3. insere transacao valida (deve funcionar) ===' AS step;
INSERT INTO transactions (user_id, category_id, subcategory_id, description, amount, type, transaction_date)
VALUES (@uid, @cat_alimentacao, @sub_mercado, 'Alimentação', 450.00, 'saida', '2026-08-10');
SELECT COUNT(*) AS transacoes_inseridas FROM transactions WHERE user_id = @uid;

SELECT '=== 4. CHECK amount<=0 (deve FALHAR) ===' AS step;
INSERT INTO transactions (user_id, category_id, description, amount, type, transaction_date)
VALUES (@uid, @cat_alimentacao, 'Invalida', -10.00, 'saida', '2026-08-10');

SELECT '=== 5. CHECK email invalido (deve FALHAR) ===' AS step;
INSERT INTO users (name, email, password_hash) VALUES ('Sem Email Valido', 'nao-e-email', 'hash');

SELECT '=== 6. UNIQUE categoria duplicada por usuario (deve FALHAR) ===' AS step;
INSERT INTO categories (user_id, name, color, type) VALUES (@uid, 'Alimentação', '#111111', 'saida');

SELECT '=== 7. CHECK cor invalida (deve FALHAR) ===' AS step;
INSERT INTO categories (user_id, name, color, type) VALUES (@uid, 'Nova Categoria', 'nao-e-cor', 'saida');

SELECT '=== 8. CHECK reference_month invalido em saving_goals (deve FALHAR) ===' AS step;
INSERT INTO saving_goals (user_id, reference_month, target_amount) VALUES (@uid, '2026-13', 1000.00);

SELECT '=== 9. FK categoria inexistente em transactions (deve FALHAR) ===' AS step;
INSERT INTO transactions (user_id, category_id, description, amount, type, transaction_date)
VALUES (@uid, 999999, 'Categoria fantasma', 100.00, 'saida', '2026-08-10');

SELECT '=== 10. RESTRICT: apagar categoria com transacao (deve FALHAR) ===' AS step;
DELETE FROM categories WHERE id = @cat_alimentacao;

SELECT '=== 11. SET NULL: apagar subcategoria em uso (funciona; a transacao so perde a subcategoria) ===' AS step;
DELETE FROM subcategories WHERE id = @sub_mercado;
SELECT subcategory_id FROM transactions WHERE user_id = @uid AND category_id = @cat_alimentacao;

SELECT '=== 12. limpeza: apagar conta requer apagar as transacoes primeiro ===' AS step;
-- fk_transactions_category e RESTRICT de proposito (protege historico
-- financeiro de sumir por acidente). Por isso "apagar minha conta" tem
-- que ser uma operacao explicita em duas etapas, nunca um DELETE FROM
-- users solto: primeiro as transacoes, so depois o resto pode cascatear.
DELETE FROM transactions WHERE user_id = @uid;
INSERT INTO saving_goals (user_id, reference_month, target_amount) VALUES (@uid, '2026-08', 1000.00);
DELETE FROM users WHERE id = @uid;

SELECT '=== 13. confirma limpeza total (tudo 0, exceto templates) ===' AS step;
SELECT COUNT(*) AS usuarios FROM users;
SELECT COUNT(*) AS categorias FROM categories;
SELECT COUNT(*) AS subcategorias FROM subcategories;
SELECT COUNT(*) AS transacoes FROM transactions;
SELECT COUNT(*) AS metas FROM saving_goals;
SELECT COUNT(*) AS category_templates FROM category_templates;
SELECT COUNT(*) AS subcategory_templates FROM subcategory_templates;
