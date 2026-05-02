import { Icon } from "@/utils/icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shipmentService } from "../shipment/services/shipment.service";
import { useModalStore } from "@/store/modal.store";
import { toast } from "sonner";
import { type Shipment } from "../shipment/types/shipment.types";

interface ConfirmDeleteShipmentModalProps {
  data: Shipment;
}

export function ConfirmDeleteShipmentModal({ data }: ConfirmDeleteShipmentModalProps) {
  const queryClient = useQueryClient();
  const { onClose } = useModalStore();

  const mutation = useMutation({
    mutationFn: () => shipmentService.deleteShipment(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      toast.success("Envío eliminado correctamente");
      onClose();
    },
    onError: (error) => {
      toast.error("Error al eliminar el envío", {
        description: error.message,
      });
    },
  });

  return (
    <div className="space-y-6 mt-4">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center text-error animate-pulse">
          <Icon name="warning" size="lg" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-on-surface">¿Estás completamente seguro?</h3>
          <p className="text-sm text-outline font-medium px-4">
            Vas a eliminar el envío con guía <span className="font-bold text-on-surface">#{data.guide_number}</span>. 
            Esta acción es irreversible y se perderán todos los registros asociados.
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 py-3.5 bg-surface-container-high text-on-surface font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-outline-variant/20 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="flex-1 py-3.5 bg-error text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-error/90 active:scale-[0.98] transition-all shadow-lg shadow-error/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {mutation.isPending ? (
            <Icon name="progress_activity" size="sm" className="animate-spin" />
          ) : (
            <Icon name="delete_forever" size="sm" />
          )}
          <span>Eliminar Envío</span>
        </button>
      </div>
    </div>
  );
}
