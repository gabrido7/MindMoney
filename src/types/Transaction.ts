export type Transaction = {
  id: string
  descricao: string
  valor: number
  tipo: "entrada" | "saida"
  data: string
}