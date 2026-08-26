import { useState } from "react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import { useDebts } from "../hooks/useDebts";
import { formatCurrency } from "../../../utils/formatters";
import type { Debt, DebtType } from "../../../types/api";

const DEBT_TYPE_LABELS: Record<DebtType, string> = {
  cartao_credito: "Cartão de crédito",
  emprestimo: "Empréstimo",
  financiamento: "Financiamento",
  cheque_especial: "Cheque especial",
  parcelamento: "Parcelamento",
  outro: "Outro",
};

function DebtRow({ debt, onRemove }: { debt: Debt; onRemove: (id: number) => void }) {
  const details = [
    debt.installmentsCount && debt.installmentAmount
      ? `${debt.installmentsCount}x de ${formatCurrency(debt.installmentAmount)}`
      : null,
    debt.interestRate ? `${debt.interestRate.toLocaleString("pt-BR")}% de juros` : null,
    debt.dueDay ? `vence dia ${debt.dueDay}` : null,
  ].filter(Boolean);

  return (
    <li className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{debt.name}</p>
        <p className="text-xs text-ink-soft">
          {DEBT_TYPE_LABELS[debt.type]}
          {details.length > 0 && ` -- ${details.join(", ")}`}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-data text-sm text-ink">{formatCurrency(debt.totalAmount)}</span>
        <button
          type="button"
          onClick={() => onRemove(debt.id)}
          aria-label={`Remover dívida ${debt.name}`}
          className="text-ink-soft hover:text-negative"
        >
          <Icon name="close" size={14} />
        </button>
      </div>
    </li>
  );
}

export default function DebtsSection() {
  const { debts, isLoading, addDebt, removeDebt, isSaving } = useDebts();
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [type, setType] = useState<DebtType>("cartao_credito");
  const [name, setName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [installmentsCount, setInstallmentsCount] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setType("cartao_credito");
    setName("");
    setTotalAmount("");
    setInstallmentAmount("");
    setInterestRate("");
    setInstallmentsCount("");
    setDueDay("");
    setShowDetails(false);
    setShowForm(false);
  };

  const handleAdd = async () => {
    setFormError(null);
    if (!name.trim()) {
      setFormError("Dê um nome pra essa dívida (ex: Cartão Nubank).");
      return;
    }
    const amount = Number(totalAmount);
    if (!amount || amount <= 0) {
      setFormError("Informe o valor total, maior que zero.");
      return;
    }

    await addDebt({
      type,
      name: name.trim(),
      totalAmount: amount,
      installmentAmount: installmentAmount ? Number(installmentAmount) : null,
      interestRate: interestRate ? Number(interestRate) : null,
      installmentsCount: installmentsCount ? Number(installmentsCount) : null,
      dueDay: dueDay ? Number(dueDay) : null,
    });
    resetForm();
  };

  return (
    <Card
      title="Dívidas"
      action={
        !showForm && (
          <Button variant="secondary" onClick={() => setShowForm(true)}>
            <Icon name="plus" size={14} />
            Adicionar
          </Button>
        )
      }
    >
      {isLoading && <p className="text-sm text-ink-soft">Carregando...</p>}

      {!isLoading && debts.length === 0 && !showForm && (
        <EmptyState icon="wallet" message="Nenhuma dívida cadastrada." />
      )}

      {debts.length > 0 && (
        <ul className="flex flex-col divide-y divide-line">
          {debts.map((debt) => (
            <DebtRow key={debt.id} debt={debt} onRemove={removeDebt} />
          ))}
        </ul>
      )}

      {showForm && (
        <div className={`flex flex-col gap-3 ${debts.length > 0 ? "mt-4 border-t border-line pt-4" : ""}`}>
          <div className="flex flex-wrap gap-2">
            <Select
              id="debt-form-type"
              label="Tipo"
              value={type}
              onChange={(e) => setType(e.target.value as DebtType)}
              className="min-w-[160px] flex-1"
            >
              {Object.entries(DEBT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <Input
              id="debt-form-name"
              label="Nome"
              placeholder="Ex: Cartão Nubank"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-w-[160px] flex-1"
            />
            <Input
              id="debt-form-total"
              label="Valor total (R$)"
              type="number"
              min={1}
              step="0.01"
              placeholder="0,00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-32"
            />
          </div>

          {!showDetails && (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="self-start text-xs font-medium text-ink-soft hover:text-brand-deep"
            >
              + Adicionar parcela, juros e vencimento (opcional)
            </button>
          )}

          {showDetails && (
            <div className="flex flex-wrap gap-2">
              <Input
                id="debt-form-installment"
                label="Parcela (R$)"
                type="number"
                min={0}
                step="0.01"
                placeholder="0,00"
                value={installmentAmount}
                onChange={(e) => setInstallmentAmount(e.target.value)}
                className="w-28"
              />
              <Input
                id="debt-form-count"
                label="Nº de parcelas"
                type="number"
                min={1}
                step="1"
                placeholder="0"
                value={installmentsCount}
                onChange={(e) => setInstallmentsCount(e.target.value)}
                className="w-28"
              />
              <Input
                id="debt-form-interest"
                label="Juros (% a.m.)"
                type="number"
                min={0}
                step="0.01"
                placeholder="0,00"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-28"
              />
              <Input
                id="debt-form-dueday"
                label="Dia do vencimento"
                type="number"
                min={1}
                max={31}
                step="1"
                placeholder="1-31"
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                className="w-28"
              />
            </div>
          )}

          {formError && <p className="text-xs text-negative">{formError}</p>}

          <div className="flex items-center gap-2">
            <Button onClick={handleAdd} disabled={isSaving} className="w-fit">
              {isSaving ? "Salvando..." : "Salvar dívida"}
            </Button>
            <Button variant="ghost" onClick={resetForm} className="w-fit">
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
