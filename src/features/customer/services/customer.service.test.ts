import { describe, it, expect, vi, beforeEach } from "vitest";
import { customerService } from "./customer.service";
import { apiClient } from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Customer Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list customers with pagination parameters", async () => {
    const mockResponse = { items: [], total: 0 };
    (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await customerService.getCustomers(10, 50);

    expect(apiClient.get).toHaveBeenCalledWith("/v1/customers/", { params: { skip: 10, limit: 50 } });
    expect(result).toEqual(mockResponse);
  });

  it("should get a customer by ID", async () => {
    const mockCustomer = { id: "cust_123", name: "Empresa Siata", identifier: "12345" };
    (apiClient.get as any).mockResolvedValueOnce({ data: mockCustomer });

    const result = await customerService.getCustomerById("cust_123");

    expect(apiClient.get).toHaveBeenCalledWith("/v1/customers/cust_123", undefined);
    expect(result).toEqual(mockCustomer);
  });

  it("should create a new customer", async () => {
    const payload = { name: "Nuevo Cliente", identifier: "98765", email: "test@test.com" };
    const mockCreated = { id: "new_1", ...payload };

    (apiClient.post as any).mockResolvedValueOnce({ data: mockCreated });

    const result = await customerService.createCustomer(payload as any);

    expect(apiClient.post).toHaveBeenCalledWith("/v1/customers/", payload, undefined);
    expect(result).toEqual(mockCreated);
  });

  it("should update an existing customer", async () => {
    const payload = { name: "Cliente Actualizado" };
    const mockUpdated = { id: "cust_123", name: "Cliente Actualizado" };

    (apiClient.patch as any).mockResolvedValueOnce({ data: mockUpdated });

    const result = await customerService.updateCustomer("cust_123", payload);

    expect(apiClient.patch).toHaveBeenCalledWith("/v1/customers/cust_123", payload, undefined);
    expect(result).toEqual(mockUpdated);
  });

  it("should delete a customer", async () => {
    const mockResponse = { message: "Eliminado con éxito" };
    (apiClient.delete as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await customerService.deleteCustomer("cust_123");

    expect(apiClient.delete).toHaveBeenCalledWith("/v1/customers/cust_123", undefined);
    expect(result).toEqual(mockResponse);
  });
});
