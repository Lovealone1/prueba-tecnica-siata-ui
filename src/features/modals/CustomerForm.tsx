import { Icon } from "@/utils/icon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerFormSchema, type CustomerFormValues, type Customer } from "../customer/types/customer.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "../customer/services/customer.service";
import { useModalStore } from "@/store/modal.store";
import { toast } from "sonner";

interface CustomerFormProps {
  initialData?: Customer;
}

export function CustomerForm({ initialData }: CustomerFormProps) {
  const isEdit = !!initialData;
  const queryClient = useQueryClient();
  const { onClose } = useModalStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(CustomerFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      identifier: initialData?.identifier || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CustomerFormValues) => {
      if (isEdit && initialData?.id) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { identifier, ...updateData } = data;
        return await customerService.updateCustomer(initialData.id, updateData);
      }
      return await customerService.createCustomer(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success(`Cliente ${isEdit ? "actualizado" : "creado"} correctamente`);
      onClose();
    },
    onError: (error) => {
      toast.error(`Error al ${isEdit ? "actualizar" : "crear"} el cliente`, {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: CustomerFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form className="space-y-6 mt-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Nombre Completo / Razón Social</label>
          <div className="relative group">
            <Icon name="person" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              {...register("name")}
              placeholder="Ej. Juan Pérez o SIATA S.A.S"
              className={`w-full pl-12 pr-4 py-3 bg-surface-container-low border ${errors.name ? "border-error focus:border-error focus:ring-error/5" : "border-outline-variant/30 focus:border-primary focus:ring-primary/5"} rounded-xl text-sm focus:ring-4 outline-none transition-all`}
            />
          </div>
          {errors.name && <p className="text-xs text-error font-medium px-1">{errors.name.message}</p>}
        </div>

        {/* Identifier */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">NIT / Cédula</label>
          <div className="relative group">
            <Icon name="badge" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              {...register("identifier")}
              disabled={isEdit}
              placeholder="Ej. 900.123.456-7"
              className={`w-full pl-12 pr-4 py-3 bg-surface-container-low border ${errors.identifier ? "border-error focus:border-error focus:ring-error/5" : "border-outline-variant/30 focus:border-primary focus:ring-primary/5"} rounded-xl text-sm focus:ring-4 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          </div>
          {errors.identifier && <p className="text-xs text-error font-medium px-1">{errors.identifier.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Correo Electrónico</label>
          <div className="relative group">
            <Icon name="mail" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              {...register("email")}
              type="email"
              placeholder="correo@ejemplo.com"
              className={`w-full pl-12 pr-4 py-3 bg-surface-container-low border ${errors.email ? "border-error focus:border-error focus:ring-error/5" : "border-outline-variant/30 focus:border-primary focus:ring-primary/5"} rounded-xl text-sm focus:ring-4 outline-none transition-all`}
            />
          </div>
          {errors.email && <p className="text-xs text-error font-medium px-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Teléfono</label>
          <div className="relative group">
            <Icon name="call" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
            <input 
              {...register("phone")}
              placeholder="+57 300 000 0000"
              className={`w-full pl-12 pr-4 py-3 bg-surface-container-low border ${errors.phone ? "border-error focus:border-error focus:ring-error/5" : "border-outline-variant/30 focus:border-primary focus:ring-primary/5"} rounded-xl text-sm focus:ring-4 outline-none transition-all`}
            />
          </div>
          {errors.phone && <p className="text-xs text-error font-medium px-1">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Dirección Fiscal</label>
        <div className="relative group">
          <Icon name="location_on" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary" />
          <input 
            {...register("address")}
            placeholder="Calle, Carrera, Ciudad, País"
            className={`w-full pl-12 pr-4 py-3 bg-surface-container-low border ${errors.address ? "border-error focus:border-error focus:ring-error/5" : "border-outline-variant/30 focus:border-primary focus:ring-primary/5"} rounded-xl text-sm focus:ring-4 outline-none transition-all`}
          />
        </div>
        {errors.address && <p className="text-xs text-error font-medium px-1">{errors.address.message}</p>}
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
          <span>{isEdit ? "Actualizar Cliente" : "Crear Cliente"}</span>
        </button>
      </div>
    </form>
  );
}
