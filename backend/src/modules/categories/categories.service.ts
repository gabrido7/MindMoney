import { AppError } from "../../utils/AppError";
import { categoriesRepository } from "./categories.repository";

export const categoriesService = {
  async listForUser(userId: number) {
    return categoriesRepository.findAllByUser(userId);
  },

  async listSubcategories(categoryId: number, userId: number) {
    const category = await categoriesRepository.findByIdAndUser(categoryId, userId);
    if (!category) throw AppError.notFound("Categoria não encontrada.");
    return categoriesRepository.findSubcategories(category.id);
  },
};
