# Mind Money — Documentação Técnica

Documentação do sistema real, tal como implementado e testado. Nenhuma
funcionalidade descrita aqui é especulativa — o que está marcado como
"não implementado" está explicitamente identificado como tal.

## 1. Visão geral

Mind Money é um sistema de gestão financeira pessoal: registro de
transações, categorização, metas de economia, score financeiro,
notificações, relatórios e insights — com autenticação real e dados
isolados por usuário em um banco relacional.

## 2. Arquitetura

Três camadas, cada uma com sua própria documentação técnica dedicada:

```
Frontend (React/TS/Vite)  ──HTTP/JSON──▶  Backend (Node/Express/TS)  ──SQL──▶  MySQL/MariaDB
      src/                                      backend/                        database/
```

- **Frontend**: SPA roteada (`react-router-dom`), autenticada via JWT
  guardado em `localStorage`. `services/*.ts` são a única camada que fala
  com a API — nenhum componente faz `fetch` direto.
- **Backend**: API REST em camadas por módulo
  (`routes → controller → service → repository`), documentado em
  detalhe em `backend/README.md`.
- **Banco**: MySQL/MariaDB normalizado, documentado em
  `database/README.md` (decisões de design, diagrama ER).

Ver `CLAUDE.md` para o mapa de onde cada coisa fica no código.

## 3. Tecnologias

| Camada | Tecnologias |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Recharts, react-router-dom |
| Backend | Node.js, Express, TypeScript, mysql2 (queries parametrizadas), zod (validação), jsonwebtoken, bcryptjs, express-rate-limit, helmet, cors |
| Banco | MySQL/MariaDB, InnoDB, utf8mb4 |
| Testes | Vitest (frontend e backend), Supertest (API) |

Nenhuma dependência de IA/LLM externa está configurada ou em uso — ver
seção 10.

## 4. Banco de dados

9 tabelas (detalhes, constraints e diagrama ER completos em
`database/README.md`):

| Tabela | Papel |
|---|---|
| `users` | Autenticação |
| `category_templates` / `subcategory_templates` | Padrões copiados para cada usuário novo no cadastro |
| `categories` / `subcategories` | Por usuário, soft-delete via `archived_at` |
| `transactions` | Lançamentos financeiros |
| `saving_goals` | Uma meta por usuário/mês |
| `notifications` | Avisos gerados por eventos reais |
| `financial_score_history` | Cache do score por mês, recalculado a cada consulta |

Decisões relevantes: valores monetários sempre `DECIMAL`, nunca
`FLOAT`/`DOUBLE`; `transactions.category_id` é `ON DELETE RESTRICT` de
propósito (protege o histórico financeiro — apagar uma categoria em uso
exige arquivá-la, não excluí-la); nenhuma tabela guarda dado
puramente derivado além do cache de score (justificativa na seção 8).

## 5. API REST

Base: `/api`. Toda rota exceto `/health`, `/api/auth/register` e
`/api/auth/login` exige `Authorization: Bearer <token>`. Toda consulta
filtra por `user_id` extraído do token — nunca por um id vindo do corpo
da requisição.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cria conta, semeia categorias padrão, devolve token |
| POST | `/api/auth/login` | Autentica, devolve token |
| GET | `/api/users/me` | Dados do usuário autenticado |
| GET | `/api/transactions` | Lista com filtros `month`, `type`, `categoryId`, `search` |
| POST | `/api/transactions` | Cria transação |
| PUT | `/api/transactions/:id` | Edita transação |
| DELETE | `/api/transactions/:id` | Remove transação |
| GET | `/api/categories` | Lista categorias ativas do usuário |
| POST | `/api/categories` | Cria categoria customizada |
| DELETE | `/api/categories/:id` | Arquiva categoria (bloqueado para categorias padrão) |
| GET | `/api/categories/:id/subcategories` | Lista subcategorias |
| POST | `/api/categories/:id/subcategories` | Cria subcategoria |
| DELETE | `/api/categories/:id/subcategories/:subId` | Arquiva subcategoria |
| GET | `/api/goals` | Lista metas (ou uma, com `?month=`) |
| POST | `/api/goals` | Cria meta do mês (409 se já existir) |
| PUT | `/api/goals/:id` | Atualiza valor da meta |
| DELETE | `/api/goals/:id` | Remove meta |
| GET | `/api/dashboard` | Totais, comparação mensal, ranking, evolução, meta, alerta — `?month=` |
| GET | `/api/score` | Score financeiro calculado (ver seção 8) — `?month=` |
| GET | `/api/score/history` | Histórico do score — `?months=` |
| GET | `/api/notifications` | Últimas 50 notificações |
| PUT | `/api/notifications/:id/read` | Marca notificação como lida |
| GET | `/api/insights` | Observações geradas por regra sobre os dados do mês |
| POST | `/api/insights/ask` | Pergunta em linguagem natural, respondida por casamento de padrão |

