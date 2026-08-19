import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { CATEGORY_PRESETS } from "../data/categoryPresets";
import { currentMonth } from "../../../utils/formatters";
import type { ApiObjective, ObjectiveCategory } from "../../../types/api";
import type { ObjectiveInput } from "../../../services/objectivesService";

export default function ObjectiveFormModal({
  initial,
  onSubmit,
  onSubmitWithInitialContribution,
  onClose,
}: {
  initial?: ApiObjective;
  onSubmit: (values: ObjectiveInput) => Promise<void>;
  /** só usado ao criar: lança um primeiro aporte logo após criar o objetivo, se o usuário preencher um valor inicial. */
  onSubmitWithInitialContribution?: (values: ObjectiveInput, initialAmount: number) => Promise<void>;
  onClose: () => void;
}) {
  const [category, setCategory] = useState<ObjectiveCategory>(initial?.category ?? "compra");
  const [name, setName] = useState(initial?.name ?? "");
  const [targetAmount, setTargetAmount] = useState(initial ? String(initial.targetAmount) : "");
  const [targetMonth, setTargetMonth] = useState(initial?.targetMonth ?? currentMonth());
  const [initialAmount, setInitialAmount] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const preset = CATEGORY_PRESETS.find((c) => c.value === category);

  const handleSubmit = async () => {
    const numericTarget = Number(targetAmount);
    if (name.trim().length < 2) {
      setError("Dê um nome para a meta.");
      return;
    }
    if (!targetAmount || Number.isNaN(numericTarget) || numericTarget <= 0) {
      setError("O valor objetivo deve ser maior que zero.");
      return;
    }
    if (!targetMonth) {
      setError("Escolha o prazo da meta.");
      return;
    }

    const numericInitial = Number(initialAmount) || 0;
    if (initialAmount && (Number.isNaN(numericInitial) || numericInitial < 0)) {
      setError("O valor inicial não pode ser negativo.");
      return;
    }

    setError("");
    setSubmitting(true);
    const values: ObjectiveInput = { name: name.trim(), category, targetAmount: numericTarget, targetMonth };
    try {
      if (!initial && numericInitial > 0 && onSubmitWithInitialContribution) {
        await onSubmitWithInitialContribution(values, numericInitial);
      } else {
        await onSubmit(values);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a meta.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={initial ? "Editar Meta" : "Nova Meta"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
            Categoria
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORY_PRESETS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-2.5 text-xs transition-colors ${
                  category === c.value
                    ? "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                    : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-lg">{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {!!preset?.suggestions.length && (
          <div className="flex flex-wrap gap-2 -mt-1">
            {preset.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setName(s)}
                className="rounded-full border border-gray-200 dark:border-gray-600 px-3 py-1 text-xs text-gray-600 dark:text-gray-300 hover:border-green-400 hover:text-green-600"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <Input
          label="Nome da meta"
          placeholder={preset?.suggestions[0] ?? "Ex: Reserva de emergência"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Valor objetivo (R$)"
          type="number"
          placeholder="0,00"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />

        <Input
          label="Prazo"
          type="month"
          value={targetMonth}
          onChange={(e) => setTargetMonth(e.target.value)}
        />

        {!initial && (
          <Input
            label="Já tem algo guardado? (opcional)"
            type="number"
            placeholder="0,00"
            value={initialAmount}
            onChange={(e) => setInitialAmount(e.target.value)}
          />
        )}

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
