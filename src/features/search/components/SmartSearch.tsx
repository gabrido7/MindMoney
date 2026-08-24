import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/ui/Icon";
import { SEARCH_INDEX } from "../utils/searchIndex";
import { search } from "../utils/search";
import FavoriteButton from "../../favorites/components/FavoriteButton";

const TYPE_BADGE: Record<"lesson" | "tool", string> = {
  lesson: "bg-surface-alt text-ink-soft",
  tool: "bg-brand-soft text-brand-deep",
};

const TYPE_LABEL: Record<"lesson" | "tool", string> = {
  lesson: "Aula",
  tool: "Calculadora",
};

export default function SmartSearch({
  placeholder = "O que você quer aprender?",
  autoFocus = false,
  onNavigate,
}: {
  placeholder?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => search(query, SEARCH_INDEX), [query]);
  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 focus-within:ring-2 focus-within:ring-brand">
        <Icon name="search" size={18} className="shrink-0 text-ink-soft" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-soft focus:outline-none"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Limpar busca"
            className="shrink-0 text-ink-soft hover:text-ink"
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>

      {hasQuery && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-ink-soft">
            {results.length === 0
              ? "Nenhum conteúdo encontrado. Tente outras palavras."
              : `Encontramos ${results.length} ${results.length === 1 ? "conteúdo relacionado" : "conteúdos relacionados"}.`}
          </p>

          <div className="flex flex-col gap-2">
            {results.map((r) => (
              <div
                key={`${r.type}-${r.id}`}
                className="flex items-center gap-2 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-brand"
              >
                <Link to={r.href} onClick={onNavigate} className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TYPE_BADGE[r.type]}`}
                  >
                    {TYPE_LABEL[r.type]}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{r.title}</span>
                    <span className="block truncate text-xs text-ink-soft">{r.subtitle}</span>
                  </span>
                </Link>
                <FavoriteButton contentType={r.type} contentId={r.id} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
