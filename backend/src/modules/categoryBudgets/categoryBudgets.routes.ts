import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { categoryBudgetsController } from "./categoryBudgets.controller";
import {
  categoryBudgetBodySchema,
  categoryBudgetDeleteQuerySchema,
  categoryBudgetListQuerySchema,
} from "./categoryBudgets.validation";

export const categoryBudgetsRouter = Router();

categoryBudgetsRouter.use(requireAuth);
categoryBudgetsRouter.get(
  "/",
  validate(categoryBudgetListQuerySchema, "query"),
  asyncHandler(categoryBudgetsController.list)
);
categoryBudgetsRouter.put(
  "/:categoryId",
  validate(categoryBudgetBodySchema),
  asyncHandler(categoryBudgetsController.upsert)
);
categoryBudgetsRouter.delete(
  "/:categoryId",
  validate(categoryBudgetDeleteQuerySchema, "query"),
  asyncHandler(categoryBudgetsController.remove)
);
