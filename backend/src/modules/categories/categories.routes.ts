import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { categoriesController } from "./categories.controller";

export const categoriesRouter = Router();

categoriesRouter.use(requireAuth);
categoriesRouter.get("/", asyncHandler(categoriesController.list));
categoriesRouter.get("/:id/subcategories", asyncHandler(categoriesController.subcategories));
