# Mind Money — Backend

API REST em Node.js + Express + TypeScript, conectada ao MySQL/MariaDB via
`mysql2` (queries parametrizadas, nunca concatenação de string). Autenticação
por JWT. O front (`src/`) continua em `localStorage` — nada foi integrado
ainda, esta etapa é só a API.

## Como rodar

```
cd backend
npm install
cp .env.example .env      # ajuste DB_PASSWORD/JWT_SECRET
npm run dev                # tsx watch, recarrega sozinho
```

Pré-requisitos: o schema do banco (`database/schema.sql` + `seed.sql` +
`database/migrations/001_notifications.sql`) já aplicado, e o usuário
`mindmoney_app` criado (`database/create_app_user.sql`) — tudo isso já foi
feito e testado na etapa anterior contra o MariaDB local (XAMPP).

## Estrutura

```
backend/src/
  config/       env.ts (valida .env com zod), db.ts (pool mysql2)
  middlewares/  auth (JWT), validate (zod), errorHandler, notFound
  utils/        AppError, asyncHandler, jwt, password (bcrypt), month
  modules/
    auth/         register, login
    users/        GET /me
    categories/   listar categorias/subcategorias do usuário
    transactions/ CRUD de transações
    goals/        CRUD de metas mensais
    dashboard/    agregação (totais, comparação, ranking, evolução)
    score/        score financeiro calculado sob demanda (sem tabela)
    notifications/ listar / marcar como lida
  app.ts        monta os middlewares e rotas
  server.ts     ponto de entrada (falha rápido se o banco estiver fora)
```

Cada módulo segue `routes → controller → service → repository`. `repository`
é a única camada que fala SQL; `service` tem a regra de negócio (posse,
validação cruzada, geração de notificação); `controller` só traduz
request/response.

## Autenticação

`POST /api/auth/register` e `POST /api/auth/login` devolvem
`{ token, user }`. Toda rota protegida exige
`Authorization: Bearer <token>`. O `requireAuth` decodifica o JWT e expõe
`req.userId` — **todas as queries de todos os módulos filtram por esse
`userId`**, nunca por um id vindo do corpo da requisição. Tentar
ler/editar/apagar um recurso de outro usuário devolve `404` (não `403` —
não revela nem que o recurso existe).

Cadastro novo já chama `sp_seed_user_categories` (a procedure criada na
etapa do banco) — toda conta nasce com as 11 categorias/42 subcategorias
padrão.

## Endpoints

| Método | Rota | Auth | O que faz |
|---|---|---|---|
| POST | `/api/auth/register` | não | Cria conta, semeia categorias, devolve token |
| POST | `/api/auth/login` | não | Devolve token |
| GET | `/api/users/me` | sim | Dados do usuário logado |
| GET | `/api/transactions?month&type&categoryId&search` | sim | Lista com filtros |
| POST | `/api/transactions` | sim | Cria (valida categoria/subcategoria do próprio usuário) |
| PUT | `/api/transactions/:id` | sim | Edita |
| DELETE | `/api/transactions/:id` | sim | Remove |
| GET | `/api/categories` | sim | Categorias ativas do usuário |
| GET | `/api/categories/:id/subcategories` | sim | Subcategorias de uma categoria (própria) |
| GET | `/api/goals?month` | sim | Lista metas (ou uma, se `month`) |
| POST | `/api/goals` | sim | Cria meta do mês (409 se já existir) |
| PUT | `/api/goals/:id` | sim | Atualiza valor da meta |
| DELETE | `/api/goals/:id` | sim | Remove meta |
| GET | `/api/dashboard?month` | sim | Totais, comparação mensal, ranking, evolução, meta, alerta |
| GET | `/api/score?month` | sim | Score 0-100 calculado na hora (ver fórmula abaixo) |
| GET | `/api/notifications` | sim | Últimas 50 notificações |
| PUT | `/api/notifications/:id/read` | sim | Marca como lida |

## Score financeiro — como é calculado

Sem tabela própria (é dado derivado — ver `database/README.md`). Duas
componentes de até 50 pontos:

- **Controle de gastos**: `50 × (1 - saídas/entradas)`, 0 se não houve
  entrada no mês.
- **Meta de economia**: `50 × (saldo/meta)` se houver meta no mês; sem meta
  definida, entra com 25 pontos (neutro).

Documentado como "primeira versão" no código (`score.service.ts`) — é uma
fórmula razoável, não uma verdade definitiva; ajustável quando houver
critério de negócio mais elaborado.

## Notificações — quando são geradas

Não existe endpoint para criar notificação manualmente — elas nascem como
efeito colateral real de criar/editar uma transação ou uma meta
(`notificationsService.checkAndNotify`, chamado pelos services de
transactions e goals):

- **`limit_exceeded`**: gasto do mês passou de 70% das entradas (mesmo
  limiar do front, `ALERT_PERCENT`).
- **`goal_achieved`**: saldo do mês atingiu a meta definida.

Sem duplicar: só cria uma nova se não houver outra do mesmo tipo ainda não
lida — evita spam a cada transação enquanto o usuário não reconhece o
alerta anterior.

## Testado de verdade

Rodei o servidor local contra o MariaDB do XAMPP e testei via HTTP real
(não só leitura de código): cadastro (com seed de categorias confirmado no
banco), login, `/me`, rejeição sem token e com senha errada, CRUD completo
de transações e metas, filtro por mês, conflito de meta duplicada (409),
validação rejeitando valor negativo (400), dashboard e score com números
conferidos manualmente, notificação gerada automaticamente ao bater a
meta, e — o mais importante — **isolamento entre usuários**: um segundo
usuário não vê a lista do primeiro, não edita, não apaga, não lê
subcategorias da categoria alheia, e não consegue criar transação
referenciando uma categoria que não é dele (`400`).

### Achado durante o teste: mojibake nos dados

Ao aplicar `seed.sql` a primeira vez via
`Get-Content -Raw | mysql.exe`, os acentos vieram corrompidos no banco
(`"SalÃ¡rio"` em vez de `"Salário"`) — o PowerShell 5.1 não assume UTF-8 por
padrão ao ler o arquivo sem `-Encoding UTF8` explícito. Corrigido recriando
o banco com `Get-Content -Raw -Encoding UTF8`, e o pool do `mysql2` agora
declara `charset: "utf8mb4"` explicitamente (`config/db.ts`) para não
depender do padrão do driver.

Um segundo mojibake apareceu durante os testes, desta vez só no campo que
eu digitava direto no corpo da requisição (`Invoke-RestMethod -Body <string>`
também não manda UTF-8 por padrão no Windows PowerShell 5.1) — não é bug do
backend: reenviando o mesmo corpo como bytes UTF-8 explícitos
(`[System.Text.Encoding]::UTF8.GetBytes(...)`), o dado chegou e voltou
perfeito. Um `fetch`/`axios` de navegador não tem esse problema (sempre
manda UTF-8), mas vale saber caso alguém teste via PowerShell de novo.

## Próximos passos

Nenhuma chamada foi feita do front para esta API ainda — o próximo passo
natural é a integração (trocar os hooks de `localStorage` por chamadas
`fetch`/`axios` para estes endpoints, com tela de login/registro no React).
