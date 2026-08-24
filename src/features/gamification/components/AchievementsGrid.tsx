import Card from "../../../components/ui/Card";
import type { Achievement } from "../../../types/api";

export default function AchievementsGrid({ achievements }: { achievements: Achievement[] }) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-ink">Conquistas</h2>
        <span className="font-data text-xs text-ink-soft">
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
                ? "border-warning bg-warning-soft hover:-translate-y-0.5 hover:shadow-card"
                : "border-line bg-surface-alt opacity-50 grayscale"
            }`}
          >
            <span className="text-2xl">{achievement.unlocked ? achievement.emoji : "🔒"}</span>
            <p
              className={`text-xs font-medium leading-tight ${
                achievement.unlocked ? "text-ink" : "text-ink-soft"
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
