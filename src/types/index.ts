export type TransactionType = "entrada" | "saida";

export interface Transaction {
  id: string;
  accountId?: number;
  description: string;
  amount: number;
  type: TransactionType;
  date: string; // yyyy-mm-dd
  category: string;
  subcategory?: string;
}

export interface Category {
  /** id no banco — opcional porque as categorias padrão embutidas no front (fallback) não têm um */
  id?: number;
  name: string;
  color: string;
  /** entrada = só receita, saida = só despesa, ambos = usuário escolhe na transação */
  type: TransactionType | "ambos";
  subcategories: { id?: number; name: string; color: string }[];
  /** categorias padrão (Salário/Outros) não podem ser removidas */
  builtin?: boolean;
}

export interface CategoryTotal {
  name: string;
  value: number;
}

export interface CategoryComparison {
  category: string;
  change: number;
  current: number;
  previous: number;
}
