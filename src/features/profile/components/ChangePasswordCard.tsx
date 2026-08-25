import { useState, type FormEvent } from "react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { usersService } from "../../../services/usersService";
import { ApiError } from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";
import { formatRelative } from "../utils/relativeTime";

export default function ChangePasswordCard() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setSaving(true);
    try {
      await usersService.changePassword({ currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível trocar a senha.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Senha">
      <p className="text-xs text-ink-soft mb-4">
        {user?.passwordChangedAt
          ? `Alterada ${formatRelative(user.passwordChangedAt)}.`
          : "Você ainda não trocou a senha desde que criou a conta."}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p role="alert" className="text-negative text-sm">
            {error}
          </p>
        )}
        {success && <p className="text-brand text-sm">Senha alterada com sucesso.</p>}

        <Input
          id="current-password"
          label="Senha atual"
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Input
          id="new-password"
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          id="confirm-new-password"
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" disabled={saving} className="w-fit">
          {saving ? "Salvando..." : "Trocar senha"}
        </Button>
      </form>
    </Card>
  );
}
