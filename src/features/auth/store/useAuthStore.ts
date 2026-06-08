import { create } from "zustand";
import rawAxios from "axios";
import axios from "../../../lib/axios";
import {
  getStoredToken,
  setStoredToken,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
} from "../../../shared/utils";
import type { IUser } from "../types";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api";

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
      } = await axios.post("/v1/modules/session", {
        code,
      });
      const { user, access_token, refresh_token } = data;
      set({ user, access_token, refresh_token, isAuthenticated: true });
      setStoredToken(USER_KEY, JSON.stringify(user));
      setStoredToken(ACCESS_TOKEN_KEY, access_token);
      setStoredToken(REFRESH_TOKEN_KEY, refresh_token);
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
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const {
        data: { data },
      } = await axios.post("/v1/modules/guest", { clientUrl: baseUrl });
      const { user, access_token, refresh_token } = data;
      set({ user, access_token, refresh_token, isAuthenticated: true });
      setStoredToken(USER_KEY, JSON.stringify(user));
      setStoredToken(ACCESS_TOKEN_KEY, access_token);
      setStoredToken(REFRESH_TOKEN_KEY, refresh_token);
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
    const current_refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);

    const {
      data: { data },
    } = await rawAxios.post(`${API_BASE_URL}/v1/modules/session/refresh`, {
      refresh_token: current_refresh_token,
    });
    const { access_token, refresh_token } = data;
    set({ access_token, refresh_token, isAuthenticated: true });
    setStoredToken(ACCESS_TOKEN_KEY, access_token);
    setStoredToken(REFRESH_TOKEN_KEY, refresh_token);

    return { access_token, refresh_token };
  },
}));

export default useAuthStore;
