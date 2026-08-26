import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { avatarUpload } from "../../middlewares/upload";
import { usersController } from "./users.controller";
import {
  changePasswordSchema,
  completeOnboardingSchema,
  deleteAccountSchema,
  notificationPreferenceSchema,
  updateProfileSchema,
} from "./users.validation";
import { financialProfileController } from "../financialProfile/financialProfile.controller";
import { updateFinancialProfileSchema } from "../financialProfile/financialProfile.validation";

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

usersRouter.post("/me/avatar", avatarUpload.single("avatar"), asyncHandler(usersController.uploadAvatar));
usersRouter.delete("/me/avatar", asyncHandler(usersController.removeAvatar));

usersRouter.get("/me/sessions", asyncHandler(usersController.listSessions));
usersRouter.delete("/me/sessions/other", asyncHandler(usersController.revokeOtherSessions));
usersRouter.delete("/me/sessions/:id", asyncHandler(usersController.revokeSession));

usersRouter.get("/me/notification-preferences", asyncHandler(usersController.getNotificationPreferences));
usersRouter.put(
  "/me/notification-preferences/:type(limit_exceeded|goal_achieved|objective_deadline|category_budget_exceeded)",
  validate(notificationPreferenceSchema),
  asyncHandler(usersController.updateNotificationPreference)
);

usersRouter.get("/me/financial-profile", asyncHandler(financialProfileController.get));
usersRouter.put(
  "/me/financial-profile",
  validate(updateFinancialProfileSchema),
  asyncHandler(financialProfileController.update)
);

usersRouter.put(
  "/me/onboarding",
  validate(completeOnboardingSchema),
  asyncHandler(usersController.completeOnboarding)
);
