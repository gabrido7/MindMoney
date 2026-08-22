export default function ResultStat({
  label,
  value,
  tone = "default",
  size = "md",
}: {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
  size?: "md" | "lg";
}) {
  const toneClass =
    tone === "positive"
      ? "text-green-600 dark:text-green-400"
      : tone === "negative"
        ? "text-red-600 dark:text-red-400"
        : "text-gray-900 dark:text-white";

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</span>
      <span className={`font-bold tabular-nums ${toneClass} ${size === "lg" ? "text-3xl" : "text-xl"}`}>{value}</span>
    </div>
  );
}
