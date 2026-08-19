import type { Request, Response } from "express";
import { objectivesService } from "./objectives.service";

export const objectivesController = {
  async list(req: Request, res: Response) {
    const objectives = await objectivesService.list(req.userId!);
    res.json({ objectives });
  },

  async summary(req: Request, res: Response) {
    const summary = await objectivesService.summary(req.userId!);
    res.json(summary);
  },

  async create(req: Request, res: Response) {
    const objective = await objectivesService.create(req.userId!, req.body);
    res.status(201).json({ objective });
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const objective = await objectivesService.update(id, req.userId!, req.body);
    res.json({ objective });
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await objectivesService.delete(id, req.userId!);
    res.status(204).send();
  },

  async listContributions(req: Request, res: Response) {
    const objectiveId = Number(req.params.id);
    const contributions = await objectivesService.listContributions(objectiveId, req.userId!);
    res.json({ contributions });
  },

  async addContribution(req: Request, res: Response) {
    const objectiveId = Number(req.params.id);
    const objective = await objectivesService.addContribution(objectiveId, req.userId!, req.body);
    res.status(201).json({ objective });
  },

  async removeContribution(req: Request, res: Response) {
    const objectiveId = Number(req.params.id);
    const contributionId = Number(req.params.contributionId);
    const objective = await objectivesService.removeContribution(objectiveId, contributionId, req.userId!);
    res.json({ objective });
  },
};
