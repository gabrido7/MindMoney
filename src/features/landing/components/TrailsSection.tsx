import { TRAILS } from "../../education/data/trails";
import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

const TRAIL_EMOJI: Record<string, string> = {
  fundamentos: "🌱",
  "organizacao-financeira": "📘",
  investimentos: "💹",
  "financas-avancadas": "🧭",
  "credito-e-dividas": "💳",
  "aposentadoria-e-independencia": "🕊️",
};

export default function TrailsSection() {
  return (
    <section id="trilhas" className="px-4 py-20 md:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal className="max-w-2xl">
          <Eyebrow>nossas trilhas</Eyebrow>
          <h2 className="font-display mt-4 text-3xl font-semibold text-ink sm:text-4xl">
            Escolha o caminho <span className="italic text-brand-deep">ideal pra sua fase</span>
          </h2>
          <p className="mt-4 text-ink-soft">
            Do básico ao avançado. Cada trilha é um curso completo, com aulas, exemplos, quiz e exercício
            prático — sem depender de terceiros.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRAILS.map((trail, i) => {
            const lessonCount = trail.courses.reduce((sum, c) => sum + c.lessons.length, 0);
            return (
              <Reveal key={trail.id} delay={i * 60}>
                <div className="group h-full rounded-2xl border border-line border-t-2 border-t-brand bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-1">
                  <span className="text-2xl leading-none">{TRAIL_EMOJI[trail.id] ?? "📚"}</span>
                  <h3 className="font-display mt-3 text-lg font-semibold text-ink">{trail.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{trail.description}</p>
                  <p className="font-data mt-4 text-xs font-semibold uppercase tracking-wide text-brand-deep">
                    {trail.courses.length} cursos · {lessonCount} aulas
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
