import Dial from "../../../components/ui/Dial";
import InstrumentStrip from "../../../components/ui/InstrumentStrip";
import { Ledger, LedgerRow } from "../../../components/ui/Ledger";

/**
 * A prova do hero não é mais uma maquete solta -- são os mesmos primitivos
 * (InstrumentStrip, Dial, Ledger) que rodam dentro do produto de verdade,
 * só que com dados de exemplo. "Sem achismo" vale pro marketing também: o
 * que aparece aqui é literalmente a interface real, não um desenho dela.
 */
export default function DashboardPreview() {
  return (
    <div className="relative rounded-[28px] border border-line bg-surface p-3 shadow-card-lg sm:p-4">
      <div className="flex items-center gap-1.5 px-2 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="font-data ml-3 text-xs text-ink-soft">app.mindmoney.com.br/dashboard</span>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-bg p-4">
        <InstrumentStrip
          items={[
            { label: "Saldo do mês", value: "R$ 3.482", trend: { direction: "up", value: "12,4%" } },
            { label: "Patrimônio", value: "R$ 28.910", trend: { direction: "up", value: "3,1%" } },
          ]}
        />

        <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
          <div className="flex items-center justify-center rounded-xl border border-line bg-surface p-4">
            <Dial value={87} size="md" sublabel="Excelente" label="Score financeiro" />
          </div>

          <div className="rounded-xl border border-line bg-surface p-4">
            <Ledger>
              <LedgerRow
                icon="trendUp"
                iconTone="brand"
                title="Salário"
                meta="03 out · Renda"
                value="R$ 5.200,00"
                tone="positive"
              />
              <LedgerRow
                icon="trendDown"
                iconTone="negative"
                title="Supermercado"
                meta="05 out · Alimentação"
                value="R$ 412,30"
                tone="negative"
              />
              <LedgerRow
                icon="trendDown"
                iconTone="negative"
                title="Aluguel"
                meta="06 out · Moradia"
                value="R$ 1.350,00"
                tone="negative"
              />
            </Ledger>
          </div>
        </div>
      </div>
    </div>
  );
}
