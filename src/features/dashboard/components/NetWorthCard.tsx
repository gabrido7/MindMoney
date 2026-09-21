import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../../../components/ui/Card";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import { assetsService } from "../../../services/assetsService";
import { debtsService } from "../../../services/debtsService";
import { accountsService } from "../../../services/accountsService";
import { netWorthService } from "../../../services/netWorthService";
import { formatCurrency, formatMonthBR } from "../../../utils/formatters";

/**
 * Patrimônio líquido = saldo das contas + ativos - dívidas. O número
 * "central" que a auditoria estratégica apontou como a maior lacuna
 * conceitual do produto (o app só enxergava fluxo de caixa, nunca "quanto
 * você tem"). Busca as três listas já existentes (/api/accounts,
 * /api/assets, /api/debts) e soma no cliente -- mesmo padrão que Debts.tsx
 * já usa pra derivar seus próprios totais a partir da lista enriquecida,
 * em vez de um endpoint novo só pra esse número.
 */
export default function NetWorthCard() {
  const { data: accountsData, isLoading: accountsLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => accountsService.list(),
  });
  const { data: assetsData, isLoading: assetsLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () => assetsService.list(),
  });
  const { data: debtsData, isLoading: debtsLoading } = useQuery({
    queryKey: ["debts"],
    queryFn: () => debtsService.list(),
  });
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["netWorthHistory"],
    queryFn: () => netWorthService.history(6),
  });

  const isLoading = accountsLoading || assetsLoading || debtsLoading;
  const totalAccounts = (accountsData?.accounts ?? []).reduce((sum, a) => sum + a.balance, 0);
  const totalAssets = (assetsData?.assets ?? []).reduce((sum, a) => sum + a.currentValue, 0);
  const totalDebts = (debtsData?.debts ?? [])
    .filter((d) => !d.paidOff)
    .reduce((sum, d) => sum + d.remainingAmount, 0);
  const netWorth = totalAccounts + totalAssets - totalDebts;

  // Só faz sentido mostrar "evolução" com pelo menos 2 meses que já tinham
  // algo real registrado -- um único ponto não é tendência nenhuma, e mês
  // sem conta/ativo/dívida cadastrados ainda é só zero, não dado de verdade.
  const history = historyData?.history ?? [];
  const monthsWithRealData = history.filter((h) => h.totalAccounts !== 0 || h.totalAssets > 0 || h.totalDebts > 0);
  const hasEnoughHistory = monthsWithRealData.length >= 2;

  return (
    <Card title="Patrimônio líquido">
      {isLoading && <p className="text-ink-soft">Calculando...</p>}

      {!isLoading && (
        <>
          <p className={`font-data text-3xl font-bold ${netWorth >= 0 ? "text-brand-deep" : "text-negative"}`}>
            {formatCurrency(netWorth)}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Contas: <span className="font-data">{formatCurrency(totalAccounts)}</span> · Ativos:{" "}
            <span className="font-data">{formatCurrency(totalAssets)}</span> · Dívidas:{" "}
            <span className="font-data">{formatCurrency(totalDebts)}</span>
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/ativos"
              className="flex items-center gap-1.5 text-sm font-medium text-brand-deep hover:underline"
            >
              <Icon name="trendUp" size={14} />
              Ver ativos
            </Link>
            <Link
              to="/dividas"
              className="flex items-center gap-1.5 text-sm font-medium text-negative hover:underline"
            >
              <Icon name="creditCard" size={14} />
              Ver dívidas
            </Link>
          </div>

          <div className="mt-5 border-t border-line pt-4">
            <h3 className="font-display mb-2 text-sm font-semibold text-ink">Evolução do patrimônio</h3>
            {historyLoading && <p className="text-xs text-ink-soft">Calculando...</p>}
            {!historyLoading && hasEnoughHistory && (
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={history}>
                  <XAxis dataKey="month" tickFormatter={formatMonthBR} stroke="var(--ink-soft)" fontSize={11} />
                  <YAxis
                    stroke="var(--ink-soft)"
                    fontSize={11}
                    width={48}
                    tickFormatter={(value: number) => value.toLocaleString("pt-BR", { notation: "compact", maximumFractionDigits: 1 })}
                  />
                  <Tooltip
                    formatter={(value: unknown) => [formatCurrency(Number(value) || 0), "Patrimônio líquido"]}
                    labelFormatter={(label) => (typeof label === "string" ? formatMonthBR(label) : "")}
                    contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12 }}
                  />
                  <Line type="monotone" dataKey="netWorth" stroke="var(--brand)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
            {!historyLoading && !hasEnoughHistory && (
              <EmptyState message="A evolução aparece aqui conforme você for atualizando seus ativos e dívidas ao longo dos meses." />
            )}
          </div>
        </>
      )}
    </Card>
  );
}
