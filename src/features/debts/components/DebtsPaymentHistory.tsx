import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import Icon from "../../../components/ui/Icon";
import { debtsService } from "../../../services/debtsService";
import { formatCurrency } from "../../../utils/formatters";

export default function DebtsPaymentHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ["debtPaymentHistory"],
    queryFn: () => debtsService.listAllPayments(),
  });
  const [search, setSearch] = useState("");

  const payments = useMemo(() => data?.payments ?? [], [data]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return payments;
    return payments.filter((p) => p.debtName.toLowerCase().includes(query));
  }, [payments, search]);

  return (
    <Card title="Histórico de pagamentos">
      {isLoading && <p className="text-sm text-ink-soft">Carregando...</p>}

      {!isLoading && payments.length > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
          <Icon name="search" size={14} className="shrink-0 text-ink-soft" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por dívida..."
            aria-label="Filtrar histórico por nome da dívida"
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-soft focus:outline-none"
          />
        </div>
      )}

      {!isLoading && payments.length === 0 && (
        <EmptyState icon="creditCard" message="Nenhum pagamento registrado ainda." />
      )}

      {!isLoading && payments.length > 0 && filtered.length === 0 && (
        <EmptyState icon="search" message={`Nenhum pagamento encontrado para "${search}".`} />
      )}

      {filtered.length > 0 && (
        <ul className="flex max-h-96 flex-col divide-y divide-line overflow-y-auto">
          {filtered.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{p.debtName}</p>
                <p className="text-xs text-ink-soft">
                  {p.paidAt.split("-").reverse().join("/")}
                  {p.note ? ` · ${p.note}` : ""}
                </p>
              </div>
              <span className="font-data shrink-0 text-sm text-ink">{formatCurrency(p.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
