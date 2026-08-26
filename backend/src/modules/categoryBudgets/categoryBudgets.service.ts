import { AppError } from "../../utils/AppError";
import { categoriesRepository } from "../categories/categories.repository";
import { categoryBudgetsRepository, type CategoryBudgetRow } from "./categoryBudgets.repository";
import { currentMonth } from "../../utils/month";
import { CATEGORY_BUDGET_NEAR_PERCENT } from "../../config/rules";

export type CategoryBudgetStatus = "ok" | "near" | "over";

function enrich(row: CategoryBudgetRow) {
  const amount = Number(row.amount);
  const spent = Number(row.spent);
  const percent = amount > 0 ? (spent / amount) * 100 : 0;
  const status: CategoryBudgetStatus = percent >= 100 ? "over" : percent >= CATEGORY_BUDGET_NEAR_PERCENT ? "near" : "ok";

  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    categoryColor: row.category_color,
    amount,
    spent,
    percent,
    status,
  };
}

export type EnrichedCategoryBudget = ReturnType<typeof enrich>;

async function assertBudgetableCategory(userId: number, categoryId: number) {
  const category = await categoriesRepository.findByIdAndUser(categoryId, userId);
  if (!category || category.archived_at) throw AppError.notFound("Categoria não encontrada.");
  if (category.type === "entrada") {
    throw AppError.badRequest("Só é possível definir orçamento para categorias de saída.");
  }
  return category;
}

export const categoryBudgetsService = {
  async list(userId: number, month: string = currentMonth()): Promise<EnrichedCategoryBudget[]> {
    const rows = await categoryBudgetsRepository.listByUserAndMonth(userId, month);
    return rows.map(enrich);
  },

  async upsert(userId: number, categoryId: number, month: string, amount: number): Promise<EnrichedCategoryBudget> {
    await assertBudgetableCategory(userId, categoryId);
    await categoryBudgetsRepository.upsert(userId, categoryId, month, amount);
    const rows = await categoryBudgetsRepository.listByUserAndMonth(userId, month);
    const row = rows.find((r) => r.category_id === categoryId);
    return enrich(row!);
  },

  async remove(userId: number, categoryId: number, month: string): Promise<void> {
    const removed = await categoryBudgetsRepository.remove(userId, categoryId, month);
    if (!removed) throw AppError.notFound("Orçamento não encontrado.");
  },

  /** Usado pelo módulo de notificações -- o primeiro orçamento estourado do mês, ou null se nenhum. */
  async findFirstOverBudget(userId: number, month: string): Promise<EnrichedCategoryBudget | null> {
    const budgets = await this.list(userId, month);
    return budgets.find((b) => b.status === "over") ?? null;
  },
};
