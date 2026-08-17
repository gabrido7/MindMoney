import { app } from "./app";
import { env } from "./config/env";
import { pool } from "./config/db";

async function main() {
  await pool.query("SELECT 1"); // falha rápido se o banco não estiver acessível

  app.listen(env.PORT, () => {
    console.log(`Mind Money API rodando em http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("Falha ao iniciar o servidor:", err);
  process.exit(1);
});
