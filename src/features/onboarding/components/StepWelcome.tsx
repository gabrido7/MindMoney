import Icon, { type IconName } from "../../../components/ui/Icon";

const TOUR_ITEMS: { icon: IconName; title: string; description: string }[] = [
  { icon: "chart", title: "Dashboard", description: "Seu saldo, gastos por categoria e evolução, tudo num só lugar." },
  { icon: "target", title: "Metas", description: "Defina quanto quer guardar e acompanhe o progresso mês a mês." },
  { icon: "wallet", title: "Orçamento por categoria", description: "Um teto por categoria, com aviso antes de estourar." },
  { icon: "book", title: "Educação financeira", description: "Trilhas curtas pra aprender no seu ritmo." },
];

export default function StepWelcome({ userName, onContinue }: { userName: string; onContinue: () => void }) {
  const firstName = userName.trim().split(" ")[0];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Olá, {firstName}!</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Bem-vindo ao Mind Money. Em poucos minutos a gente monta seu dashboard com dados reais -- sua renda,
          despesas e metas -- pra você já começar enxergando sua vida financeira com clareza, não com uma tela
          vazia.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {TOUR_ITEMS.map((item, index) => (
          <div
            key={item.title}
            className="motion-reduce:animate-none animate-rise rounded-2xl border border-line bg-surface p-4"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand-deep">
              <Icon name={item.icon} size={18} />
            </div>
            <p className="mt-3 text-sm font-semibold text-ink">{item.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{item.description}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
      >
        Vamos começar
        <Icon name="arrowRight" size={16} />
      </button>
    </div>
  );
}
