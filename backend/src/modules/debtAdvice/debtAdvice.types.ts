export type AdviceSeverity = "critical" | "warning" | "success";

export interface DebtAdvice {
  id: string;
  severity: AdviceSeverity;
  title: string;
  message: string;
}
