import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { authRateLimit } from "../../middlewares/rateLimit";
import { authController } from "./auth.controller";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshSchema,
} from "./auth.validation";

export const authRouter = Router();

authRouter.use(authRateLimit);
authRouter.post("/register", validate(registerSchema), asyncHandler(authController.register));
authRouter.post("/login", validate(loginSchema), asyncHandler(authController.login));
authRouter.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword)
);
authRouter.post(
  "/reset-password",
  validate(resetPasswordSchema),
  asyncHandler(authController.resetPassword)
);
authRouter.post("/refresh", validate(refreshSchema), asyncHandler(authController.refresh));
authRouter.post("/logout", validate(refreshSchema), asyncHandler(authController.logout));
