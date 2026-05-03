import { z } from "zod";

export const ShippingTypeSchema = z.enum(["LAND", "MARITIME"]);
export type ShippingType = z.infer<typeof ShippingTypeSchema>;

export const ShippingStatusSchema = z.enum(["PENDING", "SENT", "DELIVERED"]); // Updated to match backend
export type ShippingStatus = z.infer<typeof ShippingStatusSchema>;

export const ShipmentSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  product_id: z.string().uuid(),
  warehouse_id: z.string().uuid().nullable().optional(),
  seaport_id: z.string().uuid().nullable().optional(),
  product_quantity: z.number(),
  shipping_type: ShippingTypeSchema,
  shipping_status: ShippingStatusSchema,
  dispatch_location: z.string(),
  dispatch_continent: z.string(),
  guide_number: z.string(),
  base_price: z.number(),
  discount_percentage: z.number(),
  applied_extra_fee: z.number(),
  total_price: z.number(),
  shipping_date: z.string(),
  vehicle_plate: z.string().optional().nullable(),
  fleet_number: z.string().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Shipment = z.infer<typeof ShipmentSchema>;

export const ShipmentListResponseSchema = z.object({
  data: z.array(ShipmentSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type ShipmentListResponse = z.infer<typeof ShipmentListResponseSchema>;

// Form schema represents the UI fields
export const ShipmentBaseFormSchema = z.object({
  customer_id: z.string().uuid({ message: "Selecciona un cliente" }),
  product_id: z.string().uuid({ message: "Selecciona un producto" }),
  warehouse_id: z.string().uuid({ message: "Selecciona una bodega" }).nullable().optional(),
  seaport_id: z.string().uuid({ message: "Selecciona un puerto" }).nullable().optional(),
  product_quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
  shipping_type: z.enum(["LAND", "MARITIME"], {
    error: "Selecciona un tipo de envío",
  }),
  dispatch_location: z.string().min(1, "El país de despacho es requerido"),
  // Note: dispatch_continent is derived from dispatch_location
});

// Final form schema with refinement
export const ShipmentFormSchema = ShipmentBaseFormSchema.refine((data) => {
  if (data.shipping_type === "LAND") return !!data.warehouse_id;
  return !!data.seaport_id;
}, {
  message: "Debes seleccionar una ubicación de origen válida para el tipo de transporte",
  path: ["warehouse_id"],
});

export type ShipmentFormValues = z.infer<typeof ShipmentFormSchema>;

// Create payload matches the backend ShipmentCreateDTO exactly
export interface ShipmentCreatePayload {
  customer_id: string;
  product_id: string;
  warehouse_id?: string;
  seaport_id?: string;
  product_quantity: number;
  dispatch_location: string;
  dispatch_continent: string;
}

export const ShipmentUpdatePayloadSchema = ShipmentBaseFormSchema.partial();
export type ShipmentUpdatePayload = z.infer<typeof ShipmentUpdatePayloadSchema>;

export interface ShipmentFilters {
  skip?: number;
  limit?: number;
  customer_id?: string;
  shipping_type?: string;
  shipping_status?: string;
  dispatch_location?: string;
  destination_country?: string;
  guide_number?: string;
  date_from?: string;
  date_to?: string;
}
export interface ShipmentHistoryEntry {
  id: string;
  shipment_id: string;
  old_status: ShippingStatus;
  new_status: ShippingStatus;
  reason: string;
  created_at: string;
}
