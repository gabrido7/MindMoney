import type { Request, Response } from "express";
import { assetsService } from "./assets.service";

export const assetsController = {
  async list(req: Request, res: Response) {
    const assets = await assetsService.list(req.userId!);
    res.json({ assets });
  },

  async create(req: Request, res: Response) {
    const result = await assetsService.create(req.userId!, req.body);
    res.status(201).json(result);
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await assetsService.remove(req.userId!, id);
    res.status(204).send();
  },

  async listAllValueUpdates(req: Request, res: Response) {
    const updates = await assetsService.listAllValueUpdates(req.userId!);
    res.json({ updates });
  },

  async listValueUpdates(req: Request, res: Response) {
    const assetId = Number(req.params.id);
    const updates = await assetsService.listValueUpdates(req.userId!, assetId);
    res.json({ updates });
  },

  async addValueUpdate(req: Request, res: Response) {
    const assetId = Number(req.params.id);
    const result = await assetsService.addValueUpdate(req.userId!, assetId, req.body);
    res.status(201).json(result);
  },

  async updateValueUpdate(req: Request, res: Response) {
    const assetId = Number(req.params.id);
    const updateId = Number(req.params.updateId);
    const result = await assetsService.updateValueUpdate(req.userId!, assetId, updateId, req.body);
    res.json(result);
  },

  async removeValueUpdate(req: Request, res: Response) {
    const assetId = Number(req.params.id);
    const updateId = Number(req.params.updateId);
    const result = await assetsService.removeValueUpdate(req.userId!, assetId, updateId);
    res.json(result);
  },
};
