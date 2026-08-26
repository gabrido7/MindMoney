import { useEffect, useRef, useState } from "react";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import { useNotifications } from "../hooks/useNotifications";
import type { ApiNotification } from "../../../types/api";

const TYPE_ICON: Record<ApiNotification["type"], "alert" | "trophy" | "target" | "wallet" | "sparkles"> = {
  limit_exceeded: "alert",
  goal_achieved: "trophy",
  objective_deadline: "target",
  category_budget_exceeded: "wallet",
  onboarding_pending: "sparkles",
};

const TYPE_COLOR: Record<ApiNotification["type"], string> = {
  limit_exceeded: "var(--negative)",
  goal_achieved: "var(--brand)",
  objective_deadline: "var(--warning)",
  category_budget_exceeded: "var(--negative)",
  onboarding_pending: "var(--brand)",
};

function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate.replace(" ", "T")).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, isLoading, markAsRead } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ""}`}
        className="relative p-2 rounded-lg text-ink-soft hover:bg-surface-alt"
      >
        <Icon name="bell" size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-negative px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl bg-surface shadow-card-lg border border-line z-50">
          <div className="px-4 py-3 border-b border-line">
            <h3 className="font-display font-semibold text-ink">Notificações</h3>
          </div>

          {isLoading && <p className="p-4 text-sm text-ink-soft">Carregando...</p>}

          {!isLoading && notifications.length === 0 && (
            <div className="p-2">
              <EmptyState icon="bell" message="Nenhuma notificação por aqui." />
            </div>
          )}

          <ul>
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`px-4 py-3 border-b border-line last:border-0 flex gap-3 ${
                  n.read_at ? "" : "bg-brand-soft"
                }`}
              >
                <span className="shrink-0 mt-0.5" style={{ color: TYPE_COLOR[n.type] }}>
                  <Icon name={TYPE_ICON[n.type]} size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">{n.title}</p>
                  <p className="text-xs text-ink-soft mt-0.5">{n.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] font-data text-ink-soft">{timeAgo(n.created_at)}</span>
                    {!n.read_at && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="text-[11px] text-brand hover:underline"
                      >
                        Marcar como lida
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
