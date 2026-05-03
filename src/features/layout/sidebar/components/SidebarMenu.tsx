import { NavLink } from "react-router-dom";
import { useSidebarCollapsed } from "../sidebar.store";
import { Icon } from "@/utils/icon";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { path: "/dashboard/customers", label: "Clientes", icon: "group" },
  { path: "/dashboard/products", label: "Productos", icon: "inventory_2" },
  { path: "/dashboard/logistics", label: "Logística", icon: "warehouse" },
  { path: "/dashboard/shipments", label: "Envíos", icon: "local_shipping" },
];

export function SidebarMenu() {
  const isCollapsed = useSidebarCollapsed();

  return (
    <nav className="flex-grow px-3 space-y-1">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex items-center h-11 px-3 rounded-xl transition-all group relative",
            isActive 
              ? "bg-primary text-white shadow-md shadow-primary/20" 
              : "text-outline hover:bg-primary/10 hover:text-primary"
          )}
        >
          <Icon 
            name={item.icon} 
            size="xl" 
            className={cn("flex-shrink-0 transition-transform group-hover:scale-110")} 
          />
          
          {!isCollapsed && (
            <span className="ml-4 text-sm font-bold animate-in fade-in slide-in-from-left-2 duration-300">
              {item.label}
            </span>
          )}

          {isCollapsed && (
            <div className="absolute left-14 bg-inverse-surface text-inverse-on-surface text-[11px] font-bold px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap uppercase tracking-widest">
              {item.label}
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
