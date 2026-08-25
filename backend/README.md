# Mind Money — Backend

API REST em Node.js + Express + TypeScript, conectada ao MySQL/MariaDB via
`mysql2` (queries parametrizadas, nunca concatenação de string). Autenticação
por JWT (access token curto + refresh token rotativo).

> Lista completa dos 48 endpoints, das 20 tabelas e das regras de negócio
> (score, notificações, gamificação, perfil) está em **[`../DOCUMENTATION.md`](../DOCUMENTATION.md)**
> — este README cobre só a estrutura interna do backend, pra não duplicar (e
> desatualizar) a mesma informação em dois lugares.

## Como rodar

```
cd backend
npm install
cp .env.example .env      # ajuste DB_PASSWORD/JWT_SECRET
npm run dev                # tsx watch, recarrega sozinho
```

Pré-requisito: schema + seed + migrations aplicados e o usuário
`mindmoney_app` criado — ver `## Como rodar localmente` no README da raiz.

## Estrutura

```
backend/src/
  config/       env.ts (valida .env com zod), db.ts (pool mysql2)
  middlewares/  auth (JWT), validate (zod), rateLimit, errorHandler, notFound
  utils/        AppError, asyncHandler, jwt, password (bcrypt), month
  modules/
    auth/           registro, login, refresh/logout, esqueci/redefinir senha
    users/          perfil, foto, troca de senha, sessões ativas, preferências
                    de notificação, exclusão de conta
    financialProfile/  experiência/renda/prioridades + recomendações por regra
    categories/     categorias/subcategorias por usuário (soft-delete)
    transactions/   CRUD de transações + importação em lote
    goals/          metas de economia mensais
    objectives/     objetivos de longo prazo (nome, prazo, prioridade) + aportes
    dashboard/      agregação (totais, comparação, ranking, evolução)
    score/          score financeiro calculado sob demanda (sem tabela própria)
    notifications/  listar / marcar como lida
    insights/       observações por regra + perguntas em linguagem natural
    education/      progresso do usuário nas aulas (conteúdo é estático, vive no front)
    gamification/   XP, nível, sequência de dias, conquistas
    favorites/      aulas/calculadoras salvas pelo usuário
    newsletter/     cadastro de e-mail da landing pública (única rota sem auth fora de /auth)
  app.ts        monta os middlewares e rotas
  server.ts     ponto de entrada (falha rápido se o banco estiver fora)
```

Cada módulo segue `routes → controller → service → repository`. `repository`
é a única camada que fala SQL; `service` tem a regra de negócio (posse,
validação cruzada, geração de notificação/XP); `controller` só traduz
request/response.

## Autenticação

`POST /api/auth/register` e `POST /api/auth/login` devolvem
`{ token, refreshToken, user }`. Toda rota protegida exige
`Authorization: Bearer <token>`. O `requireAuth` decodifica o JWT e expõe
`req.userId` — **todas as queries de todos os módulos filtram por esse
`userId`**, nunca por um id vindo do corpo da requisição. Tentar
ler/editar/apagar um recurso de outro usuário devolve `404` (não `403` —
não revela nem que o recurso existe).

Cadastro novo já chama `sp_seed_user_categories` — toda conta nasce com as
categorias/subcategorias padrão.

## Testes

`npm test` roda os testes de integração (Vitest + Supertest) contra o MySQL
real — nunca mockado. Cada teste cria e limpa seus próprios usuários
(`tests/helpers.ts`), então a suíte pode rodar em qualquer ordem sem
interferir entre testes. Ver `DOCUMENTATION.md` seção 13 para a contagem
atual e a cobertura por módulo.
