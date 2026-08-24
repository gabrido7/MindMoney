import { useState, type InputHTMLAttributes } from "react";
import Icon from "../../../components/ui/Icon";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export default function AuthPasswordField({ label, id, className = "", ...rest }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-neutral-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={`w-full rounded-xl border border-white/10 bg-neutral-800/60 px-4 py-3 pr-11 text-sm text-white placeholder:text-neutral-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand ${className}`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-brand"
        >
          <Icon name={visible ? "eyeOff" : "eye"} size={18} />
        </button>
      </div>
    </div>
  );
}
