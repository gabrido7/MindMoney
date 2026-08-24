import Eyebrow from "./Eyebrow";
import Reveal from "./Reveal";

const TESTIMONIALS = [
  {
    name: "Camila R.",
    role: "Organizou o orçamento familiar",
    quote:
      "Depois que comecei a registrar tudo no Mind Money, descobri que gastava quase 30% da minha renda em delivery sem perceber. O relatório mensal mudou minha forma de enxergar as contas.",
  },
  {
    name: "Diego S.",
    role: "Guardando para um objetivo",
    quote:
      "As metas por mês me ajudaram a economizar pra viagem que eu vinha adiando há dois anos. Ver a barra de progresso preenchendo é surpreendentemente motivador.",
  },
  {
    name: "Beatriz A.",
    role: "Acompanha o score financeiro",
    quote:
      "O score financeiro virou meu termômetro. Quando ele cai, eu já sei que preciso revisar alguma categoria antes de fechar o mês no vermelho.",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="depoimentos" className="bg-surface-alt px-4 py-20 md:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Eyebrow align="center">depoimentos</Eyebrow>
          <h2 className="font-display mt-4 text-3xl font-semibold text-ink sm:text-4xl">
            Quem usa, <span className="italic text-brand-deep">organiza a vida financeira</span>
          </h2>
          <p className="mt-4 text-ink-soft">
            O Mind Money nasceu como um projeto de conclusão de curso — estes depoimentos são exemplos
            ilustrativos do tipo de resultado que a plataforma foi pensada para entregar.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl rounded-tl-md border border-line bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-1">
                <span aria-hidden="true" className="font-display text-3xl leading-none text-brand">
                  &ldquo;
                </span>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-ink">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                  <div className="font-display flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-deep">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-ink-soft">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
