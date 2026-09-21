import { useMemo } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "../../../services/transactionsService";
import { errorMessage } from "../../../services/api";
import { invalidateFinancialData } from "../../../lib/invalidateFinancialData";
import { toLocalTransaction } from "../utils/mapApiTransaction";
import type { Category, Transaction } from "../../../types";

export type TransactionInput = Omit<Transaction, "id">;

const PAGE_SIZE = 50;

/**
 * Transações vêm da API/MySQL, paginadas e restritas ao mês pedido — antes
 * este hook buscava o histórico inteiro do usuário de uma vez (sem limite
 * nenhum), a cada carregamento do Dashboard. useInfiniteQuery modela
 * exatamente o padrão "carregar mais": cada página vira uma entrada no
 * cache, acumuladas em uma lista só.
 */
export function useTransactions(categories: Category[], month: string) {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ["transactions", month],
    queryFn: ({ pageParam }) => transactionsService.list({ month, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages ? lastPage.pagination.page + 1 : undefined,
  });

  const transactions = useMemo(
    () => (query.data?.pages ?? []).flatMap((page) => page.transactions.map(toLocalTransaction)),
    [query.data]
  );
  const pagination = query.data?.pages.at(-1)?.pagination ?? null;

  const resolveInput = (input: TransactionInput) => {
    const category = categories.find((c) => c.name === input.category);
    if (!category?.id) throw new Error(`Categoria "${input.category}" não encontrada.`);
    if (!input.accountId) throw new Error("Selecione uma conta pra essa transação.");
    const subcategory = input.subcategory
      ? category.subcategories.find((s) => s.name === input.subcategory)
      : undefined;

    return {
      accountId: input.accountId,
      categoryId: category.id,
      subcategoryId: subcategory?.id,
      description: input.description,
      amount: input.amount,
      type: input.type,
      transactionDate: input.date,
    };
  };

  // Mudar transações afeta o resumo do dashboard e o saldo das metas
  // daquele mês, então toda mutação invalida os três (invalidateFinancialData),
  // não só a própria lista de transações.
  const createMutation = useMutation({
    mutationFn: (input: TransactionInput) => transactionsService.create(resolveInput(input)),
    onSuccess: () => invalidateFinancialData(queryClient),
  });

  const updateMutation = useMutation({
    mutationFn: (input: { id: string; values: TransactionInput }) =>
      transactionsService.update(Number(input.id), resolveInput(input.values)),
    onSuccess: () => invalidateFinancialData(queryClient),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionsService.remove(Number(id)),
    onSuccess: () => invalidateFinancialData(queryClient),
  });

  const addTransaction = (input: TransactionInput) => createMutation.mutateAsync(input);
  const updateTransaction = (id: string, input: TransactionInput) =>
    updateMutation.mutateAsync({ id, values: input });
  const deleteTransaction = (id: string) => deleteMutation.mutateAsync(id);

  return {
    transactions,
    pagination,
    loading: query.isLoading,
    loadingMore: query.isFetchingNextPage,
    error: errorMessage(query.error),
    loadMore: () => query.fetchNextPage(),
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
