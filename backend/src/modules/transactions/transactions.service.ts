import { AppError } from "../../utils/AppError";
import { categoriesRepository } from "../categories/categories.repository";
import { notificationsService } from "../notifications/notifications.service";
import { transactionsRepository } from "./transactions.repository";
import type { TransactionBodyInput, TransactionListQuery } from "./transactions.validation";

async function assertOwnedCategoryAndSubcategory(userId: number, input: TransactionBodyInput) {
  const category = await categoriesRepository.findByIdAndUser(input.categoryId, userId);
  if (!category) throw AppError.badRequest("Categoria inválida.");

  if (input.subcategoryId) {
    const subcategory = await categoriesRepository.findSubcategoryByIdAndCategory(
      input.subcategoryId,
      category.id
    );
    if (!subcategory) throw AppError.badRequest("Subcategoria inválida para a categoria informada.");
  }
}

export const transactionsService = {
  async list(userId: number, filters: TransactionListQuery) {
    return transactionsRepository.list(userId, filters);
  },

  async create(userId: number, input: TransactionBodyInput) {
    await assertOwnedCategoryAndSubcategory(userId, input);
    const id = await transactionsRepository.create(userId, input);
    await notificationsService.checkAndNotify(userId, input.transactionDate.slice(0, 7));
    return transactionsRepository.findByIdAndUser(id, userId);
  },

  async update(id: number, userId: number, input: TransactionBodyInput) {
    const existing = await transactionsRepository.findByIdAndUser(id, userId);
    if (!existing) throw AppError.notFound("Transação não encontrada.");

    await assertOwnedCategoryAndSubcategory(userId, input);
    await transactionsRepository.update(id, userId, input);
    await notificationsService.checkAndNotify(userId, input.transactionDate.slice(0, 7));
    return transactionsRepository.findByIdAndUser(id, userId);
  },

  async delete(id: number, userId: number) {
    const existing = await transactionsRepository.findByIdAndUser(id, userId);
    if (!existing) throw AppError.notFound("Transação não encontrada.");
    await transactionsRepository.delete(id, userId);
  },
};
