import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "./auth.service";
import { apiClient } from "@/lib/axios";

// Mock global axios instance
vi.mock("@/lib/axios", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Auth Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should request an OTP", async () => {
    const payload = { email: "test@siata.com", intent: "LOGIN" as const };
    const mockResponse = { message: "OTP Sent" };
    (apiClient.post as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await authService.requestOtp(payload);

    expect(apiClient.post).toHaveBeenCalledWith("/v1/auth/otp", payload, undefined);
    expect(result).toEqual(mockResponse);
  });

  it("should verify an OTP", async () => {
    const payload = { email: "test@siata.com", otp: "123456", intent: "LOGIN" as const };
    const mockResponse = { access_token: "token123", user: { id: "1" } };
    (apiClient.post as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await authService.verifyOtp(payload);

    expect(apiClient.post).toHaveBeenCalledWith("/v1/auth/otp/verify", payload, undefined);
    expect(result).toEqual(mockResponse);
  });

  it("should fetch active sessions", async () => {
    const mockResponse = [{ session_id: "s1" }];
    (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await authService.getSessions();

    expect(apiClient.get).toHaveBeenCalledWith("/v1/auth/sessions", undefined);
    expect(result).toEqual(mockResponse);
  });

  it("should logout current device", async () => {
    (apiClient.post as any).mockResolvedValueOnce({ data: { message: "Logged out" } });

    await authService.logoutCurrentDevice();

    expect(apiClient.post).toHaveBeenCalledWith("/v1/auth/logout", undefined, undefined);
  });

  it("should revoke a specific session", async () => {
    (apiClient.delete as any).mockResolvedValueOnce({ data: { message: "Session revoked" } });

    await authService.revokeSession("s123");

    expect(apiClient.delete).toHaveBeenCalledWith("/v1/auth/sessions/s123", undefined);
  });

  it("should get current user profile (getMe)", async () => {
    const mockProfile = { id: "1", global_role: "ADMIN" };
    (apiClient.get as any).mockResolvedValueOnce({ data: mockProfile });

    const result = await authService.getMe();

    expect(apiClient.get).toHaveBeenCalledWith("/v1/auth/me", undefined);
    expect(result).toEqual(mockProfile);
  });
});
