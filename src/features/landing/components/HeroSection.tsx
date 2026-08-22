import { Link } from "react-router-dom";
import Icon from "../../../components/ui/Icon";
import { useAuth } from "../../../hooks/useAuth";
import DashboardPreview from "./DashboardPreview";
import Reveal from "./Reveal";

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <section id="plataforma" className="relative overflow-hidden px-4 pb-20 pt-16 md:px-8 md:pt-24">
      <div
        aria-hidden="true"
        className="glow-blob pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 animate-glow-pulse opacity-30"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold uppercase leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
            Conheça a plataforma que <span className="text-[var(--brand)]">transforma</span>
            <br />
            <span className="text-[var(--brand)]">sua relação</span> com o dinheiro!
          </h1>
        </Reveal>

        <Reveal delay={100}>
          <p className="font-body mt-6 max-w-2xl text-base text-white/70 sm:text-lg">
            Tecnologia exclusiva, organização automática e acompanhamento real dos seus dados.
            Tudo integrado para a sua saúde financeira!
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              to={user ? "/dashboard" : "/cadastro"}
              className="font-body inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-7 py-3.5 text-sm font-semibold text-[var(--ink)] shadow-[0_0_30px_rgba(12,163,12,0.4)] transition-all duration-200 hover:scale-105 hover:shadow-[0_0_45px_rgba(12,163,12,0.6)]"
            >
              Quero começar agora
              <Icon name="arrowRight" size={16} />
            </Link>
            <a
              href="#funcionalidades"
              className="font-body inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              Ver como funciona
            </a>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <p className="font-body mt-4 text-xs text-white/40">
            Gratuito para criar sua conta. Sem cartão de crédito.
          </p>
        </Reveal>

        <Reveal delay={350} className="mt-16 w-full max-w-3xl">
          <DashboardPreview />
        </Reveal>
      </div>
    </section>
  );
}
