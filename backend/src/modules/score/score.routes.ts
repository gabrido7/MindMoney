import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { scoreController } from "./score.controller";
import { scoreHistoryQuerySchema, scoreQuerySchema } from "./score.validation";

export const scoreRouter = Router();

scoreRouter.use(requireAuth);
scoreRouter.get("/", validate(scoreQuerySchema, "query"), asyncHandler(scoreController.get));
scoreRouter.get(
  "/history",
  validate(scoreHistoryQuerySchema, "query"),
  asyncHandler(scoreController.history)
);
