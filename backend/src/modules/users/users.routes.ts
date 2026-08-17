import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { usersController } from "./users.controller";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, asyncHandler(usersController.me));
