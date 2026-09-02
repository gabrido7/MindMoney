import { useState } from "react";
import Card from "../../../components/ui/Card";
import ChipGroup from "../../../components/ui/ChipGroup";
import { formatCurrency } from "../../../utils/formatters";
import { rankDebts, type DebtStrategy } from "../utils/rankDebts";
import type { Debt } from "../../../types/api";

const STRATEGY_OPTIONS: { value: DebtStrategy; label: string }[] = [
  { value: "bola_de_neve", label: "❄️ Bola de neve" },
  { value: "avalanche", label: "🏔️ Avalanche" },
];

/** Escolha do método + a ordem resultante das dívidas do usuário -- a explicação de cada método fica num card à parte (DebtStrategyInfo). */
export default function DebtStrategySelector({ debts }: { debts: Debt[] }) {
  const [strategy, setStrategy] = useState<DebtStrategy>("bola_de_neve");
  const ranked = rankDebts(debts, strategy);

  return (
    <Card title="Por onde começar?">
      <ChipGroup options={STRATEGY_OPTIONS} selected={[strategy]} onToggle={setStrategy} className="mb-3" />

      <ol className="flex flex-col gap-2">
        {ranked.map((debt, index) => (
          <li
            key={debt.id}
            className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 ${
              index === 0 ? "border-brand bg-brand-soft" : "border-line bg-surface"
            }`}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  index === 0 ? "bg-brand text-white" : "bg-surface-alt text-ink-soft"
                }`}
              >
                {index + 1}
              </span>
              <span className="truncate text-sm font-medium text-ink">{debt.name}</span>
              {index === 0 && (
                <span className="shrink-0 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-white">
                  Comece por aqui
                </span>
              )}
            </div>
            <span className="font-data shrink-0 text-xs text-ink-soft">
              {strategy === "bola_de_neve"
                ? `${formatCurrency(debt.remainingAmount)} restantes`
                : debt.interestRate !== null
                  ? `${debt.interestRate.toLocaleString("pt-BR")}% a.m.`
                  : "juro não informado"}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
