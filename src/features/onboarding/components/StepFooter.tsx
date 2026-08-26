import Icon from "../../../components/ui/Icon";

export default function StepFooter({
  onSkip,
  onContinue,
  continueLabel = "Continuar",
  continueDisabled = false,
  skipLabel = "Pular esta etapa",
}: {
  onSkip: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  skipLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onSkip}
        className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        {skipLabel}
      </button>
      <button
        type="button"
        disabled={continueDisabled}
        onClick={onContinue}
        className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        {continueLabel}
        <Icon name="arrowRight" size={16} />
      </button>
    </div>
  );
}
