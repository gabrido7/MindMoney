export type InsightSeverity = "info" | "warning" | "success";

export interface Insight {
  type:
    | "aumento_gasto"
    | "categoria_problematica"
    | "evolucao_positiva"
    | "meta"
    | "recomendacao_geral";
  severity: InsightSeverity;
  title: string;
  message: string;
}
