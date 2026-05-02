import { useMemo } from "react";
import { Icon } from "@/utils/icon";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ShipmentFormSchema, 
  type ShipmentFormValues, 
  type Shipment,
  type ShipmentCreatePayload
} from "../shipment/types/shipment.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shipmentService } from "../shipment/services/shipment.service";
import { customerService } from "../customer/services/customer.service";
import { productService } from "../product/services/product.service";
import { logisticsService } from "../logistics/services/logistics.service";
import { useModalStore } from "@/store/modal.store";
import { toast } from "sonner";
import { Select } from "@/components/ui/Select";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { getCountries, getContinentByCountry } from "@/utils/location";
import { generateShipmentGuide } from "../shipment/utils/shipment-guide.util";
import { getErrorMessage } from "@/utils/error";

interface ShipmentFormProps {
  initialData?: Shipment;
}

export function ShipmentForm({ initialData }: ShipmentFormProps) {
  const isEdit = !!initialData;
  const queryClient = useQueryClient();
  const { onClose } = useModalStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShipmentFormValues>({
    resolver: zodResolver(ShipmentFormSchema),
    defaultValues: {
      customer_id: initialData?.customer_id || "",
      product_id: initialData?.product_id || "",
      warehouse_id: initialData?.warehouse_id || undefined,
      seaport_id: initialData?.seaport_id || undefined,
      product_quantity: initialData?.product_quantity || 1,
      shipping_type: initialData?.shipping_type || "LAND",
      dispatch_location: initialData?.dispatch_location || "",
    },
  });

  const watchedShippingType = useWatch({ control, name: "shipping_type" });

  // Fetch related data
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customerService.getCustomers(0, 200),
    staleTime: 1000 * 60 * 5,
  });

  const { data: products } = useQuery({
    queryKey: ["products-minimal"],
    queryFn: () => productService.getProducts(0, 200),
    staleTime: 1000 * 60 * 5,
  });

  const { data: warehouses } = useQuery({
    queryKey: ["logistics", "WAREHOUSE"],
    queryFn: () => logisticsService.getNodes("WAREHOUSE", 0, 200),
    enabled: watchedShippingType === "LAND",
    staleTime: 1000 * 60 * 5,
  });

  const { data: seaports } = useQuery({
    queryKey: ["logistics", "SEAPORT"],
    queryFn: () => logisticsService.getNodes("SEAPORT", 0, 200),
    enabled: watchedShippingType === "MARITIME",
    staleTime: 1000 * 60 * 5,
  });

  const countryOptions = useMemo(() => 
    getCountries().map(c => ({ value: c, label: c })), 
  []);

  const customerOptions = useMemo(() => {
    const list = Array.isArray(customers) ? customers : (customers as any)?.data;
    return list?.map((c: any) => ({ value: c.id, label: c.name })) || [];
  }, [customers]);

  const productOptions = useMemo(() => {
    const list = Array.isArray(products) ? products : (products as any)?.data;
    return list?.map((p: any) => ({ value: p.id, label: p.name })) || [];
  }, [products]);

  const originOptions = useMemo(() => {
    if (watchedShippingType === "LAND") {
      const list = Array.isArray(warehouses) ? warehouses : (warehouses as any)?.data;
      return list?.map((w: any) => ({ 
        value: w.id, 
        label: w.name,
        subLabel: `${w.city}, ${w.country}`, 
        icon: "warehouse" 
      })) || [];
    }
    const list = Array.isArray(seaports) ? seaports : (seaports as any)?.data;
    return list?.map((s: any) => ({ 
      value: s.id, 
      label: s.name,
      subLabel: `${s.city}, ${s.country}`, 
      icon: "sailing" 
    })) || [];
  }, [watchedShippingType, warehouses, seaports]);

  const mutation = useMutation({
    mutationFn: async (formValues: ShipmentFormValues) => {
      const payload: any = {
        customer_id: formValues.customer_id,
        product_id: formValues.product_id,
        product_quantity: formValues.product_quantity,
        dispatch_location: formValues.dispatch_location,
        dispatch_continent: getContinentByCountry(formValues.dispatch_location),
      };

      if (formValues.shipping_type === "LAND") {
        payload.warehouse_id = formValues.warehouse_id;
        payload.seaport_id = null;
      } else {
        payload.seaport_id = formValues.seaport_id;
        payload.warehouse_id = null;
      }

      if (isEdit && initialData?.id) {
        const updatePayload = {
          product_id: payload.product_id,
          product_quantity: payload.product_quantity,
          warehouse_id: payload.warehouse_id,
          seaport_id: payload.seaport_id,
        };
        return await shipmentService.updateShipment(initialData.id, updatePayload as any);
      }
      
      return await shipmentService.createShipment(payload as ShipmentCreatePayload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      toast.success(`Envío ${isEdit ? "actualizado" : "creado"} correctamente`);
      
      if (!isEdit) {
        const customerName = customerOptions.find(c => c.value === data.customer_id)?.label || "Cliente Desconocido";
        const productName = productOptions.find(p => p.value === data.product_id)?.label || "Producto Desconocido";
        const originName = originOptions.find(o => o.value === (data.warehouse_id || data.seaport_id))?.label || "Origen Desconocido";
        
        generateShipmentGuide(data, { customerName, productName, originName });
      }
      
      onClose();
    },
    onError: (error: any) => {
      toast.error("Error del Servidor", {
        description: getErrorMessage(error),
      });
    },
  });

  const onSubmit = (data: ShipmentFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form className="space-y-8 mt-6" onSubmit={handleSubmit(onSubmit)}>
      {/* SECTION 1: ENTITIES */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Icon name="person_search" size="sm" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Origen y Contenido</h3>
            <p className="text-[10px] text-outline font-bold">DATOS DEL CLIENTE Y PRODUCTO</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface-container-low/30 p-6 rounded-[24px] border border-outline-variant/10">
          <div className="md:col-span-1">
            <Controller
              name="customer_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  label="Cliente"
                  icon="person"
                  placeholder="Seleccionar..."
                  value={field.value}
                  onChange={field.onChange}
                  options={customerOptions}
                />
              )}
            />
          </div>

          <div className="md:col-span-1">
            <Controller
              name="product_id"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  label="Producto"
                  icon="inventory_2"
                  placeholder="Seleccionar..."
                  value={field.value}
                  onChange={field.onChange}
                  options={productOptions}
                />
              )}
            />
          </div>

          <div className="md:col-span-1">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Cantidad</label>
              <div className="relative group">
                <Icon name="tag" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
                <input 
                  type="number"
                  {...register("product_quantity", { valueAsNumber: true })}
                  className={`w-full pl-12 pr-4 h-[46px] bg-surface-container-low border ${errors.product_quantity ? "border-error" : "border-outline-variant/30"} rounded-xl text-sm outline-none transition-all font-bold`}
                />
              </div>
              {errors.product_quantity && <p className="text-xs text-error px-1 font-medium">{errors.product_quantity.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: LOGISTICS */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
            <Icon name="local_shipping" size="sm" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Ruta Logística</h3>
            <p className="text-[10px] text-outline font-bold">MODO DE TRANSPORTE Y DESTINOS</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface-container-low/30 p-6 rounded-[24px] border border-outline-variant/10">
          <div className="md:col-span-1">
            <Controller
              name="shipping_type"
              control={control}
              render={({ field }) => (
                <Select
                  label="Tipo de Transporte"
                  icon="travel_explore"
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue("warehouse_id", undefined);
                    setValue("seaport_id", undefined);
                  }}
                  options={[
                    { value: "LAND", label: "Terrestre", icon: "local_shipping" },
                    { value: "MARITIME", label: "Marítimo", icon: "sailing" },
                  ]}
                />
              )}
            />
          </div>

          <div className="md:col-span-1">
            <Controller
              name={watchedShippingType === "LAND" ? "warehouse_id" : "seaport_id"}
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  label={watchedShippingType === "LAND" ? "Bodega de Destino" : "Puerto de Destino"}
                  icon={watchedShippingType === "LAND" ? "warehouse" : "anchor"}
                  placeholder="Seleccionar..."
                  value={field.value || ""}
                  onChange={field.onChange}
                  options={originOptions}
                  direction="up"
                />
              )}
            />
          </div>

          <div className="md:col-span-1">
            <Controller
              name="dispatch_location"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  label="País de Despacho"
                  icon="public"
                  placeholder="Seleccionar..."
                  value={field.value}
                  onChange={field.onChange}
                  options={countryOptions}
                  direction="up"
                />
              )}
            />
          </div>
        </div>
      </div>

      {(errors.warehouse_id || errors.seaport_id || errors.root) && (
        <div className="p-4 bg-error/5 border border-error/20 rounded-2xl flex items-center gap-3 text-error">
          <Icon name="warning" size="sm" />
          <p className="text-xs font-bold uppercase tracking-widest">
            {errors.root?.message || "Faltan campos obligatorios en la ruta logística"}
          </p>
        </div>
      )}

      {isEdit && initialData && (
        <div className="p-6 bg-primary/5 border border-primary/10 rounded-[24px] space-y-4">
          <div className="flex items-center justify-between border-b border-primary/10 pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Liquidación Actual</span>
            <span className="text-xs font-bold text-on-surface">Guía #{initialData.guide_number}</span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-outline">Precio Base</span>
              <p className="text-sm font-bold text-on-surface">${initialData.base_price.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-outline">Tarifa Logística Extra</span>
              <p className={`text-sm font-bold ${initialData.applied_extra_fee > 0 ? "text-error" : "text-on-surface"}`}>
                +${initialData.applied_extra_fee.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-outline">Total con Descuento</span>
              <p className="text-sm font-black text-primary">${(initialData.total_price + initialData.applied_extra_fee).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-[12px] rounded-[24px] hover:bg-primary-container active:scale-[0.99] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSubmitting || mutation.isPending ? (
            <Icon name="progress_activity" size="sm" className="animate-spin" />
          ) : (
            <Icon name={isEdit ? "save" : "task_alt"} size="sm" />
          )}
          <span>{isEdit ? "Actualizar Envío" : "Finalizar y Generar Guía Logística"}</span>
        </button>
      </div>
    </form>
  );
}
