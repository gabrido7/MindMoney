import type { Request, Response } from "express";
import { categoriesService } from "./categories.service";

export const categoriesController = {
  async list(req: Request, res: Response) {
    const categories = await categoriesService.listForUser(req.userId!);
    res.json({ categories });
  },

  async subcategories(req: Request, res: Response) {
    const categoryId = Number(req.params.id);
    const subcategories = await categoriesService.listSubcategories(categoryId, req.userId!);
    res.json({ subcategories });
  },
};
