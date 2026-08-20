import { useQuery, useQueryClient } from "@tanstack/react-query";
import { gamificationService } from "../../../services/gamificationService";
import { useToast } from "../../../hooks/useToast";
import type { GamificationResult } from "../../../types/api";

const STAGGER_MS = 450;

export function useGamification() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["gamificationSummary"],
    queryFn: () => gamificationService.summary(),
  });

  /** Mostra o "raio de dopamina": XP ganho, conquistas desbloqueadas e level up, em cascata. */
  const celebrate = (result: GamificationResult | null | undefined) => {
    if (!result) return;
    queryClient.invalidateQueries({ queryKey: ["gamificationSummary"] });

    let delay = 0;

    if (result.xpAwarded > 0) {
      setTimeout(() => showToast(`✨ +${result.xpAwarded} XP`), delay);
      delay += STAGGER_MS;
    }

    for (const achievement of result.newAchievements) {
      setTimeout(() => {
        showToast(`${achievement.emoji} Conquista desbloqueada: ${achievement.title}!`, "celebration");
      }, delay);
      delay += STAGGER_MS;
    }

    if (result.leveledUp) {
      setTimeout(() => {
        showToast(`🎉 Você subiu para o nível ${result.level}!`, "celebration");
      }, delay);
    }
  };

  return { summary: data, isLoading, celebrate };
}
