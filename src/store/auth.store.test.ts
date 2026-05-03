import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./auth.store";

describe("Auth Store (Zustand)", () => {
  beforeEach(() => {
    // Limpiamos el store y el localStorage antes de cada prueba
    useAuthStore.setState({ accessToken: null, user: null, isAuthenticated: false });
    localStorage.clear();
  });

  it("debería inicializarse con estado vacío", () => {
    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("debería actualizar el estado al llamar a setAuth", () => {
    const mockUser = {
      id: "1",
      first_name: "Admin",
      last_name: "System",
      email: "admin@siata.com",
      phone_number: "123456789",
      is_active: true,
      global_role: "ADMIN" as const,
    };
    const mockToken = "fake-jwt-token";

    useAuthStore.getState().setAuth(mockToken, mockUser);

    const state = useAuthStore.getState();
    expect(state.accessToken).toBe(mockToken);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("debería limpiar el estado y el storage al llamar a logout", () => {
    // Forzamos un estado "logueado"
    useAuthStore.setState({
      accessToken: "token",
      user: { id: "1" } as any,
      isAuthenticated: true,
    });
    localStorage.setItem("siata-auth-storage", "dummy-data");

    // Ejecutamos logout
    useAuthStore.getState().logout();

    // Verificamos
    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem("siata-auth-storage")).toBeNull();
  });
});
