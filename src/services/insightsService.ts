import { apiRequest } from "./api";

export type InsightSeverity = "info" | "warning" | "success";

export interface Insight {
  type:
    | "aumento_gasto"
    | "categoria_problematica"
    | "evolucao_positiva"
    | "meta"
    | "recomendacao_geral"
    | "objetivo_prioridade";
  severity: InsightSeverity;
  title: string;
  message: string;
}

export const insightsService = {
  list: (month?: string) => apiRequest<{ insights: Insight[] }>("/insights", { query: { month } }),

  ask: (question: string, month?: string) =>
    apiRequest<{ answer: string }>("/insights/ask", { method: "POST", body: { question, month } }),
};
