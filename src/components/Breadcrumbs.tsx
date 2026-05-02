import { useLocation, Link } from "react-router-dom";
import { Icon } from "@/utils/icon";
import { cn } from "@/lib/utils";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  customers: "Clientes",
  products: "Productos",
  logistics: "Logística",
  shipments: "Envíos",
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-outline">
      <Link
        to="/"
        className="flex items-center hover:text-primary transition-colors group"
      >
        <Icon 
          name="home" 
          size="sm" 
          className="group-hover:scale-110 transition-transform" 
        />
      </Link>

      {pathnames.length > 0 && (
        <Icon name="chevron_right" size="xs" className="text-outline/30" />
      )}

      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const label = ROUTE_LABELS[value] || value;

        return (
          <div key={to} className="flex items-center space-x-2">
            {last ? (
              <span className="text-primary animate-in fade-in slide-in-from-left-2 duration-300">
                {label}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-primary transition-colors"
              >
                {label}
              </Link>
            )}
            {!last && (
              <Icon name="chevron_right" size="xs" className="text-outline/30" />
            )}
          </div>
        );
      })}

      {pathnames.length === 0 && (
        <span className="text-primary animate-in fade-in duration-300">
          Dashboard
        </span>
      )}
    </nav>
  );
}
