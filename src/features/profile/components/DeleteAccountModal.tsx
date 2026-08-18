import { useState, type FormEvent } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function DeleteAccountModal({
  onConfirm,
  onClose,
}: {
  onConfirm: (password: string) => Promise<void>;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onConfirm(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível excluir a conta.");
      setLoading(false);
    }
  };

  return (
    <Modal title="Excluir conta" onClose={onClose} size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-gray-600 dark:text-gray-300">
          Essa ação é <strong>permanente</strong>: todas as suas transações, categorias, metas e
          notificações serão apagadas para sempre. Digite sua senha para confirmar.
        </p>

        <Input
          id="delete-password"
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p role="alert" className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="danger" disabled={loading}>
            {loading ? "Excluindo..." : "Excluir minha conta"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
