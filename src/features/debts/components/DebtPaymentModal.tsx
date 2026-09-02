import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import type { DebtPayment, DebtPaymentInput } from "../../../types/api";

export default function DebtPaymentModal({
  debtName,
  initial,
  onSubmit,
  onClose,
}: {
  debtName: string;
  initial?: DebtPayment;
  onSubmit: (values: DebtPaymentInput) => Promise<void>;
  onClose: () => void;
}) {
  const isEditing = Boolean(initial);
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [date, setDate] = useState(initial?.paidAt ?? new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState(initial?.note ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const numericAmount = Number(amount);
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError("O valor deve ser maior que zero.");
      return;
    }
    if (!date) {
      setError("Selecione a data do pagamento.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ amount: numericAmount, paidAt: date, note: note.trim() || undefined });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o pagamento.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={`${isEditing ? "Editar pagamento" : "Novo pagamento"} — ${debtName}`} onClose={onClose} size="sm">
      <div className="flex flex-col gap-4">
        {error && <p className="text-negative text-sm font-medium">{error}</p>}

        <Input
          id="debt-payment-amount"
          label="Valor (R$)"
          type="number"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
        />

        <Input id="debt-payment-date" label="Data" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <Input
          id="debt-payment-note"
          label="Nota (opcional)"
          placeholder="Ex: Parcela de agosto"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Registrar pagamento"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
