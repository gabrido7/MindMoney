import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export interface GoalFormValues {
  referenceMonth: string;
  targetAmount: number;
}

export default function GoalFormModal({
  initial,
  lockMonth,
  onSubmit,
  onClose,
}: {
  initial?: GoalFormValues;
  /** ao editar, o mês não pode mudar (é a chave da meta) */
  lockMonth?: boolean;
  onSubmit: (values: GoalFormValues) => Promise<void>;
  onClose: () => void;
}) {
  const [month, setMonth] = useState(initial?.referenceMonth ?? new Date().toISOString().slice(0, 7));
  const [amount, setAmount] = useState(initial ? String(initial.targetAmount) : "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const numericAmount = Number(amount);
    if (!month) {
      setError("Selecione o mês.");
      return;
    }
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError("O valor deve ser maior que zero.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ referenceMonth: month, targetAmount: numericAmount });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a meta.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={initial ? "Editar Meta" : "Nova Meta"} onClose={onClose} size="sm">
      <div className="flex flex-col gap-4">
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <Input
          label="Mês"
          type="month"
          value={month}
          disabled={lockMonth}
          onChange={(e) => setMonth(e.target.value)}
        />

        <Input
          label="Valor da meta (R$)"
          type="number"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Salvando..." : initial ? "Salvar" : "Criar meta"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
