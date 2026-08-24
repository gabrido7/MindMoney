import Icon, { type IconName } from "./Icon";

export default function EmptyState({
  icon = "chart",
  message,
}: {
  icon?: IconName;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-ink-soft">
      <Icon name={icon} size={32} />
      <p className="text-sm">{message}</p>
    </div>
  );
}
