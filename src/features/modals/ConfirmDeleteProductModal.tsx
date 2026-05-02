import { Icon } from "@/utils/icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../product/services/product.service";
import { useModalStore } from "@/store/modal.store";
import { toast } from "sonner";
import { type Product } from "../product/types/product.types";

interface ConfirmDeleteProductModalProps {
  data: Product;
}

export function ConfirmDeleteProductModal({ data }: ConfirmDeleteProductModalProps) {
  const queryClient = useQueryClient();
  const { onClose } = useModalStore();

  const mutation = useMutation({
    mutationFn: () => productService.deleteProduct(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto eliminado correctamente");
      onClose();
    },
    onError: (error: any) => {
      toast.error("Error al eliminar el producto", {
        description: error.message,
      });
    },
  });

  return (
    <div className="space-y-6 mt-4">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center border-4 border-background shadow-lg">
          <Icon name="delete_forever" className="text-4xl text-error animate-bounce" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-on-surface tracking-tight">¿Estás completamente seguro?</h3>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
            Estás a punto de eliminar el producto <span className="font-bold text-error">{data.name}</span>. 
            Esta acción es irreversible y podría afectar los envíos vinculados.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onClose}
          disabled={mutation.isPending}
          className="flex-1 py-4 bg-surface-container-high text-on-surface font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-surface-container-highest transition-all active:scale-[0.98] disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="flex-[1.5] py-4 bg-error text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-error/90 transition-all active:scale-[0.98] shadow-lg shadow-error/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {mutation.isPending ? (
            <Icon name="progress_activity" size="sm" className="animate-spin" />
          ) : (
            <Icon name="delete" size="sm" />
          )}
          <span>Sí, eliminar registro</span>
        </button>
      </div>
    </div>
  );
}
