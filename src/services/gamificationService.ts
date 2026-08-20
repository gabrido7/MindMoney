import { apiRequest } from "./api";
import type { GamificationSummary } from "../types/api";

export const gamificationService = {
  summary: () => apiRequest<GamificationSummary>("/gamification/summary"),
};
