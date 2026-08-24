import type { ReactNode } from "react";
import Card from "../../../components/ui/Card";

export default function CalculatorLayout({
  inputs,
  results,
  chart,
  note,
}: {
  inputs: ReactNode;
  results: ReactNode;
  chart?: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Dados de entrada">
          <div className="flex flex-col gap-4">{inputs}</div>
        </Card>
        <Card title="Resultado">
          <div className="flex flex-col gap-4">{results}</div>
        </Card>
      </div>
      {chart && <Card title="Evolução ao longo do tempo">{chart}</Card>}
      {note && <p className="text-xs text-ink-soft leading-relaxed">{note}</p>}
    </div>
  );
}
