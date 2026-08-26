import { useState } from "react";
import Icon from "../../../components/ui/Icon";
import ChipGroup from "../../../components/ui/ChipGroup";
import StepFooter from "./StepFooter";
import type { DebtInput, DebtType } from "../../../types/api";

const DEBT_TYPE_OPTIONS: { value: DebtType; label: string }[] = [
  { value: "cartao_credito", label: "Cartão de crédito" },
  { value: "emprestimo", label: "Empréstimo" },
  { value: "financiamento", label: "Financiamento" },
  { value: "cheque_especial", label: "Cheque especial" },
  { value: "parcelamento", label: "Parcelamento" },
  { value: "outro", label: "Outro" },
];

interface DebtDraft {
  key: string;
  type: DebtType;
  name: string;
  totalAmount: string;
  installmentAmount: string;
  interestRate: string;
  installmentsCount: string;
  dueDay: string;
  showDetails: boolean;
}

const emptyDraft = (): DebtDraft => ({
  key: crypto.randomUUID(),
  type: "cartao_credito",
  name: "",
  totalAmount: "",
  installmentAmount: "",
  interestRate: "",
  installmentsCount: "",
  dueDay: "",
  showDetails: false,
});

export default function StepDebts({
  onContinue,
  onSkip,
}: {
  onContinue: (debts: DebtInput[]) => void;
  onSkip: () => void;
}) {
  const [hasDebts, setHasDebts] = useState<boolean | null>(null);
  const [drafts, setDrafts] = useState<DebtDraft[]>([emptyDraft()]);

  const updateDraft = (key: string, patch: Partial<DebtDraft>) => {
    setDrafts((prev) => prev.map((d) => (d.key === key ? { ...d, ...patch } : d)));
  };

  const removeDraft = (key: string) => {
    setDrafts((prev) => (prev.length > 1 ? prev.filter((d) => d.key !== key) : prev));
  };

  const handleContinue = () => {
    if (!hasDebts) {
      onContinue([]);
      return;
    }
    const debts: DebtInput[] = drafts
      .filter((d) => d.name.trim() && Number(d.totalAmount.replace(",", ".")) > 0)
      .map((d) => ({
        type: d.type,
        name: d.name.trim(),
        totalAmount: Number(d.totalAmount.replace(",", ".")),
        installmentAmount: d.installmentAmount ? Number(d.installmentAmount.replace(",", ".")) : null,
        interestRate: d.interestRate ? Number(d.interestRate.replace(",", ".")) : null,
        installmentsCount: d.installmentsCount ? Number(d.installmentsCount) : null,
        dueDay: d.dueDay ? Number(d.dueDay) : null,
      }));
    onContinue(debts);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-negative-soft text-negative">
        <Icon name="alert" size={22} />
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Você possui alguma dívida atualmente?</h1>
        <p className="mt-2 text-sm text-ink-soft">Cada dívida informada fica salva de verdade -- dá pra editar ou remover depois em Perfil.</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setHasDebts(false)}
          aria-pressed={hasDebts === false}
          className={`flex-1 rounded-xl border p-4 text-left transition-colors ${
            hasDebts === false ? "border-brand bg-brand-soft" : "border-line bg-surface"
          }`}
        >
          <p className="text-sm font-semibold text-ink">Não tenho dívidas</p>
        </button>
        <button
          type="button"
          onClick={() => setHasDebts(true)}
          aria-pressed={hasDebts === true}
          className={`flex-1 rounded-xl border p-4 text-left transition-colors ${
            hasDebts === true ? "border-brand bg-brand-soft" : "border-line bg-surface"
          }`}
        >
          <p className="text-sm font-semibold text-ink">Tenho dívidas</p>
        </button>
      </div>

      {hasDebts && (
        <div className="flex flex-col gap-4">
          {drafts.map((draft, index) => (
            <div key={draft.key} className="motion-reduce:animate-none animate-rise flex flex-col gap-3 rounded-xl border border-line p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Dívida {index + 1}</p>
                {drafts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDraft(draft.key)}
                    aria-label={`Remover dívida ${index + 1}`}
                    className="text-ink-soft hover:text-negative"
                  >
                    <Icon name="close" size={14} />
                  </button>
                )}
              </div>

              <ChipGroup
                options={DEBT_TYPE_OPTIONS}
                selected={[draft.type]}
                onToggle={(value) => updateDraft(draft.key, { type: value })}
              />

              <div className="flex flex-wrap gap-2">
                <div className="flex flex-1 min-w-[140px] flex-col gap-1">
                  <label className="text-xs font-medium text-ink-soft" htmlFor={`debt-name-${draft.key}`}>
                    Nome
                  </label>
                  <input
                    id={`debt-name-${draft.key}`}
                    type="text"
                    placeholder="Ex: Cartão Nubank"
                    value={draft.name}
                    onChange={(e) => updateDraft(draft.key, { name: e.target.value })}
                    className="rounded-lg border border-line bg-surface p-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div className="flex w-32 flex-col gap-1">
                  <label className="text-xs font-medium text-ink-soft" htmlFor={`debt-total-${draft.key}`}>
                    Valor total (R$)
                  </label>
                  <input
                    id={`debt-total-${draft.key}`}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    value={draft.totalAmount}
                    onChange={(e) => updateDraft(draft.key, { totalAmount: e.target.value })}
                    className="rounded-lg border border-line bg-surface p-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              {!draft.showDetails && (
                <button
                  type="button"
                  onClick={() => updateDraft(draft.key, { showDetails: true })}
                  className="self-start text-xs font-medium text-ink-soft hover:text-brand-deep"
                >
                  + Adicionar parcela, juros e vencimento (opcional)
                </button>
              )}

              {draft.showDetails && (
                <div className="flex flex-wrap gap-2">
                  <div className="flex w-28 flex-col gap-1">
                    <label className="text-xs font-medium text-ink-soft" htmlFor={`debt-installment-${draft.key}`}>
                      Parcela (R$)
                    </label>
                    <input
                      id={`debt-installment-${draft.key}`}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      value={draft.installmentAmount}
                      onChange={(e) => updateDraft(draft.key, { installmentAmount: e.target.value })}
                      className="rounded-lg border border-line bg-surface p-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div className="flex w-28 flex-col gap-1">
                    <label className="text-xs font-medium text-ink-soft" htmlFor={`debt-count-${draft.key}`}>
                      Nº de parcelas
                    </label>
                    <input
                      id={`debt-count-${draft.key}`}
                      type="number"
                      min="1"
                      step="1"
                      placeholder="0"
                      value={draft.installmentsCount}
                      onChange={(e) => updateDraft(draft.key, { installmentsCount: e.target.value })}
                      className="rounded-lg border border-line bg-surface p-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div className="flex w-28 flex-col gap-1">
                    <label className="text-xs font-medium text-ink-soft" htmlFor={`debt-interest-${draft.key}`}>
                      Juros (% a.m.)
                    </label>
                    <input
                      id={`debt-interest-${draft.key}`}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      value={draft.interestRate}
                      onChange={(e) => updateDraft(draft.key, { interestRate: e.target.value })}
                      className="rounded-lg border border-line bg-surface p-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div className="flex w-28 flex-col gap-1">
                    <label className="text-xs font-medium text-ink-soft" htmlFor={`debt-dueday-${draft.key}`}>
                      Vencimento (dia)
                    </label>
                    <input
                      id={`debt-dueday-${draft.key}`}
                      type="number"
                      min="1"
                      max="31"
                      step="1"
                      placeholder="1-31"
                      value={draft.dueDay}
                      onChange={(e) => updateDraft(draft.key, { dueDay: e.target.value })}
                      className="rounded-lg border border-line bg-surface p-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => setDrafts((prev) => [...prev, emptyDraft()])}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-brand-deep hover:underline"
          >
            <Icon name="plus" size={14} />
            Adicionar outra dívida
          </button>
        </div>
      )}

      <StepFooter onSkip={onSkip} onContinue={handleContinue} continueDisabled={hasDebts === null} />
    </div>
  );
}
