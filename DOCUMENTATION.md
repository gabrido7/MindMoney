# Mind Money — Documentação Técnica

Documentação do sistema real, tal como implementado e testado. Nenhuma
funcionalidade descrita aqui é especulativa — o que está marcado como
"não implementado" está explicitamente identificado como tal.

## 1. Visão geral

Mind Money é um sistema de gestão financeira pessoal: registro de
transações, categorização, metas de economia e objetivos de longo
prazo, score financeiro, notificações, relatórios, insights,
educação financeira gamificada (trilhas, XP, conquistas), calculadoras
financeiras e busca — com autenticação real e dados isolados por
usuário em um banco relacional.

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
seção 11.

## 4. Banco de dados

18 tabelas + 1 stored procedure (detalhes, constraints e diagrama ER
completos em `database/README.md`). Base em `database/schema.sql`,
evolução em `database/migrations/001` a `010`, aplicadas em ordem:

| Tabela | Papel |
|---|---|
| `users` | Autenticação |
| `category_templates` / `subcategory_templates` | Padrões copiados para cada usuário novo no cadastro (`sp_seed_user_categories`) |
| `categories` / `subcategories` | Por usuário, soft-delete via `archived_at` |
| `transactions` | Lançamentos financeiros |
| `saving_goals` | Uma meta de economia por usuário/mês |
| `financial_objectives` / `objective_contributions` | Objetivos de longo prazo (nome, valor-alvo, categoria, prioridade) e seus aportes |
| `notifications` | Avisos gerados por eventos reais |
| `financial_score_history` | Cache do score por mês, recalculado a cada consulta |
| `newsletter_subscribers` | Cadastros da landing pública |
| `password_reset_tokens` / `refresh_tokens` | Tokens de uso único, guardados só como hash (SHA-256) |
| `lesson_progress` | Progresso do usuário nas aulas da Educação Financeira (o conteúdo em si é estático, vive no frontend — `lesson_id` é uma slug, não FK) |
| `xp_events` | Ledger de XP; `UNIQUE(user_id, reason, reference_id)` torna a concessão idempotente |
| `user_achievements` | Conquistas desbloqueadas |
| `favorites` | Aulas/calculadoras salvas pelo usuário |

Decisões relevantes: valores monetários sempre `DECIMAL`, nunca
`FLOAT`/`DOUBLE`; `transactions.category_id` é `ON DELETE RESTRICT` de
propósito (protege o histórico financeiro — apagar uma categoria em uso
exige arquivá-la, não excluí-la); tokens de sessão/reset nunca são
guardados em texto puro, só o hash; nenhuma tabela guarda dado
puramente derivado além dos caches de score e XP (justificativa na
seção 8).

## 5. API REST

Base: `/api`, 39 endpoints. Toda rota exceto `/health`, as de
`/api/auth/*` e `POST /api/newsletter` (captura de e-mail da landing
pública) exige `Authorization: Bearer <token>`. Toda consulta filtra
por `user_id` extraído do token — nunca por um id vindo do corpo da
requisição.

**Autenticação e conta**

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cria conta, semeia categorias padrão, devolve token + refresh token |
| POST | `/api/auth/login` | Autentica, devolve token + refresh token |
| POST | `/api/auth/refresh` | Rotaciona o refresh token, emite novo access token |
| POST | `/api/auth/logout` | Revoga o refresh token |
| POST | `/api/auth/forgot-password` | Gera token de redefinição (hash guardado, token real só no e-mail) |
| POST | `/api/auth/reset-password` | Consome o token, define nova senha |
| GET | `/api/users/me` | Dados do usuário autenticado |
| PUT | `/api/users/me` | Atualiza perfil |
| PUT | `/api/users/me/password` | Troca de senha |
| DELETE | `/api/users/me` | Exclui a conta (e os dados, na ordem correta) |

