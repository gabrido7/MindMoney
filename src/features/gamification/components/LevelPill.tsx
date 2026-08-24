import { Link } from "react-router-dom";
import { useGamification } from "../hooks/useGamification";

// Uma pílula compacta de cabeçalho, ao lado de botões de ícone pequenos (sino,
// alternador de tema) -- o anel de progresso ScoreArc (mín. 56px no tamanho "sm")
// não cabe nessa faixa sem dominar o header, então aqui o sinal de "progresso
// rumo a um número" continua sendo uma barrinha linear, só que com os tokens novos.
export default function LevelPill() {
  const { summary, isLoading } = useGamification();
  if (isLoading || !summary) return null;

  const percent = Math.min((summary.xpIntoLevel / summary.xpForNextLevel) * 100, 100);

  return (
    <Link
      to="/educacao-financeira"
      title={`${summary.xpIntoLevel} / ${summary.xpForNextLevel} XP até o próximo nível`}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface-alt transition-colors"
    >
      <span className="font-data text-xs font-bold text-ink-soft shrink-0">LVL {summary.level}</span>
      <div className="w-14 h-1.5 bg-surface-alt rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-brand transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {summary.streak > 0 && (
        <span className="font-data text-xs font-medium text-warning shrink-0">🔥{summary.streak}</span>
      )}
    </Link>
  );
}
