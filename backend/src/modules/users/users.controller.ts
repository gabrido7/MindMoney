import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { hashRefreshToken } from "../../utils/refreshToken";
import { usersService } from "./users.service";
import { authService } from "../auth/auth.service";
import { notificationsService } from "../notifications/notifications.service";
import type { NotificationType } from "../notifications/notifications.repository";

const currentSessionHash = (req: Request): string | null => {
  const raw = req.get("x-refresh-token");
  return raw ? hashRefreshToken(raw) : null;
};

export const usersController = {
  async me(req: Request, res: Response) {
    const user = await usersService.getById(req.userId!);
    res.json({ user });
  },

  async updateProfile(req: Request, res: Response) {
    const user = await usersService.updateProfile(req.userId!, req.body);
    res.json({ user });
  },

  async changePassword(req: Request, res: Response) {
    await usersService.changePassword(req.userId!, req.body);
    res.json({ message: "Senha alterada com sucesso." });
  },

  async deleteAccount(req: Request, res: Response) {
    await usersService.deleteAccount(req.userId!, req.body);
    res.status(204).send();
  },

  async uploadAvatar(req: Request, res: Response) {
    if (!req.file) throw AppError.badRequest("Nenhuma imagem enviada.");
    const user = await usersService.setAvatar(req.userId!, req.file.filename);
    res.json({ user });
  },

  async removeAvatar(req: Request, res: Response) {
    const user = await usersService.removeAvatar(req.userId!);
    res.json({ user });
  },

  async listSessions(req: Request, res: Response) {
    const sessions = await authService.listSessions(req.userId!, currentSessionHash(req));
    res.json({ sessions });
  },

  async revokeSession(req: Request, res: Response) {
    await authService.revokeSession(Number(req.params.id), req.userId!);
    res.status(204).send();
  },

  async revokeOtherSessions(req: Request, res: Response) {
    await authService.revokeOtherSessions(req.userId!, currentSessionHash(req));
    res.status(204).send();
  },

  async getNotificationPreferences(req: Request, res: Response) {
    const preferences = await notificationsService.getPreferences(req.userId!);
    res.json({ preferences });
  },

  async updateNotificationPreference(req: Request, res: Response) {
    const type = req.params.type as NotificationType;
    await notificationsService.updatePreference(req.userId!, type, req.body.enabled);
    const preferences = await notificationsService.getPreferences(req.userId!);
    res.json({ preferences });
  },
};
