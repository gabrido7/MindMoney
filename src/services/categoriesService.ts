import { apiRequest } from "./api";
import type { ApiCategory, ApiSubcategory } from "../types/api";

export const categoriesService = {
  list: () => apiRequest<{ categories: ApiCategory[] }>("/categories"),

  subcategories: (categoryId: number) =>
    apiRequest<{ subcategories: ApiSubcategory[] }>(`/categories/${categoryId}/subcategories`),

  create: (input: { name: string; type: "entrada" | "saida" | "ambos" }) =>
    apiRequest<{ category: ApiCategory }>("/categories", { method: "POST", body: input }),

  remove: (id: number) => apiRequest<void>(`/categories/${id}`, { method: "DELETE" }),

  createSubcategory: (categoryId: number, name: string) =>
    apiRequest<{ subcategory: ApiSubcategory }>(`/categories/${categoryId}/subcategories`, {
      method: "POST",
      body: { name },
    }),

  removeSubcategory: (categoryId: number, subId: number) =>
    apiRequest<void>(`/categories/${categoryId}/subcategories/${subId}`, { method: "DELETE" }),
};
