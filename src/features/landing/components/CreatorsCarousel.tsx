import { useState } from "react";
import Icon from "../../../components/ui/Icon";
import { CREATORS } from "../../../assets/creators";

export default function CreatorsCarousel() {
  const [index, setIndex] = useState(0);
  const creator = CREATORS[index];

  const goPrev = () => setIndex((i) => (i === 0 ? CREATORS.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === CREATORS.length - 1 ? 0 : i + 1));

  return (
    <div className="flex flex-col items-center gap-4 sm:grid sm:grid-cols-[400px_auto_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
      {/* Fundo de estúdio fotográfico (preto, com leve degradê pra simular
          luz vinda de cima) -- as fotos são PNG com fundo transparente, o
          "estúdio" é essa cor por trás aparecendo ao redor da pessoa. */}
      <div className="order-1 relative aspect-square w-full max-w-[400px] overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-700 via-neutral-900 to-black sm:w-[400px]">
        <img
          key={creator.photo}
          src={creator.photo}
          alt={creator.name}
          className="animate-fade-in absolute inset-x-0 bottom-0 h-[92%] w-full object-contain object-bottom"
        />
      </div>

      <div
        key={creator.name}
        className="animate-fade-in order-2 w-full min-w-0 rounded-2xl border border-line border-t-2 border-t-brand bg-surface p-5 shadow-card sm:order-3"
      >
        <h3 className="font-display text-xl font-semibold text-ink">{creator.name}</h3>
        <span className="mt-1 block h-1 w-10 rounded-full bg-brand" />
        <p className="font-data mt-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep">
          {creator.role}
        </p>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{creator.bio}</p>

        <div className="mt-5 flex gap-1.5">
          {CREATORS.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver ${c.name}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-brand" : "w-1.5 bg-line hover:bg-brand-soft"
              }`}
            />
          ))}
        </div>
      </div>

      {/* "contents" tira o wrapper do fluxo no desktop, deixando os dois
          botões virarem itens do grid direto (cada um com sua própria
          coluna/ordem); no mobile o wrapper vira uma linha flex, mantendo
          os dois botões lado a lado em vez de um em cima e outro embaixo
          do card. */}
      <div className="order-3 flex items-center justify-center gap-3 sm:contents">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Criador anterior"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink-soft transition-colors hover:border-brand hover:text-brand-deep sm:order-2"
        >
          <Icon name="arrowRight" size={18} className="rotate-180" />
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Próximo criador"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink-soft transition-colors hover:border-brand hover:text-brand-deep sm:order-4"
        >
          <Icon name="arrowRight" size={18} />
        </button>
      </div>
    </div>
  );
}
