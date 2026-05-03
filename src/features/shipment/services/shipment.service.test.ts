import { describe, it, expect, vi, beforeEach } from "vitest";
import { shipmentService } from "./shipment.service";
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

describe("Shipment Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list shipments with filters", async () => {
    const mockResponse = { items: [], total: 0 };
    (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });

    const filters = { skip: 0, limit: 10, status: "PENDING" };
    const result = await shipmentService.getShipments(filters as any);

    expect(apiClient.get).toHaveBeenCalledWith("/v1/shipments/", { params: filters });
    expect(result).toEqual(mockResponse);
  });

  it("should get a shipment by ID", async () => {
    const mockShipment = { id: "ship_123", guide_number: "GUI-123" };
    (apiClient.get as any).mockResolvedValueOnce({ data: mockShipment });

    const result = await shipmentService.getShipmentById("ship_123");

    expect(apiClient.get).toHaveBeenCalledWith("/v1/shipments/ship_123", undefined);
    expect(result).toEqual(mockShipment);
  });

  it("should create a new shipment", async () => {
    const payload = { customer_id: "cust_1" };
    const mockCreated = { id: "ship_1", ...payload };
    
    (apiClient.post as any).mockResolvedValueOnce({ data: mockCreated });

    const result = await shipmentService.createShipment(payload as any);

    expect(apiClient.post).toHaveBeenCalledWith("/v1/shipments/", payload, undefined);
    expect(result).toEqual(mockCreated);
  });

  it("should update an existing shipment", async () => {
    const payload = { shipping_type: "MARITIME" };
    const mockUpdated = { id: "ship_123", ...payload };
    
    (apiClient.patch as any).mockResolvedValueOnce({ data: mockUpdated });

    const result = await shipmentService.updateShipment("ship_123", payload as any);

    expect(apiClient.patch).toHaveBeenCalledWith("/v1/shipments/ship_123", payload, undefined);
    expect(result).toEqual(mockUpdated);
  });

  it("should delete a shipment", async () => {
    const mockResponse = { message: "Deleted" };
    (apiClient.delete as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await shipmentService.deleteShipment("ship_123");

    expect(apiClient.delete).toHaveBeenCalledWith("/v1/shipments/ship_123", undefined);
    expect(result).toEqual(mockResponse);
  });

  it("should override shipment status (admin endpoint)", async () => {
    const mockUpdated = { id: "ship_123", shipping_status: "DELIVERED" };
    (apiClient.patch as any).mockResolvedValueOnce({ data: mockUpdated });

    const result = await shipmentService.overrideStatus("ship_123", "DELIVERED");

    expect(apiClient.patch).toHaveBeenCalledWith("/v1/shipments/admin/ship_123/status", { shipping_status: "DELIVERED" }, undefined);
    expect(result).toEqual(mockUpdated);
  });
});
