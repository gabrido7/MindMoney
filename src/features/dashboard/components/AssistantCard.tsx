import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import { insightsService, type Insight, type InsightSeverity } from "../../../services/insightsService";
import { ApiError, errorMessage } from "../../../services/api";

const SEVERITY_COLOR: Record<InsightSeverity, string> = {
  success: "var(--brand)",
  warning: "var(--warning)",
  info: "#2a78d6",
};

const SEVERITY_ICON: Record<InsightSeverity, "trophy" | "alert" | "chart"> = {
  success: "trophy",
  warning: "alert",
  info: "chart",
};

export default function AssistantCard({ month }: { month: string }) {
  const { data, isLoading: loading, error: queryError } = useQuery({
    queryKey: ["insights", month],
    queryFn: () => insightsService.list(month),
  });
  const error = errorMessage(queryError);
  const insights: Insight[] = data?.insights ?? [];

  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<{ question: string; answer: string }[]>([]);
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);

  const handleAsk = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setAsking(true);
    setAskError(null);
    const asked = question;
    setQuestion("");

    try {
      const { answer } = await insightsService.ask(asked, month);
      setConversation((prev) => [...prev, { question: asked, answer }]);
    } catch (err) {
      setAskError(err instanceof ApiError ? err.message : "Não foi possível responder agora.");
    } finally {
      setAsking(false);
    }
  };

  return (
    <Card
      title="Assistente Financeiro"
      action={<Icon name="sparkles" size={18} className="text-ink-soft" />}
    >
      {loading && <p className="text-ink-soft">Analisando seus dados...</p>}
      {error && <p className="text-negative">{error}</p>}

      {!loading && !error && (
        <>
          {insights.length === 0 ? (
            <EmptyState message="Sem observações relevantes para este mês ainda." />
          ) : (
            <ul className="flex flex-col gap-3 mb-5">
              {insights.map((insight, index) => (
                <li key={index} className="flex gap-3">
                  <span
                    className="shrink-0 mt-0.5"
                    style={{ color: SEVERITY_COLOR[insight.severity] }}
                  >
                    <Icon name={SEVERITY_ICON[insight.severity]} size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{insight.title}</p>
                    <p className="text-sm text-ink-soft">{insight.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-line pt-4">
            <p className="text-xs text-ink-soft mb-3">
              Pergunte sobre seus próprios dados — categorias, economia, meta ou score.
            </p>

            {conversation.length > 0 && (
              <ul className="flex flex-col gap-3 mb-3">
                {conversation.map((turn, index) => (
                  <li key={index} className="text-sm">
                    <p className="font-medium text-ink-soft">Você: {turn.question}</p>
                    <p className="text-ink-soft">{turn.answer}</p>
                  </li>
                ))}
              </ul>
            )}

            {askError && <p className="text-negative text-sm mb-2">{askError}</p>}

            <form onSubmit={handleAsk} className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: quanto gastei em alimentação?"
                disabled={asking}
                className="flex-1 p-2.5 rounded-xl border border-line bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <Button type="submit" disabled={asking || !question.trim()}>
                <Icon name="send" size={16} />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  );
}
