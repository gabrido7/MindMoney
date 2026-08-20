import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { educationController } from "./education.controller";
import { lessonIdParamSchema, progressUpsertSchema } from "./education.validation";

export const educationRouter = Router();

educationRouter.use(requireAuth);
educationRouter.get("/progress", asyncHandler(educationController.list));
educationRouter.put(
  "/progress/:lessonId",
  validate(lessonIdParamSchema, "params"),
  validate(progressUpsertSchema, "body"),
  asyncHandler(educationController.upsert)
);
educationRouter.delete(
  "/progress/:lessonId",
  validate(lessonIdParamSchema, "params"),
  asyncHandler(educationController.remove)
);
