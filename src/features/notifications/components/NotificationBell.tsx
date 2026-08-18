import { useEffect, useRef, useState } from "react";
import Icon from "../../../components/ui/Icon";
import EmptyState from "../../../components/ui/EmptyState";
import { notificationsService } from "../../../services/notificationsService";
import type { ApiNotification } from "../../../types/api";

const TYPE_ICON: Record<ApiNotification["type"], "alert" | "trophy"> = {
  limit_exceeded: "alert",
  goal_achieved: "trophy",
};

const TYPE_COLOR: Record<ApiNotification["type"], string> = {
  limit_exceeded: "#d03b3b",
  goal_achieved: "#0ca30c",
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
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      const { notifications: list } = await notificationsService.list();
      setNotifications(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000); // atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const handleMarkRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
    try {
      await notificationsService.markRead(id);
    } catch {
      load(); // se falhar, sincroniza de volta com o servidor
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ""}`}
        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <Icon name="bell" size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#d03b3b] px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notificações</h3>
          </div>

          {loading && <p className="p-4 text-sm text-gray-500 dark:text-gray-400">Carregando...</p>}

          {!loading && notifications.length === 0 && (
            <div className="p-2">
              <EmptyState icon="bell" message="Nenhuma notificação por aqui." />
            </div>
          )}

          <ul>
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700 last:border-0 flex gap-3 ${
                  n.read_at ? "" : "bg-blue-50/50 dark:bg-blue-950/30"
                }`}
              >
                <span className="shrink-0 mt-0.5" style={{ color: TYPE_COLOR[n.type] }}>
                  <Icon name={TYPE_ICON[n.type]} size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-gray-400">{timeAgo(n.created_at)}</span>
                    {!n.read_at && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="text-[11px] text-blue-600 hover:underline"
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
