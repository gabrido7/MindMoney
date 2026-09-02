import { useState } from "react";
import ProgressBar from "../../../components/ui/ProgressBar";
import { formatCurrency } from "../../../utils/formatters";
import { simulatePayoff } from "../utils/simulatePayoff";
import type { Debt } from "../../../types/api";

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-2">
      <p className="text-[11px] text-ink-soft">{label}</p>
      <p className="font-data text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

export default function DebtSimulator({ debt }: { debt: Debt }) {
  const [amount, setAmount] = useState(debt.installmentAmount ? String(debt.installmentAmount) : "");
  const numericAmount = Number(amount);
  const result =
    amount !== "" && numericAmount > 0
      ? simulatePayoff(debt.remainingAmount, debt.interestRate ?? 0, numericAmount)
      : null;

  const currentResult = debt.installmentAmount
    ? simulatePayoff(debt.remainingAmount, debt.interestRate ?? 0, debt.installmentAmount)
    : null;
  const comparingToCurrent = debt.installmentAmount !== null && numericAmount !== debt.installmentAmount;
  const deltaMonths =
    comparingToCurrent && result && currentResult && !result.insufficientPayment && !currentResult.insufficientPayment
      ? currentResult.monthsNeeded - result.monthsNeeded
      : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatBlock label="Parcela atual" value={debt.installmentAmount ? formatCurrency(debt.installmentAmount) : "não definida"} />
          <StatBlock label="Juros" value={debt.interestRate !== null ? `${debt.interestRate.toLocaleString("pt-BR")}% a.m.` : "não informado"} />
          <StatBlock
            label="Parcelas restantes"
            value={
              currentResult && !currentResult.insufficientPayment
                ? String(currentResult.monthsNeeded)
                : currentResult?.insufficientPayment
                  ? "nunca no ritmo atual"
                  : "--"
            }
          />
          <StatBlock label="Total pago" value={formatCurrency(debt.paidAmount)} />
        </div>
        <div className="mt-2">
          <ProgressBar percent={debt.progressPercent} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
          E se eu pagasse
          <span className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-2 py-1 transition-colors focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
            <span className="text-sm text-ink-soft">R$</span>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="300"
              aria-label="Valor da parcela mensal simulada"
              className="font-data w-20 bg-transparent text-sm text-ink focus:outline-none"
            />
          </span>
          por mês?
        </label>

        {amount !== "" && !(numericAmount > 0) && (
          <p className="text-sm text-negative">Digite um valor maior que zero.</p>
        )}

        {result && (
          <div className="motion-reduce:animate-none animate-fade-in rounded-lg bg-brand-soft p-3 text-sm text-ink">
            {result.insufficientPayment ? (
              <p>⚠️ Esse valor nem cobre os juros do mês -- nesse ritmo, a dívida nunca seria quitada.</p>
            ) : result.tooFar ? (
              <p>🔮 Nesse ritmo, levaria muito tempo pra quitar -- talvez valha pagar um pouco mais por mês.</p>
            ) : (
              <>
                <p>
                  🔮 Nesse ritmo, você quita em{" "}
                  <strong>
                    {result.monthsNeeded} {result.monthsNeeded === 1 ? "mês" : "meses"}
                  </strong>
                  , pagando <strong>{formatCurrency(result.totalInterest)}</strong> de juros no total.
                </p>
                {deltaMonths !== null && deltaMonths !== 0 && (
                  <p className="mt-1 text-xs text-ink-soft">
                    {deltaMonths > 0
                      ? `Isso é ${deltaMonths} ${deltaMonths === 1 ? "mês" : "meses"} a menos que no ritmo atual.`
                      : `Isso é ${Math.abs(deltaMonths)} ${Math.abs(deltaMonths) === 1 ? "mês" : "meses"} a mais que no ritmo atual.`}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
