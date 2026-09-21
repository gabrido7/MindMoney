import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import type { AssetInput, AssetType } from "../../../types/api";
import { ASSET_TYPE_LABELS } from "../constants";

export default function AddAssetModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (input: AssetInput) => Promise<void>;
  onClose: () => void;
}) {
  const [type, setType] = useState<AssetType>("investimento");
  const [name, setName] = useState("");
  const [initialValue, setInitialValue] = useState("");
  const [valuedAt, setValuedAt] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Dê um nome pra esse ativo (ex: Tesouro Selic).");
      return;
    }
    const value = Number(initialValue);
    if (initialValue === "" || Number.isNaN(value) || value < 0) {
      setError("Informe o valor atual, maior ou igual a zero.");
      return;
    }
    if (!valuedAt) {
      setError("Selecione a data desse valor.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ type, name: name.trim(), initialValue: value, valuedAt });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o ativo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Novo ativo" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {error && <p className="text-sm font-medium text-negative">{error}</p>}

        <div className="flex flex-wrap gap-2">
          <Select
            id="asset-form-type"
            label="Tipo"
            value={type}
            onChange={(e) => setType(e.target.value as AssetType)}
            className="min-w-[160px] flex-1"
          >
            {Object.entries(ASSET_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Input
            id="asset-form-name"
            label="Nome"
            placeholder="Ex: Tesouro Selic"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-w-[160px] flex-1"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Input
            id="asset-form-value"
            label="Valor atual (R$)"
            type="number"
            min={0}
            step="0.01"
            placeholder="0,00"
            value={initialValue}
            onChange={(e) => setInitialValue(e.target.value)}
            className="min-w-[140px] flex-1"
          />
          <Input
            id="asset-form-valuedat"
            label="Data desse valor"
            type="date"
            value={valuedAt}
            onChange={(e) => setValuedAt(e.target.value)}
            className="min-w-[140px] flex-1"
          />
        </div>

        <p className="text-xs text-ink-soft">
          Cada ativo deve refletir o saldo real de hoje. Se você transferir dinheiro de uma conta pra este ativo (ou
          entre dois ativos já cadastrados), atualize os dois -- não conte o mesmo valor duas vezes no seu
          patrimônio.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar ativo"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
