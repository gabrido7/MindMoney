import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import { useFavorites } from "../features/favorites/hooks/useFavorites";
import FavoriteButton from "../features/favorites/components/FavoriteButton";
import { findSearchDocument } from "../features/search/utils/searchIndex";

const TYPE_BADGE: Record<"lesson" | "tool", string> = {
  lesson: "bg-surface-alt text-ink-soft",
  tool: "bg-brand-soft text-brand-deep",
};

const TYPE_LABEL: Record<"lesson" | "tool", string> = {
  lesson: "Aula",
  tool: "Calculadora",
};

export default function Favorites() {
  const { favorites, isLoading } = useFavorites();

  const items = favorites
    .map((f) => findSearchDocument(f.contentType, f.contentId))
    .filter((d): d is NonNullable<typeof d> => d !== undefined);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">⭐ Meus conteúdos salvos</h1>
        <p className="text-sm text-ink-soft">
          Aulas e calculadoras que você marcou para acessar rápido depois.
        </p>
      </div>

      {isLoading && <p className="text-ink-soft">Carregando...</p>}

      {!isLoading && items.length === 0 && (
        <EmptyState
          icon="star"
          message="Você ainda não salvou nenhum conteúdo. Toque na estrela de uma aula ou calculadora para guardar aqui."
        />
      )}

      {!isLoading && items.length > 0 && (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Card key={`${item.type}-${item.id}`} className="flex items-center justify-between gap-3">
              <Link to={item.href} className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TYPE_BADGE[item.type]}`}
                >
                  {TYPE_LABEL[item.type]}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{item.title}</span>
                  <span className="block truncate text-xs text-ink-soft">{item.subtitle}</span>
                </span>
              </Link>
              <FavoriteButton contentType={item.type} contentId={item.id} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
