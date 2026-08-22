import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { favoritesController } from "./favorites.controller";
import { favoriteBodySchema, favoriteParamsSchema } from "./favorites.validation";

export const favoritesRouter = Router();

favoritesRouter.use(requireAuth);
favoritesRouter.get("/", asyncHandler(favoritesController.list));
favoritesRouter.post("/", validate(favoriteBodySchema, "body"), asyncHandler(favoritesController.add));
favoritesRouter.delete(
  "/:contentType/:contentId",
  validate(favoriteParamsSchema, "params"),
  asyncHandler(favoritesController.remove)
);
