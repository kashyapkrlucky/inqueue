import useAuthStore from "@/features/auth/store/useAuthStore";
import { ACCESS_TOKEN_KEY } from "@/shared/utils";
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const resolveRefreshQueue = (token: string | null) => {
  refreshQueue.forEach((callback) => callback(token));
  refreshQueue = [];
};

const isRefreshTokenExpiredError = (error: unknown) => {
  return axios.isAxiosError(error) && error.response?.status === 401;
};

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api",
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle token refresh or errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;

    if (error.response?.status !== 401 || !original) {
      return Promise.reject(error);
    }

    if (original._retry || original.url?.includes("/v1/modules/session/refresh")) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (!token) {
            reject(error);
            return;
          }

          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const tokens = await useAuthStore.getState().getRefreshedTokens();
      const accessToken = tokens?.access_token ?? null;

      if (!accessToken) {
        resolveRefreshQueue(null);
        return Promise.reject(error);
      }

      original.headers.Authorization = `Bearer ${accessToken}`;
      resolveRefreshQueue(accessToken);
      return api(original);
    } catch (refreshError) {
      if (isRefreshTokenExpiredError(refreshError)) {
        useAuthStore.getState().logout();
      }
      resolveRefreshQueue(null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
