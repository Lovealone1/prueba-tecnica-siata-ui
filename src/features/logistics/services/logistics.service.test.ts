import { describe, it, expect, vi, beforeEach } from "vitest";
import { logisticsService } from "./logistics.service";
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

describe("Logistics Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list WAREHOUSE nodes correctly", async () => {
    const mockResponse = { items: [], total: 0 };
    (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await logisticsService.getNodes("WAREHOUSE", 0, 100);

    expect(apiClient.get).toHaveBeenCalledWith("/v1/warehouses/", { 
      params: { skip: 0, limit: 100, continent: undefined, country: undefined } 
    });
    expect(result).toEqual(mockResponse);
  });

  it("should list SEAPORT nodes correctly", async () => {
    const mockResponse = { items: [], total: 0 };
    (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await logisticsService.getNodes("SEAPORT", 0, 100, "America", "Colombia");

    expect(apiClient.get).toHaveBeenCalledWith("/v1/seaports/", { 
      params: { skip: 0, limit: 100, continent: "America", country: "Colombia" } 
    });
    expect(result).toEqual(mockResponse);
  });

  it("should create a new node", async () => {
    const payload = { name: "Bodega 1", location: "Medellin" };
    const mockCreated = { id: "node_1", ...payload };
    
    (apiClient.post as any).mockResolvedValueOnce({ data: mockCreated });

    const result = await logisticsService.createNode("WAREHOUSE", payload as any);

    expect(apiClient.post).toHaveBeenCalledWith("/v1/warehouses/", payload);
    expect(result).toEqual(mockCreated);
  });

  it("should update an existing node", async () => {
    const payload = { name: "Bodega Actualizada" };
    const mockUpdated = { id: "node_1", ...payload };
    
    (apiClient.patch as any).mockResolvedValueOnce({ data: mockUpdated });

    const result = await logisticsService.updateNode("WAREHOUSE", "node_1", payload as any);

    expect(apiClient.patch).toHaveBeenCalledWith("/v1/warehouses/node_1", payload);
    expect(result).toEqual(mockUpdated);
  });

  it("should delete a node", async () => {
    (apiClient.delete as any).mockResolvedValueOnce({ data: {} });

    await logisticsService.deleteNode("SEAPORT", "node_2");

    expect(apiClient.delete).toHaveBeenCalledWith("/v1/seaports/node_2");
  });
});
