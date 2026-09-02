import type { Request, Response } from "express";
import { debtAdviceService } from "./debtAdvice.service";

export const debtAdviceController = {
  async list(req: Request, res: Response) {
    const advice = await debtAdviceService.generate(req.userId!);
    res.json({ advice });
  },
};
