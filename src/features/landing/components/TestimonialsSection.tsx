import Icon from "../../../components/ui/Icon";

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
    <section id="sobre" className="px-4 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Quem usa, organiza a vida financeira
          </h2>
          <p className="mt-4 text-neutral-400">
            O Mind Money nasceu como um projeto de conclusão de curso com um objetivo simples:
            controle financeiro real, sem letra miúda e sem dado inventado.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-white/10 bg-neutral-900/60 p-6"
            >
              <div className="flex gap-0.5 text-green-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="sparkles" size={14} />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-300">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-sm font-bold text-green-400">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
