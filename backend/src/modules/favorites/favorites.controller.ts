import type { Request, Response } from "express";
import { favoritesService } from "./favorites.service";
import type { FavoriteBody, FavoriteParams } from "./favorites.validation";

export const favoritesController = {
  async list(req: Request, res: Response) {
    const favorites = await favoritesService.list(req.userId!);
    res.json({ favorites });
  },

  async add(req: Request, res: Response) {
    const { contentType, contentId } = req.body as FavoriteBody;
    await favoritesService.add(req.userId!, contentType, contentId);
    res.status(201).json({ contentType, contentId });
  },

  async remove(req: Request, res: Response) {
    const { contentType, contentId } = req.params as unknown as FavoriteParams;
    await favoritesService.remove(req.userId!, contentType, contentId);
    res.status(204).send();
  },
};
