import { z } from "zod";

/**
 * Domain Schemas & Types
 */
export const CustomerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  identifier: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().max(255).nullable().optional(),
  address: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Customer = z.infer<typeof CustomerSchema>;

export const CustomerListResponseSchema = z.object({
  data: z.array(CustomerSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type CustomerListResponse = z.infer<typeof CustomerListResponseSchema>;

/**
 * Form / Payload Schemas & Types
 */
export const CustomerFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255),
  identifier: z.string().min(1, "El identificador es requerido").max(255),
  email: z.string().email("Ingresa un correo válido"),
  phone: z.string().max(255).optional().nullable(),
  address: z.string().optional().nullable(),
});

export type CustomerFormValues = z.infer<typeof CustomerFormSchema>;

export const CustomerCreateSchema = CustomerFormSchema;
export type CustomerCreatePayload = CustomerFormValues;

export const CustomerUpdateSchema = CustomerFormSchema.partial();
export type CustomerUpdatePayload = z.infer<typeof CustomerUpdateSchema>;
