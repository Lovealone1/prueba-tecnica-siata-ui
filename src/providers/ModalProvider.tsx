import { useModalStore } from "@/store/modal.store";
import { Modal } from "@/components/ui/Modal";
import { CustomerForm } from "@/features/modals/CustomerForm";
import { CustomerDetails } from "@/features/modals/CustomerDetails";
import { ConfirmDeleteModal } from "@/features/modals/ConfirmDeleteModal";
import { ProductForm } from "@/features/modals/ProductForm";
import { LogisticsForm } from "@/features/modals/LogisticsForm";

export function ModalProvider() {
  const { isOpen, type, data, onClose } = useModalStore();

  const getModalConfig = () => {
    switch (type) {
      case "CREATE_CUSTOMER":
        return {
          title: "Nuevo Cliente",
          subtitle: "Registra un nuevo cliente en la plataforma logística.",
          component: <CustomerForm />,
        };
      case "EDIT_CUSTOMER":
        return {
          title: "Editar Cliente",
          subtitle: "Modifica los datos del cliente seleccionado.",
          component: <CustomerForm initialData={data} />,
        };
      case "VIEW_CUSTOMER":
        return {
          title: "Detalles del Cliente",
          subtitle: "Información completa del registro seleccionado.",
          component: <CustomerDetails data={data} />,
          maxWidth: "md",
        };
      case "DELETE_CUSTOMER":
        return {
          title: "Confirmar Eliminación",
          subtitle: "Esta acción no se puede deshacer.",
          component: <ConfirmDeleteModal data={data} />,
          maxWidth: "sm",
        };
      case "CREATE_PRODUCT":
        return {
          title: "Nuevo Producto",
          subtitle: "Añade un producto al catálogo de transporte.",
          component: <ProductForm />,
        };
      case "EDIT_PRODUCT":
        return {
          title: "Editar Producto",
          subtitle: "Actualiza las especificaciones del producto.",
          component: <ProductForm initialData={data} />,
        };
      case "CREATE_LOGISTICS":
        return {
          title: "Nueva Ubicación Logística",
          subtitle: "Registra un nuevo almacén o puerto operativo.",
          component: <LogisticsForm />,
        };
      case "EDIT_LOGISTICS":
        return {
          title: "Editar Ubicación",
          subtitle: "Actualiza los datos de la infraestructura logística.",
          component: <LogisticsForm initialData={data} />,
        };
      default:
        return null;
    }
  };

  const config = getModalConfig();

  if (!config) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      subtitle={config.subtitle}
    >
      {config.component}
    </Modal>
  );
}
