import { Link } from "react-router-dom";
import { Icon } from "@/utils/icon";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <span className="text-[180px] font-manrope font-black text-primary/5 select-none leading-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="location_off" size="2xl" className="text-primary animate-bounce duration-1000" />
        </div>
      </div>

      <h1 className="text-4xl font-manrope font-black text-on-surface tracking-tight mb-4">
        Parece que te has perdido
      </h1>
      
      <p className="text-on-surface-variant max-w-md mx-auto mb-10 font-medium">
        La página que buscas no existe o ha sido movida. Verifica la dirección o regresa al panel principal.
      </p>

      <Link
        to="/"
        className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
      >
        <Icon name="dashboard" size="sm" />
        <span>Ir al Dashboard</span>
      </Link>

      <div className="mt-20 opacity-20 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-outline">
        <Icon name="shield" size="xs" />
        <span>SIATA Secure Navigation</span>
      </div>
    </div>
  );
}
