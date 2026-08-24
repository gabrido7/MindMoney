import Icon from "../../../components/ui/Icon";

export default function AlertBanner({
  level,
  gastoPercentual,
  suggestion,
}: {
  level: "over" | "near";
  gastoPercentual: number;
  suggestion: string | null;
}) {
  const isOver = level === "over";

  return (
    <div
      className={`p-4 rounded-2xl shadow-card flex gap-3 ${
        isOver ? "bg-negative text-white" : "bg-warning text-gray-900"
      }`}
    >
      <Icon name="alert" size={22} className="shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold">
          {isOver ? "Limite ultrapassado!" : "Você está próximo do limite!"}
        </p>
        <p className="text-sm opacity-90">
          Você utilizou <span className="font-data">{gastoPercentual.toFixed(1)}%</span> das suas entradas.
        </p>
        {suggestion && <p className="mt-1 text-sm">{suggestion}</p>}
      </div>
    </div>
  );
}