## 6. Autenticação e segurança

JWT assinado pelo backend (`JWT_SECRET`, validado no boot), expiração
configurável (padrão 7 dias). Senha com hash bcrypt (12 rounds), nunca
armazenada nem devolvida em texto puro. Rate limiting em
`/api/auth/*` (30 tentativas/15min por IP) e geral na API (300/15min).

Auditoria completa, achados e correções em **`SECURITY.md`** — inclui o
que foi verificado (SQL injection, XSS, IDOR, CORS, secrets) e o que foi
corrigido nesta etapa (dependências vulneráveis, rate limiting ausente).

## 7. Funcionalidades implementadas

- **Autenticação**: cadastro, login, logout, sessão persistente, rotas
  protegidas, sessão inválida/expirada detectada e tratada.
- **Transações**: CRUD completo, filtros (mês/tipo/categoria/busca),
  validação de campos e de posse.
- **Categorias e subcategorias**: padrão semeada no cadastro,
  customização (criar/arquivar), cor gerada automaticamente.
- **Dashboard**: totais, saldo, comparação com mês anterior, ranking de
  gastos, distribuição por categoria com detalhamento por subcategoria,
  evolução financeira, alerta de limite de gastos.
- **Metas**: uma por mês, progresso, status (atingida/em andamento/não
  atingida/planejada), histórico completo em tela própria.
- **Score financeiro**: 4 componentes, níveis, histórico com gráfico de
  evolução (seção 8).
- **Notificações**: geradas automaticamente (limite excedido, meta
  atingida), sino com contador de não lidas, marcar como lida.
- **Relatórios**: totais, % de economia, maior categoria, comparação dos
  últimos 6 meses, exportação em CSV.
- **Educação financeira**: 10 conteúdos reais, categorizados por tema e
  nível, filtráveis.
- **Assistente/insights**: observações automáticas (aumento de gasto,
  categoria recorrente, evolução, meta, recomendação geral) e resposta a
  perguntas simples sobre os próprios dados (seção 10).
- **Perfil**: dados da conta, logout.

## 8. Regras de negócio — Score Financeiro

Fórmula determinística (não é um número aleatório), 4 componentes que
somam 100 pontos, implementados e documentados em
`backend/src/modules/score/score.service.ts`:

1. **Controle de gastos (0–40)**: `40 × (1 − saídas/entradas)` do mês.
2. **Capacidade de economia (0–30)**: progresso da meta do mês, se
   houver; sem meta, uma taxa de poupança genérica (guardar 20%+ das
   entradas já vale a pontuação cheia).
3. **Evolução financeira (0–15)**: saldo deste mês comparado ao
   anterior, normalizado pelas entradas.
4. **Consistência (0–15)**: proporção dos últimos 3 meses que não
   ultrapassaram o limite de alerta de gastos (70%).

Níveis: Excelente (≥80) · Bom (≥60) · Regular (≥40) · Atenção (≥20) ·
Crítico (<20).

O score **não é armazenado como fonte de verdade** — é recalculado a
cada consulta e o resultado é gravado em `financial_score_history` como
um cache (permite montar o gráfico de evolução sem recalcular tudo a
cada vez, mas sempre reflete os dados atuais, inclusive se uma
transação de um mês passado for editada depois).

## 9. Regras de negócio — Notificações

Não existe endpoint para criar notificação manualmente. Elas nascem como
efeito colateral real de duas regras, avaliadas a cada criação/edição de
transação ou meta:

- `limit_exceeded`: gasto do mês passou de 70% das entradas.
- `goal_achieved`: saldo do mês atingiu a meta definida.

Sem duplicar: só cria uma nova se não houver outra do mesmo tipo ainda
não lida pelo usuário.

