export function AdminPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto h-full animate-in fade-in duration-700 mt-20">
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant mb-2">
        PANEL DE ADMINISTRACIÓN
      </p>
      <h1 className="text-6xl font-black text-on-surface tracking-tight mb-6">
        Dashboard.
      </h1>
      <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
        Navega a través del menú lateral para gestionar los recursos del sistema.
      </p>
    </div>
  );
}
