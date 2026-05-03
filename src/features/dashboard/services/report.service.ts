import { BaseService } from "@/services/base.service";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DestinationCount {
  country: string | null;
  count: number;
}

export interface ShipmentStatusCounts {
  PENDING: number;
  SENT: number;
  DELIVERED: number;
}

export interface ShipmentStats {
  total_shipments: number;
  total_revenue: number;
  status_counts: ShipmentStatusCounts;
  top_destinations: DestinationCount[];
}

export interface RecentShipment {
  guide_number: string;
  shipping_status: "PENDING" | "SENT" | "DELIVERED";
  shipping_type: "LAND" | "MARITIME";
  total_price: number;
  registry_date: string;
}

export interface DashboardReport {
  total_customers: number;
  total_products: number;
  total_warehouses: number;
  total_seaports: number;
  shipment_stats: ShipmentStats;
  recent_shipments: RecentShipment[];
}

// ── Service ───────────────────────────────────────────────────────────────────

class ReportService extends BaseService {
  constructor() {
    super("reports", "v1");
  }

  async getDashboardStats(): Promise<DashboardReport> {
    return this.get("/dashboard");
  }
}

export const reportService = new ReportService();
