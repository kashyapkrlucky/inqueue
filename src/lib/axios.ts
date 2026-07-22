import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { ACCESS_TOKEN_KEY } from "@/shared/utils";
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

const getApiBaseUrl = (url?: string) =>
  `${url || "http://localhost:3000"}/api`;

const authAxios = axios.create({
  baseURL: getApiBaseUrl(import.meta.env.VITE_AUTH_URL),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(import.meta.env.VITE_API_URL),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

type RetryableAxiosRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

let isRefreshing = false;
let queue: {
  resolve: () => void;
  reject: (error: unknown) => void;
}[] = [];

const flushQueue = (error?: unknown) => {
  queue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }
    resolve();
  });
  queue = [];
};

const shouldSkipRefresh = (url?: string) => {
  if (!url) return true;

  return ["/v1/modules/session/refresh"].some((path) => url.includes(path));
};

const expireSession = () => {
  useAuthStore.getState().logout();

  if (
    typeof window !== "undefined" &&
    window.location.pathname !== "/login"
  ) {
    window.location.replace("/login");
  }
};

const setAuthHeaders = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  config.headers["x-timezone"] =
    Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authAxios.interceptors.request.use(
  setAuthHeaders,
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.request.use(
  setAuthHeaders,
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle errors globally
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        const original = error.config as
          | RetryableAxiosRequestConfig
          | undefined;

        if (
          !original ||
          original._retry ||
          original.skipAuthRefresh ||
          shouldSkipRefresh(original.url)
        ) {
          throw error;
        }

        original._retry = true;

        if (isRefreshing) {
          await new Promise<void>((resolve, reject) => {
            queue.push({ resolve, reject });
          });
          return axiosInstance(original);
        }

        isRefreshing = true;

        try {
          await useAuthStore.getState().getRefreshedTokens();

          flushQueue();

          return axiosInstance(original);
        } catch (refreshError) {
          flushQueue(refreshError);
          expireSession();
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error);
  },
);

export { authAxios, AxiosError };
export default axiosInstance;
