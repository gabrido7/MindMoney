import { useState } from "react";
import Icon from "../../../components/ui/Icon";
import Input from "../../../components/ui/Input";
import ChipGroup from "../../../components/ui/ChipGroup";
import StepFooter from "./StepFooter";
import type { IncomeDraft } from "../hooks/useOnboarding";

const SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: "Salário", label: "💼 Salário" },
  { value: "Freelance", label: "💻 Freelance" },
  { value: "Negócio próprio", label: "🏢 Negócio próprio" },
  { value: "Bolsa/estágio", label: "🎓 Bolsa/estágio" },
  { value: "Aluguel", label: "🏠 Aluguel" },
  { value: "Investimentos", label: "📈 Investimentos" },
  { value: "Ajuda familiar", label: "👨‍👩‍👦 Ajuda familiar" },
];

export default function StepIncome({
  initialValue,
  onContinue,
  onSkip,
}: {
  initialValue: IncomeDraft;
  onContinue: (draft: IncomeDraft) => void;
  onSkip: () => void;
}) {
  const [amount, setAmount] = useState(initialValue.amount ? String(initialValue.amount) : "");
  const [variable, setVariable] = useState(initialValue.variable);
  const [min, setMin] = useState(initialValue.min ? String(initialValue.min) : "");
  const [max, setMax] = useState(initialValue.max ? String(initialValue.max) : "");
  const [sources, setSources] = useState<string[]>(initialValue.sources);
  const [customSource, setCustomSource] = useState("");

  const numericAmount = Number(amount.replace(",", "."));
  const canContinue = amount.trim() !== "" && numericAmount > 0;

  const toggleSource = (value: string) => {
    setSources((prev) => (prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]));
  };

  const addCustomSource = () => {
    const trimmed = customSource.trim();
    if (!trimmed || sources.includes(trimmed)) return;
    setSources((prev) => [...prev, trimmed]);
    setCustomSource("");
  };

  const handleContinue = () => {
    onContinue({
      amount: numericAmount,
      variable,
      min: variable && min ? Number(min.replace(",", ".")) : null,
      max: variable && max ? Number(max.replace(",", ".")) : null,
      sources,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-deep">
        <Icon name="wallet" size={22} />
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Quanto entra na sua conta todos os meses?</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Pode ser salário, estágio, aposentadoria, renda autônoma ou outras fontes recorrentes.
        </p>
      </div>

      <Input
        id="onboarding-income"
        label="Renda média mensal (R$)"
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        placeholder="0,00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        autoFocus
      />

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Sua renda varia todos os meses?</p>
        <ChipGroup
          options={[
            { value: "nao", label: "Não" },
            { value: "sim", label: "Sim" },
          ]}
          selected={[variable ? "sim" : "nao"]}
          onToggle={(v) => setVariable(v === "sim")}
        />
        {variable && (
          <div className="mt-3 flex gap-2">
            <Input
              id="onboarding-income-min"
              label="Menor renda (R$)"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="flex-1"
            />
            <Input
              id="onboarding-income-max"
              label="Maior renda (R$)"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="flex-1"
            />
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink">De onde vem seu dinheiro?</p>
        <ChipGroup options={SOURCE_OPTIONS} selected={sources} onToggle={toggleSource} />
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="Outra fonte..."
            value={customSource}
            onChange={(e) => setCustomSource(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSource())}
            className="flex-1 rounded-xl border border-line bg-surface p-2 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button
            type="button"
            onClick={addCustomSource}
            className="shrink-0 rounded-xl border border-line px-3 text-sm font-medium text-ink-soft transition-colors hover:border-brand hover:text-brand-deep"
          >
            + Adicionar
          </button>
        </div>
        {sources.filter((s) => !SOURCE_OPTIONS.some((opt) => opt.value === s)).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {sources
              .filter((s) => !SOURCE_OPTIONS.some((opt) => opt.value === s))
              .map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand text-white px-3 py-1 text-xs font-medium"
                >
                  {s}
                  <button type="button" onClick={() => toggleSource(s)} aria-label={`Remover ${s}`}>
                    <Icon name="close" size={12} />
                  </button>
                </span>
              ))}
          </div>
        )}
      </div>

      <StepFooter onSkip={onSkip} onContinue={handleContinue} continueDisabled={!canContinue} />
    </div>
  );
}
