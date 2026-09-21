import { AppError } from "../../utils/AppError";
import { accountsRepository, type AccountWithBalanceRow } from "./accounts.repository";
import type { CreateAccountInput } from "./accounts.validation";

function enrich(row: AccountWithBalanceRow) {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    initialBalance: Number(row.initial_balance),
    balance: Number(row.balance),
    createdAt: row.created_at,
  };
}

export type EnrichedAccount = ReturnType<typeof enrich>;

export const accountsService = {
  async list(userId: number): Promise<EnrichedAccount[]> {
    const rows = await accountsRepository.listByUser(userId);
    return rows.map(enrich);
  },

  async create(userId: number, input: CreateAccountInput): Promise<EnrichedAccount> {
    const id = await accountsRepository.create(userId, input);
    const rows = await accountsRepository.listByUser(userId);
    const created = rows.find((r) => r.id === id);
    return enrich(created!);
  },

  /**
   * Nunca cascata: uma conta com transação carrega histórico financeiro
   * real (mesmo princípio de category_id RESTRICT). O usuário precisa
   * apagar/mover as transações primeiro -- apagar direto reescreveria
   * dinheiro que já foi de verdade ganho ou gasto.
   */
  async remove(userId: number, id: number): Promise<void> {
    const account = await accountsRepository.findByIdAndUser(id, userId);
    if (!account) throw AppError.notFound("Conta não encontrada.");

    const transactionCount = await accountsRepository.countTransactions(id);
    if (transactionCount > 0) {
      throw AppError.conflict(
        `Esta conta tem ${transactionCount} transação(ões). Apague ou mova as transações antes de remover a conta.`
      );
    }

    await accountsRepository.remove(id, userId);
  },
};
