import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, id, className = "", ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`p-2.5 rounded-xl border border-line bg-surface text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand ${className}`}
        {...rest}
      />
    </div>
  );
}
