import { useEffect, useState, type FormEvent } from "react";
import Card from "../../../../components/ui/Card";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import { useAuth } from "../../../../hooks/useAuth";
import { usersService } from "../../../../services/usersService";
import { ApiError } from "../../../../services/api";

export default function AccountTab() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (() => {
      if (user) {
        setName(user.name);
        setEmail(user.email);
      }
    })();
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      const result = await usersService.updateProfile({ name, email });
      updateUser(result.user);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível salvar o perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Informações pessoais">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p role="alert" className="text-negative text-sm">
            {error}
          </p>
        )}
        {success && <p className="text-brand text-sm">Perfil atualizado com sucesso.</p>}

        <Input
          id="profile-name"
          label="Nome"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSuccess(false);
          }}
        />
        <Input
          id="profile-email"
          label="E-mail"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setSuccess(false);
          }}
        />

        <p className="text-xs text-ink-soft">
          Conta criada em {new Date(user.createdAt).toLocaleDateString("pt-BR")}.
        </p>

        <Button type="submit" disabled={saving} className="w-fit">
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Card>
  );
}
