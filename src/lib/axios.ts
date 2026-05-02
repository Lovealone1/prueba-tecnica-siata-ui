import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/store/auth.store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/**
 * Main Axios instance with global configuration and interceptors.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    let token = useAuthStore.getState().accessToken;
    
    // Fallback: Si el token no está en el store (posible problema de hidratación),
    // intentamos leerlo directamente del localStorage.
    if (!token) {
      const storedAuth = localStorage.getItem("siata-auth-storage");
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          token = parsed.state?.accessToken;
        } catch (e) {
          console.error("[Axios] Error parsing auth storage", e);
        }
      }
    }

    if (token && config.headers) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    console.error("[Axios Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor: Global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("[Axios 401] Unauthorized", {
        url: error.config?.url,
        detail: error.response.data?.detail || error.response.data,
      });
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
