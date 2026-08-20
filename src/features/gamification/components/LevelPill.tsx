import { Link } from "react-router-dom";
import { useGamification } from "../hooks/useGamification";

export default function LevelPill() {
  const { summary, isLoading } = useGamification();
  if (isLoading || !summary) return null;

  const percent = Math.min((summary.xpIntoLevel / summary.xpForNextLevel) * 100, 100);

  return (
    <Link
      to="/educacao-financeira"
      title={`${summary.xpIntoLevel} / ${summary.xpForNextLevel} XP até o próximo nível`}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <span className="text-xs font-bold text-gray-700 dark:text-gray-200 shrink-0">LVL {summary.level}</span>
      <div className="w-14 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {summary.streak > 0 && (
        <span className="text-xs font-medium text-orange-500 shrink-0">🔥{summary.streak}</span>
      )}
    </Link>
  );
}
