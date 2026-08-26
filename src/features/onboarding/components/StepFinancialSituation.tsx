import Icon from "../../../components/ui/Icon";
import ChipGroup from "../../../components/ui/ChipGroup";
import StepFooter from "./StepFooter";
import type { ExperienceLevel, FinancialSituation } from "../../../types/api";

const SITUATION_OPTIONS: { value: FinancialSituation; label: string }[] = [
  { value: "tudo_controle", label: "😌 Tudo sob controle" },
  { value: "aperta_mas_consigo", label: "😅 Consigo, mas aperta" },
  { value: "vivo_no_limite", label: "😟 Vivo no limite" },
  { value: "endividado", label: "😰 Estou endividado(a)" },
];

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

export default function StepFinancialSituation({
  financialSituation,
  experienceLevel,
  onChangeSituation,
  onChangeExperience,
  onContinue,
  onSkip,
}: {
  financialSituation: FinancialSituation | null;
  experienceLevel: ExperienceLevel | null;
  onChangeSituation: (value: FinancialSituation) => void;
  onChangeExperience: (value: ExperienceLevel) => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning-soft text-warning">
        <Icon name="user" size={22} />
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Como você descreve sua vida financeira hoje?</h1>
        <p className="mt-2 text-sm text-ink-soft">Sem julgamento -- isso só ajusta as recomendações que você vai ver.</p>
      </div>

      <ChipGroup
        options={SITUATION_OPTIONS}
        selected={financialSituation ? [financialSituation] : []}
        onToggle={onChangeSituation}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Seu nível de conhecimento sobre investimentos?</p>
        <ChipGroup
          options={EXPERIENCE_OPTIONS}
          selected={experienceLevel ? [experienceLevel] : []}
          onToggle={onChangeExperience}
        />
      </div>

      <StepFooter onSkip={onSkip} onContinue={onContinue} />
    </div>
  );
}
