import type { Request, Response } from "express";
import { insightsService } from "./insights.service";

export const insightsController = {
  async list(req: Request, res: Response) {
    const month = typeof req.query.month === "string" ? req.query.month : undefined;
    const insights = await insightsService.generate(req.userId!, month);
    res.json({ insights });
  },

  async ask(req: Request, res: Response) {
    const { question, month } = req.body as { question: string; month?: string };
    const answer = await insightsService.answerQuestion(req.userId!, question, month);
    res.json({ answer });
  },
};
