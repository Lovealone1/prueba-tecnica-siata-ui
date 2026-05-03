import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useModalStore } from "@/store/modal.store";
import { Icon } from "@/utils/icon";

import { Select } from "@/components/ui/Select";
import { userService } from "../services/user.service";
import { UserUpdateRoleSchema, type UserUpdateRolePayload, GlobalRole, type User } from "../types/user.types";

export function EditRoleModal({ initialData }: { initialData: User }) {
  const { onClose } = useModalStore();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserUpdateRolePayload>({
    resolver: zodResolver(UserUpdateRoleSchema),
    defaultValues: {
      global_role: (initialData.global_role as GlobalRole) || GlobalRole.USER,
    },
  });

  const selectedRole = watch("global_role");

  const updateMutation = useMutation({
    mutationFn: (data: UserUpdateRolePayload) => userService.updateRole(initialData.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Rol actualizado exitosamente");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Ocurrió un error al actualizar el rol");
    },
  });

  const onSubmit = (data: UserUpdateRolePayload) => {
    updateMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-4 border border-outline-variant/20 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
          {initialData.first_name?.[0] || ""}{initialData.last_name?.[0] || ""}
        </div>
        <div>
          <h4 className="font-bold text-on-surface text-lg">
            {initialData.first_name} {initialData.last_name}
          </h4>
          <p className="text-sm text-on-surface-variant">{initialData.email}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-wider text-outline px-1">Rol del Sistema</label>
        <Select
          value={selectedRole}
          onChange={(val) => setValue("global_role", val as GlobalRole, { shouldValidate: true })}
          options={[
            { value: GlobalRole.USER, label: "Usuario Estándar (USER)" },
            { value: GlobalRole.ADMIN, label: "Administrador (ADMIN)" },
          ]}
        />
        {errors.global_role?.message && (
          <p className="text-xs text-error font-medium px-1">{errors.global_role.message}</p>
        )}
        <p className="text-[11px] text-on-surface-variant mt-1">
          {selectedRole === GlobalRole.ADMIN
            ? "⚠️ Cuidado: Este usuario tendrá acceso total al panel administrativo y podrá modificar otros usuarios."
            : "Usuario con acceso limitado únicamente a las operaciones del dashboard logístico."}
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
        <button
          type="button"
          onClick={onClose}
          disabled={updateMutation.isPending}
          className="px-6 py-2 border border-outline-variant/30 text-on-surface hover:bg-surface-container-high rounded-xl font-bold transition-all disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {updateMutation.isPending && <Icon name="progress_activity" size="sm" className="animate-spin" />}
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}
