import { useCallback, useEffect, useState } from "react";
import { transactionsService } from "../../../services/transactionsService";
import { ApiError } from "../../../services/api";
import { toLocalTransaction } from "../utils/mapApiTransaction";
import type { Category, Transaction } from "../../../types";
import type { Pagination } from "../../../types/api";

export type TransactionInput = Omit<Transaction, "id">;

const PAGE_SIZE = 50;

/**
 * Transações vêm da API/MySQL, paginadas e restritas ao mês pedido — antes
 * este hook buscava o histórico inteiro do usuário de uma vez (sem limite
 * nenhum), a cada carregamento do Dashboard. Agora cada chamada busca no
 * máximo PAGE_SIZE transações daquele mês; "carregar mais" busca a
 * próxima página sem re-buscar o que já foi carregado.
 */
export function useTransactions(categories: Category[], month: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (targetPage: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        const result = await transactionsService.list({ month, page: targetPage, limit: PAGE_SIZE });
        const mapped = result.transactions.map(toLocalTransaction);
        setTransactions((prev) => (append ? [...prev, ...mapped] : mapped));
        setPagination(result.pagination);
        setPage(targetPage);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Erro ao carregar transações.");
      } finally {
        if (append) setLoadingMore(false);
        else setLoading(false);
      }
    },
    [month]
  );

  useEffect(() => {
    (async () => {
      await fetchPage(1, false);
    })();
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (pagination && page < pagination.totalPages && !loadingMore) {
      fetchPage(page + 1, true);
    }
  }, [pagination, page, loadingMore, fetchPage]);

  const reload = useCallback(() => fetchPage(1, false), [fetchPage]);

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
      await reload();
    },
    [resolveInput, reload]
  );

  const updateTransaction = useCallback(
    async (id: string, input: TransactionInput) => {
      await transactionsService.update(Number(id), resolveInput(input));
      await reload();
    },
    [resolveInput, reload]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      await transactionsService.remove(Number(id));
      await reload();
    },
    [reload]
  );

  return {
    transactions,
    pagination,
    loading,
    loadingMore,
    error,
    loadMore,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
