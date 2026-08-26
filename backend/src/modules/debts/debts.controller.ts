import type { Request, Response } from "express";
import { debtsService } from "./debts.service";

export const debtsController = {
  async list(req: Request, res: Response) {
    const debts = await debtsService.list(req.userId!);
    res.json({ debts });
  },

  async create(req: Request, res: Response) {
    const debt = await debtsService.create(req.userId!, req.body);
    res.status(201).json({ debt });
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await debtsService.remove(req.userId!, id);
    res.status(204).send();
  },
};
