import { apiRequest } from "./api";
import type { DashboardData, DashboardRangeData } from "../types/api";

export const dashboardService = {
  get: (month?: string) => apiRequest<DashboardData>("/dashboard", { query: { month } }),

  range: (months = 6, month?: string) =>
    apiRequest<DashboardRangeData>("/dashboard/range", { query: { months, month } }),
};
