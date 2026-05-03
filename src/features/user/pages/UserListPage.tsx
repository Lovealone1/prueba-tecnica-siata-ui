import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModalStore } from "@/store/modal.store";
import { Icon } from "@/utils/icon";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import type { User } from "../types/user.types";
import { cn } from "@/lib/utils";

export function UserListPage() {
  const { onOpen } = useModalStore();
  const pageSize = 7;

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAll(0, 200),
    staleTime: 1000 * 60 * 5,
  });

  const columns: Column<User>[] = [
    {
      header: "Usuario",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {item.first_name?.[0] || ""}{item.last_name?.[0] || ""}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-on-surface truncate max-w-[200px]">
              {item.first_name} {item.last_name}
            </span>
            <span className="text-[11px] text-outline truncate max-w-[200px]">{item.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Rol",
      accessor: (item) => (
        <span
          className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase",
            item.global_role === "ADMIN"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
              : "bg-surface-container-highest text-on-surface-variant"
          )}
        >
          {item.global_role}
        </span>
      ),
    },
    {
      header: "Estado",
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              item.is_active ? "bg-emerald-500" : "bg-error"
            )}
          />
          <span className="text-sm font-medium">
            {item.is_active ? "Activo" : "Inactivo"}
          </span>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="bg-error/10 border border-error/30 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
        <Icon name="error" className="text-4xl text-error mb-3" />
        <h3 className="text-lg font-bold text-error">Error al cargar datos</h3>
        <p className="text-sm text-error/80 mt-1">No se pudo obtener la lista de usuarios. Por favor, intenta nuevamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Gestión de Usuarios</h1>
        <p className="text-sm text-on-surface-variant">Administra el acceso y los roles de todos los usuarios del sistema.</p>
      </header>

      <DataTable
        columns={columns}
        data={data?.data || []}
        pageSize={pageSize}
        isLoading={isLoading}
        searchKey="email"
        searchPlaceholder="Buscar por correo electrónico..."
        onEdit={(item) => onOpen("EDIT_ROLE", item)}
      />
    </div>
  );
}
