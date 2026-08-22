import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/ui/Icon";
import LogoMark from "../../../components/ui/LogoMark";
import { newsletterService } from "../../../services/newsletterService";
import { ApiError } from "../../../services/api";
import Reveal from "./Reveal";

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
    <footer id="contato" className="px-4 pb-10 pt-4 md:px-8">
      <Reveal className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(12,163,12,0.4)] bg-[var(--surface)] p-8 text-center shadow-[0_0_60px_-15px_rgba(12,163,12,0.35)] sm:p-12">
          <div aria-hidden="true" className="glow-blob absolute -right-16 -top-16 h-56 w-56 opacity-25" />
          <h2 className="font-display relative text-2xl font-extrabold text-white sm:text-3xl">
            Receba novidades e dicas de educação financeira
          </h2>
          <p className="font-body relative mt-3 text-sm text-white/50">
            Sem spam. Só avisos relevantes sobre o Mind Money.
          </p>

          {status === "done" ? (
            <p className="font-body relative mx-auto mt-6 max-w-sm rounded-full border border-[rgba(12,163,12,0.4)] bg-[var(--brand-soft)] px-4 py-3 text-sm font-medium text-[var(--brand)]">
              {alreadySubscribed
                ? "Esse e-mail já está cadastrado. Obrigado pelo interesse!"
                : "Cadastro recebido! Obrigado por acompanhar o Mind Money."}
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="relative mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row"
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
                className="font-body flex-1 rounded-full border border-white/15 bg-[var(--bg)] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[var(--brand)] focus:outline-none"
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
                className="font-body flex-1 rounded-full border border-white/15 bg-[var(--bg)] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[var(--brand)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="font-body inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                {status === "loading" ? "Enviando..." : "Quero receber"}
                <Icon name="send" size={14} />
              </button>
            </form>
          )}

          {error && (
            <p role="alert" className="relative mt-3 text-sm font-medium text-red-400">
              {error}
            </p>
          )}
        </div>
      </Reveal>

      <Reveal delay={100} className="mx-auto mt-16 grid max-w-6xl gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark size={32} />
            <span className="font-display font-bold text-white">Mind Money</span>
          </div>
          <p className="font-body mt-3 text-sm text-white/40">
            Plataforma de gestão e inteligência financeira pessoal.
          </p>
        </div>

        <div>
          <h3 className="font-body text-sm font-semibold text-white">Plataforma</h3>
          <ul className="font-body mt-3 flex flex-col gap-2 text-sm text-white/50">
            <li><a href="#funcionalidades" className="transition-colors hover:text-[var(--brand)]">Funcionalidades</a></li>
            <li><a href="#trilhas" className="transition-colors hover:text-[var(--brand)]">Trilhas</a></li>
            <li><a href="#planos" className="transition-colors hover:text-[var(--brand)]">Planos</a></li>
            <li><Link to="/educacao-financeira" className="transition-colors hover:text-[var(--brand)]">Educação financeira</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-body text-sm font-semibold text-white">Conta</h3>
          <ul className="font-body mt-3 flex flex-col gap-2 text-sm text-white/50">
            <li><Link to="/login" className="transition-colors hover:text-[var(--brand)]">Entrar</Link></li>
            <li><Link to="/cadastro" className="transition-colors hover:text-[var(--brand)]">Criar conta</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-body text-sm font-semibold text-white">Redes sociais</h3>
          <div className="mt-3 flex gap-3">
            {["in", "ig", "tw"].map((label) => (
              <span
                key={label}
                className="font-body flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-white/40"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-[var(--line)] pt-6 text-xs text-white/35 sm:flex-row">
        <p className="font-body">&copy; {new Date().getFullYear()} Mind Money. Todos os direitos reservados.</p>
        <p className="font-body">Projeto acadêmico de conclusão de curso.</p>
      </div>
    </footer>
  );
}
