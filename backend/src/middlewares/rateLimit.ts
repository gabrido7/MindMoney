import rateLimit from "express-rate-limit";

// desativado durante os testes automatizados (etapa 17), que fazem muitos
// registros/logins de propósito — não é o cenário de força bruta real que
// esse limite existe pra barrar.
const skipInTests = () => process.env.NODE_ENV === "test";

/** Login/cadastro: alvo típico de força bruta e spam de contas. */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 30, // ainda inviabiliza força bruta de senha (30 tentativas/15min por IP)
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTests,
  message: { error: { message: "Muitas tentativas. Tente novamente em alguns minutos." } },
});

/** Defesa geral de baixo custo para o resto da API autenticada. */
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInTests,
  message: { error: { message: "Muitas requisições. Tente novamente em alguns minutos." } },
});
