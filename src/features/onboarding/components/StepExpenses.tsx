import { useState } from "react";
import Icon from "../../../components/ui/Icon";
import StepFooter from "./StepFooter";
import type { FixedExpenseDraft } from "../hooks/useOnboarding";

interface ExpenseCard {
  key: string;
  name: string;
  label: string;
  categoryName: string;
  subcategoryName?: string;
}

const EXPENSE_CARDS: ExpenseCard[] = [
  { key: "moradia", name: "Moradia", label: "🏠 Moradia", categoryName: "Moradia" },
  { key: "transporte", name: "Transporte", label: "🚗 Transporte", categoryName: "Transporte" },
  { key: "alimentacao", name: "Alimentação", label: "🍔 Alimentação", categoryName: "Alimentação" },
  { key: "telefone", name: "Telefone", label: "📱 Telefone", categoryName: "Telefone" },
  { key: "internet", name: "Internet", label: "🌐 Internet", categoryName: "Moradia", subcategoryName: "Internet" },
  { key: "educacao", name: "Educação", label: "🎓 Educação", categoryName: "Educação" },
  { key: "saude", name: "Saúde", label: "💊 Saúde", categoryName: "Saúde" },
  { key: "assinaturas", name: "Assinaturas", label: "🎬 Assinaturas", categoryName: "Assinaturas" },
  { key: "pets", name: "Pets", label: "🐶 Pets", categoryName: "Pets" },
  { key: "familia", name: "Família", label: "👨‍👩‍👧 Família", categoryName: "Família" },
];

interface DraftEntry {
  checked: boolean;
  amount: string;
  periodicity: "mensal" | "anual";
}

export default function StepExpenses({
  onContinue,
  onSkip,
}: {
  onContinue: (expenses: FixedExpenseDraft[]) => void;
  onSkip: () => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, DraftEntry>>({});

  const getDraft = (key: string): DraftEntry => drafts[key] ?? { checked: false, amount: "", periodicity: "mensal" };

  const toggle = (key: string) => {
    const current = getDraft(key);
    setDrafts((prev) => ({ ...prev, [key]: { ...current, checked: !current.checked } }));
  };

  const updateDraft = (key: string, patch: Partial<DraftEntry>) => {
    setDrafts((prev) => ({ ...prev, [key]: { ...getDraft(key), ...patch } }));
  };

  const selectedCount = EXPENSE_CARDS.filter((c) => {
    const d = getDraft(c.key);
    return d.checked && Number(d.amount.replace(",", ".")) > 0;
  }).length;

  const handleContinue = () => {
    const expenses: FixedExpenseDraft[] = EXPENSE_CARDS.filter((card) => {
      const d = getDraft(card.key);
      return d.checked && Number(d.amount.replace(",", ".")) > 0;
    }).map((card) => {
      const d = getDraft(card.key);
      return {
        categoryName: card.categoryName,
        subcategoryName: card.subcategoryName,
        label: card.name,
        amount: Number(d.amount.replace(",", ".")),
        periodicity: d.periodicity,
      };
    });
    onContinue(expenses);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-negative-soft text-negative">
        <Icon name="tag" size={22} />
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Quais despesas você paga todos os meses?</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Marque as que se aplicam. Cada uma vira uma transação real do mês -- pule se preferir lançar depois.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {EXPENSE_CARDS.map((card) => {
          const draft = getDraft(card.key);
          return (
            <div
              key={card.key}
              className={`rounded-xl border transition-colors ${
                draft.checked ? "border-brand bg-brand-soft" : "border-line bg-surface"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(card.key)}
                aria-pressed={draft.checked}
                className="flex w-full items-center justify-between gap-3 p-3 text-left"
              >
                <span className="text-sm font-medium text-ink">{card.label}</span>
                <Icon name={draft.checked ? "check" : "plus"} size={16} className="shrink-0 text-ink-soft" />
              </button>

              {draft.checked && (
                <div className="flex flex-wrap items-end gap-2 border-t border-line/60 p-3 pt-2">
                  <div className="flex flex-1 flex-col gap-1 min-w-[100px]">
                    <label className="text-xs font-medium text-ink-soft" htmlFor={`expense-amount-${card.key}`}>
                      Valor (R$)
                    </label>
                    <input
                      id={`expense-amount-${card.key}`}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      value={draft.amount}
                      onChange={(e) => updateDraft(card.key, { amount: e.target.value })}
                      className="rounded-lg border border-line bg-surface p-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-ink-soft" htmlFor={`expense-periodicity-${card.key}`}>
                      Periodicidade
                    </label>
                    <select
                      id={`expense-periodicity-${card.key}`}
                      value={draft.periodicity}
                      onChange={(e) => updateDraft(card.key, { periodicity: e.target.value as "mensal" | "anual" })}
                      className="rounded-lg border border-line bg-surface p-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      <option value="mensal">Mensal</option>
                      <option value="anual">Anual</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <StepFooter
        onSkip={onSkip}
        onContinue={handleContinue}
        continueLabel={selectedCount > 0 ? "Continuar" : "Nenhuma, continuar"}
      />
    </div>
  );
}
