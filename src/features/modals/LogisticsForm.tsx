import { useState } from "react";
import { Icon } from "@/utils/icon";
import { Select } from "@/components/ui/Select";

interface LogisticsFormProps {
  initialData?: any;
}

export function LogisticsForm({ initialData }: LogisticsFormProps) {
  const isEdit = !!initialData;
  const [locationType, setLocationType] = useState(initialData?.location_type || "");

  return (
    <form className="space-y-6 mt-4">
      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Nombre de la Ubicación</label>
        <div className="relative group">
          <Icon name="warehouse" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
          <input 
            defaultValue={initialData?.name}
            placeholder="Ej. Almacén Central o Puerto de Buenaventura"
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Dirección Exacta</label>
        <div className="relative group">
          <Icon name="location_on" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
          <input 
            defaultValue={initialData?.address}
            placeholder="Calle 00 #00-00, Zona Industrial"
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
          />
        </div>
      </div>

      <Select
        label="Tipo de Ubicación"
        icon="domain"
        value={locationType}
        onChange={setLocationType}
        options={[
          { value: "WAREHOUSE", label: "Bodega / Almacén", icon: "warehouse" },
          { value: "SEAPORT", label: "Puerto Marítimo", icon: "sailing" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Ciudad</label>
          <div className="relative group">
            <Icon name="location_city" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              defaultValue={initialData?.city}
              placeholder="Ej. Bogotá"
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          </div>
        </div>

        {/* Country */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">País</label>
          <div className="relative group">
            <Icon name="public" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              defaultValue={initialData?.country}
              placeholder="Ej. Colombia"
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <Icon name={isEdit ? "save" : "add_circle"} size="sm" />
          <span>{isEdit ? "Actualizar Ubicación" : "Crear Ubicación"}</span>
        </button>
      </div>
    </form>
  );
}
