import { BaseService } from "@/services/base.service";
import { type User, type UserUpdateRolePayload } from "../types/user.types";

interface UserListResponse {
  data: User[];
  total: number;
}

class UserService extends BaseService {
  constructor() {
    super("users");
  }

  /**
   * Obtiene la lista de usuarios.
   * @param skip Offset para la paginación.
   * @param limit Límite de registros a retornar.
   */
  async getAll(skip: number = 0, limit: number = 200): Promise<UserListResponse> {
    return this.get<UserListResponse>("", {
      params: { skip, limit },
    });
  }

  /**
   * Actualiza el rol de un usuario.
   * @param id ID del usuario.
   * @param payload DTO con el nuevo rol.
   */
  async updateRole(id: string, payload: UserUpdateRolePayload): Promise<User> {
    return this.patch<User>(`/${id}/role`, payload);
  }
}

export const userService = new UserService();
