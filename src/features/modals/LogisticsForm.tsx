import { useMemo, useEffect } from "react";
import { Icon } from "@/utils/icon";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  LogisticsFormSchema, 
  type LogisticsFormValues, 
  type LogisticsNode 
} from "../logistics/types/logistics.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logisticsService } from "../logistics/services/logistics.service";
import { useModalStore } from "@/store/modal.store";
import { toast } from "sonner";
import { Select } from "@/components/ui/Select";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { Country, City } from "country-state-city";

interface LogisticsFormProps {
  initialData?: LogisticsNode & { location_type?: "WAREHOUSE" | "SEAPORT" };
}

export function LogisticsForm({ initialData }: LogisticsFormProps) {
  const isEdit = !!initialData;
  const queryClient = useQueryClient();
  const { onClose } = useModalStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LogisticsFormValues>({
    resolver: zodResolver(LogisticsFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      country: initialData?.country || "",
      location_type: initialData?.location_type || "WAREHOUSE",
    },
  });

  // Watch country to filter cities
  const watchedCountry = useWatch({ control, name: "country" });

  // Get all countries from the library
  const countryOptions = useMemo(() => 
    Country.getAllCountries().map(c => ({ 
      value: c.name, // Store name to match backend
      label: c.name,
      isoCode: c.isoCode 
    })), 
  []);

  // Find ISO code for the selected country name
  const selectedCountryIso = useMemo(() => {
    if (!watchedCountry) return null;
    return countryOptions.find(c => c.value === watchedCountry)?.isoCode;
  }, [watchedCountry, countryOptions]);

  // Get cities for the selected country
  const cityOptions = useMemo(() => {
    if (!selectedCountryIso) return [];
    return City.getCitiesOfCountry(selectedCountryIso).map(c => ({
      value: c.name,
      label: c.name
    }));
  }, [selectedCountryIso]);

  // Reset city if it's no longer in the options of the new country
  useEffect(() => {
    if (watchedCountry && !isEdit) {
      // Logic to check if current city exists in new country's cities
      // But usually better to just clear it if the country changes
    }
  }, [watchedCountry]);

  const mutation = useMutation({
    mutationFn: async (values: LogisticsFormValues) => {
      const { location_type, ...data } = values;
      if (isEdit && initialData?.id) {
        return await logisticsService.updateNode(location_type, initialData.id, data);
      }
      return await logisticsService.createNode(location_type, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["logistics", variables.location_type] });
      toast.success(`${variables.location_type === "WAREHOUSE" ? "Bodega" : "Puerto"} ${isEdit ? "actualizado" : "creado"} correctamente`);
      onClose();
    },
    onError: (error) => {
      toast.error(`Error al ${isEdit ? "actualizar" : "crear"} la ubicación`, {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: LogisticsFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form className="space-y-6 mt-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Nombre de la Ubicación</label>
        <div className="relative group">
          <Icon name="warehouse" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
          <input 
            {...register("name")}
            placeholder="Ej. Almacén Central o Puerto de Buenaventura"
            className={`w-full pl-12 pr-4 py-3 bg-surface-container-low border ${errors.name ? "border-error focus:border-error focus:ring-error/5" : "border-outline-variant/30 focus:border-primary focus:ring-primary/5"} rounded-xl text-sm focus:ring-4 outline-none transition-all`}
          />
        </div>
        {errors.name && <p className="text-xs text-error font-medium px-1">{errors.name.message}</p>}
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Dirección Exacta</label>
        <div className="relative group">
          <Icon name="location_on" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
          <input 
            {...register("address")}
            placeholder="Calle 00 #00-00, Zona Industrial"
            className={`w-full pl-12 pr-4 py-3 bg-surface-container-low border ${errors.address ? "border-error focus:border-error focus:ring-error/5" : "border-outline-variant/30 focus:border-primary focus:ring-primary/5"} rounded-xl text-sm focus:ring-4 outline-none transition-all`}
          />
        </div>
        {errors.address && <p className="text-xs text-error font-medium px-1">{errors.address.message}</p>}
      </div>

      <Controller
        name="location_type"
        control={control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <Select
              label="Tipo de Ubicación"
              icon="domain"
              value={field.value}
              onChange={field.onChange}
              options={[
                { value: "WAREHOUSE", label: "Bodega / Almacén", icon: "warehouse" },
                { value: "SEAPORT", label: "Puerto Marítimo", icon: "sailing" },
              ]}
            />
            {errors.location_type && <p className="text-xs text-error font-medium px-1">{errors.location_type.message}</p>}
          </div>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country */}
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <SearchableSelect
                label="País"
                icon="public"
                placeholder="Seleccionar país..."
                searchPlaceholder="Buscar país..."
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  setValue("city", ""); // Clear city when country changes
                }}
                options={countryOptions}
                direction="up"
              />
              {errors.country && <p className="text-xs text-error font-medium px-1">{errors.country.message}</p>}
            </div>
          )}
        />

        {/* City */}
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <SearchableSelect
                label="Ciudad"
                icon="location_city"
                placeholder={watchedCountry ? "Seleccionar ciudad..." : "Primero elige un país"}
                searchPlaceholder="Buscar ciudad..."
                value={field.value}
                onChange={field.onChange}
                options={cityOptions}
                direction="up"
                className={!watchedCountry ? "opacity-50 pointer-events-none" : ""}
              />
              {errors.city && <p className="text-xs text-error font-medium px-1">{errors.city.message}</p>}
            </div>
          )}
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || mutation.isPending ? (
            <Icon name="progress_activity" size="sm" className="animate-spin" />
          ) : (
            <Icon name={isEdit ? "save" : "add_circle"} size="sm" />
          )}
          <span>{isEdit ? "Actualizar Ubicación" : "Crear Ubicación"}</span>
        </button>
      </div>
    </form>
  );
}
