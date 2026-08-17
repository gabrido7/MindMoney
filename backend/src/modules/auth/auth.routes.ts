import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { authController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), asyncHandler(authController.register));
authRouter.post("/login", validate(loginSchema), asyncHandler(authController.login));
