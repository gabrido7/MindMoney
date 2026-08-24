import ScoreArc from "../../../components/ui/ScoreArc";

export default function DashboardPreview() {
  return (
    <div className="relative rounded-[28px] border border-line bg-surface p-3 shadow-card-lg sm:p-4">
      <div className="flex items-center gap-1.5 px-2 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="font-data ml-3 text-xs text-ink-soft">app.mindmoney.com.br/dashboard</span>
      </div>

      <div className="grid gap-3 rounded-2xl bg-bg p-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-4 sm:col-span-2">
          <p className="text-xs text-ink-soft">Saldo do mês</p>
          <p className="font-data mt-1 text-2xl font-bold text-ink">R$ 3.482,00</p>
          <div className="mt-4 flex h-20 items-end gap-2">
            {[40, 65, 50, 80, 60, 95, 70].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="flex-1 rounded-t bg-brand-soft transition-all duration-700 last:bg-brand"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-line bg-surface p-4">
          <ScoreArc value={87} size="sm">
            <span className="font-data text-base font-bold text-ink">87</span>
          </ScoreArc>
          <p className="text-center text-xs font-medium text-ink-soft">Score: Excelente</p>
        </div>
      </div>
    </div>
  );
}
