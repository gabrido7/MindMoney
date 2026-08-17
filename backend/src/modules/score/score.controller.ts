import type { Request, Response } from "express";
import { scoreService } from "./score.service";

export const scoreController = {
  async get(req: Request, res: Response) {
    const month = typeof req.query.month === "string" ? req.query.month : undefined;
    const result = await scoreService.calculate(req.userId!, month);
    res.json(result);
  },
};
