export default function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  const colorClass =
    clamped >= 100
      ? "bg-[#0ca30c]"
      : clamped >= 60
      ? "bg-[#fab219]"
      : "bg-[#d03b3b]";

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3"
    >
      <div
        className={`h-3 rounded-full transition-all ${colorClass}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
