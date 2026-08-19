import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { objectivesController } from "./objectives.controller";
import { objectiveBodySchema, contributionBodySchema } from "./objectives.validation";

export const objectivesRouter = Router();

objectivesRouter.use(requireAuth);
objectivesRouter.get("/summary", asyncHandler(objectivesController.summary));
objectivesRouter.get("/evolution", asyncHandler(objectivesController.evolution));
objectivesRouter.get("/", asyncHandler(objectivesController.list));
objectivesRouter.post("/", validate(objectiveBodySchema), asyncHandler(objectivesController.create));
objectivesRouter.put("/:id", validate(objectiveBodySchema), asyncHandler(objectivesController.update));
objectivesRouter.delete("/:id", asyncHandler(objectivesController.remove));
objectivesRouter.get("/:id/contributions", asyncHandler(objectivesController.listContributions));
objectivesRouter.post(
  "/:id/contributions",
  validate(contributionBodySchema),
  asyncHandler(objectivesController.addContribution)
);
objectivesRouter.delete(
  "/:id/contributions/:contributionId",
  asyncHandler(objectivesController.removeContribution)
);
