import { apiRequest } from "./api";
import type { ScoreData } from "../types/api";

export const scoreService = {
  get: (month?: string) => apiRequest<ScoreData>("/score", { query: { month } }),
};
