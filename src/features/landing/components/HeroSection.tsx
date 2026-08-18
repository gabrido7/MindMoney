import { Link } from "react-router-dom";
import Icon from "../../../components/ui/Icon";
import { useAuth } from "../../../hooks/useAuth";

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <section id="plataforma" className="relative overflow-hidden px-4 pb-20 pt-16 md:px-8 md:pt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-green-500/20 blur-[120px]"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-green-400">
          <Icon name="sparkles" size={14} />
          Controle financeiro de verdade
        </span>

        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          TRANSFORME SUA
          <br />
          <span className="text-green-400">RELAÇÃO COM O DINHEIRO</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base text-neutral-300 sm:text-lg">
          Score financeiro, metas, relatórios e insights automáticos, tudo calculado em cima dos
          seus dados reais — sem planilha, sem achismo e sem enrolação.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to={user ? "/dashboard" : "/cadastro"}
            className="inline-flex items-center gap-2 rounded-full bg-green-500 px-7 py-3.5 text-sm font-semibold text-neutral-950 shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-transform hover:scale-[1.03] hover:bg-green-400"
          >
            Quero Começar Agora
            <Icon name="arrowRight" size={16} />
          </Link>
          <a
            href="#funcionalidades"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-green-400 hover:text-green-400"
          >
            Ver como funciona
          </a>
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          Gratuito para criar sua conta. Sem cartão de crédito.
        </p>

        <div className="relative mt-16 w-full max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-neutral-900/80 p-3 shadow-2xl shadow-black/50 sm:p-4">
            <div className="flex items-center gap-1.5 px-2 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
              <span className="ml-3 text-xs text-neutral-500">app.mindmoney.com.br/dashboard</span>
            </div>

            <div className="grid gap-3 rounded-xl bg-neutral-950 p-4 sm:grid-cols-3">
              <div className="rounded-lg border border-white/5 bg-neutral-900 p-4 sm:col-span-2">
                <p className="text-xs text-neutral-400">Saldo do mês</p>
                <p className="mt-1 text-2xl font-bold text-white">R$ 3.482,00</p>
                <div className="mt-4 flex h-20 items-end gap-2">
                  {[40, 65, 50, 80, 60, 95, 70].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="flex-1 rounded-t bg-green-500/70"
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border border-white/5 bg-neutral-900 p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-green-500 text-lg font-bold text-green-400">
                  87
                </div>
                <p className="mt-2 text-xs font-medium text-neutral-300">Score: Excelente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
