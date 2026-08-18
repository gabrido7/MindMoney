import type { Request, Response } from "express";
import { transactionsService } from "./transactions.service";

export const transactionsController = {
  async list(req: Request, res: Response) {
    const result = await transactionsService.list(req.userId!, req.query as never);
    res.json(result);
  },

  async create(req: Request, res: Response) {
    const transaction = await transactionsService.create(req.userId!, req.body);
    res.status(201).json({ transaction });
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const transaction = await transactionsService.update(id, req.userId!, req.body);
    res.json({ transaction });
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await transactionsService.delete(id, req.userId!);
    res.status(204).send();
  },

  async importBatch(req: Request, res: Response) {
    const result = await transactionsService.importBatch(req.userId!, req.body.transactions);
    res.status(201).json(result);
  },
};
