import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/ui/Icon";
import LogoMark from "../../../components/ui/LogoMark";
import { useAuth } from "../../../hooks/useAuth";

const NAV_LINKS = [
  { href: "#plataforma", label: "Plataforma" },
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#trilhas", label: "Trilhas" },
  { href: "#criadores", label: "Criadores" },
  { href: "#contato", label: "Contato" },
];

export default function LandingNavbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <LogoMark size={34} />
          <span className="font-display text-lg font-semibold text-ink">Mind Money</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors duration-200 hover:bg-brand-soft hover:text-brand-deep"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition-colors duration-200 hover:text-ink"
          >
            Entrar
          </Link>
          <Link
            to={user ? "/dashboard" : "/cadastro"}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-bg transition-transform duration-200 hover:scale-105"
          >
            Acessar plataforma
            <Icon name="arrowRight" size={15} />
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-ink md:hidden"
        >
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-alt hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-full border border-line px-4 py-2.5 text-center text-sm font-semibold text-ink"
            >
              Entrar
            </Link>
            <Link
              to={user ? "/dashboard" : "/cadastro"}
              onClick={() => setOpen(false)}
              className="rounded-full bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Acessar plataforma
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
