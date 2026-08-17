import type { Request, Response } from "express";
import { usersService } from "./users.service";

export const usersController = {
  async me(req: Request, res: Response) {
    const user = await usersService.getById(req.userId!);
    res.json({ user });
  },
};
