import { useQuery } from "@tanstack/react-query";
import Card from "../../../../components/ui/Card";
import Dial from "../../../../components/ui/Dial";
import LevelCard from "../../../gamification/components/LevelCard";
import AchievementsGrid from "../../../gamification/components/AchievementsGrid";
import { useGamification } from "../../../gamification/hooks/useGamification";
import { educationService } from "../../../../services/educationService";
import { objectivesService } from "../../../../services/objectivesService";
import { TRAILS } from "../../../education/data/trails";

const TOTAL_LESSONS = TRAILS.reduce(
  (sum, trail) => sum + trail.courses.reduce((courseSum, course) => courseSum + course.lessons.length, 0),
  0
);

export default function ProgressTab() {
  const { summary } = useGamification();

  const { data: progressData } = useQuery({
    queryKey: ["education-progress"],
    queryFn: () => educationService.listProgress(),
  });

  const { data: objectivesData } = useQuery({
    queryKey: ["objectives"],
    queryFn: () => objectivesService.list(),
  });

  const lessonsCompleted = progressData?.progress.filter((p) => p.completed).length ?? 0;
  const objectives = objectivesData?.objectives ?? [];
  const objectivesAchieved = objectives.filter((o) => o.achieved).length;

  return (
    <div className="flex flex-col gap-6">
      {summary && <LevelCard summary={summary} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="flex items-center gap-4">
            <Dial value={lessonsCompleted} max={Math.max(TOTAL_LESSONS, 1)} size="md" center={lessonsCompleted} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Educação financeira</p>
              <p className="font-data text-sm text-ink mt-1">
                {lessonsCompleted} de {TOTAL_LESSONS} aulas concluídas
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <Dial value={objectivesAchieved} max={Math.max(objectives.length, 1)} size="md" center={objectivesAchieved} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Objetivos financeiros</p>
              <p className="font-data text-sm text-ink mt-1">
                {objectivesAchieved} de {objectives.length} metas concluídas
              </p>
            </div>
          </div>
        </Card>
      </div>

      {summary && <AchievementsGrid achievements={summary.achievements} />}
    </div>
  );
}
