import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { newsletterController } from "./newsletter.controller";
import { subscribeSchema } from "./newsletter.validation";

export const newsletterRouter = Router();

// Público de propósito: o visitante da landing page ainda não tem conta.
newsletterRouter.post("/", validate(subscribeSchema), asyncHandler(newsletterController.subscribe));
