import { apiRequest } from "./api";
import type { ScoreData, ScoreHistoryEntry } from "../types/api";

export const scoreService = {
  get: (month?: string) => apiRequest<ScoreData>("/score", { query: { month } }),

  history: (months = 6) =>
    apiRequest<{ history: ScoreHistoryEntry[] }>("/score/history", { query: { months } }),
};
