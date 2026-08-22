# Mind Money

Plataforma de gestão e inteligência financeira pessoal: transações, categorias,
metas de economia, objetivos de longo prazo, score financeiro, relatórios,
notificações e insights, educação financeira gamificada (trilhas, XP,
conquistas), calculadoras financeiras e busca — tudo calculado a partir de
dados reais, sem mock em nenhuma camada.

Três partes, cada uma com sua própria documentação técnica:

```
Frontend (React/TS/Vite)  ──HTTP/JSON──▶  Backend (Node/Express/TS)  ──SQL──▶  MySQL/MariaDB
      src/                                      backend/                        database/
```

- **[DOCUMENTATION.md](DOCUMENTATION.md)** — arquitetura completa, endpoints, regras de negócio, testes.
- **[SECURITY.md](SECURITY.md)** — auditoria de segurança: o que foi verificado e o que foi corrigido.
- **[backend/README.md](backend/README.md)** — estrutura do backend.
- **[database/README.md](database/README.md)** — schema, decisões de design, diagrama ER.

## Como rodar localmente

Pré-requisito: um MySQL/MariaDB rodando (local ou via XAMPP).

```bash
# 1. Banco de dados
mysql -u root --default-character-set=utf8mb4 < database/schema.sql
mysql -u root --default-character-set=utf8mb4 < database/seed.sql
mysql -u root --default-character-set=utf8mb4 < database/create_app_user.sql
for f in database/migrations/*.sql; do
  mysql -u root --default-character-set=utf8mb4 < "$f"
done

# 2. Backend (porta 3001)
cd backend
npm install
cp .env.example .env    # ajuste DB_PASSWORD e JWT_SECRET
npm run dev

# 3. Frontend (porta 5173), num segundo terminal, na raiz do projeto
npm install
npm run dev
```

No Windows/PowerShell, troque `mysql -u root < file.sql` por
`Get-Content -Raw -Encoding UTF8 file.sql | mysql -u root` — sem o
`-Encoding UTF8`, os nomes de categoria acentuados chegam corrompidos.

## Comandos

**Frontend** (raiz do projeto):

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento Vite |
| `npm run build` | Type-check (`tsc -b`) + build de produção |
| `npm run lint` | ESLint |
| `npm test` | Vitest — funções puras de cálculo |
| `npm run preview` | Serve o build de produção localmente |

**Backend** (`backend/`):

| Comando | O que faz |
|---|---|
| `npm run dev` | `tsx watch` — API em `http://localhost:3001` |
| `npm run build` | Type-check via `tsc` |
| `npm test` | Vitest + Supertest — testes de integração contra o MySQL real (cada teste cria e limpa seus próprios usuários) |

CI (`.github/workflows/ci.yml`) roda os dois em todo push/PR: o job de
backend sobe um MySQL efêmero, aplica schema + seed + migrations e roda
a suíte de testes real contra ele.

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Recharts, react-router-dom |
| Backend | Node.js, Express, TypeScript, mysql2 (queries parametrizadas), zod, jsonwebtoken, bcryptjs, express-rate-limit, helmet, cors, pino |
| Banco | MySQL/MariaDB, InnoDB, utf8mb4 |
| Testes | Vitest (frontend e backend), Supertest (API) |

Nenhuma dependência de IA/LLM externa está configurada ou em uso — os
recursos "inteligentes" (score, insights, assistente) são 100%
determinísticos, calculados sobre dados reais. Ver `SECURITY.md` e
`backend/src/modules/insights/insights.service.ts` para o raciocínio
completo.
