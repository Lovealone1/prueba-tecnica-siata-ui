import { Icon } from "@/utils/icon";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ProductFormSchema, 
  type ProductFormValues, 
  type Product,
  TransportMode,
  ProductSize 
} from "../product/types/product.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../product/services/product.service";
import { useModalStore } from "@/store/modal.store";
import { toast } from "sonner";
import { Select } from "@/components/ui/Select";

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const isEdit = !!initialData;
  const queryClient = useQueryClient();
  const { onClose } = useModalStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      product_type: initialData?.product_type || "",
      transport_mode: initialData?.transport_mode || TransportMode.LAND,
      size: initialData?.size || ProductSize.MEDIUM,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      if (isEdit && initialData?.id) {
        return await productService.updateProduct(initialData.id, data);
      }
      return await productService.createProduct(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Producto ${isEdit ? "actualizado" : "creado"} correctamente`);
      onClose();
    },
    onError: (error) => {
      toast.error(`Error al ${isEdit ? "actualizar" : "crear"} el producto`, {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form className="space-y-6 mt-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Nombre del Producto</label>
          <div className="relative group">
            <Icon name="inventory_2" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              {...register("name")}
              placeholder="Ej. Maquinaria Pesada"
              className={`w-full pl-12 pr-4 py-3 bg-surface-container-low border ${errors.name ? "border-error focus:border-error focus:ring-error/5" : "border-outline-variant/30 focus:border-primary focus:ring-primary/5"} rounded-xl text-sm focus:ring-4 outline-none transition-all`}
            />
          </div>
          {errors.name && <p className="text-xs text-error font-medium px-1">{errors.name.message}</p>}
        </div>

        {/* Product Type */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Tipo de Producto</label>
          <div className="relative group">
            <Icon name="category" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              {...register("product_type")}
              placeholder="Ej. Sólido, Líquido, etc."
              className={`w-full pl-12 pr-4 py-3 bg-surface-container-low border ${errors.product_type ? "border-error focus:border-error focus:ring-error/5" : "border-outline-variant/30 focus:border-primary focus:ring-primary/5"} rounded-xl text-sm focus:ring-4 outline-none transition-all`}
            />
          </div>
          {errors.product_type && <p className="text-xs text-error font-medium px-1">{errors.product_type.message}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Descripción (Opcional)</label>
        <textarea 
          {...register("description")}
          rows={3}
          placeholder="Detalles adicionales del producto..."
          className={`w-full px-4 py-3 bg-surface-container-low border ${errors.description ? "border-error focus:border-error focus:ring-error/5" : "border-outline-variant/30 focus:border-primary focus:ring-primary/5"} rounded-xl text-sm focus:ring-4 outline-none transition-all resize-none`}
        />
        {errors.description && <p className="text-xs text-error font-medium px-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Transport Mode */}
        <Controller
          name="transport_mode"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <Select
                label="Modo de Transporte"
                icon="local_shipping"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: TransportMode.LAND, label: "Terrestre", icon: "local_shipping" },
                  { value: TransportMode.MARITIME, label: "Marítimo", icon: "sailing" },
                ]}
              />
              {errors.transport_mode && <p className="text-xs text-error font-medium px-1">{errors.transport_mode.message}</p>}
            </div>
          )}
        />

        {/* Size */}
        <Controller
          name="size"
          control={control}
          render={({ field }) => (
            <div className="space-y-1.5">
              <Select
                label="Tamaño Estimado"
                icon="straighten"
                value={field.value}
                onChange={field.onChange}
                direction="up"
                options={[
                  { value: ProductSize.SMALL, label: "Pequeño", icon: "view_in_ar" },
                  { value: ProductSize.MEDIUM, label: "Mediano", icon: "view_in_ar" },
                  { value: ProductSize.LARGE, label: "Grande", icon: "view_in_ar" },
                  { value: ProductSize.EXTRA_LARGE, label: "Extra Grande", icon: "view_in_ar" },
                ]}
              />
              {errors.size && <p className="text-xs text-error font-medium px-1">{errors.size.message}</p>}
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
          <span>{isEdit ? "Actualizar Producto" : "Crear Producto"}</span>
        </button>
      </div>
    </form>
  );
}
