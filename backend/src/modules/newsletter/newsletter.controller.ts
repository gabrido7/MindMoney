import type { Request, Response } from "express";
import { newsletterService } from "./newsletter.service";

export const newsletterController = {
  async subscribe(req: Request, res: Response) {
    const { name, email } = req.body as { name: string; email: string };
    const result = await newsletterService.subscribe(name, email);
    res.status(201).json(result);
  },
};
