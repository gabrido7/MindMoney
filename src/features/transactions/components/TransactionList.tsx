import EmptyState from "../../../components/ui/EmptyState";
import Icon from "../../../components/ui/Icon";
import { formatCurrency, formatDateBR } from "../../../utils/formatters";
import type { Transaction } from "../../../types";

export default function TransactionList({
  transactions,
  onEdit,
  onDeleteRequest,
}: {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDeleteRequest: (transaction: Transaction) => void;
}) {
  if (transactions.length === 0) {
    return <EmptyState icon="wallet" message="Nenhuma transação encontrada." />;
  }

  return (
    <ul className="space-y-3">
      {transactions.map((t) => (
        <li
          key={t.id}
          className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3"
        >
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {t.description}
            </p>
            <p className="text-sm text-gray-400">
              {formatDateBR(t.date)} · {t.category}
              {t.subcategory ? ` · ${t.subcategory}` : ""}
            </p>
            <p
              className={
                t.type === "entrada"
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              {formatCurrency(t.amount)}
            </p>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => onEdit(t)}
              aria-label={`Editar transação ${t.description}`}
              className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
            >
              <Icon name="edit" size={18} />
            </button>
            <button
              onClick={() => onDeleteRequest(t)}
              aria-label={`Excluir transação ${t.description}`}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Icon name="trash" size={18} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
