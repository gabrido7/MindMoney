import { useCallback } from "react";
import { useLocalStorageState } from "../../../hooks/useLocalStorageState";
import type { SavingGoals } from "../../../types";

const isSavingGoals = (value: unknown): value is SavingGoals =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  Object.values(value as Record<string, unknown>).every(
    (v) => typeof v === "number"
  );

export function useSavingGoals() {
  const [goals, setGoals] = useLocalStorageState<SavingGoals>(
    "savingGoals",
    {},
    isSavingGoals
  );

  const setGoalForMonth = useCallback(
    (month: string, amount: number) => {
      setGoals((prev) => {
        if (amount <= 0) {
          const rest = { ...prev };
          delete rest[month];
          return rest;
        }
        return { ...prev, [month]: amount };
      });
    },
    [setGoals]
  );

  const getGoalForMonth = useCallback(
    (month: string) => goals[month] ?? 0,
    [goals]
  );

  const replaceAll = useCallback(
    (next: SavingGoals) => {
      setGoals(next);
    },
    [setGoals]
  );

  return { goals, setGoalForMonth, getGoalForMonth, replaceAll };
}
