import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/ui/Icon";
import LogoMark from "../../../components/ui/LogoMark";
import { useAuth } from "../../../hooks/useAuth";

const NAV_LINKS = [
  { href: "#plataforma", label: "Plataforma", pill: true },
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#trilhas", label: "Trilhas" },
  { href: "#criadores", label: "Criadores" },
  { href: "#contato", label: "Contato" },
];

export default function LandingNavbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(13,15,10,0.9)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <LogoMark size={36} />
          <span className="font-display text-lg font-extrabold text-[var(--white)]">Mind Money</span>
        </Link>

        <nav className="hidden items-center gap-1.5 md:flex">
          {NAV_LINKS.map((link) =>
            link.pill ? (
              <a
                key={link.href}
                href={link.href}
                className="font-body rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-transform duration-200 hover:scale-105"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="font-body rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors duration-200 hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            className="font-body rounded-full px-4 py-2 text-sm font-semibold text-white/80 transition-colors duration-200 hover:text-white"
          >
            Entrar
          </Link>
          <Link
            to={user ? "/dashboard" : "/cadastro"}
            className="font-body inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_0_24px_rgba(12,163,12,0.35)]"
          >
            Acessar plataforma
            <Icon name="arrowRight" size={15} />
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-white md:hidden"
        >
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--line)] bg-[var(--bg)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`font-body rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  link.pill ? "bg-[var(--brand)] text-[var(--ink)] font-semibold" : "text-white/80 hover:bg-white/5"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="font-body rounded-full border border-[var(--line)] px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Entrar
            </Link>
            <Link
              to={user ? "/dashboard" : "/cadastro"}
              onClick={() => setOpen(false)}
              className="font-body rounded-full bg-[var(--brand)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--ink)]"
            >
              Acessar plataforma
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
