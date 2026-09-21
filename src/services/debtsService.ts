import { apiRequest } from "./api";
import type { Debt, DebtInput, DebtPayment, DebtPaymentInput, DebtPaymentWithDebtName, GamificationResult } from "../types/api";

export const debtsService = {
  list: () => apiRequest<{ debts: Debt[] }>("/debts"),

  create: (input: DebtInput) => apiRequest<{ debt: Debt }>("/debts", { method: "POST", body: input }),

  remove: (id: number) => apiRequest<void>(`/debts/${id}`, { method: "DELETE" }),

  listAllPayments: () => apiRequest<{ payments: DebtPaymentWithDebtName[] }>("/debts/payments"),

  listPayments: (debtId: number) =>
    apiRequest<{ payments: DebtPayment[] }>(`/debts/${debtId}/payments`),

  addPayment: (debtId: number, input: DebtPaymentInput) =>
    apiRequest<{ debt: Debt; milestoneReached: number | null; gamification: GamificationResult | null }>(
      `/debts/${debtId}/payments`,
      { method: "POST", body: input }
    ),

  updatePayment: (debtId: number, paymentId: number, input: DebtPaymentInput) =>
    apiRequest<{ debt: Debt }>(`/debts/${debtId}/payments/${paymentId}`, { method: "PUT", body: input }),

  removePayment: (debtId: number, paymentId: number) =>
    apiRequest<{ debt: Debt }>(`/debts/${debtId}/payments/${paymentId}`, { method: "DELETE" }),
};
