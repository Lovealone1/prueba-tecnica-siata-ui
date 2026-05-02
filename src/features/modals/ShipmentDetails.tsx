import { Icon } from "@/utils/icon";
import { type Shipment } from "../shipment/types/shipment.types";
import { generateShipmentGuide } from "../shipment/utils/shipment-guide.util";
import { useQuery } from "@tanstack/react-query";
import { customerService } from "../customer/services/customer.service";
import { productService } from "../product/services/product.service";
import { logisticsService } from "../logistics/services/logistics.service";
import { cn } from "@/lib/utils";

interface ShipmentDetailsProps {
  data: Shipment;
}

export function ShipmentDetails({ data }: ShipmentDetailsProps) {
  // Fetch names for the guide
  const { data: customer } = useQuery({
    queryKey: ["customer", data.customer_id],
    queryFn: () => customerService.getCustomerById(data.customer_id),
    staleTime: 1000 * 60 * 5,
  });

  const { data: product } = useQuery({
    queryKey: ["product", data.product_id],
    queryFn: () => productService.getProductById(data.product_id),
    staleTime: 1000 * 60 * 5,
  });

  const originId = data.warehouse_id || data.seaport_id;
  const { data: origin } = useQuery({
    queryKey: ["logistics-node", originId],
    queryFn: () => logisticsService.getNodes(data.shipping_type === "LAND" ? "WAREHOUSE" : "SEAPORT", 0, 200).then(res => res.data.find(n => n.id === originId)),
    enabled: !!originId,
    staleTime: 1000 * 60 * 5,
  });

  const handleDownloadGuide = () => {
    generateShipmentGuide(data, {
      customerName: customer?.name || "Cargando...",
      productName: product?.name || "Cargando...",
      originName: origin?.name || "Cargando...",
    });
  };

  return (
    <div className="mt-2 flex flex-col items-center">
      {/* GUIDE SIMULATION CARD */}
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-xl overflow-hidden relative">
        {/* Blue top bar */}
        <div className="h-2 bg-primary w-full" />
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-outline">SISTEMA DE GESTIÓN OFICIAL</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase text-outline mb-1">GUÍA DE ENVÍO</div>
              <div className="text-lg font-black text-on-surface">#{data.guide_number}</div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dashed border-outline-variant/30" />

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-12">
            <div className="space-y-3">
              <div className="space-y-0.5">
                <div className="text-[9px] font-black uppercase tracking-wider text-outline">Cliente</div>
                <div className="text-sm font-bold text-on-surface">{customer?.name || "..."}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-black uppercase tracking-wider text-outline">Producto</div>
                <div className="text-sm font-bold text-on-surface">{product?.name || "..."}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-black uppercase tracking-wider text-outline">Cantidad</div>
                <div className="text-sm font-bold text-on-surface">{data.product_quantity} unidades</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-0.5">
                <div className="text-[9px] font-black uppercase tracking-wider text-outline">Origen Operativo</div>
                <div className="flex items-center gap-2">
                  <Icon name={data.shipping_type === "LAND" ? "warehouse" : "anchor"} size="xs" className="text-primary" />
                  <div className="text-sm font-bold text-on-surface">{origin?.name || "..."}</div>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-black uppercase tracking-wider text-outline">Destino</div>
                <div className="flex items-center gap-2">
                  <Icon name="public" size="xs" className="text-primary" />
                  <div className="text-sm font-bold text-on-surface">{data.dispatch_location} ({data.dispatch_continent})</div>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-black uppercase tracking-wider text-outline">Estado</div>
                <div className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border",
                  data.shipping_status === "PENDING" && "bg-warning/10 text-warning border-warning/20",
                  data.shipping_status === "SENT" && "bg-info/10 text-info border-info/20",
                  data.shipping_status === "DELIVERED" && "bg-success/10 text-success border-success/20",
                )}>
                  {data.shipping_status === "PENDING" ? "Pendiente" : 
                   data.shipping_status === "SENT" ? "Enviado" : "Entregado"}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="bg-surface-container-low/50 rounded-2xl overflow-hidden border border-outline-variant/10">
            <div className="grid grid-cols-2 px-4 py-3 border-b border-outline-variant/10">
              <div className="text-[10px] font-black uppercase tracking-wider text-outline">Concepto Liquidación</div>
              <div className="text-right text-[10px] font-black uppercase tracking-wider text-outline">Monto</div>
            </div>
            
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="text-on-surface-variant font-medium">Costo Base</div>
                <div className="font-bold text-on-surface">${data.base_price.toLocaleString()}</div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="text-on-surface-variant font-medium">Descuento ({data.discount_percentage}%)</div>
                <div className="font-bold text-success">-${(data.base_price - data.total_price).toLocaleString()}</div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="text-on-surface-variant font-medium">Tarifa Extra Logística</div>
                <div className={`font-bold ${(data?.applied_extra_fee ?? 0) > 0 ? "text-error" : "text-on-surface"}`}>
                  +${(data?.applied_extra_fee ?? 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-primary px-5 py-4 flex justify-between items-center">
              <div className="text-white font-black uppercase tracking-widest text-[10px]">Total</div>
              <div className="text-white text-xl font-black">${(data.total_price + data.applied_extra_fee).toLocaleString()}</div>
            </div>
          </div>

          {/* Footer Details */}
          <div className="flex justify-between items-center pt-1">
            <div className="flex items-center gap-3 text-outline">
              {data.vehicle_plate && (
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase">Placa</span>
                  <span className="text-xs font-bold">{data.vehicle_plate}</span>
                </div>
              )}
              {data.fleet_number && (
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase">Flota</span>
                  <span className="text-xs font-bold">{data.fleet_number}</span>
                </div>
              )}
            </div>
            <div className="text-[9px] font-bold text-outline uppercase tracking-wider italic">
              Generado: {new Date(data.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Scalloped edge effect at bottom (decorative) */}
        <div className="flex justify-between px-2 -mb-2">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-background -mt-2" />
          ))}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="w-full max-w-2xl mt-6">
        <button
          onClick={handleDownloadGuide}
          className="w-full py-4 bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
        >
          <Icon name="print" size="sm" />
          <span>Imprimir o Guardar Guía Oficial</span>
        </button>
      </div>
    </div>
  );
}
