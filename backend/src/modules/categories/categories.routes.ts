import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { categoriesController } from "./categories.controller";
import { createCategorySchema, createSubcategorySchema } from "./categories.validation";

export const categoriesRouter = Router();

categoriesRouter.use(requireAuth);
categoriesRouter.get("/", asyncHandler(categoriesController.list));
categoriesRouter.post("/", validate(createCategorySchema), asyncHandler(categoriesController.create));
categoriesRouter.delete("/:id", asyncHandler(categoriesController.remove));
categoriesRouter.get("/:id/subcategories", asyncHandler(categoriesController.subcategories));
categoriesRouter.post(
  "/:id/subcategories",
  validate(createSubcategorySchema),
  asyncHandler(categoriesController.createSubcategory)
);
categoriesRouter.delete("/:id/subcategories/:subId", asyncHandler(categoriesController.removeSubcategory));
