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
      ? "text-brand"
      : tone === "negative"
        ? "text-negative"
        : "text-ink";

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</span>
      <span className={`font-data font-bold ${toneClass} ${size === "lg" ? "text-3xl" : "text-xl"}`}>{value}</span>
    </div>
  );
}
