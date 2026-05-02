import { useState, useMemo } from "react";
import { Icon } from "@/utils/icon";
import { useModalStore } from "@/store/modal.store";
import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/features/customer/services/customer.service";
import { Select } from "@/components/ui/Select";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { getCountries } from "@/utils/location";

interface ShipmentFiltersModalProps {
  data: {
    filters: {
      customerId: string;
      dispatchLocation: string;
      shippingType: string;
      shippingStatus: string;
      dateFrom: string;
      dateTo: string;
    };
    onApply: (filters: any) => void;
  };
}

export function ShipmentFiltersModal({ data }: ShipmentFiltersModalProps) {
  const { onClose } = useModalStore();
  const [localFilters, setLocalFilters] = useState(data.filters);

  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customerService.getCustomers(0, 200),
  });

  const customerOptions = useMemo(() => {
    const list = Array.isArray(customers) ? customers : customers?.data;
    return [
      { value: "", label: "Todos los clientes", icon: "all_inclusive" },
      ...(list?.map((c: any) => ({ value: c.id, label: c.name })) || [])
    ];
  }, [customers]);

  const countryOptions = useMemo(() => [
    { value: "", label: "Todos los países", icon: "all_inclusive" },
    ...getCountries().map(c => ({ value: c, label: c }))
  ], []);

  const handleApply = () => {
    data.onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const reset = {
      customerId: "",
      dispatchLocation: "",
      shippingType: "",
      shippingStatus: "",
      dateFrom: "",
      dateTo: "",
    };
    setLocalFilters(reset);
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer */}
        <SearchableSelect
          label="Cliente"
          icon="person"
          placeholder="Filtrar por cliente..."
          value={localFilters.customerId}
          onChange={(val) => setLocalFilters({ ...localFilters, customerId: val })}
          options={customerOptions}
        />

        {/* Origin Country */}
        <SearchableSelect
          label="País de Origen"
          icon="public"
          placeholder="Cualquier país..."
          value={localFilters.dispatchLocation}
          onChange={(val) => setLocalFilters({ ...localFilters, dispatchLocation: val })}
          options={countryOptions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shipping Type */}
        <Select
          label="Tipo de Transporte"
          icon="local_shipping"
          value={localFilters.shippingType}
          onChange={(val) => setLocalFilters({ ...localFilters, shippingType: val })}
          options={[
            { value: "", label: "Todos", icon: "all_inclusive" },
            { value: "LAND", label: "Terrestre", icon: "local_shipping" },
            { value: "MARITIME", label: "Marítimo", icon: "sailing" },
          ]}
        />

        {/* Shipping Status */}
        <Select
          label="Estado del Envío"
          icon="info"
          value={localFilters.shippingStatus}
          onChange={(val) => setLocalFilters({ ...localFilters, shippingStatus: val })}
          options={[
            { value: "", label: "Todos", icon: "all_inclusive" },
            { value: "PENDING", label: "Pendiente", icon: "schedule" },
            { value: "IN_TRANSIT", label: "En Tránsito", icon: "moving" },
            { value: "DELIVERED", label: "Entregado", icon: "check_circle" },
            { value: "CANCELLED", label: "Cancelado", icon: "cancel" },
          ]}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1 text-center block">Rango de Fechas de Registro</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <Icon name="event" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              type="date"
              value={localFilters.dateFrom}
              onChange={(e) => setLocalFilters({ ...localFilters, dateFrom: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:border-primary transition-all"
            />
          </div>
          <div className="relative group">
            <Icon name="event" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              type="date"
              value={localFilters.dateTo}
              onChange={(e) => setLocalFilters({ ...localFilters, dateTo: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleReset}
          className="flex-1 py-4 bg-surface-container-high text-on-surface font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-outline-variant/20 transition-all"
        >
          Limpiar Filtros
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-4 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <Icon name="filter_list" size="sm" />
          <span>Aplicar Filtros</span>
        </button>
      </div>
    </div>
  );
}
