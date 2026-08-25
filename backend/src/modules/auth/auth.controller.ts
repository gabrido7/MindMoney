import type { Request, Response } from "express";
import { authService } from "./auth.service";

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body, req.get("user-agent") ?? null);
    res.status(201).json(result);
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body, req.get("user-agent") ?? null);
    res.json(result);
  },

  async forgotPassword(req: Request, res: Response) {
    const result = await authService.forgotPassword(req.body);
    res.json(result);
  },

  async resetPassword(req: Request, res: Response) {
    const result = await authService.resetPassword(req.body);
    res.json(result);
  },

  async refresh(req: Request, res: Response) {
    const result = await authService.refresh(req.body, req.get("user-agent") ?? null);
    res.json(result);
  },

  async logout(req: Request, res: Response) {
    await authService.logout(req.body);
    res.status(204).send();
  },
};
