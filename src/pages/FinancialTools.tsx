import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { TOOLS } from "../features/tools/data/tools";

export default function FinancialTools() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">🧮 Ferramentas financeiras</h1>
        <p className="text-sm text-ink-soft">
          Calculadoras rápidas para simular juros, inflação, financiamentos e outras decisões financeiras — sem precisar de planilha.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link key={tool.id} to={`/ferramentas/${tool.id}`}>
            <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-lg cursor-pointer">
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none">{tool.emoji}</span>
                <div>
                  <h2 className="font-display font-semibold text-ink">{tool.title}</h2>
                  <p className="text-sm text-ink-soft mt-0.5">{tool.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
