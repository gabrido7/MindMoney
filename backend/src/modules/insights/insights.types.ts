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
