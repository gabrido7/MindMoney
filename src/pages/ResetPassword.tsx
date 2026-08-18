import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/ui/Icon";
import AuthPasswordField from "../features/auth/components/AuthPasswordField";
import { authService } from "../services/authService";
import { ApiError } from "../services/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white">Link inválido</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Esse link de redefinição está incompleto ou já foi usado. Gere um novo para continuar.
        </p>
        <Link
          to="/esqueci-senha"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-neutral-950 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-green-400"
        >
          Gerar novo link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

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
      await authService.resetPassword({ token, password });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Não foi possível redefinir a senha."
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white">Senha redefinida</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Sua senha foi alterada com sucesso. Você já pode entrar com a nova senha.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-neutral-950 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-green-400"
        >
          Ir para o login
          <Icon name="arrowRight" size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-white">Redefinir senha</h1>
      <p className="mt-2 text-sm text-neutral-400">Escolha uma nova senha para sua conta.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {error && (
          <p role="alert" className="text-sm font-medium text-red-400">
            {error}
          </p>
        )}

        <AuthPasswordField
          id="password"
          label="Nova senha"
          placeholder="Mínimo de 8 caracteres"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthPasswordField
          id="confirmPassword"
          label="Confirmar nova senha"
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
          {loading ? "Salvando..." : "Redefinir senha"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-400">
        Link expirado ou inválido?{" "}
        <Link to="/esqueci-senha" className="font-medium text-green-400 hover:underline">
          Gerar novo
        </Link>
      </p>
    </div>
  );
}
