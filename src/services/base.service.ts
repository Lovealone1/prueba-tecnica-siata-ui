import { type AxiosRequestConfig } from "axios";
import { apiClient } from "@/lib/axios";

/**
 * Base Service class to handle versioning and common HTTP methods.
 * This makes the service layer scalable for future versions (e.g., v2).
 */
export abstract class BaseService {
  protected readonly version: string;
  protected readonly module: string;

  constructor(module: string, version: string = "v1") {
    this.module = module;
    this.version = version;
  }

  /**
   * Constructs the full path for a request: /{version}/{module}/{path}
   */
  protected getPath(path: string = ""): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const fullPath = `/${this.version}/${this.module}${cleanPath === "/" ? "" : cleanPath}`;
    return fullPath;
  }

  protected async get<T>(path: string = "", config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<T>(this.getPath(path), config);
    return response.data;
  }

  protected async post<T>(path: string = "", data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post<T>(this.getPath(path), data, config);
    return response.data;
  }

  protected async put<T>(path: string = "", data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.put<T>(this.getPath(path), data, config);
    return response.data;
  }

  protected async patch<T>(path: string = "", data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.patch<T>(this.getPath(path), data, config);
    return response.data;
  }

  protected async delete<T>(path: string = "", config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<T>(this.getPath(path), config);
    return response.data;
  }
}
