import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/ui/Icon";
import LogoMark from "../../../components/ui/LogoMark";
import { newsletterService } from "../../../services/newsletterService";
import { ApiError } from "../../../services/api";

export default function NewsletterFooter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("loading");

    try {
      const result = await newsletterService.subscribe({ name, email });
      setAlreadySubscribed(result.alreadySubscribed);
      setStatus("done");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível cadastrar. Tente novamente.");
      setStatus("idle");
    }
  };

  return (
    <footer id="contato" className="border-t border-white/10 px-4 pb-10 pt-20 md:px-8">
      <div className="mx-auto max-w-4xl rounded-2xl border border-green-500/30 bg-neutral-900/70 p-8 text-center shadow-[0_0_40px_rgba(34,197,94,0.12)] sm:p-12">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
          Receba novidades e dicas de educação financeira
        </h2>
        <p className="mt-3 text-sm text-neutral-400">
          Sem spam. Só avisos relevantes sobre o Mind Money.
        </p>

        {status === "done" ? (
          <p className="mx-auto mt-6 max-w-sm rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-400">
            {alreadySubscribed
              ? "Esse e-mail já está cadastrado. Obrigado pelo interesse!"
              : "Cadastro recebido! Obrigado por acompanhar o Mind Money."}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-name" className="sr-only">
              Nome
            </label>
            <input
              id="newsletter-name"
              type="text"
              required
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-full border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-green-400 focus:outline-none"
            />
            <label htmlFor="newsletter-email" className="sr-only">
              E-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-full border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-green-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-green-400 disabled:opacity-50"
            >
              {status === "loading" ? "Enviando..." : "Quero receber"}
              <Icon name="send" size={14} />
            </button>
          </form>
        )}

        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-red-400">
            {error}
          </p>
        )}
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark size={32} />
            <span className="font-bold text-white">Mind Money</span>
          </div>
          <p className="mt-3 text-sm text-neutral-500">
            Plataforma de gestão e inteligência financeira pessoal.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Plataforma</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-400">
            <li><a href="#funcionalidades" className="hover:text-green-400">Funcionalidades</a></li>
            <li><a href="#planos" className="hover:text-green-400">Planos</a></li>
            <li><Link to="/educacao-financeira" className="hover:text-green-400">Educação financeira</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Conta</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-400">
            <li><Link to="/login" className="hover:text-green-400">Entrar</Link></li>
            <li><Link to="/cadastro" className="hover:text-green-400">Criar conta</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Redes sociais</h3>
          <div className="mt-3 flex gap-3">
            {["in", "ig", "tw"].map((label) => (
              <span
                key={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-neutral-400"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-neutral-500 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Mind Money. Todos os direitos reservados.</p>
        <p>Projeto acadêmico de conclusão de curso.</p>
      </div>
    </footer>
  );
}
