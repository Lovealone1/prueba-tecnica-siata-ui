import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModalStore } from "@/store/modal.store";
import { Icon } from "@/utils/icon";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { customerService } from "../services/customer.service";
import type { Customer } from "../types/customer.types";

export function CustomerListPage() {
  const { onOpen } = useModalStore();
  const pageSize = 7;

  const { data, isLoading, error } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customerService.getCustomers(0, 200),
    staleTime: 1000 * 60 * 5,
  });

  const columns: Column<Customer>[] = [
    {
      header: "Cliente", accessor: (item) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-on-surface truncate max-w-[180px]" title={item.name}>{item.name}</span>
          <span className="text-[11px] text-outline truncate max-w-[180px]">{item.identifier}</span>
        </div>
      )
    },
    {
      header: "Contacto", accessor: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{item.email}</span>
          <span className="text-[11px] text-outline">{item.phone}</span>
        </div>
      )
    },
    {
      header: "Ubicación", accessor: (item) => (
        <div className="flex items-center gap-2 text-outline">
          <Icon name="location_on" size="xs" className="text-primary/60" />
          <span className="text-sm truncate max-w-[200px]">{item.address}</span>
        </div>
      )
    },
  ];


  if (error) {
    return (
      <div className="bg-error/10 border border-error/30 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
        <Icon name="error" className="text-4xl text-error mb-3" />
        <h3 className="text-lg font-bold text-error">Error al cargar datos</h3>
        <p className="text-sm text-error/80 mt-1">No se pudo obtener la lista de clientes. Por favor, intenta nuevamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={data?.data || []}
        pageSize={pageSize}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Buscar por nombre..."
        onAdd={() => onOpen("CREATE_CUSTOMER")}
        addLabel="Nuevo Cliente"
        onEdit={(item) => onOpen("EDIT_CUSTOMER", item)}
        onDelete={(item) => onOpen("DELETE_CUSTOMER", item)}
        onView={(item) => onOpen("VIEW_CUSTOMER", item)}
      />
    </div>
  );
}
