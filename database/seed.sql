-- Mind Money — dados iniciais (templates de categoria/subcategoria)
-- Espelha exatamente src/features/categories/data/defaultCategories.ts.
-- Pré-requisito: schema.sql já aplicado.

USE mindmoney;

INSERT INTO category_templates (name, color, type, is_builtin, sort_order) VALUES
  ('Salário',      '#22c55e', 'entrada', TRUE,  1),
  ('Alimentação',  '#f97316', 'saida',   FALSE, 2),
  ('Transporte',   '#3b82f6', 'saida',   FALSE, 3),
  ('Moradia',      '#ef4444', 'saida',   FALSE, 4),
  ('Lazer',        '#a855f7', 'saida',   FALSE, 5),
  ('Saúde',        '#10b981', 'saida',   FALSE, 6),
  ('Educação',     '#6366f1', 'saida',   FALSE, 7),
  ('Investimento', '#eab308', 'saida',   FALSE, 8),
  ('Compras',      '#ec4899', 'saida',   FALSE, 9),
  ('Assinaturas',  '#59d8ff', 'saida',   FALSE, 10),
  ('Outros',       '#6b7280', 'ambos',   TRUE,  11);

INSERT INTO subcategory_templates (category_template_id, name, color, sort_order)
SELECT ct.id, sub.name, sub.color, sub.sort_order
FROM category_templates ct
JOIN (
  SELECT 'Alimentação' AS category, 'Mercado' AS name, '#f97316' AS color, 1 AS sort_order
  UNION ALL SELECT 'Alimentação', 'Restaurante', '#fb923c', 2
  UNION ALL SELECT 'Alimentação', 'Delivery',    '#fdba74', 3
  UNION ALL SELECT 'Alimentação', 'Lanche',      '#fed7aa', 4

  UNION ALL SELECT 'Transporte', 'Combustível',        '#3b82f6', 1
  UNION ALL SELECT 'Transporte', 'Uber',                '#60a5fa', 2
  UNION ALL SELECT 'Transporte', 'Manutenção',          '#93c5fd', 3
  UNION ALL SELECT 'Transporte', 'Transporte Público',  '#bfdbfe', 4
  UNION ALL SELECT 'Transporte', 'Estacionamento',      '#dbeafe', 5

  UNION ALL SELECT 'Moradia', 'Aluguel',       '#ed4a4a', 1
  UNION ALL SELECT 'Moradia', 'Financiamento', '#e84f4f', 2
  UNION ALL SELECT 'Moradia', 'Condomínio',    '#e35454', 3
  UNION ALL SELECT 'Moradia', 'Energia',       '#e35b5b', 4
  UNION ALL SELECT 'Moradia', 'Água',          '#e06060', 5
  UNION ALL SELECT 'Moradia', 'Internet',      '#d96868', 6

  UNION ALL SELECT 'Lazer', 'Cinema',    '#a854f7', 1
  UNION ALL SELECT 'Lazer', 'Viagem',    '#c084fc', 2
  UNION ALL SELECT 'Lazer', 'Streaming', '#ce9dfc', 3
  UNION ALL SELECT 'Lazer', 'Jogos',     '#9c39fa', 4
  UNION ALL SELECT 'Lazer', 'Eventos',   '#cc9ef7', 5

  UNION ALL SELECT 'Saúde', 'Farmácia',  '#04b579', 1
  UNION ALL SELECT 'Saúde', 'Consulta',  '#22b382', 2
  UNION ALL SELECT 'Saúde', 'Exames',    '#16b580', 3
  UNION ALL SELECT 'Saúde', 'Academia',  '#3dba90', 4
  UNION ALL SELECT 'Saúde', 'Convênio',  '#62b599', 5
  UNION ALL SELECT 'Saúde', 'Luta',      '#72b39c', 6

  UNION ALL SELECT 'Educação', 'Curso',      '#7173f0', 1
  UNION ALL SELECT 'Educação', 'Faculdade',  '#8082ed', 2
  UNION ALL SELECT 'Educação', 'Livros',     '#8f91eb', 3
  UNION ALL SELECT 'Educação', 'Material',   '#9d9feb', 4

  UNION ALL SELECT 'Investimento', 'Criptomoeda',   '#eab308', 1
  UNION ALL SELECT 'Investimento', 'FII',           '#facc15', 2
  UNION ALL SELECT 'Investimento', 'Ações',         '#fde047', 3
  UNION ALL SELECT 'Investimento', 'Renda Fixa',    '#fef08a', 4
  UNION ALL SELECT 'Investimento', 'Tesouro Direto','#fff5a6', 5

  UNION ALL SELECT 'Compras', 'Roupas',      '#e864a5', 1
  UNION ALL SELECT 'Compras', 'Eletrônicos', '#e675ac', 2
  UNION ALL SELECT 'Compras', 'Casa',        '#e386b3', 3
  UNION ALL SELECT 'Compras', 'Presentes',   '#e39abd', 4

  UNION ALL SELECT 'Assinaturas', 'Netflix', '#73deff', 1
  UNION ALL SELECT 'Assinaturas', 'Spotify', '#87e3ff', 2
  UNION ALL SELECT 'Assinaturas', 'Amazon',  '#9ee8ff', 3
) AS sub ON sub.category = ct.name;
