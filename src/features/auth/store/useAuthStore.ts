import { create } from "zustand";
import { authAxios } from "../../../lib/axios";
import {
  getStoredToken,
  setStoredToken,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
} from "../../../shared/utils";
import type { IUser } from "../types";

interface AuthTokenPayload {
  user?: IUser;
  token?: string;
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: unknown;
}

const findTokenValue = (
  data: unknown,
  keys: string[],
  visited = new WeakSet<object>(),
): string | undefined => {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  if (visited.has(data)) {
    return undefined;
  }

  visited.add(data);

  for (const key of keys) {
    const value = (data as Record<string, unknown>)[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  for (const value of Object.values(data)) {
    const token = findTokenValue(value, keys, visited);
    if (token) {
      return token;
    }
  }

  return undefined;
};

const getTokensFromPayload = (
  data: unknown,
  fallbackRefreshToken?: string | null,
) => {
  const access_token = findTokenValue(data, [
    "access_token",
    "accessToken",
    "token",
  ]);
  const refresh_token =
    findTokenValue(data, ["refresh_token", "refreshToken"]) ??
    fallbackRefreshToken;

  if (!access_token || !refresh_token) {
    throw new Error("Auth response is missing token data.");
  }

  return { access_token, refresh_token };
};

const persistAuthTokens = (accessToken: string, refreshToken: string) => {
  setStoredToken(ACCESS_TOKEN_KEY, accessToken);
  setStoredToken(REFRESH_TOKEN_KEY, refreshToken);
};

export interface AuthState {
  user: IUser | null;
  access_token: string | null;
  refresh_token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  isGuestLoading: boolean;
  error: string | null;
  logout: () => void;
  clearError: () => void;
  initialize: () => Promise<void>;

  getUserData: (code: string) => Promise<{
    user: IUser;
    access_token: string;
    refresh_token: string;
  } | null>;
  onGuestLogin: () => Promise<{
    user: IUser;
    access_token: string;
    refresh_token: string;
  } | null>;
  getLoggedInUser: () => IUser | null;
  getToken: () => string | null;
  getRefreshedTokens: () => Promise<{
    access_token: string;
    refresh_token: string;
  } | null>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredToken(USER_KEY) ? JSON.parse(getStoredToken(USER_KEY)!) : null,
  access_token: getStoredToken(ACCESS_TOKEN_KEY),
  refresh_token: getStoredToken(REFRESH_TOKEN_KEY),
  isAuthenticated: !!getStoredToken(ACCESS_TOKEN_KEY),
  loading: false,
  isGuestLoading: false,
  error: null,

  clearError: () => {
    set({ error: null });
  },

  initialize: async () => {
    set({ loading: true });
    try {
      const access_token = getStoredToken(ACCESS_TOKEN_KEY);
      const user = getStoredToken(USER_KEY);
      if (access_token && user) {
        set({ access_token, isAuthenticated: true, user: JSON.parse(user) });
      }
      set({ loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Initialization failed",
      });
    }
  },

  getUserData: async (code: string) => {
    try {
      set({ loading: true });
      const {
        data: { data },
      } = await authAxios.post("/v1/modules/session", {
        code,
      });
      const { user } = data as AuthTokenPayload;
      const { access_token, refresh_token } = getTokensFromPayload(data);
      if (!user) {
        throw new Error("Auth response is missing user data.");
      }
      set({ user, access_token, refresh_token, isAuthenticated: true });
      setStoredToken(USER_KEY, JSON.stringify(user));
      persistAuthTokens(access_token, refresh_token);
      return { user, access_token, refresh_token };
    } catch {
      return null;
    } finally {
      set({ loading: false });
    }
  },

  onGuestLogin: async () => {
    try {
      set({ isGuestLoading: true });
      const clientId = import.meta.env.VITE_CLIENT_ID;
      const {
        data: { data },
      } = await authAxios.post("/v1/modules/guest", { clientId });
      const { user } = data as AuthTokenPayload;
      const { access_token, refresh_token } = getTokensFromPayload(data);
      if (!user) {
        throw new Error("Auth response is missing user data.");
      }
      set({ user, access_token, refresh_token, isAuthenticated: true });
      setStoredToken(USER_KEY, JSON.stringify(user));
      persistAuthTokens(access_token, refresh_token);
      return { user, access_token, refresh_token };
    } catch {
      return null;
    } finally {
      set({ isGuestLoading: false });
    }
  },
  getLoggedInUser: () => {
    return getStoredToken(USER_KEY)
      ? JSON.parse(getStoredToken(USER_KEY)!)
      : null;
  },
  getToken: () => {
    return getStoredToken(ACCESS_TOKEN_KEY);
  },
  logout: () => {
    setStoredToken(ACCESS_TOKEN_KEY, null);
    setStoredToken(REFRESH_TOKEN_KEY, null);
    setStoredToken(USER_KEY, null);
    set({
      user: null,
      access_token: null,
      refresh_token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  getRefreshedTokens: async () => {
    const current_refresh_token = getStoredToken(REFRESH_TOKEN_KEY);

    if (!current_refresh_token) {
      throw new Error("Refresh token is missing.");
    }

    const {
      data: { data },
    } = await authAxios.post("/v1/modules/session/refresh", {
      refresh_token: current_refresh_token,
    });

    console.log("Refresh response data:", data);
    const { access_token, refresh_token } = data;
    set({ access_token, refresh_token, isAuthenticated: true });
    persistAuthTokens(access_token, refresh_token);

    return { access_token, refresh_token };
  },
}));

export default useAuthStore;
