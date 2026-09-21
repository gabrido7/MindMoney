import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import Switch from "../../../components/ui/Switch";
import { formatCurrency } from "../../../utils/formatters";
import type { DebtInput, DebtType } from "../../../types/api";

const DEBT_TYPE_LABELS: Record<DebtType, string> = {
  cartao_credito: "Cartão de crédito",
  emprestimo: "Empréstimo",
  financiamento: "Financiamento",
  cheque_especial: "Cheque especial",
  parcelamento: "Parcelamento",
  outro: "Outro",
};

/** Tipos onde "lançar uma compra parcelada agora" é o caso de uso comum -- o checkbox de gerar parcelas automaticamente já nasce marcado. Empréstimo/financiamento costumam ser dívida já existente sendo só acompanhada, não uma compra nova. */
const AUTO_GENERATE_DEFAULT_TYPES: DebtType[] = ["parcelamento", "cartao_credito"];

export default function AddDebtModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (input: DebtInput) => Promise<void>;
  onClose: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [type, setType] = useState<DebtType>("cartao_credito");
  const [name, setName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [installmentsCount, setInstallmentsCount] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [autoGenerate, setAutoGenerate] = useState(() => AUTO_GENERATE_DEFAULT_TYPES.includes("cartao_credito"));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleTypeChange = (next: DebtType) => {
    setType(next);
    setAutoGenerate(AUTO_GENERATE_DEFAULT_TYPES.includes(next));
  };

  const canAutoGenerate = Boolean(Number(installmentAmount) > 0 && Number(installmentsCount) > 0 && Number(dueDay) > 0);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Dê um nome pra essa dívida (ex: Cartão Nubank).");
      return;
    }
    const amount = Number(totalAmount);
    if (!amount || amount <= 0) {
      setError("Informe o valor total, maior que zero.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        type,
        name: name.trim(),
        totalAmount: amount,
        installmentAmount: installmentAmount ? Number(installmentAmount) : null,
        interestRate: interestRate ? Number(interestRate) : null,
        installmentsCount: installmentsCount ? Number(installmentsCount) : null,
        dueDay: dueDay ? Number(dueDay) : null,
        autoGenerateInstallments: canAutoGenerate && autoGenerate,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a dívida.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Nova dívida" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {error && <p className="text-sm font-medium text-negative">{error}</p>}

        <div className="flex flex-wrap gap-2">
          <Select
            id="debt-form-type"
            label="Tipo"
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as DebtType)}
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
        </div>

        <Input
          id="debt-form-total"
          label="Valor total (R$)"
          type="number"
          min={1}
          step="0.01"
          placeholder="0,00"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
        />

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

        {showDetails && canAutoGenerate && (
          <div className="flex items-start gap-3 rounded-xl border border-line bg-surface-alt p-3">
            <Switch checked={autoGenerate} onChange={setAutoGenerate} label="Já lançar as parcelas futuras como transações" />
            <div className="min-w-0 flex-1 text-xs text-ink-soft">
              <p className="font-medium text-ink">Já lançar as parcelas futuras como transações</p>
              <p className="mt-0.5">
                {autoGenerate
                  ? `Isso vai criar ${installmentsCount} transações de ${formatCurrency(Number(installmentAmount))}, uma por mês, começando no dia ${dueDay}. Sem isso marcado, você registra cada parcela manualmente depois.`
                  : "Deixe marcado se essa é uma compra nova sendo parcelada agora -- as parcelas futuras entram como transações reais de uma vez, sem precisar registrar mês a mês."}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar dívida"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
