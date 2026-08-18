import type { Transaction } from "../../../types";
import type { ApiTransaction } from "../../../types/api";

export const toLocalTransaction = (t: ApiTransaction): Transaction => ({
  id: String(t.id),
  description: t.description,
  amount: t.amount,
  type: t.type,
  date: t.transaction_date,
  category: t.category_name,
  subcategory: t.subcategory_name ?? undefined,
});
