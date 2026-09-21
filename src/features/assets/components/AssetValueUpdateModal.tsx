import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import type { AssetValueUpdate, AssetValueUpdateInput } from "../../../types/api";

export default function AssetValueUpdateModal({
  assetName,
  initial,
  onSubmit,
  onClose,
}: {
  assetName: string;
  initial?: AssetValueUpdate;
  onSubmit: (values: AssetValueUpdateInput) => Promise<void>;
  onClose: () => void;
}) {
  const isEditing = Boolean(initial);
  const [value, setValue] = useState(initial ? String(initial.value) : "");
  const [date, setDate] = useState(initial?.valuedAt ?? new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState(initial?.note ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const numericValue = Number(value);
    if (value === "" || Number.isNaN(numericValue) || numericValue < 0) {
      setError("O valor deve ser maior ou igual a zero.");
      return;
    }
    if (!date) {
      setError("Selecione a data desse valor.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ value: numericValue, valuedAt: date, note: note.trim() || undefined });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a atualização de saldo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={`${isEditing ? "Editar valor" : "Atualizar saldo"} — ${assetName}`} onClose={onClose} size="sm">
      <div className="flex flex-col gap-4">
        {error && <p className="text-negative text-sm font-medium">{error}</p>}

        <Input
          id="asset-value-update-value"
          label="Valor atual (R$)"
          type="number"
          min={0}
          placeholder="0,00"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />

        <Input
          id="asset-value-update-date"
          label="Data"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Input
          id="asset-value-update-note"
          label="Nota (opcional)"
          placeholder="Ex: Rendimento do mês"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Atualizar saldo"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
