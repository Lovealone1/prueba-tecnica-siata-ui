import { useLocation } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const ROUTE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "": { 
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
};

export function PageHeader() {
  const location = useLocation();
  const path = location.pathname.split("/")[1] || "";
  const info = ROUTE_TITLES[path] || { title: "Página", subtitle: "" };

  return (
    <header className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <Breadcrumbs />
      
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
    </header>
  );
}
