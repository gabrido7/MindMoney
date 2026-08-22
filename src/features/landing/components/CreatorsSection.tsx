import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

const STACK = ["React", "TypeScript", "Node.js", "Express", "MySQL", "Tailwind CSS"];

const PRINCIPLES = [
  {
    title: "Dados reais, sem achismo",
    description: "Nada de números fictícios: score, relatórios e insights são calculados em cima das suas transações de verdade.",
  },
  {
    title: "Regras claras, não caixa-preta",
    description: "Score e recomendações seguem fórmulas determinísticas e documentadas — nunca uma IA inventando resposta.",
  },
  {
    title: "Feito pra ser levado a sério",
    description: "Autenticação, isolamento de dados por usuário e cobertura de testes como um produto real, não uma maquete.",
  },
];

export default function CreatorsSection() {
  return (
    <section id="criadores" className="px-4 py-20 md:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal className="max-w-2xl">
          <Eyebrow>criadores</Eyebrow>
          <h2 className="font-display mt-4 text-3xl font-extrabold text-white sm:text-4xl">
            Um projeto <span className="text-[var(--brand)]">construído a sério</span>
          </h2>
          <p className="font-body mt-4 text-white/60">
            O Mind Money nasceu como um projeto acadêmico de conclusão de curso — mas foi desenvolvido com
            o mesmo rigor de um produto real: backend próprio, banco de dados de verdade e nenhum dado
            inventado na tela.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(12,163,12,0.3)]">
                <h3 className="font-display text-lg font-bold text-white">{p.title}</h3>
                <p className="font-body mt-2 text-sm leading-relaxed text-white/55">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={250} className="mt-10">
          <p className="font-script uppercase text-xl text-[var(--brand)]">construído com</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {STACK.map((tech) => (
              <span
                key={tech}
                className="font-body rounded-full border border-[var(--line)] px-4 py-1.5 text-xs font-semibold text-white/70 transition-colors duration-200 hover:border-[var(--brand)] hover:text-[var(--brand)]"
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
