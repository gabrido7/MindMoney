import { formatCurrency } from "../../../utils/formatters";
import type { DiagramSpec } from "../types";

export default function LessonDiagram({ diagram }: { diagram: DiagramSpec }) {
  if (diagram.type === "steps") {
    return (
      <div className="flex flex-col gap-2.5">
        {diagram.steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-200 pt-1">{step}</p>
          </div>
        ))}
      </div>
    );
  }

  if (diagram.type === "comparison") {
    return (
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-300 mb-2">
            {diagram.left.label}
          </p>
          <ul className="text-sm text-gray-700 dark:text-gray-200 flex flex-col gap-1.5">
            {diagram.left.items.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-300 mb-2">
            {diagram.right.label}
          </p>
          <ul className="text-sm text-gray-700 dark:text-gray-200 flex flex-col gap-1.5">
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
        {diagram.caption && <p className="text-xs text-gray-400">{diagram.caption}</p>}
        {diagram.bars.map((bar, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-xs text-gray-500 dark:text-gray-400">{bar.label}</span>
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-green-500 transition-all duration-500 ease-out"
                style={{ width: `${(bar.value / max) * 100}%` }}
              />
            </div>
            <span className="w-28 shrink-0 text-xs text-gray-600 dark:text-gray-300 text-right">
              {formatCurrency(bar.value)}
              {bar.suffix ?? ""}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 text-center">
      <p className="font-mono text-sm text-gray-800 dark:text-gray-100">{diagram.formula}</p>
      {diagram.caption && <p className="text-xs text-gray-400 mt-2">{diagram.caption}</p>}
    </div>
  );
}
