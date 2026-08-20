import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { gamificationController } from "./gamification.controller";

export const gamificationRouter = Router();

gamificationRouter.use(requireAuth);
gamificationRouter.get("/summary", asyncHandler(gamificationController.summary));
