import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { validate } from "../../middlewares/validate";
import { assetsController } from "./assets.controller";
import { createAssetSchema, assetValueUpdateBodySchema } from "./assets.validation";

export const assetsRouter = Router();

assetsRouter.use(requireAuth);
assetsRouter.get("/", asyncHandler(assetsController.list));
assetsRouter.post("/", validate(createAssetSchema), asyncHandler(assetsController.create));
assetsRouter.delete("/:id", asyncHandler(assetsController.remove));

assetsRouter.get("/updates", asyncHandler(assetsController.listAllValueUpdates));

assetsRouter.get("/:id/updates", asyncHandler(assetsController.listValueUpdates));
assetsRouter.post(
  "/:id/updates",
  validate(assetValueUpdateBodySchema),
  asyncHandler(assetsController.addValueUpdate)
);
assetsRouter.put(
  "/:id/updates/:updateId",
  validate(assetValueUpdateBodySchema),
  asyncHandler(assetsController.updateValueUpdate)
);
assetsRouter.delete("/:id/updates/:updateId", asyncHandler(assetsController.removeValueUpdate));
