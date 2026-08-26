import Icon from "../../../components/ui/Icon";
import { useFinancialProfile } from "../../profile/hooks/useFinancialProfile";

const MOTIVATION_LABELS: Record<string, string> = {
  organizar_financas: "Organizar as finanças",
  alcancar_objetivos: "Alcançar objetivos",
  controlar_gastos: "Controlar gastos",
  reserva_emergencia: "Reserva de emergência",
  investir: "Investir",
  educacao: "Aprender sobre dinheiro",
  construir_patrimonio: "Construir patrimônio",
  quitar_dividas: "Quitar dívidas",
  comprar_um_bem: "Comprar um bem",
  aposentadoria: "Aposentadoria",
};

export default function StepResults({ saving, onFinish }: { saving: boolean; onFinish: () => void }) {
  const { profile, isLoading } = useFinancialProfile();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-deep">
        <Icon name="check" size={22} />
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Tudo pronto!</h1>
        <p className="mt-2 text-sm text-ink-soft">Seu dashboard já está com dados reais. Aqui vai um resumo do que entendemos sobre você.</p>
      </div>

      {isLoading && <p className="text-sm text-ink-soft">Carregando seu resumo...</p>}

      {!isLoading && profile?.behaviorProfile && (
        <div className="motion-reduce:animate-none animate-rise rounded-2xl border border-line bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Seu perfil comportamental</p>
          <p className="mt-1 text-lg font-display font-semibold text-brand-deep">{profile.behaviorProfile.label}</p>
          <p className="mt-1 text-sm text-ink-soft">{profile.behaviorProfile.description}</p>
        </div>
      )}

      {!isLoading && profile && profile.priorities.length > 0 && (
        <div
          className="motion-reduce:animate-none animate-rise flex flex-wrap gap-2"
          style={{ animationDelay: "80ms" }}
        >
          {profile.priorities.map((p) => (
            <span key={p} className="rounded-full bg-surface-alt px-3 py-1 text-xs font-medium text-ink-soft">
              {MOTIVATION_LABELS[p] ?? p}
            </span>
          ))}
        </div>
      )}

      {!isLoading && profile && profile.recommendations.length > 0 && (
        <div
          className="motion-reduce:animate-none animate-rise flex flex-col gap-3"
          style={{ animationDelay: "160ms" }}
        >
          <p className="text-sm font-medium text-ink">Recomendações pra você começar</p>
          <ul className="flex flex-col gap-2">
            {profile.recommendations.map((rec) => (
              <li key={rec.id} className="rounded-xl border border-line p-3">
                <p className="text-sm font-semibold text-ink">{rec.title}</p>
                <p className="mt-1 text-xs text-ink-soft">{rec.description}</p>
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink-soft">Você encontra essas recomendações depois em Perfil {"->"} Financeiro.</p>
        </div>
      )}

      <button
        type="button"
        disabled={saving}
        onClick={onFinish}
        className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Preparando seu dashboard..." : "Ir para o dashboard"}
        <Icon name="arrowRight" size={16} />
      </button>
    </div>
  );
}
