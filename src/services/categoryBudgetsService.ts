import { apiRequest } from "./api";
import type { CategoryBudget } from "../types/api";

export const categoryBudgetsService = {
  list: (month: string) =>
    apiRequest<{ budgets: CategoryBudget[] }>("/category-budgets", { query: { month } }),

  upsert: (categoryId: number, month: string, amount: number) =>
    apiRequest<{ budget: CategoryBudget }>(`/category-budgets/${categoryId}`, {
      method: "PUT",
      body: { month, amount },
    }),

  remove: (categoryId: number, month: string) =>
    apiRequest<void>(`/category-budgets/${categoryId}`, { method: "DELETE", query: { month } }),
};
