import { Icon } from "@/utils/icon";
import { type Customer } from "../customer/types/customer.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CustomerDetailsProps {
  data: Customer;
}

export function CustomerDetails({ data }: CustomerDetailsProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "PPP 'a las' p", { locale: es });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 mt-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-background shadow-xl">
          <Icon name="corporate_fare" className="text-5xl text-primary" />
        </div>
        <div className="max-w-full px-4">
          <h2 className="text-2xl font-black tracking-tight text-on-surface break-words leading-tight">{data.name}</h2>
          <p className="text-sm font-bold text-outline uppercase tracking-widest mt-1">{data.identifier}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailCard
          icon="mail"
          label="Correo Electrónico"
          value={data.email}
          copyable
        />
        <DetailCard
          icon="call"
          label="Teléfono de Contacto"
          value={data.phone || "No registrado"}
        />
        <DetailCard
          icon="location_on"
          label="Dirección Fiscal"
          value={data.address || "No registrado"}
          className="md:col-span-2"
        />
      </div>

      {/* Timestamps */}
      <div className="p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 space-y-3">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-outline font-black uppercase tracking-wider flex items-center gap-2">
            <Icon name="history" size="xs" /> Creado el
          </span>
          <span className="text-outline font-bold">{formatDate(data.created_at)}</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-outline font-black uppercase tracking-wider flex items-center gap-2">
            <Icon name="edit_note" size="xs" /> Última actualización
          </span>
          <span className="text-outline font-bold">{formatDate(data.updated_at)}</span>
        </div>
      </div>

    </div>
  );
}

interface DetailCardProps {
  icon: string;
  label: string;
  value: string;
  copyable?: boolean;
  className?: string;
}

function DetailCard({ icon, label, value, className }: DetailCardProps) {
  return (
    <div className={`p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 group hover:border-primary/30 transition-colors ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-outline group-hover:text-primary transition-colors shadow-sm">
          <Icon name={icon} size="sm" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-1">{label}</p>
          <p className="text-sm font-bold text-on-surface break-words">{value}</p>
        </div>
      </div>
    </div>
  );
}
