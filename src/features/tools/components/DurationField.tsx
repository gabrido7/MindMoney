import type { DurationUnit } from "../utils/calculations";
import NumberField from "./NumberField";

export default function DurationField({
  id,
  label,
  value,
  onChange,
  unit,
  onUnitChange,
  placeholder = "12",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit: DurationUnit;
  onUnitChange: (unit: DurationUnit) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-2">
      <div className="flex-1 min-w-0">
        <NumberField id={id} label={label} value={value} onChange={onChange} placeholder={placeholder} />
      </div>
      <div className="flex shrink-0 rounded-lg border border-gray-200 dark:border-gray-600 p-0.5">
        {(["months", "years"] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => onUnitChange(u)}
            className={`rounded-md px-2.5 py-2 text-xs font-medium transition-colors ${
              unit === u
                ? "bg-green-600 text-white"
                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600"
            }`}
          >
            {u === "months" ? "meses" : "anos"}
          </button>
        ))}
      </div>
    </div>
  );
}
