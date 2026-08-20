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
import { goalsRouter } from "./modules/goals/goals.routes";
import { objectivesRouter } from "./modules/objectives/objectives.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { scoreRouter } from "./modules/score/score.routes";
import { notificationsRouter } from "./modules/notifications/notifications.routes";
import { insightsRouter } from "./modules/insights/insights.routes";
import { newsletterRouter } from "./modules/newsletter/newsletter.routes";
import { educationRouter } from "./modules/education/education.routes";
import { gamificationRouter } from "./modules/gamification/gamification.routes";

export const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(requestLogger);
}
app.use(helmet());
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

app.use("/api", apiRateLimit);

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/objectives", objectivesRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/score", scoreRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/education", educationRouter);
app.use("/api/gamification", gamificationRouter);

app.use(notFoundHandler);
app.use(errorHandler);
