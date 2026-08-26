import { apiRequest } from "./api";
import type { Debt, DebtInput } from "../types/api";

export const debtsService = {
  list: () => apiRequest<{ debts: Debt[] }>("/debts"),

  create: (input: DebtInput) => apiRequest<{ debt: Debt }>("/debts", { method: "POST", body: input }),

  remove: (id: number) => apiRequest<void>(`/debts/${id}`, { method: "DELETE" }),
};
