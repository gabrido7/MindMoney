import { apiRequest } from "./api";
import type { ApiCategory, ApiSubcategory } from "../types/api";

export const categoriesService = {
  /** GET /api/categories já devolve subcategorias aninhadas — não existe mais um endpoint de subcategorias por categoria consumido à parte. */
  list: () => apiRequest<{ categories: ApiCategory[] }>("/categories"),

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
