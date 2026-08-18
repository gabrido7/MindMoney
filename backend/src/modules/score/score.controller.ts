import type { Request, Response } from "express";
import { scoreService } from "./score.service";

export const scoreController = {
  async get(req: Request, res: Response) {
    const month = typeof req.query.month === "string" ? req.query.month : undefined;
    const result = await scoreService.calculate(req.userId!, month);
    res.json(result);
  },

  async history(req: Request, res: Response) {
    const months = (req.query.months as number | undefined) ?? 6;
    const result = await scoreService.history(req.userId!, months);
    res.json({ history: result });
  },
};
