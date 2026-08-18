import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import AuthField from "../features/auth/components/AuthField";
import AuthPasswordField from "../features/auth/components/AuthPasswordField";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../services/api";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Informe seu nome completo.");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-white">Criar conta</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Insira seus dados para começar a organizar sua vida financeira.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {error && (
          <p role="alert" className="text-sm font-medium text-red-400">
            {error}
          </p>
        )}

        <AuthField
          id="name"
          label="Nome completo"
          placeholder="Nome completo"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <AuthField
          id="email"
          label="E-mail"
          type="email"
          placeholder="usuario@exemplo.com.br"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthPasswordField
          id="password"
          label="Senha"
          placeholder="Mínimo de 8 caracteres"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthPasswordField
          id="confirmPassword"
          label="Confirmar senha"
          placeholder="Repita a senha"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-neutral-950 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-colors hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Criando conta..." : "Continuar"}
          {!loading && <Icon name="arrowRight" size={16} />}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-400">
        Já tenho conta.{" "}
        <Link to="/login" className="font-medium text-green-400 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