**Transações e categorias**

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/transactions` | Lista com filtros `month`, `type`, `categoryId`, `search` |
| POST | `/api/transactions` | Cria transação |
| POST | `/api/transactions/import` | Importação em lote |
| PUT | `/api/transactions/:id` | Edita transação |
| DELETE | `/api/transactions/:id` | Remove transação |
| GET | `/api/categories` | Lista categorias ativas do usuário |
| POST | `/api/categories` | Cria categoria customizada |
| DELETE | `/api/categories/:id` | Arquiva categoria (bloqueado para categorias padrão) |
| GET | `/api/categories/:id/subcategories` | Lista subcategorias |
| POST | `/api/categories/:id/subcategories` | Cria subcategoria |
| DELETE | `/api/categories/:id/subcategories/:subId` | Arquiva subcategoria |

**Metas, objetivos, dashboard e score**

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/goals` | Lista metas mensais (ou uma, com `?month=`) |
| POST | `/api/goals` | Cria meta do mês (409 se já existir) |
| PUT | `/api/goals/:id` | Atualiza valor da meta |
| DELETE | `/api/goals/:id` | Remove meta |
| GET | `/api/objectives` | Lista objetivos de longo prazo |
| POST | `/api/objectives` | Cria objetivo |
| PUT | `/api/objectives/:id` | Edita objetivo |
| DELETE | `/api/objectives/:id` | Remove objetivo |
| GET | `/api/objectives/summary` | Totais agregados dos objetivos |
| GET | `/api/objectives/evolution` | Série histórica para o gráfico de evolução |
| GET | `/api/objectives/:id/contributions` | Lista aportes de um objetivo |
| POST | `/api/objectives/:id/contributions` | Registra aporte (dispara XP/conquista ao atingir 100%) |
| DELETE | `/api/objectives/:id/contributions/:contributionId` | Remove aporte |
| GET | `/api/dashboard` | Totais, comparação mensal, ranking, evolução, meta, alerta — `?month=` |
| GET | `/api/dashboard/range` | Mesma visão para um intervalo de meses customizado |
| GET | `/api/score` | Score financeiro calculado (ver seção 8) — `?month=` |
| GET | `/api/score/history` | Histórico do score — `?months=` |

**Notificações e insights**

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/notifications` | Últimas notificações |
| PUT | `/api/notifications/:id/read` | Marca notificação como lida |
| GET | `/api/insights` | Observações geradas por regra sobre os dados do mês |
| POST | `/api/insights/ask` | Pergunta em linguagem natural, respondida por casamento de padrão |

**Educação financeira, gamificação e favoritos**

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/education/progress` | Progresso do usuário em todas as aulas |
| PUT | `/api/education/progress/:lessonId` | Upsert de progresso (conclusão, quiz, exercício) — dispara XP |
| DELETE | `/api/education/progress/:lessonId` | Remove o progresso de uma aula |
| GET | `/api/gamification/summary` | XP total, nível, sequência de dias e conquistas (desbloqueadas ou não) |
| GET | `/api/favorites` | Lista aulas/calculadoras salvas |
| POST | `/api/favorites` | Salva um conteúdo (idempotente) |
| DELETE | `/api/favorites/:contentType/:contentId` | Remove dos salvos |

**Outros**

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Healthcheck (verifica conexão real com o banco) |
| POST | `/api/newsletter` | Cadastro de e-mail pela landing pública (única rota fora de `/api/auth` sem autenticação) |

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
- **Objetivos de longo prazo**: metas nomeadas (viagem, compra,
  patrimônio...), com prioridade, aportes registrados individualmente e
  gráfico de evolução — diferente da meta de economia mensal.
- **Educação financeira**: 6 trilhas completas (Fundamentos, Organização
  financeira, Investimentos, Finanças avançadas, Crédito e dívidas,
  Aposentadoria), 165 aulas com explicação, exemplos, diagrama, quiz e
  exercício prático — progresso salvo por usuário.
- **Gamificação**: XP por aula concluída/quiz/curso e trilha completos/
  meta atingida/sequência de dias de estudo, níveis, 14 conquistas
  desbloqueáveis (seção 10).
- **Ferramentas financeiras**: 11 calculadoras (juros simples e
  compostos, inflação, poder de compra, reserva de emergência,
  aposentadoria, aportes mensais, financiamento, empréstimo, comparação
  de investimentos, rentabilidade real) — cálculo 100% client-side, sem
  chamada ao backend.
- **Busca**: busca por palavra-chave (com tokenização e remoção de
  stopwords em português) sobre todas as aulas e calculadoras, acessível
  de qualquer página autenticada.
- **Favoritos**: salvar aulas e calculadoras para acesso rápido depois.
- **Assistente/insights**: observações automáticas (aumento de gasto,
  categoria recorrente, evolução, meta, recomendação geral) e resposta a
  perguntas simples sobre os próprios dados (seção 11).
