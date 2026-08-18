import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { transactionsController } from "./transactions.controller";
import {
  transactionBodySchema,
  transactionListQuerySchema,
  importTransactionsSchema,
} from "./transactions.validation";

export const transactionsRouter = Router();

transactionsRouter.use(requireAuth);
transactionsRouter.get(
  "/",
  validate(transactionListQuerySchema, "query"),
  asyncHandler(transactionsController.list)
);
transactionsRouter.post("/", validate(transactionBodySchema), asyncHandler(transactionsController.create));
transactionsRouter.post(
  "/import",
  validate(importTransactionsSchema),
  asyncHandler(transactionsController.importBatch)
);
transactionsRouter.put("/:id", validate(transactionBodySchema), asyncHandler(transactionsController.update));
transactionsRouter.delete("/:id", asyncHandler(transactionsController.remove));
