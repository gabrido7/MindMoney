import Card from "../../../components/ui/Card";
import type { GamificationSummary } from "../../../types/api";

export default function LevelCard({ summary }: { summary: GamificationSummary }) {
  const percent = Math.min((summary.xpIntoLevel / summary.xpForNextLevel) * 100, 100);

  return (
    <Card>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold shrink-0">
            {summary.level}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Nível financeiro</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">LVL {summary.level}</p>
          </div>
        </div>
        {summary.streak > 0 && (
          <span className="text-sm font-medium text-orange-500 flex items-center gap-1">
            🔥 {summary.streak} {summary.streak === 1 ? "dia seguido" : "dias seguidos"} estudando
          </span>
        )}
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1.5">
        {summary.xpIntoLevel.toLocaleString("pt-BR")} / {summary.xpForNextLevel.toLocaleString("pt-BR")} XP
        <span className="mx-1.5">·</span>
        {summary.totalXp.toLocaleString("pt-BR")} XP no total
      </p>
    </Card>
  );
}
