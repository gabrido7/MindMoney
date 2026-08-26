interface ChipOption<T extends string> {
  value: T;
  label: string;
}

/**
 * Botão-chip reutilizável (usado em FinancialProfileTab e em várias etapas
 * do onboarding). Agnóstico a single/multi-select de propósito: o chamador
 * decide o que "selected"/"onToggle" significam -- single-select troca o
 * array inteiro por um item só, multi-select faz o toggle de verdade.
 */
export default function ChipGroup<T extends string>({
  options,
  selected,
  onToggle,
  className = "",
}: {
  options: ChipOption<T>[];
  selected: T[];
  onToggle: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((opt) => {
        const isActive = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            aria-pressed={isActive}
            className={`motion-reduce:transition-none rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ${
              isActive
                ? "scale-[1.02] bg-brand text-white"
                : "border border-line text-ink-soft hover:border-brand hover:text-brand-deep"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
