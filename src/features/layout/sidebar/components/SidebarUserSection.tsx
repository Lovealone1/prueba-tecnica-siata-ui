import { useNavigate } from "react-router-dom";
import { useAuthUser, useAuthStore } from "@/store/auth.store";
import { useSidebarCollapsed } from "../sidebar.store";
import { useTheme } from "@/hooks/useTheme";
import { Icon } from "@/utils/icon";
import { cn } from "@/lib/utils";

export function SidebarUserSection() {
  const user = useAuthUser();
  const logout = useAuthStore((state) => state.logout);
  const isCollapsed = useSidebarCollapsed();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const userInitials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div className="mt-auto px-3 py-6 space-y-4 border-t border-outline-variant/20">
      {/* Actions: Theme & Settings */}
      <div className={cn(
        "flex gap-1",
        isCollapsed ? "flex-col items-center" : "justify-between"
      )}>
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-primary/10 text-outline hover:text-primary transition-all"
          title={theme === "light" ? "Modo Oscuro" : "Modo Claro"}
        >
          <Icon name={theme === "light" ? "dark_mode" : "light_mode"} size="xl" />
        </button>
        
        <button
          className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-primary/10 text-outline hover:text-primary opacity-50 cursor-not-allowed transition-all"
          title="Configuración"
          disabled
        >
          <Icon name="settings" size="xl" />
        </button>
      </div>

      {/* User Card */}
      <div className={cn(
        "rounded-2xl transition-all duration-300 group relative",
        isCollapsed 
          ? "bg-transparent p-0" 
          : "bg-surface-container-low p-2"
      )}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar simulation */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-black text-sm shadow-inner overflow-hidden border-2 border-primary/20">
               <span className="animate-in fade-in zoom-in-50 duration-500">{userInitials}</span>
            </div>

            {!isCollapsed && (
              <div className="flex-grow min-w-0 animate-in fade-in duration-300">
                <p className="text-sm font-bold text-on-surface truncate leading-tight">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-[11px] text-on-surface-variant truncate font-medium">
                  {user?.email}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all active:scale-90"
              title="Cerrar Sesión"
            >
              <Icon name="logout" size="xl" />
            </button>
          )}
        </div>

        {isCollapsed && (
          <button
            onClick={handleLogout}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
            title="Cerrar Sesión"
          >
            <Icon name="logout" size="xs" />
          </button>
        )}
      </div>
    </div>
  );
}
