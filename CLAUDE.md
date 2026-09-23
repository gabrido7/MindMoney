# CLAUDE.md

Guia para o Claude Code trabalhar neste repositório. Contém só o que vale
para sempre. **Antes de começar qualquer tarefa, leia o `PROGRESSO.md`** para
ver o estado atual, o que falta fazer e os pontos de atenção.

Ao terminar uma tarefa grande: atualize o `PROGRESSO.md`; só mexa neste
arquivo se surgir uma decisão permanente (e mantenha-o curto).

## Comandos

Frontend (raiz do projeto):
- `npm run dev` — Vite (`http://localhost:5173`)
- `npm run build` — type-check (`tsc -b`) + build de produção
- `npm run lint` — ESLint
- `npm test` — Vitest (`src/**/*.test.ts`, só funções puras de cálculo)

Backend (`backend/`):
- `npm run dev` — `tsx watch src/server.ts`, API em `http://localhost:3001`
- `npm run build` — `tsc -p tsconfig.json` (gera `dist/`)
- `npm start` — `node dist/server.js` (usado no Render)
- `npm test` — Vitest + Supertest, testes de integração contra o MySQL de dev
  real (sem mock); cada teste cria e apaga seus próprios usuários

Banco (`database/`): `schema.sql` + `seed.sql` são a base;
`migrations/NNN_*.sql` são aplicadas em ordem por cima. No Windows/PowerShell,
sempre `Get-Content -Raw -Encoding UTF8 arquivo.sql | mysql ...` com
`--default-character-set=utf8mb4` — sem isso os acentos das categorias
corrompem e quebram as UNIQUE KEYs silenciosamente.

## Arquitetura

Três partes: frontend React+TypeScript+Vite (`src/`), backend
Node+Express+TypeScript (`backend/`), banco MySQL/MariaDB (`database/`).
**Sem mock e sem dado falso em nenhuma camada** — toda funcionalidade usa a API
e o banco reais.

**Frontend** — SPA com `react-router-dom` (rotas em `App.tsx`: landing
pública, `AuthLayout` para login/cadastro, `AppLayout` + `ProtectedRoute` para
as páginas logadas). Estado de servidor via TanStack Query
(`lib/queryClient.ts`, invalidação em `lib/invalidateFinancialData.ts`).
`services/*.ts` são wrappers tipados por módulo do backend, todos passando por
`services/api.ts` (base `VITE_API_URL`, Bearer token automático, refresh
token silencioso). Cada funcionalidade vive em `src/features/<nome>/`
(`components`, `hooks`, `utils` com testes). `src/types/api.ts` é o formato
literal da API; `src/types/index.ts` é o modelo de domínio — os hooks adaptam
um no outro.

**Backend** — um módulo por domínio em
`backend/src/modules/<nome>/{routes,controller,service,repository,validation}.ts`:
routes ligam `requireAuth` + `validate()` (zod) + controller; service tem as
regras de negócio e checagem de dono; repository é a única camada que toca SQL
(sempre parametrizado). **Toda query é filtrada pelo `user_id` do JWT — nunca
confie em id vindo do corpo da requisição.** O backend conecta como
`mindmoney_app` (usuário MySQL de privilégio mínimo, nunca root).
Access token curto (15 min) + refresh token (30 dias). `middlewares/rateLimit.ts`
protege `/api/auth/*` (desligado com `NODE_ENV=test`).

**Banco** — InnoDB, utf8mb4, normalizado. Categorias são por usuário, com
soft-delete (`archived_at`), copiadas dos templates no cadastro pela procedure
`sp_seed_user_categories`. `transactions.category_id` é `ON DELETE RESTRICT`
de propósito. Detalhes e raciocínio em `database/README.md`.

**Score, insights e notificações são calculados, não "a verdade" gravada**:
o score é uma fórmula determinística recalculada na leitura
(`financial_score_history` é só cache); o "assistente" (`modules/insights`) é
100% baseado em regras. **Não existe API de IA configurada — não invente uma
chave** (ver `SECURITY.md`).

## Convenções que já causaram bugs

- **Não use `CURDATE()`/`NOW()` no SQL dos repositories** para regras de data:
  receba um `asOfDate: string` vindo de `todayISO()`. `vi.setSystemTime` não
  altera o relógio do MySQL, então SQL com data embutida não é testável.
- Em testes que avançam o relógio com `vi.setSystemTime`, faça login de novo
  depois do salto — o token obtido antes aparece expirado.
- Toda transação exige `accountId` (contas/carteiras múltiplas). Nos testes do
  backend use o helper `getAccountId(token)` de `backend/tests/helpers.ts`, e
  sempre confira o status da criação (`expect(res.status).toBe(201)`) para o
  teste não passar pelo motivo errado.
- O frontend no Vercel precisa de `VITE_API_URL` **absoluto** apontando para o
  Render (frontend e backend estão em domínios diferentes); caminho relativo
  (`/api`) só funciona com os dois no mesmo domínio.

## Preferências de trabalho

- Pesquise o código diretamente (Read/Grep), sem disparar subagentes em
  paralelo — o usuário já recusou isso.

## Produção (nuvem, plano gratuito)

- **Frontend:** Vercel, projeto `mindmoney-frontend` →
  https://mindmoney-frontend.vercel.app
- **Backend:** Render, serviço `mindmoney-backend` (config em `render.yaml`) →
  https://mindmoney-backend.onrender.com (health check em `/health`)
- **Banco:** MySQL gerenciado no Aiven (exige TLS: `DB_SSL_CA` no Render)
- Repositório: `github.com/gabrido7/MindMoney`, branch `master`

**Todo `git push` na `master` publica sozinho** no Vercel e no Render. Então:
rode `npm run build` e `npm test` (frontend e backend) antes de qualquer push —
um erro vai direto para o site no ar.

**Rate limit** (`middlewares/rateLimit.ts`): por IP, a cada 15 min, com padrão
de 6000 ações de API e 200 de login/cadastro — dimensionado para um laboratório
de ~20 PCs saindo pelo mesmo IP da escola. Ajustável sem código pelas variáveis
`RATE_LIMIT_API_MAX` / `RATE_LIMIT_AUTH_MAX` no Render. Em produção o app usa
`trust proxy = 1` (balanceador do Render); sem isso todos os visitantes viram
um IP só.

**Keep-alive** (`.github/workflows/keep-alive.yml`): o GitHub Actions visita o
`/health` a cada 10 min. Isso impede o Aiven gratuito de desligar o banco por
inatividade (aconteceu em 22/09) e evita o Render "dormindo". Se o banco
cair, o servidor nem sobe (`server.ts` exige o banco antes de escutar).

**Migrations não são aplicadas automaticamente no Aiven.** Ao criar uma
migration nova, ela precisa ser rodada manualmente no banco de produção, e o
`database/deploy_all.sql` (consolidado de schema + seed + migrations 001..022)
deve ser atualizado para incluí-la.

Segredos (senhas do banco, `JWT_SECRET`) ficam só nos painéis do Render/Aiven
e nos `.env` locais — nunca no repositório.

## Outros documentos

- `DOCUMENTATION.md` — arquitetura completa, endpoints, regras de negócio
- `SECURITY.md` — auditoria de segurança
- `database/README.md` — schema e decisões de design
- `COMO-ABRIR-EM-OUTRO-PC.txt` — como rodar localmente em outro computador
