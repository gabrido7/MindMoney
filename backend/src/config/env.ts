import "dotenv/config";
import { z } from "zod";
import { logger } from "../utils/logger";

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().default(3306),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string(),
  JWT_SECRET: z.string().min(16, "JWT_SECRET precisa ter pelo menos 16 caracteres"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error({ issues: parsed.error.flatten().fieldErrors }, "Variáveis de ambiente inválidas");
  process.exit(1);
}

export const env = parsed.data;
