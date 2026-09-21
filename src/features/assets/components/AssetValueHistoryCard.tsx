import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import Icon from "../../../components/ui/Icon";
import { assetsService } from "../../../services/assetsService";
import { formatCurrency } from "../../../utils/formatters";

export default function AssetValueHistoryCard() {
  const { data, isLoading } = useQuery({
    queryKey: ["assetValueHistory"],
    queryFn: () => assetsService.listAllValueUpdates(),
  });
  const [search, setSearch] = useState("");

  const updates = useMemo(() => data?.updates ?? [], [data]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return updates;
    return updates.filter((u) => u.assetName.toLowerCase().includes(query));
  }, [updates, search]);

  return (
    <Card title="Histórico de valores">
      {isLoading && <p className="text-sm text-ink-soft">Carregando...</p>}

      {!isLoading && updates.length > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
          <Icon name="search" size={14} className="shrink-0 text-ink-soft" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por ativo..."
            aria-label="Filtrar histórico por nome do ativo"
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-soft focus:outline-none"
          />
        </div>
      )}

      {!isLoading && updates.length === 0 && (
        <EmptyState icon="wallet" message="Nenhuma atualização de saldo registrada ainda." />
      )}

      {!isLoading && updates.length > 0 && filtered.length === 0 && (
        <EmptyState icon="search" message={`Nenhuma atualização encontrada para "${search}".`} />
      )}

      {filtered.length > 0 && (
        <ul className="flex max-h-96 flex-col divide-y divide-line overflow-y-auto">
          {filtered.map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{u.assetName}</p>
                <p className="text-xs text-ink-soft">
                  {u.valuedAt.split("-").reverse().join("/")}
                  {u.note ? ` · ${u.note}` : ""}
                </p>
              </div>
              <span className="font-data shrink-0 text-sm text-ink">{formatCurrency(u.value)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
