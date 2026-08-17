import type { Request, Response } from "express";
import { dashboardService } from "./dashboard.service";

export const dashboardController = {
  async get(req: Request, res: Response) {
    const month = typeof req.query.month === "string" ? req.query.month : undefined;
    const result = await dashboardService.build(req.userId!, month);
    res.json(result);
  },
};
