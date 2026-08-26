import { AppError } from "../../utils/AppError";
import { debtsRepository, type DebtRow } from "./debts.repository";
import type { CreateDebtInput } from "./debts.validation";

function enrich(row: DebtRow) {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    totalAmount: Number(row.total_amount),
    installmentAmount: row.installment_amount !== null ? Number(row.installment_amount) : null,
    interestRate: row.interest_rate !== null ? Number(row.interest_rate) : null,
    installmentsCount: row.installments_count,
    dueDay: row.due_day,
    createdAt: row.created_at,
  };
}

export type EnrichedDebt = ReturnType<typeof enrich>;

export const debtsService = {
  async list(userId: number): Promise<EnrichedDebt[]> {
    const rows = await debtsRepository.listByUser(userId);
    return rows.map(enrich);
  },

  async create(userId: number, input: CreateDebtInput): Promise<EnrichedDebt> {
    const id = await debtsRepository.create(userId, {
      type: input.type,
      name: input.name,
      totalAmount: input.totalAmount,
      installmentAmount: input.installmentAmount ?? null,
      interestRate: input.interestRate ?? null,
      installmentsCount: input.installmentsCount ?? null,
      dueDay: input.dueDay ?? null,
    });
    const row = await debtsRepository.findByIdAndUser(id, userId);
    return enrich(row!);
  },

  async remove(userId: number, id: number): Promise<void> {
    const removed = await debtsRepository.remove(id, userId);
    if (!removed) throw AppError.notFound("Dívida não encontrada.");
  },
};
