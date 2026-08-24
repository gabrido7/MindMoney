import type { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export default function Select({
  label,
  id,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`p-2.5 rounded-xl border border-line bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-brand ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}
