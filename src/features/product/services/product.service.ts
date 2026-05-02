import { BaseService } from "@/services/base.service";
import type {
  Product,
  ProductListResponse,
  ProductCreatePayload,
  ProductUpdatePayload,
  TransportMode,
  ProductSize
} from "../types/product.types";

export class ProductService extends BaseService {
  constructor() {
    super("products", "v1"); // -> api/v1/products
  }

  async getProducts(
    skip: number = 0, 
    limit: number = 100,
    transport_mode?: TransportMode,
    size?: ProductSize
  ): Promise<ProductListResponse> {
    return this.get("", { 
      params: { 
        skip, 
        limit,
        transport_mode,
        size
      } 
    });
  }

  async getProductById(id: string): Promise<Product> {
    return this.get(`/${id}`);
  }

  async createProduct(payload: ProductCreatePayload): Promise<Product> {
    return this.post("", payload);
  }

  async updateProduct(id: string, payload: ProductUpdatePayload): Promise<Product> {
    return this.patch(`/${id}`, payload);
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    return this.delete(`/${id}`);
  }
}

export const productService = new ProductService();
