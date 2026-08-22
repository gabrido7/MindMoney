export type ToolId =
  | "juros-simples"
  | "juros-compostos"
  | "inflacao"
  | "poder-de-compra"
  | "reserva-de-emergencia"
  | "aposentadoria"
  | "aportes-mensais"
  | "financiamento"
  | "emprestimo"
  | "comparacao-de-investimentos"
  | "rentabilidade-real";

export interface Tool {
  id: ToolId;
  title: string;
  emoji: string;
  description: string;
}
