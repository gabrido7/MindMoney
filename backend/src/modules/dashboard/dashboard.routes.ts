import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { dashboardController } from "./dashboard.controller";
import { scoreQuerySchema } from "../score/score.validation";
import { dashboardRangeQuerySchema } from "./dashboard.validation";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.get("/range", validate(dashboardRangeQuerySchema, "query"), asyncHandler(dashboardController.range));
dashboardRouter.get("/", validate(scoreQuerySchema, "query"), asyncHandler(dashboardController.get));
