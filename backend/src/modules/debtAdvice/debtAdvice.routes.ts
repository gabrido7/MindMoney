import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { debtAdviceController } from "./debtAdvice.controller";

export const debtAdviceRouter = Router();

debtAdviceRouter.use(requireAuth);
debtAdviceRouter.get("/", asyncHandler(debtAdviceController.list));
