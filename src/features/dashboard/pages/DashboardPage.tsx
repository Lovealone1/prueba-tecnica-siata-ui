import { useAuthStore, useAuthUser } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useModalStore } from "@/store/modal.store";

export function DashboardPage() {
  const user = useAuthUser();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const onOpen = useModalStore((state) => state.onOpen);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
        <div>
          <h1 className="text-2xl font-manrope font-bold text-on-surface">
            Bienvenido, {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-on-surface-variant text-sm">{user?.email}</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-2.5 bg-error/10 text-error font-bold rounded-xl hover:bg-error hover:text-white transition-all group"
        >
          <span className="material-symbols-outlined text-xl group-hover:rotate-180 transition-transform duration-500">logout</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Toast Test Section */}
      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-primary">Test Notifier System</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => toast.success("Operación exitosa", { description: "Los datos se han guardado correctamente en la base de datos." })}
            className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all"
          >
            Success Toast
          </button>
          <button
            onClick={() => toast.error("Error crítico", { description: "Ha ocurrido un problema al intentar procesar la solicitud." })}
            className="px-4 py-2 bg-error/10 text-error font-bold rounded-xl hover:bg-error hover:text-white transition-all"
          >
            Error Toast
          </button>
          <button
            onClick={() => toast("Aviso del sistema", { description: "Hay una nueva actualización disponible para el módulo de logística." })}
            className="px-4 py-2 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-on-surface hover:text-white transition-all"
          >
            Default Toast
          </button>
          <button
            onClick={() => toast.info("Acción requerida", { 
              description: "¿Deseas confirmar la eliminación del registro?",
              action: {
                label: "Confirmar",
                onClick: () => toast.success("Confirmado")
              }
            })}
            className="px-4 py-2 bg-secondary/10 text-secondary font-bold rounded-xl hover:bg-secondary hover:text-white transition-all"
          >
            Action Toast
          </button>
        </div>

        <div className="pt-4 border-t border-outline-variant/10 flex flex-wrap gap-3">
          <button
            onClick={() => onOpen("CREATE_CUSTOMER")}
            className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all"
          >
            Test Create Customer
          </button>
          <button
            onClick={() => onOpen("CREATE_PRODUCT")}
            className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all"
          >
            Test Create Product
          </button>
          <button
            onClick={() => onOpen("CREATE_LOGISTICS")}
            className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all"
          >
            Test Create Logistics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
          <h3 className="font-bold text-primary mb-2">Rol</h3>
          <p className="text-2xl font-black text-on-surface uppercase tracking-tighter">{user?.global_role}</p>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30">
          <h3 className="font-bold text-secondary mb-2">Estado</h3>
          <p className="text-2xl font-black text-on-surface uppercase tracking-tighter">
            {user?.is_active ? "Activo" : "Inactivo"}
          </p>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-outline-variant/30">
          <h3 className="font-bold text-secondary mb-2">ID</h3>
          <p className="text-xs font-mono text-outline truncate">{user?.id}</p>
        </div>
      </div>
      
      <div className="bg-white p-12 rounded-2xl border border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-6xl text-outline/20 mb-4">analytics</span>
        <h2 className="text-xl font-bold text-outline">Panel de Estadísticas Mock</h2>
        <p className="text-on-surface-variant max-w-xs mt-2">
          Aquí se mostrarán las métricas de envíos y logística próximamente.
        </p>
      </div>
    </div>
  );
}
