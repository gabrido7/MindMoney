import Icon from "../../../components/ui/Icon";
import { useFavorites } from "../hooks/useFavorites";
import type { FavoriteContentType } from "../../../types/api";

export default function FavoriteButton({
  contentType,
  contentId,
  size = "md",
}: {
  contentType: FavoriteContentType;
  contentId: string;
  size?: "sm" | "md";
}) {
  const { isFavorited, toggle, isToggling } = useFavorites();
  const active = isFavorited(contentType, contentId);

  return (
    <button
      type="button"
      onClick={() => toggle(contentType, contentId)}
      disabled={isToggling}
      aria-pressed={active}
      aria-label={active ? "Remover dos conteúdos salvos" : "Salvar conteúdo"}
      title={active ? "Remover dos conteúdos salvos" : "Salvar conteúdo"}
      className={`inline-flex shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${
        size === "sm" ? "p-1.5" : "p-2"
      } ${
        active
          ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950"
          : "text-gray-400 hover:bg-gray-100 hover:text-amber-500 dark:hover:bg-gray-700"
      }`}
    >
      <Icon name="star" size={size === "sm" ? 16 : 20} filled={active} />
    </button>
  );
}
