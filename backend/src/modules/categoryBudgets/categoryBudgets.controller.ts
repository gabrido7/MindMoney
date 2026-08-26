import type { Request, Response } from "express";
import { categoryBudgetsService } from "./categoryBudgets.service";
import { currentMonth } from "../../utils/month";

export const categoryBudgetsController = {
  async list(req: Request, res: Response) {
    const month = (req.query.month as string | undefined) ?? currentMonth();
    const budgets = await categoryBudgetsService.list(req.userId!, month);
    res.json({ budgets });
  },

  async upsert(req: Request, res: Response) {
    const categoryId = Number(req.params.categoryId);
    const { month, amount } = req.body;
    const budget = await categoryBudgetsService.upsert(req.userId!, categoryId, month, amount);
    res.json({ budget });
  },

  async remove(req: Request, res: Response) {
    const categoryId = Number(req.params.categoryId);
    const month = req.query.month as string;
    await categoryBudgetsService.remove(req.userId!, categoryId, month);
    res.status(204).send();
  },
};
