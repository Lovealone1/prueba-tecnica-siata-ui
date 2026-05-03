import { useState, useMemo } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useModalStore } from "@/store/modal.store";
import { Icon } from "@/utils/icon";
import { useQuery } from "@tanstack/react-query";
import { shipmentService } from "@/features/shipment/services/shipment.service";
import { customerService } from "@/features/customer/services/customer.service";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/Select";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { getCountries } from "@/utils/location";

export function AdminShipmentListPage() {
  const { onOpen } = useModalStore();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Filter states
  const [customerId, setCustomerId] = useState<string>("");
  const [dispatchLocation, setDispatchLocation] = useState<string>("");
  const [shippingType, setShippingType] = useState<string>("");
  const [shippingStatus, setShippingStatus] = useState<string>("");
  const [guideNumber, setGuideNumber] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: [
      "admin-shipments", 
      currentPage, 
      customerId, 
      dispatchLocation, 
      shippingType, 
      shippingStatus, 
      guideNumber, 
      dateFrom, 
      dateTo
    ],
    queryFn: () => shipmentService.getShipments({
      skip: (currentPage - 1) * pageSize,
      limit: pageSize,
      customer_id: customerId || undefined,
      dispatch_location: dispatchLocation || undefined,
      shipping_type: shippingType || undefined,
      shipping_status: shippingStatus || undefined,
      guide_number: guideNumber || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    }),
  });

  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customerService.getCustomers(0, 200),
    staleTime: 1000 * 60 * 5,
  });

  const customerOptions = useMemo(() => {
    const list = Array.isArray(customers) ? customers : (customers as any)?.data;
    return [
      { value: "", label: "Todos los clientes", icon: "all_inclusive" },
      ...(list?.map((c: any) => ({ value: c.id, label: c.name })) || [])
    ];
  }, [customers]);

  const countryOptions = useMemo(() => [
    { value: "", label: "Todos los países", icon: "all_inclusive" },
    ...getCountries().map(c => ({ value: c, label: c }))
  ], []);

  const mappedData = useMemo(() => {
    if (!data?.data) return [];
    const customerList = Array.isArray(customers) ? customers : (customers as any)?.data;
    
    return data.data.map(shipment => ({
      ...shipment,
      customerName: customerList?.find((c: any) => c.id === shipment.customer_id)?.name || "Cargando..."
    }));
  }, [data, customers]);

  const columns: Column<any>[] = [
    {
      header: "Guía",
      accessor: (item) => (
        <span className="font-mono font-black text-primary tracking-tighter">#{item.guide_number}</span>
      ),
    },
    {
      header: "Cliente",
      accessor: (item) => (
        <span className="font-bold text-on-surface">{item.customerName}</span>
      ),
    },
    {
      header: "Tipo",
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <Icon 
            name={item.shipping_type === "LAND" ? "local_shipping" : "sailing"} 
            size="xs" 
            className="text-outline" 
          />
          <span className="text-[10px] font-bold uppercase">{item.shipping_type === "LAND" ? "Terrestre" : "Marítimo"}</span>
        </div>
      ),
    },
    {
      header: "Estado",
      accessor: (item) => {
        const config = {
          PENDING: { label: "Pendiente", color: "bg-warning", text: "text-warning-on-container", icon: "schedule" },
          SENT: { label: "Enviado", color: "bg-info", text: "text-info-on-container", icon: "local_shipping" },
          DELIVERED: { label: "Entregado", color: "bg-success", text: "text-success-on-container", icon: "check_circle" },
        };
        const status = config[item.shipping_status as keyof typeof config];
        
        return (
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit shadow-sm border border-black/5",
            status.color,
            status.text
          )}>
            <Icon name={status.icon} size="xs" />
            <span>{status.label}</span>
          </div>
        );
      },
    },
    {
      header: "Origen",
      accessor: (item) => (
        <span className="text-xs font-medium text-outline">{item.dispatch_location}</span>
      ),
    },
    {
      header: "Acciones Admin",
      className: "text-right",
      accessor: (item) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onOpen("ADMIN_SHIPMENT_HISTORY", item)}
            className="w-9 h-9 rounded-xl bg-surface-container-highest text-outline hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center shadow-sm border border-outline-variant/10"
            title="Ver Historial"
          >
            <Icon name="history" size="sm" />
          </button>
          <button
            onClick={() => onOpen("ADMIN_OVERRIDE_STATUS", item)}
            className="w-9 h-9 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center shadow-sm border border-primary/20"
            title="Cambiar Estado"
          >
            <Icon name="edit_note" size="sm" />
          </button>
        </div>
      ),
    },
  ];

  const filtersSidePanel = (
    <>
      {isFiltersOpen && (
        <div 
          className="fixed inset-0 bg-black/5 z-40 backdrop-blur-[2px] animate-in fade-in duration-300"
          onClick={() => setIsFiltersOpen(false)}
        />
      )}
      
      <div className={cn(
        "fixed inset-y-0 right-0 w-80 bg-surface-container-lowest border-l border-outline-variant/30 z-50 shadow-2xl transition-all duration-500 ease-in-out transform flex flex-col",
        isFiltersOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-6 border-bottom border-outline-variant/10 flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="tune" size="sm" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Filtros Admin</h3>
          </div>
          <button 
            onClick={() => setIsFiltersOpen(false)}
            className="w-10 h-10 rounded-full hover:bg-outline-variant/10 flex items-center justify-center text-outline transition-all"
          >
            <Icon name="close" size="sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <SearchableSelect
            label="Cliente"
            icon="person"
            placeholder="Todos los clientes"
            value={customerId}
            onChange={(val) => { setCustomerId(val); setCurrentPage(1); }}
            options={customerOptions}
          />

          <SearchableSelect
            label="País de Despacho"
            icon="public"
            placeholder="Cualquier país"
            value={dispatchLocation}
            onChange={(val) => { setDispatchLocation(val); setCurrentPage(1); }}
            options={countryOptions}
          />

          <Select
            label="Tipo de Transporte"
            icon="local_shipping"
            value={shippingType}
            onChange={(val) => { setShippingType(val); setCurrentPage(1); }}
            options={[
              { value: "", label: "Todos los tipos", icon: "all_inclusive" },
              { value: "LAND", label: "Terrestre", icon: "local_shipping" },
              { value: "MARITIME", label: "Marítimo", icon: "sailing" },
            ]}
          />

          <Select
            label="Estado del Envío"
            icon="info"
            value={shippingStatus}
            onChange={(val) => { setShippingStatus(val); setCurrentPage(1); }}
            options={[
              { value: "", label: "Todos los estados", icon: "all_inclusive" },
              { value: "PENDING", label: "Pendiente", icon: "schedule" },
              { value: "SENT", label: "Enviado", icon: "moving" },
              { value: "DELIVERED", label: "Entregado", icon: "check_circle" },
            ]}
          />

          <div className="pt-2 border-t border-outline-variant/10 space-y-6">
            <DatePicker 
              label="Desde"
              icon="event_available"
              value={dateFrom}
              onChange={(val) => { setDateFrom(val); setCurrentPage(1); }}
              placeholder="Fecha inicial..."
            />
            <DatePicker 
              label="Hasta"
              icon="event_busy"
              value={dateTo}
              onChange={(val) => { setDateTo(val); setCurrentPage(1); }}
              placeholder="Fecha final..."
            />
          </div>
        </div>

        <div className="p-6 bg-surface-container-low/50 border-t border-outline-variant/10">
          <button 
            onClick={() => {
              setCustomerId("");
              setDispatchLocation("");
              setShippingType("");
              setShippingStatus("");
              setDateFrom("");
              setDateTo("");
              setCurrentPage(1);
            }}
            className="w-full py-4 border border-outline-variant/30 text-outline font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-outline-variant/10 transition-all flex items-center justify-center gap-2"
          >
            <Icon name="restart_alt" size="xs" />
            Limpiar Filtros
          </button>
        </div>
      </div>
    </>
  );

  const tableFilters = (
    <div className="flex items-center gap-2">
      <div className="relative group">
        <Icon name="receipt" size="xs" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" />
        <input 
          type="text"
          placeholder="N° Guía..."
          value={guideNumber}
          onChange={(e) => {
            setGuideNumber(e.target.value);
            setCurrentPage(1);
          }}
          className="w-32 md:w-40 pl-9 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-sm outline-none focus:border-primary transition-all font-mono"
        />
      </div>

      <button 
        type="button"
        onClick={() => setIsFiltersOpen(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest h-[46px]",
          (customerId || dispatchLocation || shippingType || shippingStatus || dateFrom || dateTo || guideNumber) 
            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
            : "bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-outline-variant/10"
        )}
      >
        <Icon name="tune" size="xs" />
        <span>Filtros Detallados</span>
      </button>
    </div>
  );

  return (
    <div className="relative">
      {filtersSidePanel}
      
      <div className="space-y-6">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="admin_panel_settings" size="sm" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-on-surface tracking-tight">Gestión de Envíos</h1>
              <p className="text-xs text-outline font-bold uppercase tracking-widest">Panel Administrativo</p>
            </div>
          </div>
        </header>

        <DataTable
          columns={columns}
          data={mappedData}
          isLoading={isLoading || !customers}
          totalRecords={data?.total || 0}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          filters={tableFilters}
        />
      </div>
    </div>
  );
}
