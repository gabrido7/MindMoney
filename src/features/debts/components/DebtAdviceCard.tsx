import { useQuery } from "@tanstack/react-query";
import Card from "../../../components/ui/Card";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import { debtAdviceService, type AdviceSeverity } from "../../../services/debtAdviceService";
import { errorMessage } from "../../../services/api";

const SEVERITY_COLOR: Record<AdviceSeverity, string> = {
  critical: "var(--negative)",
  warning: "var(--warning)",
  success: "var(--brand)",
};

const SEVERITY_ICON: Record<AdviceSeverity, "alert" | "trophy"> = {
  critical: "alert",
  warning: "alert",
  success: "trophy",
};

export default function DebtAdviceCard() {
  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ["debtAdvice"],
    queryFn: () => debtAdviceService.list(),
  });
  const error = errorMessage(queryError);
  const advice = data?.advice ?? [];

  return (
    <Card
      title="Como sair da dívida"
      action={<Icon name="sparkles" size={18} className="text-ink-soft" />}
    >
      {isLoading && <p className="text-ink-soft">Analisando seus dados...</p>}
      {error && <p className="text-negative">{error}</p>}

      {!isLoading && !error && advice.length === 0 && (
        <EmptyState icon="creditCard" message="Cadastre suas dívidas para receber conselhos personalizados." />
      )}

      {!isLoading && !error && advice.length > 0 && (
        <ul className="flex flex-col gap-3">
          {advice.map((item) => (
            <li key={item.id} className="flex gap-3">
              <span className="mt-0.5 shrink-0" style={{ color: SEVERITY_COLOR[item.severity] }}>
                <Icon name={SEVERITY_ICON[item.severity]} size={18} />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{item.title}</p>
                <p className="text-sm text-ink-soft">{item.message}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
