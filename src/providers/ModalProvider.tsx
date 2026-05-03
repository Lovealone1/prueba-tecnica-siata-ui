import { useModalStore } from "@/store/modal.store";
import { Modal } from "@/components/ui/Modal";
import { CustomerForm } from "@/features/modals/CustomerForm";
import { CustomerDetails } from "@/features/modals/CustomerDetails";
import { ConfirmDeleteModal } from "@/features/modals/ConfirmDeleteModal";
import { ProductForm } from "@/features/modals/ProductForm";
import { ProductDetails } from "@/features/modals/ProductDetails";
import { ConfirmDeleteProductModal } from "@/features/modals/ConfirmDeleteProductModal";
import { LogisticsForm } from "@/features/modals/LogisticsForm";
import { LogisticsDetails } from "@/features/modals/LogisticsDetails";
import { ConfirmDeleteLogisticsModal } from "@/features/modals/ConfirmDeleteLogisticsModal";
import { ShipmentForm } from "@/features/modals/ShipmentForm";
import { ShipmentDetails } from "@/features/modals/ShipmentDetails";
import { ConfirmDeleteShipmentModal } from "@/features/modals/ConfirmDeleteShipmentModal";
import { EditRoleModal } from "@/features/user/components/EditRoleModal";

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
      case "VIEW_PRODUCT":
        return {
          title: "Detalles del Producto",
          subtitle: "Especificaciones y datos técnicos del registro.",
          component: <ProductDetails data={data} />,
          maxWidth: "md",
        };
      case "DELETE_PRODUCT":
        return {
          title: "Eliminar Producto",
          subtitle: "Esta acción no se puede deshacer.",
          component: <ConfirmDeleteProductModal data={data} />,
          maxWidth: "sm",
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
      case "VIEW_LOGISTICS":
        return {
          title: "Detalles de Ubicación",
          subtitle: "Información completa de la infraestructura logística.",
          component: <LogisticsDetails data={data} />,
          maxWidth: "md",
        };
        case "DELETE_LOGISTICS":
        return {
          title: "Eliminar Ubicación",
          subtitle: "Esta acción no se puede deshacer.",
          component: <ConfirmDeleteLogisticsModal data={data} />,
          maxWidth: "sm",
        };
      case "CREATE_SHIPMENT":
        return {
          title: "Nuevo Envío",
          subtitle: "Registra un nuevo envío y genera su guía logística.",
          component: <ShipmentForm />,
          maxWidth: "lg",
        };
      case "EDIT_SHIPMENT":
        return {
          title: "Editar Envío",
          subtitle: "Modifica los datos del envío seleccionado (solo si está PENDIENTE).",
          component: <ShipmentForm initialData={data} />,
          maxWidth: "lg",
        };
      case "VIEW_SHIPMENT":
        return {
          title: "Detalles del Envío",
          subtitle: "Información completa y descarga de guía.",
          component: <ShipmentDetails data={data} />,
          maxWidth: "md",
        };
      case "DELETE_SHIPMENT":
        return {
          title: "Eliminar Envío",
          subtitle: "Esta acción no se puede deshacer.",
          component: <ConfirmDeleteShipmentModal data={data} />,
          maxWidth: "sm",
        };
      case "EDIT_ROLE":
        return {
          title: "Modificar Rol",
          subtitle: "Asigna los permisos del usuario en el sistema.",
          component: <EditRoleModal initialData={data} />,
          maxWidth: "sm",
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
      maxWidth={config.maxWidth as any}
    >
      {config.component}
    </Modal>
  );
}
