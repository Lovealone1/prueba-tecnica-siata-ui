import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@/utils/icon";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const ADMIN_NAV_ITEMS = [

  {
    section: "ADMINISTRACIÓN",
    items: [
      { path: "/admin/users", label: "Usuarios", icon: "group" },
      { path: "/admin/shipments", label: "Envíos", icon: "local_shipping" },
    ]
  }
];

export function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Top Navbar */}
      <header className="h-16 flex items-center justify-between px-6 bg-primary text-primary-foreground border-b border-primary-foreground/10 z-50 sticky top-0 shadow-md">
        <div className="flex items-center gap-3">
          <Icon name="admin_panel_settings" size="xl" className="opacity-90" />
          <div className="flex items-center">
            <h1 className="text-xl font-black tracking-widest uppercase">SIATA LOGISTICS</h1>
            <span className="text-sm font-medium opacity-80 ml-2 tracking-wider">/ ADMIN</span>
          </div>
        </div>

        <div className="flex items-center">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-primary-foreground/10 transition-colors font-bold text-sm tracking-wide border border-primary-foreground/20"
            title="Regresar al Dashboard"
          >
            <Icon name="logout" size="sm" className="rotate-180" />
            SALIR DEL PANEL
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-[260px] flex-shrink-0 border-r border-outline-variant/30 bg-background">
          <nav className="p-4 space-y-6">
            {ADMIN_NAV_ITEMS.map((section) => (
              <div key={section.section} className="space-y-2">
                <h3 className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase px-3">
                  {section.section}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={'end' in item ? (item as any).end : undefined}
                      className={({ isActive }) => cn(
                        "flex items-center h-10 px-3 rounded-lg transition-all text-sm group",
                        isActive 
                          ? "bg-primary text-primary-foreground font-bold shadow-sm" 
                          : "text-on-surface hover:text-primary hover:bg-primary/10 font-medium"
                      )}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon 
                            name={item.icon} 
                            size="sm" 
                            className={cn(
                              "mr-3 transition-transform",
                              "group-hover:scale-110",
                              isActive ? "text-primary-foreground" : "text-outline group-hover:text-primary"
                            )} 
                          />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 relative flex flex-col min-h-[calc(100vh-64px)] p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
