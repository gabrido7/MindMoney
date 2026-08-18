import { useEffect, useState } from "react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import ProgressBar from "../../../components/ui/ProgressBar";
import { formatCurrency, formatMonthBR } from "../../../utils/formatters";

export default function GoalCard({
  month,
  goal,
  saldo,
  onChangeGoal,
}: {
  month: string;
  goal: number;
  saldo: number;
  onChangeGoal: (value: number) => Promise<void>;
}) {
  const [draft, setDraft] = useState(goal || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // sincroniza o rascunho quando a meta muda por fora (troca de mês, primeira carga)
  useEffect(() => {
    (() => {
      setDraft(goal || "");
    })();
  }, [goal, month]);

  const savingPercent = goal > 0 ? (saldo / goal) * 100 : 0;

  const handleBlur = async () => {
    const value = Number(draft) || 0;
    if (value === goal) return; // nada mudou, não chama a API à toa

    setSaving(true);
    setError(null);
    try {
      await onChangeGoal(value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a meta.");
      setDraft(goal || ""); // desfaz o rascunho já que não foi salvo
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title={`Meta de Economia — ${formatMonthBR(month)}`}>
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <Input
          label="Meta do mês (R$)"
          type="number"
          placeholder="Definir meta"
          value={draft}
          disabled={saving}
          onChange={(e) => setDraft(e.target.value === "" ? "" : Number(e.target.value))}
          onBlur={handleBlur}
          className="max-w-[200px]"
        />
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          Meta atual: {formatCurrency(goal)}
          {saving && " — salvando..."}
        </span>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {goal > 0 && (
        <>
          <ProgressBar percent={savingPercent} />
          <p className="text-gray-700 dark:text-gray-200 mt-3">
            Progresso: {savingPercent.toFixed(1)}%
          </p>

          {savingPercent >= 100 && (
            <p className="text-[#0ca30c] font-semibold mt-1">🏆 Meta atingida!</p>
          )}

          {savingPercent < 100 && saldo > 0 && (
            <p className="text-[#fab219] mt-1">
              Faltam {formatCurrency(goal - saldo)} para atingir sua meta.
            </p>
          )}

          {saldo <= 0 && (
            <p className="text-[#d03b3b] mt-1">
              Você precisa reduzir gastos para atingir sua meta.
            </p>
          )}
        </>
      )}
    </Card>
  );
}
