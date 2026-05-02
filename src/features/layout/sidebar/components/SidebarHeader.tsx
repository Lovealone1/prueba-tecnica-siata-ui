import { useSidebarCollapsed, useSidebarActions } from "../sidebar.store";
import { Icon } from "@/utils/icon";
import { cn } from "@/lib/utils";

export function SidebarHeader() {
  const isCollapsed = useSidebarCollapsed();
  const { toggle } = useSidebarActions();

  return (
    <div className="px-3 py-6">
      <button
        onClick={toggle}
        className={cn(
          "flex items-center justify-center w-full rounded-2xl transition-all duration-300 group overflow-hidden h-16",
          isCollapsed 
            ? "bg-transparent p-0 border-none shadow-none hover:bg-primary/10" 
            : "bg-surface-container-low border border-outline-variant/20 hover:bg-primary/10 hover:border-primary/20 shadow-sm p-3"
        )}
        title={isCollapsed ? "Expandir" : "Colapsar"}
      >
        <div className="flex items-center justify-center w-full h-full">
          {isCollapsed ? (
            <img 
              src="/resumed_logo.png" 
              alt="SIATA" 
              className="w-12 h-12 object-contain animate-in zoom-in-50 duration-300 group-hover:scale-110 transition-transform" 
            />
          ) : (
            <img 
              src="/logo.png" 
              alt="SIATA Logistics" 
              className="h-11 object-contain animate-in fade-in slide-in-from-left-4 duration-300 group-hover:scale-105 transition-transform" 
            />
          )}
        </div>
      </button>
    </div>
  );
}
