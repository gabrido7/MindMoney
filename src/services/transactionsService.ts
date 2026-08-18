import { apiRequest } from "./api";
import type { ApiTransaction, ApiTransactionInput, Pagination } from "../types/api";
import type { ImportRow } from "../features/importExport/utils/exportImport";

export interface ImportResult {
  imported: number;
  skipped: { row: number; reason: string }[];
}

export interface TransactionFilters {
  month?: string;
  type?: "entrada" | "saida";
  categoryId?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export const transactionsService = {
  list: (filters: TransactionFilters = {}) =>
    apiRequest<{ transactions: ApiTransaction[]; pagination: Pagination }>("/transactions", {
      query: filters,
    }),

  /**
   * Busca o histórico inteiro do usuário, página por página, até esgotar
   * totalPages. É uso legítimo de "buscar tudo" (backup/exportação —
   * ação explícita do usuário, não o carregamento padrão de uma tela) —
   * diferente do Dashboard, que agora busca só o mês selecionado.
   */
  async listAll(filters: Omit<TransactionFilters, "page" | "limit"> = {}): Promise<ApiTransaction[]> {
    const limit = 200;
    let page = 1;
    let totalPages = 1;
    let all: ApiTransaction[] = [];

    do {
      const result = await this.list({ ...filters, page, limit });
      all = all.concat(result.transactions);
      totalPages = result.pagination.totalPages;
      page += 1;
    } while (page <= totalPages);

    return all;
  },

  create: (input: ApiTransactionInput) =>
    apiRequest<{ transaction: ApiTransaction }>("/transactions", { method: "POST", body: input }),

  update: (id: number, input: ApiTransactionInput) =>
    apiRequest<{ transaction: ApiTransaction }>(`/transactions/${id}`, { method: "PUT", body: input }),

  remove: (id: number) => apiRequest<void>(`/transactions/${id}`, { method: "DELETE" }),

  importBatch: (transactions: ImportRow[]) =>
    apiRequest<ImportResult>("/transactions/import", { method: "POST", body: { transactions } }),
};
