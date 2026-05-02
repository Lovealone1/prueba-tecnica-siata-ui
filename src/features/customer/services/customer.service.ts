import { BaseService } from "@/services/base.service";
import type {
  Customer,
  CustomerListResponse,
  CustomerCreatePayload,
  CustomerUpdatePayload
} from "../types/customer.types";

export class CustomerService extends BaseService {
  constructor() {
    super("customers", "v1"); // -> api/v1/customers
  }

  async getCustomers(skip: number = 0, limit: number = 100): Promise<CustomerListResponse> {
    return this.get("", { params: { skip, limit } });
  }

  async getCustomerById(id: string): Promise<Customer> {
    return this.get(`/${id}`);
  }

  async createCustomer(payload: CustomerCreatePayload): Promise<Customer> {
    return this.post("", payload);
  }

  async updateCustomer(id: string, payload: CustomerUpdatePayload): Promise<Customer> {
    return this.patch(`/${id}`, payload);
  }

  async deleteCustomer(id: string): Promise<{ message: string }> {
    return this.delete(`/${id}`);
  }
}

export const customerService = new CustomerService();
