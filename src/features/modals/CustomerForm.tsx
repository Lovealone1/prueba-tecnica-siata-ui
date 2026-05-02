import { Icon } from "@/utils/icon";

interface CustomerFormProps {
  initialData?: any;
}

export function CustomerForm({ initialData }: CustomerFormProps) {
  const isEdit = !!initialData;

  return (
    <form className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Nombre Completo / Razón Social</label>
          <div className="relative group">
            <Icon name="person" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              defaultValue={initialData?.name}
              placeholder="Ej. Juan Pérez o SIATA S.A.S"
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          </div>
        </div>

        {/* Identifier */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">NIT / Cédula</label>
          <div className="relative group">
            <Icon name="badge" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              defaultValue={initialData?.identifier}
              placeholder="Ej. 900.123.456-7"
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Correo Electrónico</label>
          <div className="relative group">
            <Icon name="mail" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              defaultValue={initialData?.email}
              type="email"
              placeholder="correo@ejemplo.com"
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Teléfono</label>
          <div className="relative group">
            <Icon name="call" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              defaultValue={initialData?.phone}
              placeholder="+57 300 000 0000"
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Dirección Fiscal</label>
        <div className="relative group">
          <Icon name="location_on" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
          <input 
            defaultValue={initialData?.address}
            placeholder="Calle, Carrera, Ciudad, País"
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <Icon name={isEdit ? "save" : "add_circle"} size="sm" />
          <span>{isEdit ? "Actualizar Cliente" : "Crear Cliente"}</span>
        </button>
      </div>
    </form>
  );
}
