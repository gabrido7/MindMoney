import type { Request, Response } from "express";
import { usersService } from "./users.service";

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
};
