import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { netWorthController } from "./netWorth.controller";
import { netWorthHistoryQuerySchema } from "./netWorth.validation";

export const netWorthRouter = Router();

netWorthRouter.use(requireAuth);
netWorthRouter.get("/history", validate(netWorthHistoryQuerySchema, "query"), asyncHandler(netWorthController.history));
