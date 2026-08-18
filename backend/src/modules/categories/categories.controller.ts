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

  async create(req: Request, res: Response) {
    const category = await categoriesService.create(req.userId!, req.body);
    res.status(201).json({ category });
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await categoriesService.archive(id, req.userId!);
    res.status(204).send();
  },

  async createSubcategory(req: Request, res: Response) {
    const categoryId = Number(req.params.id);
    const subcategory = await categoriesService.createSubcategory(categoryId, req.userId!, req.body);
    res.status(201).json({ subcategory });
  },

  async removeSubcategory(req: Request, res: Response) {
    const categoryId = Number(req.params.id);
    const subcategoryId = Number(req.params.subId);
    await categoriesService.archiveSubcategory(categoryId, subcategoryId, req.userId!);
    res.status(204).send();
  },
};
