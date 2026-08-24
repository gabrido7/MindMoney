import { Link, Navigate, useParams } from "react-router-dom";
import Icon from "../components/ui/Icon";
import { findTool } from "../features/tools/data/tools";
import { CALCULATOR_COMPONENTS } from "../features/tools/calculators";
import type { ToolId } from "../features/tools/types";
import FavoriteButton from "../features/favorites/components/FavoriteButton";

export default function FinancialToolDetail() {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = toolId ? findTool(toolId) : undefined;

  if (!tool) return <Navigate to="/ferramentas" replace />;

  const Calculator = CALCULATOR_COMPONENTS[tool.id as ToolId];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <div>
        <Link
          to="/ferramentas"
          className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-brand"
        >
          <Icon name="arrowRight" size={14} className="rotate-180" />
          Ferramentas financeiras
        </Link>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <h1 className="font-display text-2xl font-semibold text-ink">
            {tool.emoji} {tool.title}
          </h1>
          <FavoriteButton contentType="tool" contentId={tool.id} />
        </div>
        <p className="text-sm text-ink-soft">{tool.description}</p>
      </div>

      <Calculator />
    </div>
  );
}
