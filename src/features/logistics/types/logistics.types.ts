import { z } from "zod";

export type LogisticsNodeType = "WAREHOUSE" | "SEAPORT";

export interface LogisticsNode {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  continent: string;
  created_at: string;
}

export interface LogisticsNodeCreateDTO {
  name: string;
  address: string;
  city: string;
  country: string;
}

export interface LogisticsNodeUpdateDTO {
  name?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface LogisticsNodeListResponse {
  data: LogisticsNode[];
  total: number;
  skip: number;
  limit: number;
}

export const LogisticsFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(150),
  address: z.string().min(1, "La dirección es requerida").max(255),
  city: z.string().min(1, "La ciudad es requerida").max(100),
  country: z.string().min(1, "El país es requerido").max(100),
  location_type: z.enum(["WAREHOUSE", "SEAPORT"] as const),
});

export type LogisticsFormValues = z.infer<typeof LogisticsFormSchema>;
