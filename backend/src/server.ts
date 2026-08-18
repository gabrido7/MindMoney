import { app } from "./app";
import { env } from "./config/env";
import { pool } from "./config/db";
import { logger } from "./utils/logger";

async function main() {
  await pool.query("SELECT 1"); // falha rápido se o banco não estiver acessível

  app.listen(env.PORT, () => {
    logger.info(`Mind Money API rodando em http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  logger.error({ err }, "Falha ao iniciar o servidor");
  process.exit(1);
});
