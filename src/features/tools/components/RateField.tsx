import type { RatePeriod } from "../utils/calculations";
import NumberField from "./NumberField";

export default function RateField({
  id,
  label,
  value,
  onChange,
  period,
  onPeriodChange,
  placeholder = "0,8",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  period: RatePeriod;
  onPeriodChange: (period: RatePeriod) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-end justify-between gap-2">
        <div className="flex-1 min-w-0">
          <NumberField id={id} label={label} value={value} onChange={onChange} suffix="%" placeholder={placeholder} />
        </div>
        <div className="flex shrink-0 rounded-lg border border-gray-200 dark:border-gray-600 p-0.5">
          {(["monthly", "annual"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange(p)}
              className={`rounded-md px-2.5 py-2 text-xs font-medium transition-colors ${
                period === p
                  ? "bg-green-600 text-white"
                  : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600"
              }`}
            >
              {p === "monthly" ? "ao mês" : "ao ano"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
