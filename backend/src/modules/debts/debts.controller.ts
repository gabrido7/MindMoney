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

  async listAllPayments(req: Request, res: Response) {
    const payments = await debtsService.listAllPayments(req.userId!);
    res.json({ payments });
  },

  async listPayments(req: Request, res: Response) {
    const debtId = Number(req.params.id);
    const payments = await debtsService.listPayments(req.userId!, debtId);
    res.json({ payments });
  },

  async addPayment(req: Request, res: Response) {
    const debtId = Number(req.params.id);
    const debt = await debtsService.addPayment(req.userId!, debtId, req.body);
    res.status(201).json({ debt });
  },

  async removePayment(req: Request, res: Response) {
    const debtId = Number(req.params.id);
    const paymentId = Number(req.params.paymentId);
    const debt = await debtsService.removePayment(req.userId!, debtId, paymentId);
    res.json({ debt });
  },

  async updatePayment(req: Request, res: Response) {
    const debtId = Number(req.params.id);
    const paymentId = Number(req.params.paymentId);
    const debt = await debtsService.updatePayment(req.userId!, debtId, paymentId, req.body);
    res.json({ debt });
  },
};
