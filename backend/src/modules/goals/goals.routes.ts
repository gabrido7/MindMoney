import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { goalsController } from "./goals.controller";
import { goalBodySchema, goalUpdateSchema } from "./goals.validation";

export const goalsRouter = Router();

goalsRouter.use(requireAuth);
goalsRouter.get("/", asyncHandler(goalsController.list));
goalsRouter.post("/", validate(goalBodySchema), asyncHandler(goalsController.create));
goalsRouter.put("/:id", validate(goalUpdateSchema), asyncHandler(goalsController.update));
goalsRouter.delete("/:id", asyncHandler(goalsController.remove));
