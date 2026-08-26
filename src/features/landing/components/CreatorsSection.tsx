import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";
import CreatorsCarousel from "./CreatorsCarousel";

const STACK = ["React", "TypeScript", "Node.js", "Express", "MySQL", "Tailwind CSS"];

const PRINCIPLES = [
  {
    title: "Dados reais, sem achismo",
    description:
      "Nada de números fictícios: score, relatórios e insights são calculados em cima das suas transações de verdade.",
  },
  {
    title: "Regras claras, não caixa-preta",
    description:
      "Score e recomendações seguem fórmulas determinísticas e documentadas — nunca uma IA inventando resposta.",
  },
  {
    title: "Feito pra ser levado a sério",
    description:
      "Autenticação, isolamento de dados por usuário e cobertura de testes como um produto real, não uma maquete.",
  },
];

export default function CreatorsSection() {
  return (
    <section id="criadores" className="px-4 py-20 md:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal className="max-w-2xl">
          <Eyebrow>criadores</Eyebrow>
          <h2 className="font-display mt-4 text-3xl font-semibold text-ink sm:text-4xl">
            Um projeto <span className="italic text-brand-deep">construído a sério</span>
          </h2>
          <p className="mt-4 text-ink-soft">
            O Mind Money nasceu como um projeto acadêmico de conclusão de curso — mas foi desenvolvido com
            o mesmo rigor de um produto real: backend próprio, banco de dados de verdade e nenhum dado
            inventado na tela.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-12">
          <CreatorsCarousel />
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-line bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-1">
                <h3 className="font-display text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={250} className="mt-10">
          <p className="font-data text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep">
            Construído com
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {STACK.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold text-ink-soft transition-colors duration-200 hover:border-brand hover:text-brand-deep"
              >
                {tech}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
