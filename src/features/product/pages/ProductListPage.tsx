import { useState } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModalStore } from "@/store/modal.store";
import { Icon } from "@/utils/icon";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/product.service";
import { TransportMode, ProductSize, type Product } from "../types/product.types";
import { Select } from "@/components/ui/Select";

const TRANSPORT_MODE_LABELS = {
  [TransportMode.LAND]: "Terrestre",
  [TransportMode.MARITIME]: "Marítimo",
} as const;

const PRODUCT_SIZE_LABELS = {
  [ProductSize.SMALL]: "Pequeño",
  [ProductSize.MEDIUM]: "Mediano",
  [ProductSize.LARGE]: "Grande",
  [ProductSize.EXTRA_LARGE]: "Extra Grande",
} as const;

export function ProductListPage() {
  const { onOpen } = useModalStore();
  const [transportMode, setTransportMode] = useState<string>("");
  const [size, setSize] = useState<string>("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", transportMode, size],
    queryFn: () => productService.getProducts(0, 200, transportMode as TransportMode || undefined, size as ProductSize || undefined),
    staleTime: 1000 * 60 * 5,
  });

  const columns: Column<Product>[] = [
    {
      header: "Producto",
      accessor: (item) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-on-surface truncate max-w-[180px]" title={item.name}>
            {item.name}
          </span>
          <span className="text-[11px] text-outline truncate max-w-[180px]">
            {item.product_type}
          </span>
        </div>
      ),
    },
    {
      header: "Modo de Transporte",
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <Icon 
            name={item.transport_mode === TransportMode.LAND ? "local_shipping" : "sailing"} 
            size="xs" 
            className="text-primary/60" 
          />
          <span className="text-sm font-medium">
            {TRANSPORT_MODE_LABELS[item.transport_mode as keyof typeof TRANSPORT_MODE_LABELS]}
          </span>
        </div>
      ),
    },
    {
      header: "Tamaño",
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <Icon name="straighten" size="xs" className="text-primary/60" />
          <span className="text-sm font-medium">
            {PRODUCT_SIZE_LABELS[item.size as keyof typeof PRODUCT_SIZE_LABELS]}
          </span>
        </div>
      ),
    },
    {
      header: "Descripción",
      accessor: (item) => (
        <span className="text-sm text-outline truncate max-w-[200px]" title={item.description || ""}>
          {item.description || "Sin descripción"}
        </span>
      ),
    },
  ];

  const filters = (
    <div className="flex items-center gap-2">
      <div className="w-44">
        <Select
          size="sm"
          placeholder="Modo: Todos"
          value={transportMode}
          onChange={setTransportMode}
          icon="local_shipping"
          options={[
            { value: "", label: "Todos", icon: "all_inclusive" },
            { value: TransportMode.LAND, label: "Terrestre", icon: "local_shipping" },
            { value: TransportMode.MARITIME, label: "Marítimo", icon: "sailing" },
          ]}
        />
      </div>
      <div className="w-44">
        <Select
          size="sm"
          placeholder="Tamaño: Todos"
          value={size}
          onChange={setSize}
          icon="view_in_ar"
          options={[
            { value: "", label: "Todos", icon: "all_inclusive" },
            { value: ProductSize.SMALL, label: "Pequeño", icon: "view_in_ar" },
            { value: ProductSize.MEDIUM, label: "Mediano", icon: "view_in_ar" },
            { value: ProductSize.LARGE, label: "Grande", icon: "view_in_ar" },
            { value: ProductSize.EXTRA_LARGE, label: "Extra Grande", icon: "view_in_ar" },
          ]}
        />
      </div>
      {(transportMode || size) && (
        <button 
          onClick={() => {
            setTransportMode("");
            setSize("");
          }}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-xl transition-all whitespace-nowrap"
        >
          <Icon name="filter_alt_off" size="sm" />
          <span>Limpiar Filtros</span>
        </button>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="bg-error/10 border border-error/30 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
        <Icon name="error" className="text-4xl text-error mb-3" />
        <h3 className="text-lg font-bold text-error">Error al cargar datos</h3>
        <p className="text-sm text-error/80 mt-1">
          No se pudo obtener la lista de productos. Por favor, intenta nuevamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={data?.data || []}
        pageSize={7}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Buscar productos..."
        filters={filters}
        onAdd={() => onOpen("CREATE_PRODUCT")}
        addLabel="Nuevo Producto"
        onEdit={(item) => onOpen("EDIT_PRODUCT", item)}
        onDelete={(item) => onOpen("DELETE_PRODUCT", item)}
        onView={(item) => onOpen("VIEW_PRODUCT", item)}
      />
    </div>
  );
}
