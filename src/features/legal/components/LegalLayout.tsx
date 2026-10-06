import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoMark from "../../../components/ui/LogoMark";
import Icon from "../../../components/ui/Icon";
import { LEGAL_LAST_UPDATED } from "../legalInfo";

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="flex list-disc flex-col gap-1.5 pl-5">{children}</ul>;
}

/** Link para fora do site: abre em outra aba, sem passar o endereço de origem. */
export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-brand-deep underline underline-offset-2 hover:text-brand"
    >
      {children}
    </a>
  );
}

export default function LegalLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  const { hash } = useLocation();

  // O React Router não rola até o #âncora sozinho (ex.: /privacidade#contato).
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <LogoMark size={32} />
            <span className="font-display text-lg font-semibold text-ink">Mind Money</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-ink-soft" aria-label="Documentos legais">
            <Link to="/termos" className="transition-colors hover:text-brand-deep">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="transition-colors hover:text-brand-deep">
              Privacidade
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
          <p className="font-data text-xs text-ink-soft">Última atualização: {LEGAL_LAST_UPDATED}</p>
          <p className="text-[15px] leading-relaxed text-ink-soft">{intro}</p>
        </div>

        {children}

        <div className="border-t border-line pt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-brand-deep hover:text-brand">
            <Icon name="arrowRight" size={14} className="rotate-180" />
            Voltar para o início
          </Link>
        </div>
      </main>
    </div>
  );
}
