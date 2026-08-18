import { useCallback, useEffect, useState } from "react";
import { transactionsService } from "../../../services/transactionsService";
import { ApiError } from "../../../services/api";
import type { Category, Transaction } from "../../../types";
import type { ApiTransaction } from "../../../types/api";

export type TransactionInput = Omit<Transaction, "id">;

const toLocalTransaction = (t: ApiTransaction): Transaction => ({
  id: String(t.id),
  description: t.description,
  amount: t.amount,
  type: t.type,
  date: t.transaction_date,
  category: t.category_name,
  subcategory: t.subcategory_name ?? undefined,
});

/** Transações vêm da API/MySQL agora — localStorage não é mais a fonte dos dados financeiros. */
export function useTransactions(categories: Category[]) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { transactions: apiTransactions } = await transactionsService.list();
      setTransactions(apiTransactions.map(toLocalTransaction));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao carregar transações.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const resolveInput = useCallback(
    (input: TransactionInput) => {
      const category = categories.find((c) => c.name === input.category);
      if (!category?.id) throw new Error(`Categoria "${input.category}" não encontrada.`);
      const subcategory = input.subcategory
        ? category.subcategories.find((s) => s.name === input.subcategory)
        : undefined;

      return {
        categoryId: category.id,
        subcategoryId: subcategory?.id,
        description: input.description,
        amount: input.amount,
        type: input.type,
        transactionDate: input.date,
      };
    },
    [categories]
  );

  const addTransaction = useCallback(
    async (input: TransactionInput) => {
      await transactionsService.create(resolveInput(input));
      await load();
    },
    [resolveInput, load]
  );

  const updateTransaction = useCallback(
    async (id: string, input: TransactionInput) => {
      await transactionsService.update(Number(id), resolveInput(input));
      await load();
    },
    [resolveInput, load]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      await transactionsService.remove(Number(id));
      await load();
    },
    [load]
  );

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
