import { Link } from "react-router-dom";
import Icon from "../../../components/ui/Icon";
import { useAuth } from "../../../hooks/useAuth";
import DashboardPreview from "./DashboardPreview";
import Reveal from "./Reveal";

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <section id="plataforma" className="relative overflow-hidden px-4 pb-20 pt-16 md:px-8 md:pt-24">
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Reveal>
            <h1 className="font-display text-4xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-5xl md:text-[3.4rem]">
              Sua vida financeira,{" "}
              <span className="relative whitespace-nowrap italic text-brand-deep">
                traduzida em um número
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 12"
                  className="absolute -bottom-1 left-0 w-full text-brand"
                  preserveAspectRatio="none"
                >
                  <path d="M2 8c60-8 180-8 296 0" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{" "}
              que você entende.
            </h1>
          </Reveal>

          <Reveal delay={100}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              Transações, metas, score e educação financeira — tudo calculado em cima dos seus dados
              reais, sem planilha e sem achismo. Você vê exatamente de onde vem cada número.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                to={user ? "/dashboard" : "/cadastro"}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-brand-deep"
              >
                Quero começar agora
                <Icon name="arrowRight" size={16} />
              </Link>
              <a
                href="#funcionalidades"
                className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-semibold text-ink transition-all duration-200 hover:border-brand hover:text-brand-deep"
              >
                Ver como funciona
              </a>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <p className="mt-4 text-xs text-ink-soft">Gratuito para criar sua conta. Sem cartão de crédito.</p>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative">
          <DashboardPreview />
        </Reveal>
      </div>
    </section>
  );
}
