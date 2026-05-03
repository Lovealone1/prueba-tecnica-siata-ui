import { describe, it, expect, vi, beforeEach } from "vitest";
import { userService } from "./user.service";
import { apiClient } from "@/lib/axios";

// Mock global axios instance
vi.mock("@/lib/axios", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("User Service (Admin)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list users with pagination", async () => {
    const mockResponse = { data: [], total: 0 };
    (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await userService.getAll(10, 50);

    expect(apiClient.get).toHaveBeenCalledWith("/v1/users/", { 
      params: { skip: 10, limit: 50 } 
    });
    expect(result).toEqual(mockResponse);
  });

  it("should update a user's role", async () => {
    const payload = { global_role: "ADMIN" as const };
    const mockUpdated = { id: "user_1", ...payload };
    
    (apiClient.patch as any).mockResolvedValueOnce({ data: mockUpdated });

    const result = await userService.updateRole("user_1", payload);

    expect(apiClient.patch).toHaveBeenCalledWith("/v1/users/user_1/role", payload, undefined);
    expect(result).toEqual(mockUpdated);
  });
});
