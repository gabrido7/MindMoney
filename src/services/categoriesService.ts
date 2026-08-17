import { apiRequest } from "./api";
import type { ApiCategory, ApiSubcategory } from "../types/api";

export const categoriesService = {
  list: () => apiRequest<{ categories: ApiCategory[] }>("/categories"),

  subcategories: (categoryId: number) =>
    apiRequest<{ subcategories: ApiSubcategory[] }>(`/categories/${categoryId}/subcategories`),
};
