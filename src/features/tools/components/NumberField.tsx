export default function NumberField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      <div className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 focus-within:ring-2 focus-within:ring-brand">
        {prefix && <span className="shrink-0 font-data text-sm text-ink-soft">{prefix}</span>}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent py-2.5 font-data text-ink focus:outline-none"
        />
        {suffix && <span className="shrink-0 font-data text-sm text-ink-soft">{suffix}</span>}
      </div>
    </div>
  );
}
