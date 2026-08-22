export default function DashboardPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="glow-blob absolute -inset-6 animate-glow-pulse opacity-40"
      />
      <div className="relative rounded-2xl border border-[rgba(12,163,12,0.4)] bg-[var(--surface)] p-3 shadow-[0_0_60px_-10px_rgba(12,163,12,0.35)] sm:p-4">
        <div className="flex items-center gap-1.5 px-2 pb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="font-body ml-3 text-xs text-white/40">app.mindmoney.com.br/dashboard</span>
        </div>

        <div className="grid gap-3 rounded-xl bg-[var(--bg)] p-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-4 sm:col-span-2">
            <p className="font-body text-xs text-white/50">Saldo do mês</p>
            <p className="font-display mt-1 text-2xl font-bold text-white">R$ 3.482,00</p>
            <div className="mt-4 flex h-20 items-end gap-2">
              {[40, 65, 50, 80, 60, 95, 70].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="flex-1 rounded-t bg-[rgba(12,163,12,0.7)] transition-all duration-700"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[var(--brand)] font-display text-lg font-bold text-[var(--brand)]">
              87
            </div>
            <p className="font-body mt-2 text-center text-xs font-medium text-white/60">Score: Excelente</p>
          </div>
        </div>
      </div>
    </div>
  );
}
