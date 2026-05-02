import { z } from "zod";

/**
 * Constants / Enums (Erasable syntax compatible)
 */
export const TransportMode = {
  LAND: "LAND",
  MARITIME: "MARITIME",
} as const;
export type TransportMode = (typeof TransportMode)[keyof typeof TransportMode];

export const ProductSize = {
  SMALL: "SMALL",
  MEDIUM: "MEDIUM",
  LARGE: "LARGE",
  EXTRA_LARGE: "EXTRA_LARGE",
} as const;
export type ProductSize = (typeof ProductSize)[keyof typeof ProductSize];

/**
 * Domain Schemas & Types
 */
export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(150),
  description: z.string().nullable().optional(),
  product_type: z.string().min(1).max(50),
  transport_mode: z.enum(["LAND", "MARITIME"]),
  size: z.enum(["SMALL", "MEDIUM", "LARGE", "EXTRA_LARGE"]),
  created_at: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductListResponseSchema = z.object({
  data: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;

/**
 * Form / Payload Schemas & Types
 */
export const ProductFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(150),
  description: z.string().optional().nullable(),
  product_type: z.string().min(1, "El tipo de producto es requerido").max(50),
  transport_mode: z.enum(["LAND", "MARITIME"], {
    error: "Selecciona un modo de transporte",
  }),
  size: z.enum(["SMALL", "MEDIUM", "LARGE", "EXTRA_LARGE"], {
    error: "Selecciona un tamaño",
  }),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;

export const ProductCreateSchema = ProductFormSchema;
export type ProductCreatePayload = ProductFormValues;

export const ProductUpdateSchema = ProductFormSchema.partial();
export type ProductUpdatePayload = z.infer<typeof ProductUpdateSchema>;
