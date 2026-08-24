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
    <section id="planos" className="bg-surface-alt px-4 py-20 md:px-8">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Eyebrow align="center">sem pegadinha</Eyebrow>
        <h2 className="font-display mt-4 text-3xl font-semibold text-ink sm:text-4xl">Um plano só, e é grátis</h2>
        <p className="mt-4 text-ink-soft">
          O Mind Money é gratuito. Sem taxa escondida, sem trial que vira cobrança.
        </p>
      </Reveal>

      <Reveal delay={100} className="mx-auto mt-12 max-w-md">
        <div className="rounded-2xl border border-brand bg-surface p-8 shadow-card-lg">
          <div className="flex items-baseline justify-center gap-1">
            <span className="font-data text-5xl font-bold text-ink">R$ 0</span>
            <span className="text-ink-soft">/mês</span>
          </div>
          <p className="mt-2 text-center text-sm text-ink-soft">Plano completo, para sempre.</p>

          <ul className="mt-8 flex flex-col gap-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-ink">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-deep">
                  <Icon name="check" size={12} />
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <Link
            to={user ? "/dashboard" : "/cadastro"}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-brand-deep"
          >
            Experimente grátis
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
