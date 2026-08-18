import { Link } from "react-router-dom";
import Icon from "../../../components/ui/Icon";
import { useAuth } from "../../../hooks/useAuth";

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
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Um plano só, sem pegadinha</h2>
        <p className="mt-4 text-neutral-400">
          O Mind Money é gratuito. Sem taxa escondida, sem trial que vira cobrança.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-md rounded-2xl border border-green-500/30 bg-neutral-900/70 p-8 shadow-[0_0_40px_rgba(34,197,94,0.12)]">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-extrabold text-white">R$ 0</span>
          <span className="text-neutral-400">/mês</span>
        </div>
        <p className="mt-2 text-center text-sm text-neutral-500">Plano completo, para sempre.</p>

        <ul className="mt-8 flex flex-col gap-3">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-sm text-neutral-300">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                <Icon name="check" size={12} />
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <Link
          to={user ? "/dashboard" : "/cadastro"}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3.5 text-sm font-semibold text-neutral-950 shadow-[0_0_25px_rgba(34,197,94,0.45)] transition-transform hover:scale-[1.02] hover:bg-green-400"
        >
          Experimente Grátis
          <Icon name="arrowRight" size={16} />
        </Link>
      </div>
    </section>
  );
}
