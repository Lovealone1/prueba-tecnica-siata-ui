import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { useModalStore } from "@/store/modal.store";
import { Icon } from "@/utils/icon";
import { Select } from "@/components/ui/Select";
import { shipmentService } from "@/features/shipment/services/shipment.service";
import type { Shipment } from "@/features/shipment/types/shipment.types";

const OverrideStatusSchema = z.object({
  status: z.enum(["PENDING", "SENT", "DELIVERED"], {
    error: "Selecciona un estado válido",
  }),
});

type OverrideStatusValues = z.infer<typeof OverrideStatusSchema>;

export function OverrideStatusModal({ shipment }: { shipment: Shipment }) {
  const { onClose } = useModalStore();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OverrideStatusValues>({
    resolver: zodResolver(OverrideStatusSchema),
    defaultValues: {
      status: shipment.shipping_status as any,
    },
  });

  const selectedStatus = watch("status");

  const mutation = useMutation({
    mutationFn: (data: OverrideStatusValues) =>
      shipmentService.overrideStatus(shipment.id, data.status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-shipments"] });
      await queryClient.invalidateQueries({ queryKey: ["shipments"] });
      await queryClient.invalidateQueries({ queryKey: ["shipment-history"] });
      toast.success("Estado del envío actualizado correctamente");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Error al actualizar el estado");
    },
  });

  const onSubmit = (data: OverrideStatusValues) => {
    if (data.status === shipment.shipping_status) {
      onClose();
      return;
    }
    mutation.mutate(data);
  };

  return (
    <div className="space-y-8">
      {/* Card Informativa (Solo Texto) */}
      <div className="bg-surface-container-high border border-outline-variant/5 p-4 rounded-2xl mt-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface mb-1">Módulo de Auditoría</h4>
        <p className="text-[11px] text-outline leading-tight font-medium">
          Ajuste administrativo para la guía <span className="font-mono font-bold text-on-surface">#{shipment.guide_number}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase tracking-widest text-outline px-1 block mb-2">
            Nuevo Estado del Envío
          </label>
          <Select
            value={selectedStatus}
            onChange={(val) => setValue("status", val as any, { shouldValidate: true })}
            className="[&_button]:pl-4"
            direction="up"
            options={[
              { value: "PENDING", label: "Pendiente", icon: "schedule" },
              { value: "SENT", label: "Enviado", icon: "local_shipping" },
              { value: "DELIVERED", label: "Entregado", icon: "check_circle" },
            ]}
          />
          {errors.status?.message && (
            <p className="text-xs text-error font-medium px-1">{errors.status.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-outline hover:text-on-surface font-bold text-sm transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-container transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            {mutation.isPending && <Icon name="progress_activity" size="sm" className="animate-spin" />}
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
}

