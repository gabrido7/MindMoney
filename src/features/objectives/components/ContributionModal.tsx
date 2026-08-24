import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import type { ContributionInput } from "../../../services/objectivesService";

export default function ContributionModal({
  objectiveName,
  onSubmit,
  onClose,
}: {
  objectiveName: string;
  onSubmit: (values: ContributionInput) => Promise<void>;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const numericAmount = Number(amount);
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError("O valor deve ser maior que zero.");
      return;
    }
    if (!date) {
      setError("Selecione a data do aporte.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ amount: numericAmount, contributedAt: date, note: note.trim() || undefined });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível registrar o aporte.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={`Novo aporte — ${objectiveName}`} onClose={onClose} size="sm">
      <div className="flex flex-col gap-4">
        {error && <p className="text-negative text-sm font-medium">{error}</p>}

        <Input
          label="Valor (R$)"
          type="number"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Input label="Data" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <Input
          label="Nota (opcional)"
          placeholder="Ex: 13º salário"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Salvando..." : "Adicionar aporte"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
