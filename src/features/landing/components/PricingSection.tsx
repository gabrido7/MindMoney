import { Link } from "react-router-dom";
import Icon from "../../../components/ui/Icon";
import { useAuth } from "../../../hooks/useAuth";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

const BENEFITS = [
  "Transações e categorias ilimitadas",
  "Metas de economia por mês",
  "Score financeiro e relatórios de evolução",
  "Notificações automáticas de limite e metas",
  "Educação financeira e assistente de dúvidas",
  "Seus dados isolados e nunca compartilhados",
];

export default function PricingSection() {
  const { user } = useAuth();

  return (
    <section id="planos" className="px-4 py-20 md:px-8">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Eyebrow align="center">sem pegadinha</Eyebrow>
        <h2 className="font-display mt-4 text-3xl font-extrabold text-white sm:text-4xl">Um plano só, e é grátis</h2>
        <p className="font-body mt-4 text-white/60">
          O Mind Money é gratuito. Sem taxa escondida, sem trial que vira cobrança.
        </p>
      </Reveal>

      <Reveal delay={100} className="mx-auto mt-12 max-w-md">
        <div className="rounded-2xl border border-[rgba(12,163,12,0.4)] bg-[var(--surface)] p-8 shadow-[0_0_60px_-15px_rgba(12,163,12,0.35)]">
          <div className="flex items-baseline justify-center gap-1">
            <span className="font-display text-5xl font-extrabold text-white">R$ 0</span>
            <span className="font-body text-white/50">/mês</span>
          </div>
          <p className="font-body mt-2 text-center text-sm text-white/40">Plano completo, para sempre.</p>

          <ul className="mt-8 flex flex-col gap-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="font-body flex items-start gap-3 text-sm text-white/75">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                  <Icon name="check" size={12} />
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <Link
            to={user ? "/dashboard" : "/cadastro"}
            className="font-body mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3.5 text-sm font-semibold text-[var(--ink)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(12,163,12,0.5)]"
          >
            Experimente grátis
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
