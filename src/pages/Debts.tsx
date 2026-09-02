import { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import { useDebts } from "../features/debts/hooks/useDebts";
import DebtAdviceCard from "../features/debts/components/DebtAdviceCard";
import DebtStrategyInfo from "../features/debts/components/DebtStrategyInfo";
import DebtStrategySelector from "../features/debts/components/DebtStrategySelector";
import DebtsSection from "../features/debts/components/DebtsSection";
import DebtsPaymentHistory from "../features/debts/components/DebtsPaymentHistory";
import AddDebtModal from "../features/debts/components/AddDebtModal";
import { simulatePayoff } from "../features/debts/utils/simulatePayoff";
import { formatCurrency } from "../utils/formatters";

export default function Debts() {
  const { debts, isLoading, addDebt, removeDebt } = useDebts();
  const [showAddModal, setShowAddModal] = useState(false);

  const activeDebts = debts.filter((d) => !d.paidOff);
  const totalOwed = activeDebts.reduce((sum, d) => sum + d.remainingAmount, 0);
  const totalPaid = debts.reduce((sum, d) => sum + d.paidAmount, 0);
  const projectedInterest = activeDebts.reduce((sum, d) => {
    if (!d.installmentAmount) return sum;
    const result = simulatePayoff(d.remainingAmount, d.interestRate ?? 0, d.installmentAmount);
    return sum + (result && !result.insufficientPayment ? result.totalInterest : 0);
  }, 0);
  const hasProjection = activeDebts.some((d) => d.installmentAmount);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-negative-soft text-negative">
            <Icon name="creditCard" size={20} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Central de Dívidas</h1>
            <p className="text-sm text-ink-soft">Acompanhe, pague e planeje a saída de cada dívida.</p>
          </div>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Icon name="plus" size={16} />
          Adicionar dívida
        </Button>
      </div>

      {isLoading && <p className="text-ink-soft">Carregando...</p>}

      {!isLoading && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <h3 className="text-sm text-ink-soft">Total devido</h3>
              <p className="font-data text-xl font-bold text-negative">{formatCurrency(totalOwed)}</p>
            </Card>
            <Card>
              <h3 className="text-sm text-ink-soft">Total pago</h3>
              <p className="font-data text-xl font-bold text-brand">{formatCurrency(totalPaid)}</p>
            </Card>
            <Card>
              <h3 className="text-sm text-ink-soft">Dívidas ativas</h3>
              <p className="font-data text-xl font-bold text-ink">{activeDebts.length}</p>
            </Card>
            <Card>
              <h3 className="text-sm text-ink-soft">Projeção de juros</h3>
              <p className="font-data text-xl font-bold text-ink">
                {hasProjection ? formatCurrency(projectedInterest) : "—"}
              </p>
            </Card>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <DebtAdviceCard />
              {activeDebts.length >= 2 && <DebtStrategySelector debts={debts} />}
            </div>
            {activeDebts.length >= 2 && (
              <div className="min-w-0 flex-1">
                <DebtStrategyInfo debts={debts} />
              </div>
            )}
          </div>

          <DebtsSection debts={debts} isLoading={isLoading} onRemove={removeDebt} />

          <DebtsPaymentHistory />
        </>
      )}

      {showAddModal && (
        <AddDebtModal
          onSubmit={async (input) => {
            await addDebt(input);
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
