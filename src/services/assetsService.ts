import { apiRequest } from "./api";
import type {
  Asset,
  AssetInput,
  AssetValueUpdate,
  AssetValueUpdateInput,
  AssetValueUpdateWithAssetName,
  GamificationResult,
} from "../types/api";

export const assetsService = {
  list: () => apiRequest<{ assets: Asset[] }>("/assets"),

  create: (input: AssetInput) =>
    apiRequest<{ asset: Asset; gamification: GamificationResult }>("/assets", { method: "POST", body: input }),

  remove: (id: number) => apiRequest<void>(`/assets/${id}`, { method: "DELETE" }),

  listAllValueUpdates: () => apiRequest<{ updates: AssetValueUpdateWithAssetName[] }>("/assets/updates"),

  listValueUpdates: (assetId: number) =>
    apiRequest<{ updates: AssetValueUpdate[] }>(`/assets/${assetId}/updates`),

  addValueUpdate: (assetId: number, input: AssetValueUpdateInput) =>
    apiRequest<{ asset: Asset; gamification: GamificationResult }>(`/assets/${assetId}/updates`, {
      method: "POST",
      body: input,
    }),

  updateValueUpdate: (assetId: number, updateId: number, input: AssetValueUpdateInput) =>
    apiRequest<{ asset: Asset; gamification: GamificationResult }>(`/assets/${assetId}/updates/${updateId}`, {
      method: "PUT",
      body: input,
    }),

  removeValueUpdate: (assetId: number, updateId: number) =>
    apiRequest<{ asset: Asset; gamification: GamificationResult }>(`/assets/${assetId}/updates/${updateId}`, {
      method: "DELETE",
    }),
};
