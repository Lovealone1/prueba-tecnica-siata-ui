import { Icon } from "@/utils/icon";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TransportMode, ProductSize, type Product } from "../product/types/product.types";

interface ProductDetailsProps {
  data: Product;
}

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

export function ProductDetails({ data }: ProductDetailsProps) {
  return (
    <div className="space-y-8 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Info */}
      <div className="flex items-start gap-5">
        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary shrink-0">
          <Icon name="inventory_2" size="lg" />
        </div>
        <div className="space-y-1 min-w-0">
          <h2 className="text-2xl font-black text-on-surface tracking-tight truncate" title={data.name}>
            {data.name}
          </h2>
          <div className="flex items-center gap-2 text-outline font-medium">
            <Icon name="category" size="xs" />
            <span className="text-sm">{data.product_type}</span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specifications */}
        <div className="space-y-4 flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-1">Especificaciones</h3>
          
          <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10 flex flex-col justify-center space-y-4 flex-grow">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-outline">
                <Icon name={data.transport_mode === TransportMode.LAND ? "local_shipping" : "sailing"} size="sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-outline/60">Transporte</span>
                <span className="text-sm font-bold text-on-surface">
                  {TRANSPORT_MODE_LABELS[data.transport_mode as keyof typeof TRANSPORT_MODE_LABELS]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-outline">
                <Icon name="straighten" size="sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-outline/60">Tamaño</span>
                <span className="text-sm font-bold text-on-surface">
                  {PRODUCT_SIZE_LABELS[data.size as keyof typeof PRODUCT_SIZE_LABELS]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Info */}
        <div className="space-y-4 flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-1">Información de Registro</h3>
          
          <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10 flex flex-col justify-center space-y-4 flex-grow">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-outline">
                <Icon name="calendar_today" size="sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-outline/60">Fecha de Creación</span>
                <span className="text-sm font-bold text-on-surface">
                  {format(new Date(data.created_at), "PPP p", { locale: es })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-outline">
                <Icon name="fingerprint" size="sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-outline/60">ID del Registro</span>
                <span className="text-[11px] font-mono font-medium text-outline break-all">
                  {data.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-1">Descripción Detallada</h3>
        <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/10 max-h-[160px] overflow-y-auto custom-scrollbar">
          <p className="text-sm text-on-surface-variant leading-relaxed font-medium whitespace-pre-wrap">
            {data.description || "Este producto no cuenta con una descripción detallada registrada."}
          </p>
        </div>
      </div>
    </div>
  );
}
