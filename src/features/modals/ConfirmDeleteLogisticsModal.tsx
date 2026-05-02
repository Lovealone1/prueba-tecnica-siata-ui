import { Icon } from "@/utils/icon";
import { useModalStore } from "@/store/modal.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logisticsService } from "../logistics/services/logistics.service";
import { toast } from "sonner";
import type { LogisticsNode, LogisticsNodeType } from "../logistics/types/logistics.types";

interface ConfirmDeleteLogisticsProps {
  data: LogisticsNode & { location_type: LogisticsNodeType };
}

export function ConfirmDeleteLogisticsModal({ data }: ConfirmDeleteLogisticsProps) {
  const { onClose } = useModalStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => logisticsService.deleteNode(data.location_type, data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logistics", data.location_type] });
      toast.success(`${data.location_type === "WAREHOUSE" ? "Bodega" : "Puerto"} eliminado correctamente`);
      onClose();
    },
    onError: (error: any) => {
      toast.error("Error al eliminar la ubicación", {
        description: error.message,
      });
    },
  });

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center text-error animate-pulse">
          <Icon name="delete_forever" className="text-3xl" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-black text-on-surface">¿Estás completamente seguro?</h3>
          <p className="text-sm text-outline px-4">
            Estás a punto de eliminar <strong>{data.name}</strong> ({data.location_type === "WAREHOUSE" ? "Bodega" : "Puerto"}). 
            Esta acción no se puede deshacer y borrará permanentemente los datos.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Icon name="location_on" className="text-primary" />
          <span className="text-on-surface font-medium">{data.address}, {data.city}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Icon name="public" className="text-primary" />
          <span className="text-on-surface font-medium">{data.country} ({data.continent})</span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 py-3 bg-surface-container-high text-on-surface font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-outline-variant/20 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="flex-1 py-3 bg-error text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-error-container active:scale-[0.98] transition-all shadow-lg shadow-error/20 flex items-center justify-center gap-2"
        >
          {mutation.isPending ? (
            <Icon name="progress_activity" size="sm" className="animate-spin" />
          ) : (
            <Icon name="delete" size="sm" />
          )}
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
}