- **Perfil**: dados da conta, troca de senha, exclusão de conta, logout.

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

## 10. Regras de negócio — Gamificação

Implementado em `backend/src/modules/gamification`. XP nunca vem do
cliente — só o motivo (`reason`) e um `reference_id` de deduplicação; o
valor em pontos é decidido sempre no servidor
(`gamification.constants.ts`).

- **Eventos que dão XP**: aula concluída, quiz respondido, curso
  completo, trilha completa, meta atingida, marco de sequência de dias
  de estudo (3/7/14/30 dias) e cada conquista desbloqueada.
- **Idempotência**: `xp_events` tem `UNIQUE(user_id, reason,
  reference_id)` — reenviar o mesmo evento (ex.: marcar a mesma aula como
  concluída de novo) não duplica XP, a inserção é ignorada.
- **Nível**: cada nível exige `100 + (nível − 1) × 50` XP; o nível atual
  e o XP até o próximo são recalculados a partir do total acumulado, não
  guardados como campo separado.
- **Sequência de dias**: calculada a partir das datas distintas de
  conclusão de aula, sempre usando `CURDATE()` do próprio MySQL como
  "hoje" — nunca `new Date()` do Node, que diverge por fuso horário
  perto da virada de meia-noite UTC (bug real já encontrado e corrigido
  durante o desenvolvimento).
- **14 conquistas**: da primeira aula até completar cada uma das 6
  trilhas, primeiro quiz, primeira meta atingida, sequência de 3 dias,
  entre outras — catálogo completo em `gamification.constants.ts`.
- **Conteúdo estático, progresso real**: o catálogo de aulas/trilhas
  vive no frontend (mesmo princípio do `lesson_progress`); o backend
  mantém pequenos conjuntos de IDs de aula por curso/trilha só para
  detectar "curso/trilha 100% concluída" — precisam ser atualizados
  manualmente sempre que uma trilha nova é escrita.

## 11. Recurso inteligente (etapa 15) — o que é e o que não é

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

## 12. Testes

243 testes automatizados, executados e passando — 18 arquivos em
`backend/tests/` (integração via Supertest contra o MySQL real, cada
teste cria e limpa seus próprios usuários) e 8 arquivos em
`src/**/*.test.ts` (unitários — funções de cálculo puras: score,
agregações, calculadoras financeiras, busca, gamificação). Comandos:
`npm test` na raiz (frontend) e em `backend/` (backend). Cobertura:
cadastro, login, refresh/expiração de sessão, troca e redefinição de
senha, transações, categorias, subcategorias, metas, objetivos e
aportes, score, notificações, dashboard, educação financeira e
gamificação (XP, nível, sequência, conquistas), favoritos, filtros,
cálculos e — em praticamente todo módulo — isolamento entre usuários
(IDOR).

## 13. Limitações conhecidas

Registradas aqui de propósito, para não serem confundidas com
funcionalidade quebrada:

- **Recurso inteligente sem IA externa**: ver seção 11.
- **`useCategories` no frontend faz uma requisição por categoria** para
  buscar as subcategorias (N+1), em vez de um endpoint único que já
  devolva tudo aninhado. Com o número atual de categorias por usuário o
  impacto é pequeno, mas é o ponto mais claro de otimização futura se
  esse número crescer.
- **Bundle de produção do frontend acima de 500kB** (aviso do Vite,
  puxado principalmente pelo Recharts): nenhum code-splitting por
  `manualChunks` foi aplicado ainda. Como é uma SPA carregada uma vez
  por sessão, não afeta a experiência de forma perceptível hoje, mas é
  o próximo passo óbvio de performance se o app crescer mais.

## 14. Auditoria final (etapa 20)

> Auditoria feita num ponto específico do projeto — antes de
> gamificação, trilhas completas de educação financeira, ferramentas
> financeiras, busca, favoritos e do redesign da landing/sidebar. Os
> achados abaixo continuam válidos para o núcleo que auditam (transações,
> categorias, metas, autenticação), mas as funcionalidades adicionadas
> depois não foram re-auditadas com este mesmo nível de detalhe —
> receberam sua própria verificação ponta a ponta no momento em que
> foram construídas (ver testes automatizados da seção 12), não uma
> auditoria formal registrada aqui.

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
