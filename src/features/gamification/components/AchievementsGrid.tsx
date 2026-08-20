import Card from "../../../components/ui/Card";
import type { Achievement } from "../../../types/api";

export default function AchievementsGrid({ achievements }: { achievements: Achievement[] }) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-900 dark:text-white">Conquistas</h2>
        <span className="text-xs text-gray-400">
          {unlockedCount} de {achievements.length}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            title={achievement.description}
            className={`flex flex-col items-center text-center gap-1.5 rounded-xl border p-3 transition-all duration-200 ${
              achievement.unlocked
                ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 hover:-translate-y-0.5 hover:shadow-md"
                : "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 opacity-50"
            }`}
          >
            <span className="text-2xl">{achievement.unlocked ? achievement.emoji : "🔒"}</span>
            <p
              className={`text-xs font-medium leading-tight ${
                achievement.unlocked ? "text-gray-900 dark:text-white" : "text-gray-400"
              }`}
            >
              {achievement.title}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
