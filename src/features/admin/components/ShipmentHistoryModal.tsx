import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { shipmentService } from "@/features/shipment/services/shipment.service";
import { Icon } from "@/utils/icon";
import { cn } from "@/lib/utils";
import type { ShipmentHistoryEntry } from "../types/shipment.types";

export function ShipmentHistoryModal({ shipmentId }: { shipmentId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["shipment-history", shipmentId],
    queryFn: () => shipmentService.getShipmentHistory(shipmentId),
  });

  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: { label: "Pendiente", color: "bg-warning", text: "text-warning-on-container", icon: "schedule" },
      SENT: { label: "Enviado", color: "bg-info", text: "text-info-on-container", icon: "local_shipping" },
      DELIVERED: { label: "Entregado", color: "bg-success", text: "text-success-on-container", icon: "check_circle" },
    };
    return configs[status as keyof typeof configs] || configs.PENDING;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Icon name="progress_activity" size="lg" className="animate-spin text-primary" />
        <p className="text-sm font-bold text-outline uppercase tracking-widest">Cargando historial...</p>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-outline-variant mb-2">
          <Icon name="history" size="lg" />
        </div>
        <p className="font-bold text-on-surface">No hay historial disponible</p>
        <p className="text-xs text-outline">Este envío aún no ha tenido cambios de estado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      <div className="grid gap-4">
        {[...data].reverse().map((entry: ShipmentHistoryEntry, index: number) => {
          const config = getStatusConfig(entry.new_status);
          const oldConfig = getStatusConfig(entry.old_status || "PENDING");
          return (
            <div 
              key={entry.id} 
              className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/20 shadow-sm hover:shadow-md transition-all animate-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Status Transition (Centered) */}
                <div className="flex items-center justify-center gap-3 flex-1 order-2 md:order-1">
                  <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl border border-black/5 shadow-sm", oldConfig.color, oldConfig.text)}>
                    <Icon name={oldConfig.icon} size="xs" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {oldConfig.label}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Icon name="arrow_forward" size="xs" className="text-primary/60 animate-pulse" />
                  </div>

                  <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl border border-black/5 shadow-lg", config.color, config.text)}>
                    <Icon name={config.icon} size="xs" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {config.label}
                    </span>
                  </div>
                </div>

                {/* Date (Right Aligned, Full Horizontal) */}
                <div className="flex items-center gap-2.5 text-outline bg-surface-container-high px-3.5 py-2 rounded-xl border border-outline-variant/10 shrink-0 order-1 md:order-2 w-full md:w-auto justify-center md:justify-start">
                  <Icon name="schedule" size="xs" className="text-primary" />
                  <span className="text-[10px] font-black whitespace-nowrap uppercase tracking-tight">
                    {format(new Date(entry.created_at), "EEEE, d 'de' MMMM 'a las' HH:mm", { locale: es })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
