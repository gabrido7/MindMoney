import type { Request, Response } from "express";
import { notificationsService } from "./notifications.service";

export const notificationsController = {
  async list(req: Request, res: Response) {
    const notifications = await notificationsService.list(req.userId!);
    res.json({ notifications });
  },

  async markRead(req: Request, res: Response) {
    const id = Number(req.params.id);
    const notification = await notificationsService.markAsRead(id, req.userId!);
    res.json({ notification });
  },
};
