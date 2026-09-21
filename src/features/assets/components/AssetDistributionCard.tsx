import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import { formatCurrency } from "../../../utils/formatters";
import { ASSET_TYPE_LABELS } from "../constants";
import type { Asset, AssetType } from "../../../types/api";

/**
 * Hero da página -- o valor total em destaque (mesmo peso visual do total
 * de dívidas em DebtHealthCard), seguido de "onde" esse total está: lista
 * com barra, não gráfico de pizza -- o objetivo é responder "onde está meu
 * patrimônio" de forma escaneável, não virar mais um gráfico decorativo.
 */
export default function AssetDistributionCard({ assets }: { assets: Asset[] }) {
  const total = assets.reduce((sum, a) => sum + a.currentValue, 0);

  const byType = new Map<AssetType, number>();
  for (const asset of assets) {
    byType.set(asset.type, (byType.get(asset.type) ?? 0) + asset.currentValue);
  }
  const rows = [...byType.entries()]
    .map(([type, value]) => ({ type, value, percent: total > 0 ? (value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card title="Distribuição do patrimônio">
      <p className="font-data text-3xl font-bold text-brand-deep sm:text-4xl">{formatCurrency(total)}</p>
      <p className="text-sm text-ink-soft">
        somado em {assets.length} {assets.length === 1 ? "ativo" : "ativos"}
      </p>

      {rows.length === 0 && (
        <div className="mt-4">
          <EmptyState icon="trendUp" message="Cadastre um ativo pra ver a distribuição." />
        </div>
      )}

      {rows.length > 0 && (
        <ul className="mt-5 flex flex-col gap-3 border-t border-line pt-4">
          {rows.map((row) => (
            <li key={row.type}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-ink">{ASSET_TYPE_LABELS[row.type]}</span>
                <span className="font-data text-ink-soft">
                  {formatCurrency(row.value)} · {row.percent.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-alt">
                <div
                  className="h-2 rounded-full bg-brand transition-all duration-700 ease-out"
                  style={{ width: `${row.percent}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
