/**
 * Mapping of technical backend error messages to user-friendly Spanish instructions.
 */
const ERROR_TRANSLATIONS: Record<string, string> = {
  "This is a LAND shipment based on geographical rules. You must provide a warehouse_id.": 
    "Este envío debe ser terrestre debido a la cercanía geográfica. Por favor, selecciona una bodega de origen.",
  
  "This is a MARITIME shipment based on geographical rules. You must provide a seaport_id.": 
    "Este envío requiere transporte marítimo debido a la distancia. Por favor, selecciona un puerto de origen.",
  
  "Must provide either warehouse_id or seaport_id.": 
    "Debes seleccionar una ubicación de origen (Bodega o Puerto).",
  
  "Only shipments in PENDING status can be modified.": 
    "Solo se pueden modificar envíos que estén en estado Pendiente.",
  
  "Only shipments in PENDING status can be deleted.": 
    "Solo se pueden eliminar envíos que estén en estado Pendiente.",
    
  "Invalid status transition.": 
    "No se puede cambiar el estado de esta forma. Sigue el flujo: Pendiente -> Enviado -> Entregado.",

  "Customer not found.": "El cliente seleccionado no existe.",
  "Product not found.": "El producto seleccionado no existe.",
  "Warehouse not found.": "La bodega seleccionada no existe.",
  "Seaport not found.": "El puerto seleccionado no existe.",
};

/**
 * Extracts and translates a user-friendly error message from a backend response.
 */
export function getErrorMessage(error: any): string {
  if (!error) return "Error desconocido";

  const data = error.response?.data;
  let rawMessage = "";

  if (data) {
    if (typeof data.detail === "string") {
      rawMessage = data.detail;
    } else if (Array.isArray(data.detail)) {
      rawMessage = data.detail.map((err: any) => err.msg || err.message).join(", ");
    } else if (data.message) {
      rawMessage = data.message;
    }
  } else {
    rawMessage = error.message || "";
  }

  // Find a friendly translation or return the raw message (sanitized)
  for (const [technical, friendly] of Object.entries(ERROR_TRANSLATIONS)) {
    if (rawMessage.includes(technical)) {
      return friendly;
    }
  }

  return rawMessage || "Ha ocurrido un error inesperado";
}
