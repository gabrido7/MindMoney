# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Frontend (repo root):
- `npm run dev` — Vite dev server (default `http://localhost:5173`)
- `npm run build` — type-check (`tsc -b`) then production-build with Vite
- `npm run lint` — ESLint over the whole project
- `npm test` — Vitest unit tests (`src/**/*.test.ts`, pure calculation functions only)
- `npm run preview` — serve the production build locally

Backend (`backend/`):
- `npm run dev` — `tsx watch src/server.ts`, API on `http://localhost:3001`
- `npm run build` — `tsc -p tsconfig.json`
- `npm test` — Vitest + Supertest integration tests (`backend/tests/*.test.ts`), hit the real dev MySQL database directly (no mocking); each test creates its own throwaway user(s) and cleans up after itself

Database (`database/`): `schema.sql` + `seed.sql` are the base; `migrations/*.sql` are applied in order on top. Apply with `mysql -u root --default-character-set=utf8mb4 < file.sql` (use `Get-Content -Raw -Encoding UTF8 | mysql ...` on Windows/PowerShell — plain piping without `-Encoding UTF8` has corrupted accented characters before).

## Architecture

Three parts: React+TypeScript+Vite frontend (`src/`), Node+Express+TypeScript backend (`backend/`), MySQL/MariaDB database (`database/`). No mocks, no fake data anywhere — every feature is wired to the real API and real database.

**Frontend** — routed SPA (`react-router-dom`), `App.tsx` wires `AuthLayout` (login/cadastro) and `AppLayout` (protected pages, top nav) via `ProtectedRoute`. `AuthContext` holds the session; `services/*.ts` are thin typed wrappers around each backend module, all going through the shared `services/api.ts` (base URL from `VITE_API_URL`, Bearer token attached automatically, 401 anywhere clears the session). Pages: Dashboard (the original, most-developed page — preserved intentionally across the localStorage→API migration, same UI/behavior, different data source), Perfil, Metas, Relatórios, Educação Financeira (static content, no backend needed), Login/Cadastro. `src/types/index.ts` is the domain model the Dashboard's calculation utils operate on; `src/types/api.ts` is the literal API response shape (different, e.g. API includes joined `category_name`) — hooks in `src/features/*/hooks` adapt between the two.

**Backend** — layered per module (`backend/src/modules/<name>/{routes,controller,service,repository,validation}.ts`): routes wire `requireAuth` + zod `validate()` + controller; service holds business rules and ownership checks; repository is the only layer that touches SQL (always parameterized). Every query is scoped by `user_id` from the JWT — never trust an id from the request body. `config/db.ts` connects as `mindmoney_app` (least-privilege MySQL user, not root). `middlewares/rateLimit.ts` guards `/api/auth/*` (skipped when `NODE_ENV=test`).

**Database** — MySQL/MariaDB, InnoDB, utf8mb4, normalized. `categories`/`subcategories` are per-user (not global) with soft-delete (`archived_at`) so deleting a category never breaks old transactions' history; `category_templates`/`subcategory_templates` are the dealer's-choice defaults copied into a new user's own categories at registration via the `sp_seed_user_categories` stored procedure. `transactions.category_id` is `ON DELETE RESTRICT` on purpose — deleting a user account requires deleting their transactions first, then the rest cascades (see `database/README.md`). `financial_score_history` is a cache that gets recalculated (upserted) every time that month's score is requested, not an immutable ledger.

**Score, insights and notifications are computed, not stored as "the truth"**: financial score (`backend/src/modules/score`) is a 4-component deterministic formula recalculated on read; the "assistant" (`backend/src/modules/insights`) is 100% rule-based (no AI API key is configured in this project — don't invent one; see `SECURITY.md` for the reasoning) with a small pattern-matched Q&A that admits when it doesn't understand a question instead of fabricating an answer; notifications are a real side effect of transaction/goal mutations (limit exceeded, goal achieved), not manually created.

See `SECURITY.md` for the security audit and its findings/fixes, and `database/README.md` for schema design rationale.
