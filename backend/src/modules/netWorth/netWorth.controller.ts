import type { Request, Response } from "express";
import { netWorthService } from "./netWorth.service";

export const netWorthController = {
  async history(req: Request, res: Response) {
    const months = req.query.months ? Number(req.query.months) : undefined;
    const history = await netWorthService.getHistory(req.userId!, months);
    res.json({ history });
  },
};
