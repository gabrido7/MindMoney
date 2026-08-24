import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import AuthField from "../features/auth/components/AuthField";
import AuthPasswordField from "../features/auth/components/AuthPasswordField";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      const redirectTo = (location.state as { from?: string })?.from ?? "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-bold text-white">Entrar</h1>
      <p className="mt-2 text-sm text-neutral-400">Acesse sua conta para continuar.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {error && (
          <p role="alert" className="text-sm font-medium text-negative">
            {error}
          </p>
        )}

        <AuthField
          id="email"
          label="E-mail"
          type="email"
          placeholder="Digite seu e-mail"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthPasswordField
          id="password"
          label="Senha"
          placeholder="Digite sua senha"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link
          to="/esqueci-senha"
          className="-mt-2 self-end text-xs font-medium text-neutral-400 hover:text-brand hover:underline"
        >
          Esqueci minha senha
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-neutral-950 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
          {!loading && <Icon name="arrowRight" size={16} />}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-400">
        Não tenho conta.{" "}
        <Link to="/cadastro" className="font-medium text-brand hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
