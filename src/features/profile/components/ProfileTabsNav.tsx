import Icon, { type IconName } from "../../../components/ui/Icon";
import type { ProfileTabId } from "../types";

const TABS: { id: ProfileTabId; label: string; icon: IconName }[] = [
  { id: "conta", label: "Conta", icon: "user" },
  { id: "seguranca", label: "Segurança", icon: "lock" },
  { id: "notificacoes", label: "Notificações", icon: "bell" },
  { id: "aparencia", label: "Aparência", icon: "palette" },
  { id: "financeiro", label: "Financeiro", icon: "wallet" },
  { id: "jornada", label: "Jornada", icon: "trophy" },
  { id: "privacidade", label: "Privacidade", icon: "shield" },
  { id: "perigo", label: "Perigo", icon: "alert" },
];

export default function ProfileTabsNav({
  active,
  onChange,
}: {
  active: ProfileTabId;
  onChange: (tab: ProfileTabId) => void;
}) {
  return (
    <nav
      aria-label="Seções do perfil"
      className="flex gap-1 overflow-x-auto pb-1 md:w-56 md:shrink-0 md:flex-col md:overflow-visible md:pb-0"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        const isDanger = tab.id === "perigo";
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
              isActive
                ? isDanger
                  ? "bg-negative-soft text-negative"
                  : "bg-brand-soft text-brand-deep"
                : "text-ink-soft hover:bg-surface-alt hover:text-ink"
            }`}
          >
            <Icon name={tab.icon} size={17} className="shrink-0" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
