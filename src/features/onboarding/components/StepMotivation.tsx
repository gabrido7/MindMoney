import Icon from "../../../components/ui/Icon";
import ChipGroup from "../../../components/ui/ChipGroup";
import StepFooter from "./StepFooter";
import type { FinancialPriority } from "../../../types/api";

const MOTIVATION_OPTIONS: { value: FinancialPriority; label: string }[] = [
  { value: "organizar_financas", label: "💰 Organizar minhas finanças" },
  { value: "alcancar_objetivos", label: "🎯 Alcançar meus objetivos" },
  { value: "controlar_gastos", label: "💳 Controlar meus gastos" },
  { value: "reserva_emergencia", label: "🛡️ Criar uma reserva de emergência" },
  { value: "investir", label: "📈 Começar a investir" },
  { value: "educacao", label: "🧠 Aprender sobre dinheiro" },
  { value: "construir_patrimonio", label: "🚀 Construir patrimônio" },
];

export default function StepMotivation({
  selected,
  onChange,
  onContinue,
  onSkip,
}: {
  selected: FinancialPriority[];
  onChange: (value: FinancialPriority[]) => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const toggle = (value: FinancialPriority) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-deep">
        <Icon name="sparkles" size={22} />
      </div>

      <div>
        <h1 className="font-display text-2xl font-bold text-ink">O que te trouxe até aqui?</h1>
        <p className="mt-2 text-sm text-ink-soft">Escolha quantas fizerem sentido -- isso ajuda a priorizar o que te mostramos primeiro.</p>
      </div>

      <ChipGroup options={MOTIVATION_OPTIONS} selected={selected} onToggle={toggle} />

      <StepFooter onSkip={onSkip} onContinue={onContinue} />
    </div>
  );
}
