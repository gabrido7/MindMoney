import rateLimit from "express-rate-limit";
import { env } from "../config/env";

// desativado durante os testes automatizados (etapa 17), que fazem muitos
// registros/logins de propósito — não é o cenário de força bruta real que
// esse limite existe pra barrar.
const skipInTests = () => process.env.NODE_ENV === "test";

/** Login/cadastro: alvo típico de força bruta e spam de contas. */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  // Padrão 200/15min por IP: comporta um laboratório inteiro logando pelo
  // mesmo IP da escola e ainda inviabiliza força bruta de senha.
  limit: env.RATE_LIMIT_AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTests,
  message: { error: { message: "Muitas tentativas. Tente novamente em alguns minutos." } },
});

/** Defesa geral de baixo custo para o resto da API autenticada. */
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.RATE_LIMIT_API_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTests,
  message: { error: { message: "Muitas requisições. Tente novamente em alguns minutos." } },
});
