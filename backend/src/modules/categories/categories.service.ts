import { AppError } from "../../utils/AppError";
import { colorForLabel } from "../../utils/color";
import { categoriesRepository, type SubcategoryRow } from "./categories.repository";
import type { CreateCategoryInput, CreateSubcategoryInput } from "./categories.validation";

export const categoriesService = {
  /**
   * Uma chamada de categorias + uma chamada de subcategorias (com IN),
   * nunca 1+N -- antes o frontend fazia uma chamada de subcategorias por
   * categoria (useCategories.ts), o que virava 1+N requisições sempre que
   * a lista carregava.
   */
  async listForUser(userId: number) {
    const categories = await categoriesRepository.findAllByUser(userId);
    if (categories.length === 0) return [];

    const subcategories = await categoriesRepository.findSubcategoriesForCategories(
      categories.map((c) => c.id)
    );
    const byCategory = new Map<number, SubcategoryRow[]>();
    for (const sub of subcategories) {
      const list = byCategory.get(sub.category_id) ?? [];
      list.push(sub);
      byCategory.set(sub.category_id, list);
    }

    return categories.map((c) => ({ ...c, subcategories: byCategory.get(c.id) ?? [] }));
  },

  async listSubcategories(categoryId: number, userId: number) {
    const category = await categoriesRepository.findByIdAndUser(categoryId, userId);
    if (!category) throw AppError.notFound("Categoria não encontrada.");
    return categoriesRepository.findSubcategories(category.id);
  },

  async create(userId: number, input: CreateCategoryInput) {
    const existing = await categoriesRepository.findByNameAndUser(input.name, userId);
    if (existing) throw AppError.conflict("Já existe uma categoria com esse nome.");

    const id = await categoriesRepository.create(userId, input.name, colorForLabel(input.name), input.type);
    const category = await categoriesRepository.findByIdAndUser(id, userId);
    return category ? { ...category, subcategories: [] } : null;
  },

  async archive(id: number, userId: number) {
    const category = await categoriesRepository.findByIdAndUser(id, userId);
    if (!category) throw AppError.notFound("Categoria não encontrada.");
    if (category.is_builtin) throw AppError.badRequest("Categorias padrão não podem ser removidas.");

    await categoriesRepository.archive(id, userId);
  },

  async createSubcategory(categoryId: number, userId: number, input: CreateSubcategoryInput) {
    const category = await categoriesRepository.findByIdAndUser(categoryId, userId);
    if (!category) throw AppError.notFound("Categoria não encontrada.");

    const existing = await categoriesRepository.findSubcategoryByNameAndCategory(input.name, categoryId);
    if (existing) throw AppError.conflict("Já existe uma subcategoria com esse nome nesta categoria.");

    const id = await categoriesRepository.createSubcategory(categoryId, input.name, colorForLabel(input.name));
    const subcategories = await categoriesRepository.findSubcategories(categoryId);
    return subcategories.find((s) => s.id === id) ?? null;
  },

  async archiveSubcategory(categoryId: number, subcategoryId: number, userId: number) {
    const category = await categoriesRepository.findByIdAndUser(categoryId, userId);
    if (!category) throw AppError.notFound("Categoria não encontrada.");

    const subcategory = await categoriesRepository.findSubcategoryByIdAndCategory(subcategoryId, categoryId);
    if (!subcategory) throw AppError.notFound("Subcategoria não encontrada.");

    await categoriesRepository.archiveSubcategory(subcategoryId, categoryId);
  },
};
