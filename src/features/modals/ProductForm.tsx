import { useState } from "react";
import { Icon } from "@/utils/icon";
import { Select } from "@/components/ui/Select";

interface ProductFormProps {
  initialData?: any;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const isEdit = !!initialData;
  const [productType, setProductType] = useState(initialData?.product_type || "");
  const [transportMode, setTransportMode] = useState(initialData?.transport_mode || "LAND");
  const [size, setSize] = useState(initialData?.size || "MEDIUM");

  return (
    <form className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Nombre del Producto</label>
          <div className="relative group">
            <Icon name="inventory_2" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              defaultValue={initialData?.name}
              placeholder="Ej. Maquinaria Pesada"
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          </div>
        </div>

        {/* Product Type (Input) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Tipo de Producto</label>
          <div className="relative group">
            <Icon name="category" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              defaultValue={initialData?.product_type}
              placeholder="Ej. Sólido, Líquido, etc."
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Descripción</label>
        <textarea 
          defaultValue={initialData?.description}
          rows={3}
          placeholder="Detalles adicionales del producto..."
          className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Modo de Transporte"
          icon="local_shipping"
          value={transportMode}
          onChange={setTransportMode}
          options={[
            { value: "LAND", label: "Terrestre", icon: "local_shipping" },
            { value: "SEA", label: "Marítimo", icon: "sailing" },
          ]}
        />

        <Select
          label="Tamaño Estimado"
          icon="straighten"
          value={size}
          onChange={setSize}
          direction="up"
          options={[
            { value: "SMALL", label: "Pequeño", icon: "view_in_ar" },
            { value: "MEDIUM", label: "Mediano", icon: "view_in_ar" },
            { value: "LARGE", label: "Grande", icon: "view_in_ar" },
            { value: "XLARGE", label: "Extra Grande", icon: "view_in_ar" },
          ]}
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <Icon name={isEdit ? "save" : "add_circle"} size="sm" />
          <span>{isEdit ? "Actualizar Producto" : "Crear Producto"}</span>
        </button>
      </div>
    </form>
  );
}
