import { Icon } from "@/utils/icon";
import { cn } from "@/lib/utils";
import type { LogisticsNode, LogisticsNodeType } from "../logistics/types/logistics.types";

interface LogisticsDetailsProps {
  data: LogisticsNode & { location_type?: LogisticsNodeType };
}

export function LogisticsDetails({ data }: LogisticsDetailsProps) {
  const isWarehouse = data.location_type === "WAREHOUSE" || (!data.location_type && data.continent); // Fallback logic if needed

  return (
    <div className="space-y-8 py-2">
      {/* Header Info */}
      <div className="flex items-center gap-6 p-6 bg-surface-container-low rounded-3xl border border-outline-variant/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon name={isWarehouse ? "warehouse" : "sailing"} size="xl" className="text-8xl" />
        </div>
        
        <div className={cn(
          "w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500",
          isWarehouse ? "bg-primary" : "bg-tertiary"
        )}>
          <Icon name={isWarehouse ? "warehouse" : "sailing"} className="text-4xl" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
              isWarehouse ? "bg-primary/10 text-primary" : "bg-tertiary/10 text-tertiary"
            )}>
              {isWarehouse ? "Bodega" : "Puerto Marítimo"}
            </span>
          </div>
          <h3 className="text-2xl font-black text-on-surface">{data.name}</h3>
          <p className="text-sm text-outline flex items-center gap-1.5">
            <Icon name="history" size="xs" />
            Registrado el {new Date(data.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Grid Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailCard 
          icon="location_on" 
          label="Dirección" 
          value={data.address} 
          color="primary"
        />
        <DetailCard 
          icon="location_city" 
          label="Ciudad" 
          value={data.city} 
          color="primary"
        />
        <DetailCard 
          icon="public" 
          label="País" 
          value={data.country} 
          color="secondary"
        />
        <DetailCard 
          icon="map" 
          label="Continente" 
          value={data.continent} 
          color="secondary"
        />
      </div>

      <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-3">
        <Icon name="info" className="text-primary mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Nota de Ubicación</h4>
          <p className="text-xs text-on-surface/70 leading-relaxed">
            Esta ubicación está marcada como activa en el sistema de logística global. Los tiempos de tránsito se calculan automáticamente basándose en las coordenadas geográficas de {data.city}, {data.country}.
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value, color }: { icon: string, label: string, value: string, color: string }) {
  return (
    <div className="p-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl hover:border-primary/30 transition-all group">
      <div className="flex items-center gap-3 mb-1">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          color === "primary" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
        )}>
          <Icon name={icon} size="sm" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-outline">{label}</span>
      </div>
      <p className="text-sm font-bold text-on-surface pl-11">{value}</p>
    </div>
  );
}

