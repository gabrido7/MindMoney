import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

interface MysqlError extends Error {
  code?: string;
  errno?: number;
}

const MYSQL_STATUS_BY_CODE: Record<string, { status: number; message: string }> = {
  ER_DUP_ENTRY: { status: 409, message: "Já existe um registro com esses dados." },
  ER_NO_REFERENCED_ROW_2: { status: 400, message: "Referência inválida (recurso relacionado não existe)." },
  ER_ROW_IS_REFERENCED_2: { status: 409, message: "Não é possível excluir: existem registros dependentes." },
  ER_CHECK_CONSTRAINT_VIOLATED: { status: 400, message: "Dados inválidos para um dos campos enviados." },
};

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: { message: err.message } });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Dados inválidos.",
        details: err.flatten().fieldErrors,
      },
    });
  }

  const mysqlErr = err as MysqlError;
  if (mysqlErr?.code && MYSQL_STATUS_BY_CODE[mysqlErr.code]) {
    const mapped = MYSQL_STATUS_BY_CODE[mysqlErr.code];
    return res.status(mapped.status).json({ error: { message: mapped.message } });
  }

  logger.error({ err, method: req.method, url: req.originalUrl }, "Erro não tratado");
  return res.status(500).json({ error: { message: "Erro interno do servidor." } });
}
