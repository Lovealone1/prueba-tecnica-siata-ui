import { apiClient } from "@/lib/axios";
import type { 
  LogisticsNode, 
  LogisticsNodeCreateDTO, 
  LogisticsNodeUpdateDTO, 
  LogisticsNodeListResponse,
  LogisticsNodeType 
} from "../types/logistics.types";

class LogisticsService {
  private getEndpoint(type: LogisticsNodeType) {
    return type === "WAREHOUSE" ? "/warehouses" : "/seaports";
  }

  async getNodes(
    type: LogisticsNodeType,
    skip = 0,
    limit = 100,
    continent?: string,
    country?: string
  ): Promise<LogisticsNodeListResponse> {
    const response = await apiClient.get<LogisticsNodeListResponse>(
      `/v1${this.getEndpoint(type)}/`,
      { 
        params: {
          skip,
          limit,
          continent,
          country
        }
      }
    );
    return response.data;
  }

  async createNode(type: LogisticsNodeType, data: LogisticsNodeCreateDTO): Promise<LogisticsNode> {
    const response = await apiClient.post<LogisticsNode>(
      `/v1${this.getEndpoint(type)}/`,
      data
    );
    return response.data;
  }

  async updateNode(
    type: LogisticsNodeType,
    id: string,
    data: LogisticsNodeUpdateDTO
  ): Promise<LogisticsNode> {
    const response = await apiClient.patch<LogisticsNode>(
      `/v1${this.getEndpoint(type)}/${id}`,
      data
    );
    return response.data;
  }

  async deleteNode(type: LogisticsNodeType, id: string): Promise<void> {
    await apiClient.delete(`/v1${this.getEndpoint(type)}/${id}`);
  }
}

export const logisticsService = new LogisticsService();
