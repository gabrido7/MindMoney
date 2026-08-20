import { useState } from "react";
import { formatMonthBR, formatMonthLongBR } from "../../../utils/formatters";
import { simulateGoal } from "../utils/simulateGoal";
import type { ApiObjective } from "../../../types/api";

export default function GoalSimulator({ objective }: { objective: ApiObjective }) {
  const [amount, setAmount] = useState("");
  const numericAmount = Number(amount);
  const result =
    amount !== "" && numericAmount > 0
      ? simulateGoal(objective.remainingAmount, objective.targetMonth, numericAmount)
      : null;

  const deltaAbs = result ? Math.abs(result.deltaVsDeadlineMonths) : 0;
  const deltaUnit = deltaAbs === 1 ? "mês" : "meses";

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 flex-wrap">
        E se eu guardar
        <span className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 transition-colors focus-within:border-green-400 focus-within:ring-1 focus-within:ring-green-400">
          <span className="text-gray-400 text-sm">R$</span>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="300"
            aria-label="Valor hipotético por mês"
            className="w-20 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
          />
        </span>
        por mês?
      </label>

      {amount !== "" && !(numericAmount > 0) && (
        <p className="text-sm text-red-500">Digite um valor maior que zero.</p>
      )}

      {result && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-gray-700 dark:text-gray-100 motion-safe:animate-fade-in">
          {result.tooFar ? (
            <p>🔮 Nesse ritmo, levaria muito tempo para chegar lá — talvez valha guardar um pouco mais por mês.</p>
          ) : (
            <>
              <p>
                🔮 Você atingiria sua meta aproximadamente em{" "}
                <strong>{formatMonthLongBR(result.projectedMonth)}</strong>
                {result.monthsNeeded > 0 &&
                  ` (${result.monthsNeeded} ${result.monthsNeeded === 1 ? "mês" : "meses"} a partir de agora)`}
                .
              </p>
              {result.deltaVsDeadlineMonths !== 0 && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {result.deltaVsDeadlineMonths < 0
                    ? `Isso é ${deltaAbs} ${deltaUnit} antes do prazo atual (${formatMonthBR(objective.targetMonth)}).`
                    : `Isso ficaria ${deltaAbs} ${deltaUnit} depois do prazo atual (${formatMonthBR(objective.targetMonth)}).`}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
