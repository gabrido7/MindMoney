import { apiRequest } from "./api";
import type { DashboardData } from "../types/api";

export const dashboardService = {
  get: (month?: string) => apiRequest<DashboardData>("/dashboard", { query: { month } }),
};
