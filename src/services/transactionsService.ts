import { apiRequest } from "./api";
import type { ApiTransaction, ApiTransactionInput } from "../types/api";

export interface TransactionFilters {
  month?: string;
  type?: "entrada" | "saida";
  categoryId?: number;
  search?: string;
}

export const transactionsService = {
  list: (filters: TransactionFilters = {}) =>
    apiRequest<{ transactions: ApiTransaction[] }>("/transactions", { query: filters }),

  create: (input: ApiTransactionInput) =>
    apiRequest<{ transaction: ApiTransaction }>("/transactions", { method: "POST", body: input }),

  update: (id: number, input: ApiTransactionInput) =>
    apiRequest<{ transaction: ApiTransaction }>(`/transactions/${id}`, { method: "PUT", body: input }),

  remove: (id: number) => apiRequest<void>(`/transactions/${id}`, { method: "DELETE" }),
};
