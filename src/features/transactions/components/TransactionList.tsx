import EmptyState from "../../../components/ui/EmptyState";
import Icon from "../../../components/ui/Icon";
import Button from "../../../components/ui/Button";
import { formatCurrency, formatDateBR } from "../../../utils/formatters";
import type { Transaction } from "../../../types";
import type { Pagination } from "../../../types/api";

export default function TransactionList({
  transactions,
  onEdit,
  onDeleteRequest,
  pagination,
  loadingMore,
  onLoadMore,
}: {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDeleteRequest: (transaction: Transaction) => void;
  pagination?: Pagination | null;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}) {
  if (transactions.length === 0) {
    return <EmptyState icon="wallet" message="Nenhuma transação encontrada." />;
  }

  const hasMore = Boolean(pagination && pagination.page < pagination.totalPages);

  return (
    <div className="flex flex-col gap-4">
      <ul className="space-y-3">
        {transactions.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center border-b border-line pb-3"
          >
            <div>
              <p className="font-medium text-ink">
                {t.description}
              </p>
              <p className="text-sm text-ink-soft">
                {formatDateBR(t.date)} · {t.category}
                {t.subcategory ? ` · ${t.subcategory}` : ""}
              </p>
              <p
                className={
                  t.type === "entrada"
                    ? "font-data text-brand font-medium"
                    : "font-data text-negative font-medium"
                }
              >
                {formatCurrency(t.amount)}
              </p>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => onEdit(t)}
                aria-label={`Editar transação ${t.description}`}
                className="p-2 rounded-lg text-brand hover:bg-brand-soft"
              >
                <Icon name="edit" size={18} />
              </button>
              <button
                onClick={() => onDeleteRequest(t)}
                aria-label={`Excluir transação ${t.description}`}
                className="p-2 rounded-lg text-negative hover:bg-negative-soft"
              >
                <Icon name="trash" size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {pagination && pagination.total > transactions.length && (
        <div className="flex flex-col items-center gap-2 pt-1">
          <p className="text-xs text-ink-soft">
            Mostrando {transactions.length} de {pagination.total} transações deste mês
          </p>
          {hasMore && (
            <Button variant="secondary" onClick={onLoadMore} disabled={loadingMore}>
              {loadingMore ? "Carregando..." : "Carregar mais"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
