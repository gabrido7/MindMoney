import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function AuthField({ label, id, className = "", ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-neutral-300">
        {label}
      </label>
      <input
        id={id}
        className={`rounded-xl border border-white/10 bg-neutral-800/60 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand ${className}`}
        {...rest}
      />
    </div>
  );
}
