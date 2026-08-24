import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon";
import AuthField from "../features/auth/components/AuthField";
import { authService } from "../services/authService";
import { ApiError } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ message: string; token?: string; expiresAt?: string } | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  const resetLink = result?.token
    ? `${window.location.origin}/redefinir-senha?token=${result.token}`
    : null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.forgotPassword({ email });
      setResult(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível processar o pedido.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!resetLink) return;
    try {
      await navigator.clipboard.writeText(resetLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível (ex: contexto não seguro) -- sem efeito colateral crítico
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-bold text-white">Esqueci minha senha</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Informe seu e-mail para gerar um link de redefinição.
      </p>

      {!result ? (
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

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-neutral-950 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Gerando link..." : "Gerar link de redefinição"}
          </button>
        </form>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          <p className="text-sm text-neutral-300">{result.message}</p>

          {resetLink ? (
            <div className="rounded-xl border border-brand-soft bg-brand-soft p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand">
                <Icon name="shield" size={12} />
                Modo demonstração — sem e-mail configurado
              </p>
              <p className="mt-2 break-all rounded-lg bg-neutral-900 px-3 py-2 text-xs text-neutral-300 font-data">
                {resetLink}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Link
                  to={`/redefinir-senha?token=${result.token}`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-brand-deep"
                >
                  Ir para redefinição
                  <Icon name="arrowRight" size={14} />
                </Link>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:border-brand hover:text-brand"
                >
                  {copied ? "Copiado!" : "Copiar link"}
                </button>
              </div>
              <p className="mt-3 text-xs text-neutral-500">Válido por 30 minutos, uso único.</p>
            </div>
          ) : null}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-neutral-400">
        Lembrou a senha?{" "}
        <Link to="/login" className="font-medium text-brand hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
