import Card from "../../../components/ui/Card";
import Dial from "../../../components/ui/Dial";
import type { GamificationSummary } from "../../../types/api";

export default function LevelCard({ summary }: { summary: GamificationSummary }) {
  return (
    <Card>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Dial value={summary.xpIntoLevel} max={summary.xpForNextLevel} size="md" center={summary.level} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Nível financeiro</p>
            <p className="font-display text-lg font-semibold text-ink">LVL {summary.level}</p>
            <p className="font-data text-xs text-ink-soft mt-1">
              {summary.xpIntoLevel.toLocaleString("pt-BR")} / {summary.xpForNextLevel.toLocaleString("pt-BR")} XP
              <span className="mx-1.5">·</span>
              {summary.totalXp.toLocaleString("pt-BR")} XP no total
            </p>
          </div>
        </div>
        {summary.streak > 0 && (
          <span className="font-data text-sm font-medium text-warning flex items-center gap-1">
            🔥 {summary.streak} {summary.streak === 1 ? "dia seguido" : "dias seguidos"} estudando
          </span>
        )}
      </div>
    </Card>
  );
}
