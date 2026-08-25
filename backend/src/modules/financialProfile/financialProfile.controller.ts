import type { Request, Response } from "express";
import { financialProfileService } from "./financialProfile.service";

export const financialProfileController = {
  async get(req: Request, res: Response) {
    const profile = await financialProfileService.get(req.userId!);
    res.json({ profile });
  },

  async update(req: Request, res: Response) {
    const profile = await financialProfileService.update(req.userId!, req.body);
    res.json({ profile });
  },
};
