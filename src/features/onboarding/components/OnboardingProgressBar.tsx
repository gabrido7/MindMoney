/**
 * Barra única contínua (não mais segmentada em blocos por etapa) -- o
 * preenchimento suave, em vez de saltar de bloco em bloco, evita a
 * sensação de "formulário longo" que uma barra em degraus reforça.
 */
export default function OnboardingProgressBar({ step, totalSteps }: { step: number; totalSteps: number }) {
  const percent = totalSteps > 1 ? (step / (totalSteps - 1)) * 100 : 100;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-surface-alt"
    >
      <div
        className="motion-reduce:transition-none h-full rounded-full bg-brand transition-all duration-500 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
