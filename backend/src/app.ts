import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import { apiRateLimit } from "./middlewares/rateLimit";
import { requestLogger } from "./middlewares/requestLogger";

import { authRouter } from "./modules/auth/auth.routes";
import { usersRouter } from "./modules/users/users.routes";
import { transactionsRouter } from "./modules/transactions/transactions.routes";
import { categoriesRouter } from "./modules/categories/categories.routes";
import { goalsRouter } from "./modules/goals/goals.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { scoreRouter } from "./modules/score/score.routes";
import { notificationsRouter } from "./modules/notifications/notifications.routes";
import { insightsRouter } from "./modules/insights/insights.routes";
import { newsletterRouter } from "./modules/newsletter/newsletter.routes";

export const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(requestLogger);
}
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", apiRateLimit);

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/score", scoreRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/newsletter", newsletterRouter);

app.use(notFoundHandler);
app.use(errorHandler);
