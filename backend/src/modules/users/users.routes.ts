import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { usersController } from "./users.controller";
import { changePasswordSchema, deleteAccountSchema, updateProfileSchema } from "./users.validation";

export const usersRouter = Router();

usersRouter.use(requireAuth);
usersRouter.get("/me", asyncHandler(usersController.me));
usersRouter.put("/me", validate(updateProfileSchema), asyncHandler(usersController.updateProfile));
usersRouter.put(
  "/me/password",
  validate(changePasswordSchema),
  asyncHandler(usersController.changePassword)
);
usersRouter.delete("/me", validate(deleteAccountSchema), asyncHandler(usersController.deleteAccount));
