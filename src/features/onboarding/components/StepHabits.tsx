import { useState } from "react";
import Icon from "../../../components/ui/Icon";
import ChipGroup from "../../../components/ui/ChipGroup";
import StepFooter from "./StepFooter";
import type { FinancialHabits } from "../../../types/api";

export default function StepHabits({
  onContinue,
  onSkip,
}: {
  onContinue: (habits: FinancialHabits) => void;
  onSkip: () => void;
}) {
  const [tracksSpending, setTracksSpending] = useState<FinancialHabits["tracksSpending"] | null>(null);
  const [overspends, setOverspends] = useState<FinancialHabits["overspends"] | null>(null);
  const [creditCardUsage, setCreditCardUsage] = useState<FinancialHabits["creditCardUsage"] | null>(null);
  const [investsRegularly, setInvestsRegularly] = useState<FinancialHabits["investsRegularly"] | null>(null);

  const canContinue = tracksSpending && overspends && creditCardUsage && investsRegularly;

  const handleContinue = () => {
    if (!canContinue) return;
    onContinue({ tracksSpending, overspends, creditCardUsage, investsRegularly });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-deep">
        <Icon name="sparkles" size={22} />
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Como você costuma lidar com seu dinheiro?</h1>
        <p className="mt-2 text-sm text-ink-soft">4 perguntas rápidas -- isso monta seu perfil comportamental.</p>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Você acompanha seus gastos?</p>
          <ChipGroup
            options={[
              { value: "sim", label: "Sim" },
              { value: "as_vezes", label: "Às vezes" },
              { value: "nao", label: "Não" },
            ]}
            selected={tracksSpending ? [tracksSpending] : []}
            onToggle={setTracksSpending}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink">Costuma gastar mais do que planeja?</p>
          <ChipGroup
            options={[
              { value: "nunca", label: "Nunca" },
              { value: "as_vezes", label: "Às vezes" },
              { value: "frequentemente", label: "Frequentemente" },
            ]}
            selected={overspends ? [overspends] : []}
            onToggle={setOverspends}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink">Usa cartão de crédito?</p>
          <ChipGroup
            options={[
              { value: "nao", label: "Não" },
              { value: "pouco", label: "Pouco" },
              { value: "frequentemente", label: "Frequentemente" },
            ]}
            selected={creditCardUsage ? [creditCardUsage] : []}
            onToggle={setCreditCardUsage}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink">Costuma investir?</p>
          <ChipGroup
            options={[
              { value: "nunca", label: "Nunca" },
              { value: "as_vezes", label: "Às vezes" },
              { value: "regularmente", label: "Regularmente" },
            ]}
            selected={investsRegularly ? [investsRegularly] : []}
            onToggle={setInvestsRegularly}
          />
        </div>
      </div>

      <StepFooter onSkip={onSkip} onContinue={handleContinue} continueDisabled={!canContinue} />
    </div>
  );
}
