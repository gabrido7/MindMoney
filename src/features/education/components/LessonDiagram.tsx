import { formatCurrency } from "../../../utils/formatters";
import type { DiagramSpec } from "../types";

export default function LessonDiagram({ diagram }: { diagram: DiagramSpec }) {
  if (diagram.type === "steps") {
    return (
      <div className="flex flex-col gap-2.5">
        {diagram.steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-brand-soft text-brand-deep flex items-center justify-center text-xs font-bold mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-ink pt-1">{step}</p>
          </div>
        ))}
      </div>
    );
  }

  if (diagram.type === "comparison") {
    return (
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-brand bg-brand-soft p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-deep mb-2">
            {diagram.left.label}
          </p>
          <ul className="text-sm text-ink flex flex-col gap-1.5">
            {diagram.left.items.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-negative bg-negative-soft p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-negative mb-2">
            {diagram.right.label}
          </p>
          <ul className="text-sm text-ink flex flex-col gap-1.5">
            {diagram.right.items.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (diagram.type === "bars") {
    const max = Math.max(...diagram.bars.map((b) => b.value), 1);
    return (
      <div className="flex flex-col gap-2.5">
        {diagram.caption && <p className="text-xs text-ink-soft">{diagram.caption}</p>}
        {diagram.bars.map((bar, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-xs text-ink-soft">{bar.label}</span>
            <div className="flex-1 bg-surface-alt rounded-full h-3">
              <div
                className="h-3 rounded-full bg-brand transition-all duration-500 ease-out"
                style={{ width: `${(bar.value / max) * 100}%` }}
              />
            </div>
            <span className="w-28 shrink-0 text-xs font-data text-ink-soft text-right">
              {bar.suffix === "%"
                ? `${bar.value.toLocaleString("pt-BR")}%`
                : `${formatCurrency(bar.value)}${bar.suffix ?? ""}`}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-surface-alt border border-line p-4 text-center">
      <p className="font-data text-sm text-ink">{diagram.formula}</p>
      {diagram.caption && <p className="text-xs text-ink-soft mt-2">{diagram.caption}</p>}
    </div>
  );
}
