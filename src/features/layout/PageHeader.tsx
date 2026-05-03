import { useLocation } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useAuthUser } from "@/store/auth.store";

const ROUTE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "": { 
    title: "Panel de Control", 
    subtitle: "Bienvenido al resumen general de tus operaciones." 
  },
  "dashboard": { 
    title: "Panel de Control", 
    subtitle: "Bienvenido al resumen general de tus operaciones." 
  },
  "customers": { 
    title: "Gestión de Clientes", 
    subtitle: "Administra tu base de datos de clientes y sus perfiles." 
  },
  "products": { 
    title: "Catálogo de Productos", 
    subtitle: "Control de inventario, categorías y especificaciones." 
  },
  "logistics": { 
    title: "Infraestructura Logística", 
    subtitle: "Gestión de almacenes, puertos y puntos de control." 
  },
  "shipments": { 
    title: "Seguimiento de Envíos", 
    subtitle: "Monitorea el estado de tus mercancías en tiempo real." 
  },
  "users": {
    title: "Gestión de Usuarios",
    subtitle: "Administra los accesos y roles del personal."
  },
};

export function PageHeader() {
  const location = useLocation();
  const user = useAuthUser();
  
  const segments = location.pathname.split("/").filter(Boolean);
  const path = segments[segments.length - 1] || "";
  
  const info = ROUTE_TITLES[path] || { title: "Página", subtitle: "" };
  const isDashboard = path === "dashboard" || path === "";

  return (
    <header className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <Breadcrumbs />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-manrope font-black text-on-surface tracking-tight">
            {info.title}
          </h1>
          {info.subtitle && (
            <p className="text-on-surface-variant text-sm font-medium opacity-80">
              {info.subtitle}
            </p>
          )}
        </div>

        {isDashboard && user && (
          <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-2xl px-5 py-3 animate-in fade-in zoom-in duration-500">
            <span className="material-symbols-outlined text-primary">verified_user</span>
            <div>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none mb-1">Rol activo</p>
              <p className="font-black text-on-surface text-sm leading-none">{user.global_role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
