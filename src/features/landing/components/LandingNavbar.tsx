import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/ui/Icon";
import LogoMark from "../../../components/ui/LogoMark";
import { useAuth } from "../../../hooks/useAuth";

const NAV_LINKS = [
  { href: "#plataforma", label: "Plataforma" },
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#sobre", label: "Sobre Nós" },
  { href: "#contato", label: "Contato" },
];

export default function LandingNavbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <LogoMark size={40} />
          <span className="text-lg font-bold text-white">Mind Money</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-300 transition-colors hover:text-green-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors hover:text-green-400"
          >
            Entrar
          </Link>
          <Link
            to={user ? "/dashboard" : "/cadastro"}
            className="inline-flex items-center gap-1.5 rounded-full bg-green-500 px-5 py-2 text-sm font-semibold text-neutral-950 shadow-[0_0_20px_rgba(34,197,94,0.45)] transition-transform hover:scale-[1.03] hover:bg-green-400"
          >
            Acessar Plataforma
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-white md:hidden"
        >
          <Icon name={open ? "close" : "menu"} size={24} />
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-neutral-950 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-neutral-300 hover:text-green-400"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/15 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Entrar
            </Link>
            <Link
              to={user ? "/dashboard" : "/cadastro"}
              onClick={() => setOpen(false)}
              className="rounded-full bg-green-500 px-4 py-2 text-center text-sm font-semibold text-neutral-950"
            >
              Acessar Plataforma
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
