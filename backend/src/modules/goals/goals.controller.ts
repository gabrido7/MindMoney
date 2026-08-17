import type { Request, Response } from "express";
import { goalsService } from "./goals.service";

export const goalsController = {
  async list(req: Request, res: Response) {
    const month = typeof req.query.month === "string" ? req.query.month : undefined;
    const goals = await goalsService.list(req.userId!, month);
    res.json({ goals });
  },

  async create(req: Request, res: Response) {
    const goal = await goalsService.create(req.userId!, req.body);
    res.status(201).json({ goal });
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const goal = await goalsService.update(id, req.userId!, req.body);
    res.json({ goal });
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await goalsService.delete(id, req.userId!);
    res.status(204).send();
  },
};
