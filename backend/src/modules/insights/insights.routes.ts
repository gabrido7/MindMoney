import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { insightsController } from "./insights.controller";
import { askQuestionSchema, insightsQuerySchema } from "./insights.validation";

export const insightsRouter = Router();

insightsRouter.use(requireAuth);
insightsRouter.get("/", validate(insightsQuerySchema, "query"), asyncHandler(insightsController.list));
insightsRouter.post("/ask", validate(askQuestionSchema), asyncHandler(insightsController.ask));
