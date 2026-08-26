import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { debtsController } from "./debts.controller";
import { createDebtSchema } from "./debts.validation";

export const debtsRouter = Router();

debtsRouter.use(requireAuth);
debtsRouter.get("/", asyncHandler(debtsController.list));
debtsRouter.post("/", validate(createDebtSchema), asyncHandler(debtsController.create));
debtsRouter.delete("/:id", asyncHandler(debtsController.remove));
