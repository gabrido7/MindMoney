import { useCallback } from "react";
import { useLocalStorageState } from "../../../hooks/useLocalStorageState";
import { generateId } from "../../../utils/id";
import type { Transaction } from "../../../types";

const isTransactionArray = (value: unknown): value is Transaction[] =>
  Array.isArray(value) &&
  value.every(
    (t) =>
      t &&
      typeof t.id !== "undefined" &&
      typeof t.description === "string" &&
      typeof t.amount === "number" &&
      (t.type === "entrada" || t.type === "saida") &&
      typeof t.date === "string" &&
      typeof t.category === "string"
  );

export type TransactionInput = Omit<Transaction, "id">;

export function useTransactions() {
  const [transactions, setTransactions] = useLocalStorageState<Transaction[]>(
    "transactions",
    [],
    isTransactionArray
  );

  const addTransaction = useCallback(
    (input: TransactionInput) => {
      const transaction: Transaction = { id: generateId(), ...input };
      setTransactions((prev) => [...prev, transaction]);
    },
    [setTransactions]
  );

  const updateTransaction = useCallback(
    (id: string, input: TransactionInput) => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { id, ...input } : t))
      );
    },
    [setTransactions]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    },
    [setTransactions]
  );

  const replaceAll = useCallback(
    (next: Transaction[]) => {
      setTransactions(next);
    },
    [setTransactions]
  );

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    replaceAll,
  };
}
