import { z } from "zod";

/**
 * Enums and Base Schemas
 */
export const AuthIntentSchema = z.enum(["LOGIN", "REGISTER"]);
export type AuthIntent = z.infer<typeof AuthIntentSchema>;

export const GlobalRole = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type GlobalRole = (typeof GlobalRole)[keyof typeof GlobalRole];

export const RegistrationDataSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  phone_number: z.string().min(7, { message: "Phone number must be valid" }),
});
export type RegistrationData = z.infer<typeof RegistrationDataSchema>;

/**
 * Request Payloads
 */
export const RequestOtpSchema = z.object({
  email: z.email({ message: "Ingresa un correo válido" }),
  intent: AuthIntentSchema,
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
}).refine((data) => {
  if (data.intent === "REGISTER") {
    return !!data.first_name && !!data.last_name && !!data.phone_number;
  }
  return true;
}, {
  message: "Los campos de registro son obligatorios",
  path: ["first_name"],
});
export type RequestOtpPayload = z.infer<typeof RequestOtpSchema>;

export const RequestOtpResponseSchema = z.object({
  message: z.string(),
  ttl_seconds: z.number(),
});
export type RequestOtpResponse = z.infer<typeof RequestOtpResponseSchema>;

export const VerifyOtpSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  intent: AuthIntentSchema,
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
  registration_data: RegistrationDataSchema.optional(),
}).refine((data) => {
  if (data.intent === "REGISTER" && !data.registration_data) {
    return false;
  }
  return true;
}, {
  message: "Registration data is required for registration intent",
  path: ["registration_data"],
});
export type VerifyOtpPayload = z.infer<typeof VerifyOtpSchema>;

/**
 * Response Schemas
 */
export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string().optional(),
  global_role: z.string(),
  is_active: z.boolean(),
});
export type User = z.infer<typeof UserSchema>;

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const SessionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  device_info: z.string(),
  ip_address: z.string(),
  created_at: z.string(),
  expires_at: z.string(),
  is_current: z.boolean(),
});
export type Session = z.infer<typeof SessionSchema>;

export const AuthMeResponseSchema = z.object({
  is_logged_in: z.boolean(),
  role: z.string(),
  user: UserSchema,
});
export type AuthMeResponse = z.infer<typeof AuthMeResponseSchema>;
