import type { ReactNode } from "react";
import Icon from "./Icon";

interface InstrumentItem {
  label: string;
  value: ReactNode;
  trend?: { direction: "up" | "down"; value: string };
}

/**
 * Faixa de leitura rápida pro topo de Dashboard/Dívidas/Ativos -- os
 * números-chave da página como mostrador de instrumento (painel escuro
 * fixo, não o card branco padrão), em vez de uma fileira de cards
 * idênticos. `gap-px` + fundo no wrapper desenha as divisórias finas entre
 * células sem precisar de borda condicional por item (funciona igual com
 * quebra de linha no mobile). `auto-fit`/`minmax` em vez de um número fixo
 * de colunas -- o número de itens varia por página (3 no Dashboard, outros
 * valores em Dívidas/Ativos) e o grid precisa reagir sozinho, sem depender
 * de uma classe Tailwind estática por contagem.
 */
export default function InstrumentStrip({ items }: { items: InstrumentItem[] }) {
  return (
    <div
      className="grid gap-px overflow-hidden rounded-2xl shadow-card-lg"
      style={{ backgroundColor: "var(--panel-line)", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}
    >
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1 bg-panel px-4 py-4 sm:px-5 sm:py-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-panel-ink opacity-70">
            {item.label}
          </span>
          <span className="font-data text-xl font-bold text-panel-ink sm:text-2xl">{item.value}</span>
          {item.trend && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-panel-ink opacity-80">
              <Icon name={item.trend.direction === "up" ? "trendUp" : "trendDown"} size={12} />
              {item.trend.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
