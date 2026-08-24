export default function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  const colorClass =
    clamped >= 100 ? "bg-brand" : clamped >= 60 ? "bg-warning" : "bg-negative";

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="w-full bg-surface-alt rounded-full h-3"
    >
      <div
        className={`h-3 rounded-full transition-all duration-700 ease-out ${colorClass}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
