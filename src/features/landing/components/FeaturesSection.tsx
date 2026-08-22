import { useState } from "react";
import Icon, { type IconName } from "../../../components/ui/Icon";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

interface Feature {
  id: string;
  label: string;
  icon: IconName;
  title: string;
  description: string;
  stats: { label: string; value: string }[];
}

const FEATURES: Feature[] = [
  {
    id: "planejamento",
    label: "Planejamento",
    icon: "target",
    title: "Planejamento financeiro inteligente",
    description:
      "Defina metas de economia mês a mês e acompanhe o progresso real, calculado em cima das suas transações — sem planilha, sem achismo.",
    stats: [
      { label: "Metas ativas", value: "Ilimitadas" },
      { label: "Acompanhamento", value: "Mês a mês" },
    ],
  },
  {
    id: "score",
    label: "Score financeiro",
    icon: "trendUp",
    title: "Score financeiro em tempo real",
    description:
      "Um número que resume sua saúde financeira, recalculado a cada consulta com uma fórmula determinística — nada de caixa-preta.",
    stats: [
      { label: "Componentes do score", value: "4" },
      { label: "Atualização", value: "Em tempo real" },
    ],
  },
  {
    id: "relatorios",
    label: "Relatórios",
    icon: "chart",
    title: "Relatórios e evolução mensal",
    description:
      "Compare meses, veja para onde seu dinheiro está indo por categoria e acompanhe a evolução do seu saldo em gráficos claros.",
    stats: [
      { label: "Comparação", value: "Mês a mês" },
      { label: "Categorias", value: "Personalizáveis" },
    ],
  },
  {
    id: "educacao",
    label: "Educação financeira",
    icon: "book",
    title: "Educação financeira gamificada",
    description:
      "6 trilhas completas, do básico ao avançado, com aulas, quiz e exercício prático — além de XP, níveis e conquistas pra manter o ritmo.",
    stats: [
      { label: "Trilhas", value: "6" },
      { label: "Aulas completas", value: "165" },
    ],
  },
  {
    id: "ferramentas",
    label: "Ferramentas",
    icon: "wallet",
    title: "Calculadoras financeiras",
    description:
      "Juros compostos, financiamento, aposentadoria, rentabilidade real e mais — 11 calculadoras pra simular decisões antes de tomá-las.",
    stats: [
      { label: "Calculadoras", value: "11" },
      { label: "Custo", value: "Gratuito" },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    icon: "sparkles",
    title: "Insights e notificações automáticas",
    description:
      "Alertas de limite de gastos, metas atingidas e recomendações geradas por regras a partir dos seus próprios dados — nunca inventadas.",
    stats: [
      { label: "Geração", value: "100% baseada em regras" },
      { label: "Notificações", value: "Automáticas" },
    ],
  },
];

export default function FeaturesSection() {
  const [selectedId, setSelectedId] = useState(FEATURES[0].id);
  const selected = FEATURES.find((f) => f.id === selectedId) ?? FEATURES[0];

  return (
    <section id="funcionalidades" className="px-4 py-20 md:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <div className="mx-auto flex flex-col items-center">
            <Eyebrow align="center">nossa plataforma</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-extrabold text-white sm:text-4xl">
              O que você vai <span className="text-[var(--brand)]">receber</span> no Mind Money
            </h2>
            <p className="font-body mt-4 max-w-xl text-white/60">
              Tecnologia real, dados reais e recursos práticos pra você organizar sua vida financeira.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <button
              key={feature.id}
              type="button"
              onClick={() => setSelectedId(feature.id)}
              className={`font-body rounded-full px-4 py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.03] ${
                selected.id === feature.id
                  ? "bg-[var(--brand)] text-[var(--ink)] shadow-[0_0_24px_rgba(12,163,12,0.35)]"
                  : "border border-[var(--line)] text-white/70 hover:border-[rgba(12,163,12,0.5)] hover:text-[var(--brand)]"
              }`}
            >
              {feature.label}
            </button>
          ))}
        </Reveal>

        <Reveal delay={150} className="mt-4">
          <div
            key={selected.id}
            className="animate-fade-in grid gap-8 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 md:grid-cols-2 md:p-10"
          >
            <div className="flex flex-col justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <Icon name={selected.icon} size={22} />
              </div>
              <h3 className="font-display mt-4 text-2xl font-bold text-white">{selected.title}</h3>
              <p className="font-body mt-3 leading-relaxed text-white/60">{selected.description}</p>
            </div>

            <div className="flex flex-col justify-center gap-3">
              {selected.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] px-5 py-4"
                >
                  <span className="font-body text-sm text-white/50">{stat.label}</span>
                  <span className="font-display text-lg font-bold text-[var(--brand)]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
