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
  const [acceptTerms, setAcceptTerms] = useState(false);
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

    if (!acceptTerms) {
      setError("Para criar a conta, aceite os Termos de Uso e a Política de Privacidade.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, acceptTerms);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-bold text-white">Criar conta</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Insira seus dados para começar a organizar sua vida financeira.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {error && (
          <p role="alert" className="text-sm font-medium text-negative">
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

        <div className="flex items-start gap-3">
          <input
            id="acceptTerms"
            type="checkbox"
            required
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-white/20 bg-neutral-800 accent-[#22c55e] focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-neutral-950"
          />
          <label htmlFor="acceptTerms" className="text-sm leading-snug text-neutral-300">
            Li e concordo com os{" "}
            <Link to="/termos" target="_blank" className="font-medium text-brand hover:underline">
              Termos de Uso
            </Link>{" "}
            e com a{" "}
            <Link to="/privacidade" target="_blank" className="font-medium text-brand hover:underline">
              Política de Privacidade
            </Link>
            .
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-neutral-950 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Criando conta..." : "Continuar"}
          {!loading && <Icon name="arrowRight" size={16} />}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-400">
        Já tenho conta.{" "}
        <Link to="/login" className="font-medium text-brand hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
