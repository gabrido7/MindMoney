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
  // Só definido em produção (Aiven e a maioria dos MySQL gerenciados exigem
  // TLS). Conteúdo do certificado CA em PEM, colado direto como variável de
  // ambiente -- sem isso, db.ts conecta sem TLS (comportamento local de hoje).
  DB_SSL_CA: z.string().optional(),
  JWT_SECRET: z.string().min(16, "JWT_SECRET precisa ter pelo menos 16 caracteres"),
  // Vida curta de propósito: este é só o access token. Sessão longa vem do
  // refresh token (REFRESH_TOKEN_DAYS), renovado silenciosamente pelo
  // frontend -- ver utils/refreshToken.ts.
  JWT_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_DAYS: z.coerce.number().default(30),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  // Limites por IP a cada 15 min (middlewares/rateLimit.ts). Dimensionados
  // para um laboratório inteiro (~20 PCs) saindo pelo mesmo IP público da
  // escola; ajustáveis no painel do Render sem mexer no código.
  RATE_LIMIT_API_MAX: z.coerce.number().int().positive().default(6000),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().int().positive().default(200),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error({ issues: parsed.error.flatten().fieldErrors }, "Variáveis de ambiente inválidas");
  process.exit(1);
}

export const env = parsed.data;
