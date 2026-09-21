import type { Request, Response } from "express";
import { accountsService } from "./accounts.service";

export const accountsController = {
  async list(req: Request, res: Response) {
    const accounts = await accountsService.list(req.userId!);
    res.json({ accounts });
  },

  async create(req: Request, res: Response) {
    const account = await accountsService.create(req.userId!, req.body);
    res.status(201).json({ account });
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await accountsService.remove(req.userId!, id);
    res.status(204).send();
  },
};
