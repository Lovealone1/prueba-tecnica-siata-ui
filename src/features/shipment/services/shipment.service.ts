import { BaseService } from "@/services/base.service";
import type { 
  Shipment, 
  ShipmentListResponse, 
  ShipmentCreatePayload, 
  ShipmentUpdatePayload,
  ShipmentFilters
} from "../types/shipment.types";

export class ShipmentService extends BaseService {
  constructor() {
    super("shipments", "v1");
  }

  async getShipments(params: ShipmentFilters): Promise<ShipmentListResponse> {
    return this.get("", { params });
  }

  async getShipmentById(id: string): Promise<Shipment> {
    return this.get(`/${id}`);
  }

  async createShipment(payload: ShipmentCreatePayload): Promise<Shipment> {
    return this.post("", payload);
  }

  async updateShipment(id: string, payload: ShipmentUpdatePayload): Promise<Shipment> {
    return this.patch(`/${id}`, payload);
  }

  async deleteShipment(id: string): Promise<{ message: string }> {
    return this.delete(`/${id}`);
  }

  // Admin Endpoints (Privados)
  async overrideStatus(id: string, status: string): Promise<Shipment> {
    return this.patch(`/${id}/status`, { status });
  }

  async getShipmentHistory(id: string): Promise<any[]> {
    return this.get(`/${id}/history`);
  }

  async getStats(): Promise<any> {
    return this.get("/stats");
  }
}

export const shipmentService = new ShipmentService();
