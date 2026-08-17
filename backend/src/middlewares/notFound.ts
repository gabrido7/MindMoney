import type { Request, Response } from "express";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: { message: `Rota não encontrada: ${req.method} ${req.originalUrl}` } });
}
