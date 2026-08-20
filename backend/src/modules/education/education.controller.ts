import type { Request, Response } from "express";
import { educationService } from "./education.service";

export const educationController = {
  async list(req: Request, res: Response) {
    const progress = await educationService.list(req.userId!);
    res.json({ progress });
  },

  async upsert(req: Request, res: Response) {
    const { lessonId } = req.params;
    const progress = await educationService.upsert(req.userId!, lessonId, req.body);
    res.json({ progress });
  },

  async remove(req: Request, res: Response) {
    const { lessonId } = req.params;
    await educationService.remove(req.userId!, lessonId);
    res.status(204).send();
  },
};
