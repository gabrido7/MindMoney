import pino from "pino";

const isTest = process.env.NODE_ENV === "test";
const isProduction = process.env.NODE_ENV === "production";

/**
 * Log estruturado real -- antes disso o backend só tinha console.error no
 * handler de erro global e dois console.log no bootstrap, sem log de
 * acesso, latência ou taxa de erro nenhum. Nível "silent" em teste (não
 * "info" com transporte desligado) para não sujar a saída do vitest nem
 * pagar o custo de serialização à toa.
 */
export const logger = pino({
  level: isTest ? "silent" : (process.env.LOG_LEVEL ?? "info"),
  transport:
    !isTest && !isProduction
      ? { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss", ignore: "pid,hostname" } }
      : undefined,
});
