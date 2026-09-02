import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { debtsController } from "./debts.controller";
import { createDebtSchema, debtPaymentBodySchema } from "./debts.validation";

export const debtsRouter = Router();

debtsRouter.use(requireAuth);
debtsRouter.get("/", asyncHandler(debtsController.list));
debtsRouter.post("/", validate(createDebtSchema), asyncHandler(debtsController.create));
debtsRouter.delete("/:id", asyncHandler(debtsController.remove));

debtsRouter.get("/payments", asyncHandler(debtsController.listAllPayments));

debtsRouter.get("/:id/payments", asyncHandler(debtsController.listPayments));
debtsRouter.post(
  "/:id/payments",
  validate(debtPaymentBodySchema),
  asyncHandler(debtsController.addPayment)
);
debtsRouter.put(
  "/:id/payments/:paymentId",
  validate(debtPaymentBodySchema),
  asyncHandler(debtsController.updatePayment)
);
debtsRouter.delete("/:id/payments/:paymentId", asyncHandler(debtsController.removePayment));
