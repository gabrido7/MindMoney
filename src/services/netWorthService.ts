import { apiRequest } from "./api";

export interface NetWorthSnapshot {
  month: string;
  totalAssets: number;
  totalAccounts: number;
  totalDebts: number;
  netWorth: number;
}

export const netWorthService = {
  history: (months = 6) => apiRequest<{ history: NetWorthSnapshot[] }>("/net-worth/history", { query: { months } }),
};