## 10. Recurso inteligente (etapa 15) — o que é e o que não é

**Não há nenhuma integração de IA/LLM configurada neste projeto** —
nenhuma chave de API, nenhuma variável de ambiente para isso. O
"assistente" é 100% regra determinística sobre dados reais
(`backend/src/modules/insights`):

- Insights automáticos: comparação de categorias entre meses, detecção
  de categoria recorrentemente problemática, tendência de saldo, análise
  de meta, recomendação geral baseada no score.
- Perguntas e respostas: reconhecimento por palavra-chave de um conjunto
  pequeno de perguntas (categoria específica, maior gasto, economia do
  mês, meta, score). Fora desse conjunto, a resposta é "não consegui
  entender", nunca uma resposta inventada.

Uma integração de IA externa real é uma extensão possível — entraria
como uma etapa **depois** do cálculo determinístico (por exemplo, para
redigir o texto de forma mais natural), nunca no lugar dele, e nunca sem
uma credencial de verdade configurada.

## 11. Testes

59 testes automatizados, executados e passando — detalhes em
`backend/tests/` (36, integração via Supertest contra o banco real) e
`src/**/*.test.ts` (23, unitários, funções de cálculo puras). Comandos:
`npm test` na raiz (frontend) e em `backend/` (backend). Cobertura:
cadastro, login, autenticação, transações, categorias, subcategorias,
metas, score, notificações, dashboard, filtros, cálculos e — em
praticamente todo módulo — isolamento entre usuários (IDOR).

## 12. Limitações conhecidas

Registradas aqui de propósito, para não serem confundidas com
funcionalidade quebrada:

- **Importação em massa de dados**: desativada. Existia como recurso
  client-side antes da migração para a API (etapa 8); não há endpoint de
  importação em massa no backend, e simular isso no cliente resolvendo
  nomes de categoria para id seria arriscado o suficiente para merecer
  virar uma etapa própria, não um ajuste rápido.
- **Token JWT em `localStorage`, sem refresh token**: decisão consciente
  documentada em `SECURITY.md` — dado que não há nenhum vetor de XSS no
  projeto hoje, o risco prático é baixo, mas é uma escolha a revisar
  antes de um deploy de produção real.
- **Recurso inteligente sem IA externa**: ver seção 10.

## 13. Auditoria final (etapa 20)

Revisão completa do estado atual do sistema, feita depois de todas as
outras etapas concluídas:

- **Código**: sem uso de `any` em nenhum dos dois projetos (grep
  dedicado); sem comentários `TODO`/`FIXME` pendentes; sem
  `console.log`/`console.debug` de depuração esquecido (só o log de
  inicialização do servidor e o `console.error` intencional do
  tratamento de erro global); build e lint limpos.
- **Funcionalidades**: validadas de ponta a ponta com interação real de
  UI (não só chamadas de API) — cadastro, lançar transação de entrada e
  de saída com subcategoria, definir meta, navegar por todas as páginas,
  perfil, logout seguido de login (dados persistem), modo escuro. Zero
  erros de console.
- **Achado durante a validação, não é bug**: o rate limiting da etapa 16
  (30 tentativas/15min por IP em `/api/auth/*`) bloqueou um dos testes
  desta própria auditoria, porque a sessão de desenvolvimento já tinha
  feito dezenas de cadastros de teste antes. Isso é o limite funcionando
  como projetado, não uma falha — só reforça que é um valor adequado
  para conter força bruta de verdade. Reiniciar o processo do backend
  zera o contador (guardado em memória).
- **Performance**: uma característica conhecida, não corrigida nesta
  etapa — `useCategories` no front faz uma requisição por categoria para
  buscar as subcategorias (N+1), em vez de um endpoint único que já
  devolva tudo aninhado. Com 11 categorias por usuário o impacto é
  pequeno, mas é o ponto mais claro de otimização futura se o número de
  categorias crescer. O bundle de produção do frontend também passou de
  500kB (aviso do Vite) — nenhum code-splitting foi aplicado; dado que é
  uma SPA de uma página só carregada por vez, não afeta a experiência de
  forma perceptível hoje.
- **Banco de dados e segurança**: sem novos achados além dos já
  registrados em `database/README.md` e `SECURITY.md`.
