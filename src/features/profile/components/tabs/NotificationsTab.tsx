import Card from "../../../../components/ui/Card";
import Switch from "../../../../components/ui/Switch";
import { useNotificationPreferences } from "../../hooks/useNotificationPreferences";
import type { NotificationType } from "../../../../types/api";

const OPTIONS: { type: NotificationType; title: string; description: string }[] = [
  {
    type: "limit_exceeded",
    title: "Limite de gastos ultrapassado",
    description: "Avisar quando suas saídas do mês passarem do percentual de alerta das suas entradas.",
  },
  {
    type: "goal_achieved",
    title: "Meta de economia atingida",
    description: "Avisar quando você bater a meta de economia definida para o mês.",
  },
  {
    type: "objective_deadline",
    title: "Meta próxima do prazo",
    description: "Lembrar quando um dos seus objetivos financeiros estiver perto de vencer.",
  },
  {
    type: "category_budget_exceeded",
    title: "Orçamento de categoria estourado",
    description: "Avisar quando você ultrapassar o orçamento definido para uma categoria no mês.",
  },
  {
    type: "onboarding_pending",
    title: "Onboarding incompleto",
    description: "Lembrar quando você pular etapas do assistente de boas-vindas, pra completar depois.",
  },
  {
    type: "debt_due_date",
    title: "Vencimento de dívida próximo",
    description: "Avisar quando o vencimento de uma dívida estiver chegando perto.",
  },
];

export default function NotificationsTab() {
  const { preferences, isLoading, setPreference } = useNotificationPreferences();

  return (
    <Card title="Central de notificações">
      <p className="text-sm text-ink-soft mb-5">
        Escolha quais avisos você quer receber. Todos vêm de eventos reais da sua conta -- nada é enviado sem
        acontecer de verdade.
      </p>

      {isLoading && <p className="text-sm text-ink-soft">Carregando...</p>}

      {preferences && (
        <ul className="flex flex-col divide-y divide-line">
          {OPTIONS.map((option) => (
            <li key={option.type} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-ink">{option.title}</p>
                <p className="text-xs text-ink-soft mt-0.5">{option.description}</p>
              </div>
              <Switch
                checked={preferences[option.type]}
                onChange={(enabled) => setPreference(option.type, enabled)}
                label={option.title}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
