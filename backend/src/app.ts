import path from "node:path";
import fs from "node:fs";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { pool } from "./config/db";
import { logger } from "./utils/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import { apiRateLimit } from "./middlewares/rateLimit";
import { requestLogger } from "./middlewares/requestLogger";

import { authRouter } from "./modules/auth/auth.routes";
import { usersRouter } from "./modules/users/users.routes";
import { transactionsRouter } from "./modules/transactions/transactions.routes";
import { categoriesRouter } from "./modules/categories/categories.routes";
import { categoryBudgetsRouter } from "./modules/categoryBudgets/categoryBudgets.routes";
import { debtsRouter } from "./modules/debts/debts.routes";
import { debtAdviceRouter } from "./modules/debtAdvice/debtAdvice.routes";
import { assetsRouter } from "./modules/assets/assets.routes";
import { accountsRouter } from "./modules/accounts/accounts.routes";
import { netWorthRouter } from "./modules/netWorth/netWorth.routes";
import { objectivesRouter } from "./modules/objectives/objectives.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { scoreRouter } from "./modules/score/score.routes";
import { notificationsRouter } from "./modules/notifications/notifications.routes";
import { insightsRouter } from "./modules/insights/insights.routes";
import { newsletterRouter } from "./modules/newsletter/newsletter.routes";
import { educationRouter } from "./modules/education/education.routes";
import { gamificationRouter } from "./modules/gamification/gamification.routes";
import { favoritesRouter } from "./modules/favorites/favorites.routes";

export const app = express();

// No Render, toda requisição chega pelo balanceador de carga deles. Sem isso,
// req.ip é o IP do balanceador e o rate limit trata todos os visitantes como
// um só. Confia só no proxy imediato (1 salto), que não pode ser forjado pelo
// cliente.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

if (process.env.NODE_ENV !== "test") {
  app.use(requestLogger);
}
// A CSP padrão do helmet ("default-src 'self'") bloquearia o CSS/fonte do
// Google Fonts que o index.html carrega externamente -- só passou
// despercebido até agora porque em dev o frontend nunca foi servido por
// este processo (Vite roda separado, sem helmet no meio). Libera
// explicitamente os dois domínios usados, mantém o resto do padrão.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
      },
    },
  })
);
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

/**
 * Antes disso era só {status: "ok"} estático -- não provava nada sobre o
 * estado real do sistema. Agora testa a conexão de verdade com o banco
 * (a mesma dependência que faz o processo inteiro falhar no boot, ver
 * server.ts) e devolve 503 se ela estiver fora, em vez de mentir que
 * está tudo bem.
 */
app.get("/health", async (_req, res) => {
  const startedAt = Date.now();
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      db: { status: "ok", latencyMs: Date.now() - startedAt },
    });
  } catch (err) {
    logger.error({ err }, "Health check: banco inacessível");
    res.status(503).json({
      status: "degraded",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      db: { status: "error" },
    });
  }
});

// Fotos de perfil: servidas como arquivo estático, não como binário no
// banco. crossOriginResourcePolicy custom porque o helmet() acima já setou
// "same-origin" por padrão, o que bloquearia o <img> do frontend (porta
// 5173) de carregar um arquivo servido na porta 3001 -- não é uma questão
// de CORS (imagens em <img> não passam por preflight), é esse header
// específico que precisa liberar "cross-origin" só pra esta rota.
app.use(
  "/uploads",
  (_req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "..", "uploads"))
);

app.use("/api", apiRateLimit);

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/category-budgets", categoryBudgetsRouter);
app.use("/api/debts", debtsRouter);
app.use("/api/debt-advice", debtAdviceRouter);
app.use("/api/assets", assetsRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/net-worth", netWorthRouter);
app.use("/api/objectives", objectivesRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/score", scoreRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/education", educationRouter);
app.use("/api/gamification", gamificationRouter);
app.use("/api/favorites", favoritesRouter);

/**
 * Serve o build de produção do frontend (dist/ na raiz do repo, gerado por
 * `npm run build`) direto do mesmo processo/porta do backend -- só pra
 * demonstração (ex: expor via túnel público numa apresentação), não é o
 * modo de desenvolvimento normal (Vite roda separado, porta 5173). Mesma
 * origem pro front e pro back elimina CORS por completo aqui, o que
 * importa de verdade quando o acesso vem de um domínio de túnel que muda a
 * cada execução. __dirname aqui é backend/src (rodando via tsx, não
 * compilado) -- "../../dist" sobe pra backend/, depois pra raiz do repo.
 * Só ativa se a pasta existir, pra não quebrar o dev normal quando dist/
 * não foi gerado ainda.
 */
const frontendDist = path.join(__dirname, "..", "..", "dist");
if (fs.existsSync(path.join(frontendDist, "index.html"))) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);
