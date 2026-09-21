import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { accountsController } from "./accounts.controller";
import { createAccountSchema } from "./accounts.validation";

export const accountsRouter = Router();

accountsRouter.use(requireAuth);
accountsRouter.get("/", asyncHandler(accountsController.list));
accountsRouter.post("/", validate(createAccountSchema), asyncHandler(accountsController.create));
accountsRouter.delete("/:id", asyncHandler(accountsController.remove));
