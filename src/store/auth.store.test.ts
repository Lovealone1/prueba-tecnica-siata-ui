import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./auth.store";

describe("Auth Store (Zustand)", () => {
  beforeEach(() => {
    useAuthStore.setState({ accessToken: null, user: null, isAuthenticated: false });
    localStorage.clear();
  });

  it("should initialize with empty state", () => {
    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should update state when setAuth is called", () => {
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

  it("should clear state and storage when logout is called", () => {
    useAuthStore.setState({
      accessToken: "token",
      user: { id: "1" } as any,
      isAuthenticated: true,
    });
    localStorage.setItem("siata-auth-storage", "dummy-data");

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem("siata-auth-storage")).toBeNull();
  });
});
