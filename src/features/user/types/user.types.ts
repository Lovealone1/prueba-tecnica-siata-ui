import { z } from "zod";
import { UserSchema, GlobalRole } from "@/features/auth/types/auth.types";

export const UserUpdateRoleSchema = z.object({
  global_role: z.nativeEnum(GlobalRole).or(z.enum([GlobalRole.ADMIN, GlobalRole.USER])),
});

export type UserUpdateRolePayload = z.infer<typeof UserUpdateRoleSchema>;

// Re-export the base User type for convenience
export type { User } from "@/features/auth/types/auth.types";
export { UserSchema, GlobalRole } from "@/features/auth/types/auth.types";
