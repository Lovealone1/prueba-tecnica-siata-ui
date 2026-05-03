import { describe, it, expect, vi, beforeEach } from "vitest";
import { reportService } from "./report.service";
import { apiClient } from "@/lib/axios";

vi.mock("@/lib/axios", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe("Report Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully fetch dashboard statistics", async () => {
    const mockDashboardData = {
      total_customers: 150,
      total_products: 45,
      total_warehouses: 12,
      total_seaports: 4,
      shipment_stats: {
        total_shipments: 500,
        total_revenue: 150000,
        status_counts: { PENDING: 100, SENT: 200, DELIVERED: 200 },
        top_destinations: [],
      },
      recent_shipments: [],
    };

    (apiClient.get as any).mockResolvedValueOnce({ data: mockDashboardData });

    const result = await reportService.getDashboardStats();
    expect(apiClient.get).toHaveBeenCalledWith("/v1/reports/dashboard", undefined);
    expect(result).toEqual(mockDashboardData);
  });
});
