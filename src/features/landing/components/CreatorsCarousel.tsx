import { useState } from "react";
import Icon from "../../../components/ui/Icon";
import { CREATORS } from "../../../assets/creators";

export default function CreatorsCarousel() {
  const [index, setIndex] = useState(0);
  const creator = CREATORS[index];

  const goPrev = () => setIndex((i) => (i === 0 ? CREATORS.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === CREATORS.length - 1 ? 0 : i + 1));

  return (
    <div className="mx-auto flex max-w-xl items-center gap-3">
      <button
        type="button"
        onClick={goPrev}
        aria-label="Criador anterior"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink-soft transition-colors hover:border-brand hover:text-brand-deep"
      >
        <Icon name="arrowRight" size={18} className="rotate-180" />
      </button>

      <div
        key={creator.name}
        className="animate-fade-in w-full min-w-0 rounded-2xl border border-line border-t-2 border-t-brand bg-surface p-6 text-center shadow-card"
      >
        <h3 className="font-display text-xl font-semibold text-ink">{creator.name}</h3>
        <span className="mx-auto mt-1 block h-1 w-10 rounded-full bg-brand" />
        <p className="font-data mt-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep">
          {creator.role}
        </p>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{creator.bio}</p>

        <div className="mt-5 flex justify-center gap-1.5">
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

      <button
        type="button"
        onClick={goNext}
        aria-label="Próximo criador"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink-soft transition-colors hover:border-brand hover:text-brand-deep"
      >
        <Icon name="arrowRight" size={18} />
      </button>
    </div>
  );
}
