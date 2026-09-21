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

/**
 * Motivo real da recomendação -- não um texto fixo, uma frase gerada a
 * partir da própria estratégia escolhida e da posição da dívida no ranking
 * (rankDebts.ts já ordena por saldo ou por juros, essa função só verbaliza
 * o critério que decidiu a posição #1).
 */
function recommendationReason(top: Debt, strategy: DebtStrategy): string {
  if (strategy === "bola_de_neve") {
    return `"${top.name}" é sua menor dívida em saldo restante -- pela Bola de Neve, quitá-la primeiro dá a sensação de progresso mais rápido, mesmo que não seja a matematicamente mais barata.`;
  }
  return top.interestRate !== null
    ? `"${top.name}" tem a maior taxa de juros entre suas dívidas (${top.interestRate.toLocaleString("pt-BR")}% a.m.) -- por isso é priorizada pela Avalanche, que ataca primeiro o que mais encarece no total.`
    : `"${top.name}" é a próxima da fila pela Avalanche -- as dívidas com juros informado já foram priorizadas antes dela.`;
}

/** Escolha do método + a ordem resultante das dívidas do usuário -- a explicação de cada método fica num card à parte (DebtStrategyInfo). */
export default function DebtStrategySelector({ debts }: { debts: Debt[] }) {
  const [strategy, setStrategy] = useState<DebtStrategy>("bola_de_neve");
  const ranked = rankDebts(debts, strategy);
  const top = ranked[0] ?? null;

  return (
    <Card title="Por onde começar?">
      <ChipGroup options={STRATEGY_OPTIONS} selected={[strategy]} onToggle={setStrategy} className="mb-3" />

      {top && (
        <div className="mb-4 rounded-xl border border-brand bg-brand-soft p-3">
          <p className="text-sm font-semibold text-ink">
            Comece por "{top.name}"
          </p>
          <div className="font-data mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-soft">
            <span>{formatCurrency(top.remainingAmount)} restantes</span>
            <span>{top.interestRate !== null ? `${top.interestRate.toLocaleString("pt-BR")}% a.m.` : "juro não informado"}</span>
            {top.installmentAmount !== null && <span>{formatCurrency(top.installmentAmount)}/mês</span>}
          </div>
          <p className="mt-2 text-xs text-ink">{recommendationReason(top, strategy)}</p>
        </div>
      )}

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
