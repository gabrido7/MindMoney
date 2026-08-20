import type { Request, Response } from "express";
import { gamificationService } from "./gamification.service";

export const gamificationController = {
  async summary(req: Request, res: Response) {
    const summary = await gamificationService.getSummary(req.userId!);
    res.json(summary);
  },
};
