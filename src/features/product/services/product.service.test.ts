import { describe, it, expect, vi, beforeEach } from "vitest";
import { productService } from "./product.service";
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

describe("Product Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list products with filters and pagination", async () => {
    const mockResponse = { items: [], total: 0 };
    (apiClient.get as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await productService.getProducts(10, 50, "LAND" as any, "L" as any);

    expect(apiClient.get).toHaveBeenCalledWith("/v1/products/", { 
      params: { skip: 10, limit: 50, transport_mode: "LAND", size: "L" } 
    });
    expect(result).toEqual(mockResponse);
  });

  it("should get a product by ID", async () => {
    const mockProduct = { id: "prod_123", name: "Caja" };
    (apiClient.get as any).mockResolvedValueOnce({ data: mockProduct });

    const result = await productService.getProductById("prod_123");

    expect(apiClient.get).toHaveBeenCalledWith("/v1/products/prod_123", undefined);
    expect(result).toEqual(mockProduct);
  });

  it("should create a new product", async () => {
    const payload = { name: "Caja", price: 100 };
    const mockCreated = { id: "new_1", ...payload };
    
    (apiClient.post as any).mockResolvedValueOnce({ data: mockCreated });

    const result = await productService.createProduct(payload as any);

    expect(apiClient.post).toHaveBeenCalledWith("/v1/products/", payload, undefined);
    expect(result).toEqual(mockCreated);
  });

  it("should update an existing product", async () => {
    const payload = { price: 150 };
    const mockUpdated = { id: "prod_123", price: 150 };
    
    (apiClient.patch as any).mockResolvedValueOnce({ data: mockUpdated });

    const result = await productService.updateProduct("prod_123", payload as any);

    expect(apiClient.patch).toHaveBeenCalledWith("/v1/products/prod_123", payload, undefined);
    expect(result).toEqual(mockUpdated);
  });

  it("should delete a product", async () => {
    const mockResponse = { message: "Deleted successfully" };
    (apiClient.delete as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await productService.deleteProduct("prod_123");

    expect(apiClient.delete).toHaveBeenCalledWith("/v1/products/prod_123", undefined);
    expect(result).toEqual(mockResponse);
  });
});
