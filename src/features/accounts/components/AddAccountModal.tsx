import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import type { AccountInput, AccountType } from "../../../types/api";

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  corrente: "Conta corrente",
  poupanca: "Poupança",
  carteira: "Carteira",
  outro: "Outro",
};

export default function AddAccountModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (input: AccountInput) => Promise<void>;
  onClose: () => void;
}) {
  const [type, setType] = useState<AccountType>("corrente");
  const [name, setName] = useState("");
  const [initialBalance, setInitialBalance] = useState("0");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Dê um nome pra essa conta (ex: Nubank).");
      return;
    }
    const balance = Number(initialBalance);
    if (initialBalance !== "" && Number.isNaN(balance)) {
      setError("Informe um saldo inicial válido.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ type, name: name.trim(), initialBalance: balance || 0 });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a conta.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Nova conta" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {error && <p className="text-sm font-medium text-negative">{error}</p>}

        <div className="flex flex-wrap gap-2">
          <Select
            id="account-form-type"
            label="Tipo"
            value={type}
            onChange={(e) => setType(e.target.value as AccountType)}
            className="min-w-[160px] flex-1"
          >
            {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Input
            id="account-form-name"
            label="Nome"
            placeholder="Ex: Nubank"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-w-[160px] flex-1"
          />
        </div>

        <Input
          id="account-form-balance"
          label="Saldo inicial (R$)"
          type="number"
          step="0.01"
          placeholder="0,00"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
        />
        <p className="text-xs text-ink-soft">
          O saldo de hoje em diante é sempre calculado a partir das transações lançadas nessa conta -- este valor é
          só o ponto de partida, o quanto ela já tinha antes de você começar a usar o MindMoney.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar conta"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
