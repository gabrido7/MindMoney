import Icon, { type IconName } from "../../../components/ui/Icon";

const FEATURES: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "target",
    title: "Planejamento Financeiro Inteligente",
    description:
      "Defina metas de economia mês a mês e acompanhe o progresso real, calculado a partir das suas transações.",
  },
  {
    icon: "trendUp",
    title: "Análise de Despesas e Metas em Tempo Real",
    description:
      "Veja para onde seu dinheiro está indo por categoria e subcategoria, com comparação automática entre meses.",
  },
  {
    icon: "chart",
    title: "Relatórios e Acompanhamento Personalizado",
    description:
      "Relatórios mensais com evolução financeira, ranking de gastos e um score que resume sua saúde financeira em um número.",
  },
  {
    icon: "sparkles",
    title: "Insights e Organização Automática",
    description:
      "Categorias organizadas automaticamente e recomendações geradas a partir dos seus próprios dados — sem inventar números.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="funcionalidades" className="px-4 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">O que você vai receber</h2>
          <p className="mt-4 text-neutral-400">
            Quatro pilares que sustentam o Mind Money, todos conectados aos seus dados reais.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-white/10 bg-neutral-900/60 p-6 transition-colors hover:border-green-500/40 hover:bg-neutral-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400 transition-colors group-hover:bg-green-500 group-hover:text-neutral-950">
                <Icon name={feature.icon} size={22} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
