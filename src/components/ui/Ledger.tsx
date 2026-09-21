import type { ReactNode } from "react";
import Icon, { type IconName } from "./Icon";

/**
 * Lista tabular -- alternativa ao Card pra dado que é naturalmente lista
 * (transação, parcela, histórico de valor): linhas com regra fina em vez
 * de cada item virar seu próprio cartão branco com sombra. Números sempre
 * em font-data, alinhados à direita, como um razão contábil de verdade.
 */
export function Ledger({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <ul className={`flex flex-col divide-y divide-line ${className}`}>{children}</ul>;
}

const ICON_TONE_CLASSES: Record<"brand" | "negative" | "warning" | "neutral", string> = {
  brand: "bg-brand-soft text-brand-deep",
  negative: "bg-negative-soft text-negative",
  warning: "bg-warning-soft text-warning",
  neutral: "bg-surface-alt text-ink-soft",
};

const VALUE_TONE_CLASSES: Record<"positive" | "negative" | "neutral", string> = {
  positive: "text-brand",
  negative: "text-negative",
  neutral: "text-ink",
};

export function LedgerRow({
  icon,
  iconTone = "neutral",
  title,
  meta,
  value,
  tone = "neutral",
  actions,
}: {
  icon?: IconName;
  iconTone?: "brand" | "negative" | "warning" | "neutral";
  title: ReactNode;
  meta?: ReactNode;
  value: ReactNode;
  tone?: "positive" | "negative" | "neutral";
  actions?: ReactNode;
}) {
  return (
    <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      {icon && (
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${ICON_TONE_CLASSES[iconTone]}`}
        >
          <Icon name={icon} size={16} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{title}</p>
        {meta && <p className="truncate text-xs text-ink-soft">{meta}</p>}
      </div>
      <span className={`font-data shrink-0 text-right text-sm font-semibold ${VALUE_TONE_CLASSES[tone]}`}>
        {value}
      </span>
      {actions && <span className="flex shrink-0 items-center gap-1">{actions}</span>}
    </li>
  );
}
