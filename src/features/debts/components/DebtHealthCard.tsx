import Card from "../../../components/ui/Card";
import ProgressBar from "../../../components/ui/ProgressBar";
import { formatCurrency } from "../../../utils/formatters";
import type { Debt } from "../../../types/api";

/**
 * Bloco "hero" da página -- o valor mais importante (quanto você já deveu
 * no total) com o maior destaque visual, seguido de uma barra de progresso
 * agregada. Os 4 cards de estatística de antes eram todos visualmente
 * iguais; este card resolve isso concentrando "quanto devia / quanto pagou
 * / quanto falta" num só lugar, com hierarquia real.
 */
export default function DebtHealthCard({ debts }: { debts: Debt[] }) {
  const totalOriginal = debts.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalPaid = debts.reduce((sum, d) => sum + d.paidAmount, 0);
  const totalRemaining = Math.max(0, totalOriginal - totalPaid);
  const percentPaid = totalOriginal > 0 ? Math.min(100, (totalPaid / totalOriginal) * 100) : 0;

  return (
    <Card title="Saúde das dívidas">
      <p className="font-data text-3xl font-bold text-ink sm:text-4xl">{formatCurrency(totalOriginal)}</p>
      <p className="text-sm text-ink-soft">valor original de todas as suas dívidas</p>

      <div className="mt-4">
        <ProgressBar percent={percentPaid} />
        <p className="font-data mt-1 text-right text-xs text-ink-soft">{percentPaid.toFixed(0)}% quitado</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-6">
        <div>
          <p className="text-xs text-ink-soft">Pago até agora</p>
          <p className="font-data text-lg font-semibold text-brand-deep">{formatCurrency(totalPaid)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-soft">Ainda falta</p>
          <p className="font-data text-lg font-semibold text-negative">{formatCurrency(totalRemaining)}</p>
        </div>
      </div>
    </Card>
  );
}
