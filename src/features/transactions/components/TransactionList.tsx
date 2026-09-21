import EmptyState from "../../../components/ui/EmptyState";
import Icon from "../../../components/ui/Icon";
import Button from "../../../components/ui/Button";
import { Ledger, LedgerRow } from "../../../components/ui/Ledger";
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
      <Ledger>
        {transactions.map((t) => (
          <LedgerRow
            key={t.id}
            icon={t.type === "entrada" ? "trendUp" : "trendDown"}
            iconTone={t.type === "entrada" ? "brand" : "negative"}
            title={t.description}
            meta={`${formatDateBR(t.date)} · ${t.category}${t.subcategory ? ` · ${t.subcategory}` : ""}`}
            value={formatCurrency(t.amount)}
            tone={t.type === "entrada" ? "positive" : "negative"}
            actions={
              <>
                <button
                  onClick={() => onEdit(t)}
                  aria-label={`Editar transação ${t.description}`}
                  className="p-2 rounded-lg text-ink-soft hover:bg-brand-soft hover:text-brand-deep"
                >
                  <Icon name="edit" size={16} />
                </button>
                <button
                  onClick={() => onDeleteRequest(t)}
                  aria-label={`Excluir transação ${t.description}`}
                  className="p-2 rounded-lg text-ink-soft hover:bg-negative-soft hover:text-negative"
                >
                  <Icon name="trash" size={16} />
                </button>
              </>
            }
          />
        ))}
      </Ledger>

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
