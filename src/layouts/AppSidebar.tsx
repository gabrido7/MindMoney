import { useEffect, useState } from "react";
import { Link, NavLink, type NavLinkRenderProps } from "react-router-dom";
import Icon, { type IconName } from "../components/ui/Icon";
import LogoMark from "../components/ui/LogoMark";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../features/favorites/hooks/useFavorites";

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: "home" },
  { to: "/metas", label: "Metas", icon: "target" },
  { to: "/relatorios", label: "Relatórios", icon: "chart" },
  { to: "/educacao-financeira", label: "Educação Financeira", icon: "book" },
  { to: "/ferramentas", label: "Ferramentas", icon: "wallet" },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sidebar-collapsed") === "true");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "?";
  const favoriteCount = favorites.length;

  const linkClass = ({ isActive }: NavLinkRenderProps) =>
    `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive ? "bg-brand-soft text-brand-deep" : "text-ink-soft hover:bg-surface hover:text-ink"
    } ${collapsed ? "justify-center" : ""}`;

  const activeBar = (isActive: boolean) =>
    isActive && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand" />;

  const content = (
    <div className="flex h-full flex-col gap-6 px-3 py-5">
      <div className={`flex items-center gap-2 px-2 ${collapsed ? "justify-center" : ""}`}>
        <LogoMark size={32} />
        {!collapsed && <span className="font-display text-lg font-bold text-ink">Mind Money</span>}
      </div>

      <Link
        to="/perfil"
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface ${collapsed ? "justify-center" : ""}`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-deep">
          {initials}
        </div>
        {!collapsed && (
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
            <p className="truncate text-xs text-ink-soft">{user?.email}</p>
          </div>
        )}
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={linkClass}
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                {activeBar(isActive)}
                <Icon name={item.icon} size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}

        <NavLink
          to="/favoritos"
          onClick={() => setMobileOpen(false)}
          className={linkClass}
          title={collapsed ? "Favoritos" : undefined}
        >
          {({ isActive }) => (
            <>
              {activeBar(isActive)}
              <Icon name="star" size={18} className="shrink-0" />
              {!collapsed && <span className="flex-1 truncate">Favoritos</span>}
              {favoriteCount > 0 && (
                <span
                  className={`flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-white ${
                    collapsed ? "absolute -right-1 -top-1" : ""
                  }`}
                >
                  {favoriteCount > 9 ? "9+" : favoriteCount}
                </span>
              )}
            </>
          )}
        </NavLink>
      </nav>

      <div className="flex flex-col gap-1 border-t border-line pt-3">
        <button
          type="button"
          onClick={logout}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface hover:text-ink ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Icon name="logout" size={18} className="shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className="hidden items-center justify-center rounded-xl p-2 text-ink-soft transition-colors hover:bg-surface hover:text-ink md:flex"
        >
          <Icon name="arrowRight" size={16} className={collapsed ? "" : "rotate-180"} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-line bg-surface-alt px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <LogoMark size={28} />
          <span className="font-display text-base font-bold text-ink">Mind Money</span>
        </div>
        <button type="button" onClick={() => setMobileOpen(true)} aria-label="Abrir menu" className="p-2 text-ink">
          <Icon name="menu" size={22} />
        </button>
      </div>

      <aside
        className={`hidden shrink-0 border-r border-line bg-surface-alt transition-[width] duration-200 md:flex md:flex-col ${
          collapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="h-full w-72 bg-surface-alt" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
                className="p-2 text-ink-soft"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
