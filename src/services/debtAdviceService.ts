import { apiRequest } from "./api";

export type AdviceSeverity = "critical" | "warning" | "success";

export interface DebtAdvice {
  id: string;
  severity: AdviceSeverity;
  title: string;
  message: string;
}

export const debtAdviceService = {
  list: () => apiRequest<{ advice: DebtAdvice[] }>("/debt-advice"),
};
