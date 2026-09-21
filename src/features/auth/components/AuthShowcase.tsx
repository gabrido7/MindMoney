import Icon, { type IconName } from "../../../components/ui/Icon";
import Dial from "../../../components/ui/Dial";

const BADGES: { icon: IconName; className: string }[] = [
  { icon: "target", className: "left-[12%] top-[18%] -rotate-6" },
  { icon: "trophy", className: "right-[14%] top-[14%] rotate-6" },
  { icon: "shield", className: "left-[8%] top-[62%] rotate-3" },
  { icon: "chart", className: "right-[10%] top-[58%] -rotate-3" },
  { icon: "sparkles", className: "left-[20%] top-[82%] rotate-6" },
  { icon: "wallet", className: "right-[22%] top-[80%] -rotate-6" },
];

export default function AuthShowcase() {
  return (
    <div className="relative hidden h-full w-full overflow-hidden bg-neutral-950 lg:block">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-1/4 top-1/2 h-[140%] w-[80%] -translate-y-1/2 rotate-12 bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[10%] top-[20%] h-72 w-72 rounded-full bg-green-500/15 blur-[100px]"
      />

      {BADGES.map(({ icon, className }) => (
        <div
          key={icon}
          className={`absolute flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-neutral-900/80 text-brand shadow-[0_0_25px_rgba(34,197,94,0.25)] backdrop-blur ${className}`}
        >
          <Icon name={icon} size={24} />
        </div>
      ))}

      <div className="relative flex h-full w-full items-center justify-center px-12">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900/90 p-6 shadow-2xl shadow-black/60">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Score financeiro</p>
          <div className="mt-3 flex items-center gap-4">
            <Dial
              value={87}
              color="var(--brand)"
              trackColor="rgba(255,255,255,0.08)"
              size="md"
              center={<span className="font-data text-2xl font-bold text-white">87</span>}
            />
            <div className="flex-1">
              <p className="font-display text-base font-semibold text-white">Excelente</p>
              <div className="mt-2 h-2 rounded-full bg-neutral-800">
                <div className="h-2 w-[87%] rounded-full bg-brand" />
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Meta do mês: viagem</p>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="font-data font-semibold text-white">R$ 1.200 / R$ 1.500</span>
              <span className="font-data text-brand">80%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-neutral-800">
              <div className="h-2 w-4/5 rounded-full bg-brand" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 w-full max-w-sm -translate-x-1/2 px-6 text-center">
        <p className="text-base font-medium text-neutral-200">
          Organize suas finanças, acompanhe metas e entenda seu score, tudo em um só lugar.
        </p>
      </div>
    </div>
  );
}
