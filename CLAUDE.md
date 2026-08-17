# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then production-build with Vite
- `npm run lint` — run ESLint over the whole project
- `npm run preview` — serve the production build locally

There is no test runner configured in this project (no test files, no test script in `package.json`).

## Architecture

This is a client-only React + TypeScript + Vite SPA (Tailwind CSS for styling, recharts for charts). There is no backend — all data lives in `localStorage`.

**Almost the entire application lives in one component: `src/pages/Dashboard.tsx`.** The render chain is `main.tsx` → `App.tsx` → `Dashboard.tsx`, and `App.tsx` renders nothing but `<Dashboard />`. Dashboard owns all state, all derived/aggregated data, and all UI for the app:
- Transaction CRUD (add/edit/delete), stored in the `transactions` state array
- Category → subcategory mapping (`subcategoriesMap`) and per-category/subcategory color maps, all hardcoded in this file
- Month filtering, month-over-month comparison, and "financial evolution" time series (derived with `.reduce`/`.filter` over `transactions` on every render, not memoized)
- Saving-goal progress bar and overspend alerting (`alertPercent` threshold), plus simple rule-based "insight" suggestions (`getSuggestion`, `generateSuggestion`)
- Dark mode toggle
- The pie/line charts (via `recharts`) and the transaction form/list UI

Persistence is three separate `localStorage` keys, each synced via its own `useEffect`: `transactions`, `savingGoal`, `theme`. There is no schema/migration handling — reads do a raw `JSON.parse` of whatever is stored.

**Orphaned/unwired code** — present in `src/` but not reachable from `App.tsx`, so don't assume they're part of the live app without checking:
- `src/components/Navbar.tsx` — uses `react-router-dom`'s `Link`, but no `<Router>`/routes are set up anywhere and `Navbar` is never rendered.
- `src/components/Saldo.tsx` and `src/types/Transaction.ts` — a separate, simpler `Transaction` shape (`descricao`/`valor`/`tipo`/`data`) than the one defined inline in `Dashboard.tsx` (`description`/`amount`/`type`/`date`/`category`/`subcategory`). These two `Transaction` shapes are not interchangeable.
- `react-router-dom` and the `Navbar` suggest multi-page routing was intended but never wired in; if adding routes, `App.tsx` is the place to introduce a `<Router>`.

Domain/UI text (categories, labels, currency formatting) is Brazilian Portuguese and BRL (`toLocaleString("pt-BR", { style: "currency", currency: "BRL" })`) — keep new user-facing strings and formatting consistent with that locale unless told otherwise.
