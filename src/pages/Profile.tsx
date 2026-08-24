import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Icon from "../components/ui/Icon";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useApiRequest } from "../hooks/useApiRequest";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import { usersService } from "../services/usersService";
import { ApiError } from "../services/api";
import DeleteAccountModal from "../features/profile/components/DeleteAccountModal";

export default function Profile() {
  const { logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error } = useApiRequest(() => authService.me(), []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    (() => {
      if (data) {
        setName(data.user.name);
        setEmail(data.user.email);
      }
    })();
  }, [data]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setProfileSaving(true);
    try {
      const result = await usersService.updateProfile({ name, email });
      updateUser(result.user);
      setProfileSuccess(true);
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : "Não foi possível salvar o perfil.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem.");
      return;
    }

    setPasswordSaving(true);
    try {
      await usersService.changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Não foi possível trocar a senha.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async (password: string) => {
    await usersService.deleteAccount({ password });
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">Perfil</h1>

      <Card>
        {loading && <p className="text-ink-soft">Carregando...</p>}
        {error && <p className="text-negative">{error}</p>}

        {data && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-deep">
                <Icon name="user" size={22} />
              </div>
              <div>
                <p className="font-semibold text-ink">{data.user.name}</p>
                <p className="text-sm text-ink-soft">{data.user.email}</p>
              </div>
            </div>

            <p className="text-sm text-ink-soft">
              Conta criada em {new Date(data.user.createdAt).toLocaleDateString("pt-BR")}
            </p>

            <Button variant="secondary" onClick={logout} className="w-fit">
              <Icon name="logout" size={16} />
              Sair
            </Button>
          </div>
        )}
      </Card>

      <Card title="Editar dados">
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          {profileError && (
            <p role="alert" className="text-negative text-sm">
              {profileError}
            </p>
          )}
          {profileSuccess && <p className="text-brand text-sm">Perfil atualizado com sucesso.</p>}

          <Input
            id="profile-name"
            label="Nome"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setProfileSuccess(false);
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
              setProfileSuccess(false);
            }}
          />

          <Button type="submit" disabled={profileSaving} className="w-fit">
            {profileSaving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </Card>

      <Card title="Trocar senha">
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          {passwordError && (
            <p role="alert" className="text-negative text-sm">
              {passwordError}
            </p>
          )}
          {passwordSuccess && <p className="text-brand text-sm">Senha alterada com sucesso.</p>}

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

          <Button type="submit" disabled={passwordSaving} className="w-fit">
            {passwordSaving ? "Salvando..." : "Trocar senha"}
          </Button>
        </form>
      </Card>

      <Card title="Zona de risco">
        <p className="text-sm text-ink-soft mb-4">
          Excluir sua conta apaga permanentemente todos os seus dados financeiros. Essa ação não
          pode ser desfeita.
        </p>
        <Button variant="danger" onClick={() => setIsDeleteOpen(true)} className="w-fit">
          <Icon name="trash" size={16} />
          Excluir conta
        </Button>
      </Card>

      {isDeleteOpen && (
        <DeleteAccountModal onConfirm={handleDeleteAccount} onClose={() => setIsDeleteOpen(false)} />
      )}
    </div>
  );
}
