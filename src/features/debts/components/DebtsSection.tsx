import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import ProgressBar from "../../../components/ui/ProgressBar";
import { debtsService } from "../../../services/debtsService";
import { errorMessage } from "../../../services/api";
import { invalidateFinancialData } from "../../../lib/invalidateFinancialData";
import { formatCurrency } from "../../../utils/formatters";
import DebtPaymentModal from "./DebtPaymentModal";
import DebtSimulator from "./DebtSimulator";
import type { Debt, DebtPayment, DebtType } from "../../../types/api";

const DEBT_TYPE_LABELS: Record<DebtType, string> = {
  cartao_credito: "Cartão de crédito",
  emprestimo: "Empréstimo",
  financiamento: "Financiamento",
  cheque_especial: "Cheque especial",
  parcelamento: "Parcelamento",
  outro: "Outro",
};

function DebtRow({ debt, onRemove }: { debt: Debt; onRemove: (id: number) => void }) {
  const queryClient = useQueryClient();
  const [showPayments, setShowPayments] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [paymentModal, setPaymentModal] = useState<"add" | DebtPayment | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const details = [
    debt.installmentsCount && debt.installmentAmount
      ? `${debt.installmentsCount}x de ${formatCurrency(debt.installmentAmount)}`
      : null,
    debt.interestRate ? `${debt.interestRate.toLocaleString("pt-BR")}% de juros` : null,
    debt.dueDay ? `vence dia ${debt.dueDay}` : null,
  ].filter(Boolean);

  const { data, isLoading } = useQuery({
    queryKey: ["debtPayments", debt.id],
    queryFn: () => debtsService.listPayments(debt.id),
    enabled: showPayments,
  });

  // Um pagamento de dívida agora gera uma transação real (categoria
  // "Dívidas") -- precisa invalidar o mesmo conjunto de caches que qualquer
  // outra mutação financeira (transações, dashboard, score, notificações),
  // não só a própria lista de dívidas. debtAdvice também depende do estado
  // das dívidas (quanto falta pagar, comprometimento de renda etc.) -- sem
  // invalidar aqui, o card "Como sair da dívida" ficava com conselhos
  // desatualizados até a página ser recarregada manualmente.
  const invalidateAfterPayment = () => {
    invalidateFinancialData(queryClient);
    queryClient.invalidateQueries({ queryKey: ["debts"] });
    queryClient.invalidateQueries({ queryKey: ["debtPayments", debt.id] });
    queryClient.invalidateQueries({ queryKey: ["debtPaymentHistory"] });
    queryClient.invalidateQueries({ queryKey: ["debtAdvice"] });
  };

  const addPaymentMutation = useMutation({
    mutationFn: (input: Parameters<typeof debtsService.addPayment>[1]) => debtsService.addPayment(debt.id, input),
    onSuccess: invalidateAfterPayment,
  });

  const updatePaymentMutation = useMutation({
    mutationFn: (vars: { paymentId: number; input: Parameters<typeof debtsService.updatePayment>[2] }) =>
      debtsService.updatePayment(debt.id, vars.paymentId, vars.input),
    onSuccess: invalidateAfterPayment,
  });

  const removePaymentMutation = useMutation({
    mutationFn: (paymentId: number) => debtsService.removePayment(debt.id, paymentId),
    onSuccess: () => {
      invalidateAfterPayment();
      setRemoveError(null);
    },
    onError: (err) => setRemoveError(errorMessage(err) ?? "Não foi possível remover o pagamento."),
  });

  return (
    <li className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{debt.name}</p>
          <p className="text-xs text-ink-soft">
            {DEBT_TYPE_LABELS[debt.type]}
            {details.length > 0 && ` -- ${details.join(", ")}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {debt.paidOff ? (
            <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-deep">
              Quitada 🎉
            </span>
          ) : (
            <span className="font-data text-sm text-ink">{formatCurrency(debt.remainingAmount)} restantes</span>
          )}
          <button
            type="button"
            onClick={() => onRemove(debt.id)}
            aria-label={`Remover dívida ${debt.name}`}
            className="text-ink-soft hover:text-negative"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      </div>

      <div className="mt-2">
        <ProgressBar percent={debt.progressPercent} />
        <p className="font-data mt-1 text-right text-[11px] text-ink-soft">
          {formatCurrency(debt.paidAmount)} pago / {formatCurrency(debt.totalAmount)}
        </p>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        {!debt.paidOff && (
          <Button variant="secondary" onClick={() => setPaymentModal("add")} className="text-xs">
            <Icon name="plus" size={12} />
            Registrar pagamento
          </Button>
        )}
        <button
          type="button"
          onClick={() => setShowPayments((v) => !v)}
          className="flex items-center gap-1 text-xs text-ink-soft transition-colors hover:text-brand"
        >
          {showPayments ? "Ocultar pagamentos" : "Ver pagamentos"}
          <Icon
            name="chevronDown"
            size={12}
            className={`transition-transform duration-200 ${showPayments ? "rotate-180" : ""}`}
          />
        </button>
        {!debt.paidOff && (
          <button
            type="button"
            onClick={() => setShowSimulator((v) => !v)}
            className="flex items-center gap-1 text-xs text-ink-soft transition-colors hover:text-brand"
          >
            <Icon name="sparkles" size={12} />
            {showSimulator ? "Ocultar detalhes" : "Ver detalhes e simular"}
            <Icon
              name="chevronDown"
              size={12}
              className={`transition-transform duration-200 ${showSimulator ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {showSimulator && !debt.paidOff && (
        <div className="motion-reduce:animate-none animate-fade-in mt-3 border-t border-line pt-3">
          <DebtSimulator debt={debt} />
        </div>
      )}

      {showPayments && (
        <div className="motion-reduce:animate-none animate-fade-in mt-3 border-t border-line pt-3">
          {isLoading && <p className="text-xs text-ink-soft">Carregando...</p>}
          {removeError && <p className="mb-2 text-xs text-negative">{removeError}</p>}
          {data && data.payments.length === 0 && (
            <p className="text-xs text-ink-soft">Nenhum pagamento registrado ainda.</p>
          )}
          {data && data.payments.length > 0 && (
            <ul className="flex flex-col gap-2">
              {data.payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="font-data text-ink-soft">
                    {p.paidAt.split("-").reverse().join("/")} · {formatCurrency(p.amount)}
                    {p.note ? ` · ${p.note}` : ""}
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPaymentModal(p)}
                      aria-label="Editar pagamento"
                      className="rounded p-1 text-ink-soft transition-colors hover:bg-surface-alt hover:text-brand active:scale-90"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePaymentMutation.mutate(p.id)}
                      disabled={removePaymentMutation.isPending}
                      aria-label="Remover pagamento"
                      className="rounded p-1 text-negative transition-colors hover:bg-negative-soft active:scale-90"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {paymentModal && (
        <DebtPaymentModal
          debtName={debt.name}
          initial={typeof paymentModal === "object" ? paymentModal : undefined}
          onSubmit={async (values) => {
            if (typeof paymentModal === "object") {
              await updatePaymentMutation.mutateAsync({ paymentId: paymentModal.id, input: values });
            } else {
              await addPaymentMutation.mutateAsync(values);
            }
          }}
          onClose={() => setPaymentModal(null)}
        />
      )}
    </li>
  );
}

export default function DebtsSection({
  debts,
  isLoading,
  onRemove,
}: {
  debts: Debt[];
  isLoading: boolean;
  onRemove: (id: number) => void;
}) {
  return (
    <Card title="Suas dívidas">
      {isLoading && <p className="text-sm text-ink-soft">Carregando...</p>}

      {!isLoading && debts.length === 0 && (
        <EmptyState icon="creditCard" message="Nenhuma dívida cadastrada." />
      )}

      {debts.length > 0 && (
        <ul className="flex max-h-[36rem] flex-col gap-3 overflow-y-auto pr-1">
          {debts.map((debt) => (
            <DebtRow key={debt.id} debt={debt} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </Card>
  );
}
