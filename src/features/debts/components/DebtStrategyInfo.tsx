import Card from "../../../components/ui/Card";
import Icon from "../../../components/ui/Icon";
import { formatCurrency } from "../../../utils/formatters";
import type { DebtStrategy } from "../utils/rankDebts";
import { simulateCascade } from "../utils/simulateCascade";
import type { Debt } from "../../../types/api";

const METHOD_INFO: Record<
  DebtStrategy,
  { icon: string; title: string; definition: string; advantages: string[]; idealFor: string }
> = {
  bola_de_neve: {
    icon: "❄️",
    title: "Bola de neve",
    definition: "Ataca primeiro a dívida com o menor saldo restante, não a mais cara.",
    advantages: [
      "Motivação psicológica mais forte -- vitórias rápidas mantêm o ânimo",
      "Reduz o número de dívidas em aberto mais cedo",
      "Mais fácil de acompanhar -- foco numa dívida de cada vez",
    ],
    idealFor: "Quem já tentou quitar dívidas antes e desanimou no meio do caminho, ou prefere ver progresso visível rápido.",
  },
  avalanche: {
    icon: "🏔️",
    title: "Avalanche",
    definition: "Ataca primeiro a dívida com o maior juro, não a de menor saldo.",
    advantages: [
      "Matematicamente minimiza o total pago em juros",
      "Quita primeiro a dívida que mais 'sangra' o orçamento",
      "No longo prazo, libera mais dinheiro no bolso",
    ],
    idealFor: "Quem tem disciplina pra manter o plano mesmo sem vitórias rápidas, e dívidas com juros bem diferentes entre si.",
  },
};

function CascadeStat({
  label,
  cascade,
}: {
  label: string;
  cascade: ReturnType<typeof simulateCascade>;
}) {
  return (
    <div className="flex-1 rounded-xl border border-line bg-surface p-3">
      <p className="text-sm font-semibold text-ink">{label}</p>
      {cascade ? (
        <>
          <p className="mt-1 font-data text-lg font-bold text-ink">
            {cascade.totalMonths} {cascade.totalMonths === 1 ? "mês" : "meses"}
          </p>
          <p className="font-data text-xs text-ink-soft">{formatCurrency(cascade.totalInterest)} de juros no total</p>
          {cascade.excludedCount > 0 && (
            <p className="mt-1 text-[11px] text-ink-soft">
              {cascade.excludedCount} dívida{cascade.excludedCount > 1 ? "s" : ""} sem parcela definida ficou{cascade.excludedCount > 1 ? "ram" : ""} fora
            </p>
          )}
        </>
      ) : (
        <p className="mt-1 text-xs text-ink-soft">Defina a parcela mensal das dívidas pra ver essa projeção.</p>
      )}
    </div>
  );
}

/** Só a explicação dos métodos -- comparação real das duas estratégias sobre as dívidas do usuário + vantagens de cada uma. Nenhuma seleção acontece aqui (ver DebtStrategySelector). */
export default function DebtStrategyInfo({ debts }: { debts: Debt[] }) {
  const snowballCascade = simulateCascade(debts, "bola_de_neve");
  const avalancheCascade = simulateCascade(debts, "avalanche");

  const interestSaved =
    snowballCascade && avalancheCascade ? snowballCascade.totalInterest - avalancheCascade.totalInterest : null;
  const monthsSaved =
    snowballCascade && avalancheCascade ? snowballCascade.totalMonths - avalancheCascade.totalMonths : null;

  return (
    <Card title="Bola de neve vs. Avalanche">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row">
        <CascadeStat label="❄️ Bola de neve" cascade={snowballCascade} />
        <CascadeStat label="🏔️ Avalanche" cascade={avalancheCascade} />
      </div>

      {interestSaved !== null && monthsSaved !== null && (interestSaved !== 0 || monthsSaved !== 0) && (
        <p className="mb-4 rounded-lg bg-surface-alt p-3 text-sm text-ink">
          {interestSaved > 0
            ? `Escolhendo avalanche, você economiza ${formatCurrency(interestSaved)} em juros`
            : interestSaved < 0
              ? `Nesse caso, a bola de neve economiza ${formatCurrency(Math.abs(interestSaved))} em juros`
              : "As duas estratégias custam o mesmo em juros nesse caso"}
          {monthsSaved !== 0 &&
            ` e termina ${Math.abs(monthsSaved)} ${Math.abs(monthsSaved) === 1 ? "mês" : "meses"} ${monthsSaved > 0 ? "antes" : "depois"}`}
          .
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(Object.keys(METHOD_INFO) as DebtStrategy[]).map((key) => {
          const info = METHOD_INFO[key];
          return (
            <div key={key} className="rounded-xl border border-line p-3">
              <p className="text-sm font-semibold text-ink">
                {info.icon} {info.title}
              </p>
              <p className="mt-1 text-xs text-ink-soft">{info.definition}</p>
              <ul className="mt-2 flex flex-col gap-1">
                {info.advantages.map((a) => (
                  <li key={a} className="flex items-start gap-1.5 text-xs text-ink">
                    <Icon name="check" size={12} className="mt-0.5 shrink-0 text-brand" />
                    {a}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-ink-soft">
                <strong className="text-ink">Ideal para quem:</strong> {info.idealFor}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
