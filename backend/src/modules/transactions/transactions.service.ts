import { AppError } from "../../utils/AppError";
import { categoriesRepository } from "../categories/categories.repository";
import { accountsRepository } from "../accounts/accounts.repository";
import { notificationsService } from "../notifications/notifications.service";
import { transactionsRepository } from "./transactions.repository";
import type { ImportRow, TransactionBodyInput, TransactionListQuery } from "./transactions.validation";

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

  const account = await accountsRepository.findByIdAndUser(input.accountId, userId);
  if (!account) throw AppError.badRequest("Conta inválida.");
}

export const transactionsService = {
  async list(userId: number, filters: TransactionListQuery) {
    const { page, limit } = filters;
    const [transactions, total] = await Promise.all([
      transactionsRepository.list(userId, filters, { page, limit }),
      transactionsRepository.count(userId, filters),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    };
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

  /**
   * Importação em massa (mesmo formato do CSV exportado: data, descrição,
   * categoria, subcategoria, tipo, valor). Categoria/subcategoria são
   * resolvidas por nome contra as categorias do próprio usuário -- uma
   * chamada para todas as categorias + uma para todas as subcategorias
   * (mesmo princípio anti-N+1 de categories.service.ts), não uma consulta
   * por linha. Linhas com categoria desconhecida são puladas (reportadas
   * em `skipped`), não derrubam a importação inteira. O CSV não tem coluna
   * de conta -- toda linha importada cai na conta padrão do usuário (a
   * primeira criada, ver accountsRepository.findDefaultForUser), sem mudar
   * o formato do arquivo.
   */
  async importBatch(
    userId: number,
    rows: ImportRow[]
  ): Promise<{ imported: number; skipped: { row: number; reason: string }[] }> {
    const [categories, defaultAccount] = await Promise.all([
      categoriesRepository.findAllByUser(userId),
      accountsRepository.findDefaultForUser(userId),
    ]);
    if (!defaultAccount) throw AppError.badRequest("Nenhuma conta encontrada para importar as transações.");
    const categoryByName = new Map(categories.map((c) => [c.name, c]));

    const subcategories = await categoriesRepository.findSubcategoriesForCategories(
      categories.map((c) => c.id)
    );
    const subcategoryId = new Map(subcategories.map((s) => [`${s.category_id}:${s.name}`, s.id]));

    let imported = 0;
    const skipped: { row: number; reason: string }[] = [];
    const touchedMonths = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const category = categoryByName.get(row.category);
      if (!category) {
        skipped.push({ row: i + 1, reason: `Categoria "${row.category}" não encontrada.` });
        continue;
      }

      await transactionsRepository.create(userId, {
        accountId: defaultAccount.id,
        categoryId: category.id,
        subcategoryId: row.subcategory ? subcategoryId.get(`${category.id}:${row.subcategory}`) : undefined,
        description: row.description,
        amount: row.amount,
        type: row.type,
        transactionDate: row.date,
      });
      imported += 1;
      touchedMonths.add(row.date.slice(0, 7));
    }

    for (const month of touchedMonths) {
      await notificationsService.checkAndNotify(userId, month);
    }

    return { imported, skipped };
  },
};
